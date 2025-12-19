import * as vscode from "vscode";
import * as ts from "typescript";
import { Parser, Language, type Node } from "web-tree-sitter";

type Rule = { selector: string; scope: string };
type SelectorParts = string[]; // split on '>'

type CompiledRule = {
  parts: SelectorParts; // trimmed
  scope: string;
};

type StyleKey =
  | "flag"
  | "delimiter"
  | "pattern"
  | "invalid"
  | "disjunction"
  | "quantifier"
  | "anchor"
  | "groupDelimiter"
  | "groupIdentifier"
  | "groupTag"
  | "backreference"
  | "charset"
  | "charsetDelimiter"
  | "charsetRangeDash"
  | "escape"
  | "escapeOperator"
  | "numeric"
  | "numericCharcode"
  | "characterClass"
  | "unicodePropertyName"
  | "unicodePropertyOperator"
  | "unicodePropertyValue";

const STYLE: Record<StyleKey, vscode.DecorationRenderOptions> = {
  flag: { color: "#7afd7a" },
  delimiter: { color: "#00ff00" },
  pattern: { color: "#7da672" },
  invalid: { color: "#ff0000" },

  disjunction: { color: "#ffffff" },

  quantifier: { color: "#e2608b" },
  anchor: { color: "#ffffff" },

  groupDelimiter: { color: "#e8e888" },
  groupIdentifier: { color: "#b5b57a" },
  groupTag: { color: "#d3d3a0" },

  backreference: { color: "#ffa15d" },

  charset: { backgroundColor: "rgba(86,182,194,0.08)" },
  charsetDelimiter: { color: "#88eeee" },
  charsetRangeDash: { color: "#88eeee" },

  escape: { color: "#61afef" },
  escapeOperator: { color: "#c678dd" },

  numeric: { color: "#d19a66" },
  numericCharcode: { color: "#b07d4e" },

  characterClass: { color: "#56b6c2" },

  unicodePropertyName: { color: "#56b6c2" },
  unicodePropertyOperator: { color: "#c678dd" },
  unicodePropertyValue: { color: "#56b6c2" },
};

// Map Atom-ish scope strings (from your CSON) to a VS Code decoration style key.
function scopeToStyleKey(scope: string): StyleKey | null {
  if (scope.includes("invalid")) return "invalid";
  if (scope.includes(".anchor.")) return "anchor";
  if (scope.includes(".quantifier.")) return "quantifier";
  if (scope.includes(".disjunction.")) return "disjunction";

  if (scope.includes("punctuation.definition.group")) return "groupDelimiter";
  if (scope.includes("entity.name.type.") || scope.includes("entity.name.tag.")) {
    // identifiers like (?:, (?=, (?<name>), and tags (name)
    // If you want capturing vs non-capturing to differ later, split here.
    return scope.includes("tag") ? "groupTag" : "groupIdentifier";
  }

  if (scope.includes("back-reference")) return "backreference";

  if (scope.includes("character-class.set")) return "charset";
  if (scope.includes("character-class.set.begin") || scope.includes("character-class.set.end")) return "charsetDelimiter";
  if (scope.includes("character-class.range.hyphen")) return "charsetRangeDash";
  if (scope.includes("character-class.escape")) return "characterClass";

  if (scope.includes("unicode-property.name")) return "unicodePropertyName";
  if (scope.includes("unicode-property.value")) return "unicodePropertyValue";
  if (scope.includes("unicode-property")) return "unicodePropertyOperator";

  if (scope.includes("keyword.operator.escape-character")) return "escapeOperator";

  if (scope.includes("character.numeric")) {
    return scope.includes("character-code") ? "numericCharcode" : "numeric";
  }

  // default for escapes
  if (scope.includes("constant.character") || scope.includes("escape")) return "escape";

  return null;
}

function isSupportedDoc(doc: vscode.TextDocument) {
  return (
    doc.languageId === "javascript" ||
    doc.languageId === "javascriptreact" ||
    doc.languageId === "typescript" ||
    doc.languageId === "typescriptreact"
  );
}

function getConfig() {
  const cfg = vscode.workspace.getConfiguration("regexTreeSitterHighlighter");
  return {
    enable: cfg.get<boolean>("enable", true),
    maxRegexLength: cfg.get<number>("maxRegexLength", 5000),
    debug: cfg.get<boolean>("debugLogNodeTypes", false),
    wasmRegex: cfg.get<string>("wasmPathRegex", "parsers/tree-sitter-regex-js.wasm"),
    wasmRegexU: cfg.get<string>("wasmPathRegexUnicode", "parsers/tree-sitter-regex-unicode-js.wasm"),
  };
}

function getRegexLiteralSpans(
  text: string,
  fileName: string,
  langId: string
): Array<{ start: number; end: number; literal: string }> {
  const spans: Array<{ start: number; end: number; literal: string }> = [];

  const scriptKind =
    langId === "typescript" ? ts.ScriptKind.TS :
    langId === "typescriptreact" ? ts.ScriptKind.TSX :
    langId === "javascriptreact" ? ts.ScriptKind.JSX :
    ts.ScriptKind.JS;

  const sourceFile = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    scriptKind
  );

  const visit = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.RegularExpressionLiteral) {
      // getStart excludes leading trivia; regex literals shouldn't have trivia, but this is safest
      const start = node.getStart(sourceFile);
      const end = node.getEnd();
      spans.push({ start, end, literal: text.slice(start, end) });
      return; // no need to go deeper
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return spans;
}

function splitRegexLiteral(literal: string): { pattern: string; flags: string } | null {
  // TS already confirmed it's a regex literal token, so we can be simpler.
  if (!literal.startsWith("/")) return null;

  // trailing flags
  let i = literal.length - 1;
  while (i > 0 && /[a-z]/i.test(literal[i])) i--;

  if (literal[i] !== "/") return null;

  const flags = literal.slice(i + 1);
  const pattern = literal.slice(1, i);
  return { pattern, flags };
}

function compileRules(rules: Rule[]): CompiledRule[] {
  return rules.map(r => ({
    parts: r.selector.split(">").map(p => p.trim()).filter(Boolean),
    scope: r.scope,
  }));
}

function matchRule(node: Node, rule: CompiledRule): boolean {
  // rule.parts like ["identity_escape", "escape_operator"]
  let cur: Node | null = node;
  for (let idx = rule.parts.length - 1; idx >= 0; idx--) {
    if (!cur) return false;
    if (cur.type !== rule.parts[idx]) return false;
    cur = cur.parent;
  }
  return true;
}

function walk(node: Node, visit: (n: Node) => void) {
  visit(node);
  for (let i = 0; i < node.childCount; i++) {
    const c = node.child(i);
    if (c) walk(c, visit);
  }
}

let initialized = false;
let parserRegex: Parser | null = null;
let parserRegexU: Parser | null = null;

async function ensureParsers(context: vscode.ExtensionContext, output: vscode.OutputChannel) {
  if (initialized) return;

  await Parser.init();

  const cfg = getConfig();
  const wasmRegexPath = vscode.Uri.joinPath(context.extensionUri, cfg.wasmRegex).fsPath;
  const wasmRegexUPath = vscode.Uri.joinPath(context.extensionUri, cfg.wasmRegexU).fsPath;

  const langRegex = await Language.load(wasmRegexPath);
  const langRegexU = await Language.load(wasmRegexUPath);

  parserRegex = new Parser();
  parserRegex.setLanguage(langRegex);

  parserRegexU = new Parser();
  parserRegexU.setLanguage(langRegexU);

  initialized = true;
}

function chooseParser(flags: string): Parser {
  return flags.includes("u") ? (parserRegexU as Parser) : (parserRegex as Parser);
}

// ---- Load your CSON-derived rules (compiled into JSON) ----
const RULES: Rule[] = require("../resources/scopeRules.json");
const COMPILED_RULES = compileRules(RULES);

// Create decoration types for each StyleKey once.
function createDecorationTypes(): Record<StyleKey, vscode.TextEditorDecorationType> {
  const out = {} as Record<StyleKey, vscode.TextEditorDecorationType>;
  (Object.keys(STYLE) as StyleKey[]).forEach(k => {
    out[k] = vscode.window.createTextEditorDecorationType(STYLE[k]);
  });
  return out;
}

export async function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel("Regex Tree-sitter Highlighter");
  context.subscriptions.push(output);

  const decos = createDecorationTypes();
  Object.values(decos).forEach(d => context.subscriptions.push(d));

  let timer: NodeJS.Timeout | undefined;

  async function refresh(editor: vscode.TextEditor) {
    const cfg = getConfig();
    if (!cfg.enable) return;
    
    const doc = editor.document;
    if (!isSupportedDoc(doc)) return;
    
    await ensureParsers(context, output);

    // Clear all decorations
    (Object.keys(decos) as StyleKey[]).forEach(k => editor.setDecorations(decos[k], []));

    const text = doc.getText();
    const spans = getRegexLiteralSpans(text, doc.fileName, doc.languageId);

    const buckets: Record<StyleKey, Array<{ start: number; end: number }>> = Object.create(null);

    const add = (k: StyleKey, start: number, end: number) => {
      (buckets[k] ??= []).push({ start, end });
    };

    for (const s of spans) {
      const split = splitRegexLiteral(s.literal);
      if (!split) continue;

      const { pattern, flags } = split;
      if (pattern.length > cfg.maxRegexLength) continue;

      const parser = chooseParser(flags);
      const tree = parser.parse(pattern);
      if (!tree) {
        throw new TypeError(`parse 'tree' is null`);
      }

      if (cfg.debug) {
        output.appendLine("-----");
        output.appendLine(`Regex: /${pattern}/${flags}`);
        output.appendLine(tree.rootNode.toString());
      }

      const patternOffset = s.start + 1; // after leading /

      // Very lightweight base styling:
      // - delimiters `/` and flags are outside pattern; we can decorate them too
      add("delimiter", s.start, s.start + 1);
      add("delimiter", s.start + 1 + pattern.length, s.start + 2 + pattern.length); // closing /
      if (flags.length) add("flag", s.end - flags.length, s.end);

      // Walk nodes and apply first matching rule => style key
      walk(tree.rootNode, (node) => {
        for (const rule of COMPILED_RULES) {
          if (!matchRule(node, rule)) continue;
          const styleKey = scopeToStyleKey(rule.scope);
          if (!styleKey) continue;

          const start = patternOffset + node.startIndex;
          const end = patternOffset + node.endIndex;
          if (end > start) add(styleKey, start, end);
          break;
        }
      });
    }

    // Apply decorations
    (Object.keys(buckets) as StyleKey[]).forEach(k => {
      const ranges = buckets[k].map(o => new vscode.Range(doc.positionAt(o.start), doc.positionAt(o.end)));
      editor.setDecorations(decos[k], ranges);
    });
  }

  function scheduleRefresh(editor?: vscode.TextEditor) {
    const ed = editor ?? vscode.window.activeTextEditor;
    if (!ed) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => refresh(ed), 120);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(ed => ed && scheduleRefresh(ed)),
    vscode.workspace.onDidChangeTextDocument(e => {
      const ed = vscode.window.activeTextEditor;
      if (ed && e.document === ed.document) scheduleRefresh(ed);
    }),
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("regexTreeSitterHighlighter")) scheduleRefresh();
    }),
  );

  if (vscode.window.activeTextEditor) scheduleRefresh(vscode.window.activeTextEditor);

  //output.appendLine("Extension activated.");
}

export function deactivate() {}
