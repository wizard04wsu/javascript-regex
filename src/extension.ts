import * as vscode from "vscode";
import * as ts from "typescript";
import { Parser, Language, type Node } from "web-tree-sitter";
import colorMap from "./colorMap.js";

type Rule = { selector: string; scope: string };
type SelectorParts = string[]; // split on '>'

type CompiledRule = {
  parts: SelectorParts; // trimmed
  scope: string;
};

type StyleKey =
  // Basic elements
  | "flag"
  | "delimiter"
  | "pattern"
  | "invalid"
  
  // Operators
  | "disjunction"
  
  // Anchors / assertions
  | "anchor"
  | "lookaround"
  
  // Quantifiers
  | "quantifier"
  | "quantifierContent"  // numbers and delimiters inside {n,m}
  
  // Groups - Non-capturing
  | "groupDelimiter"
  | "groupIdentifier"
  
  // Groups - Capturing
  | "groupDelimiterCapturing"
  | "groupIdentifierCapturing"
  | "groupTagCapturing"
  
  // Backreferences
  | "backreference"
  | "backreferenceTag"
  
  // Character sets - structure
  | "charsetBackground"
  | "charsetDelimiter"
  | "charsetNonSyntax"
  
  // Character sets - ranges
  | "charsetRangeBackground"
  | "charsetRangeDash"
  
  // Character escapes (outside sets)
  | "identityEscape"
  | "identityEscapeBackslash"
  | "numericEscape"
  | "numericEscapeCode"
  | "specialEscape"
  
  // Character classes (outside sets)
  | "characterClass"
  | "characterClassAny"  // . (any character)
  
  // Unicode properties (outside sets)
  | "unicodePropertyName"
  | "unicodePropertyValue"
  | "unicodePropertyOperator"
  
  // Inside character sets - escapes
  | "charsetIdentityEscape"
  | "charsetNumericEscape"
  | "charsetNumericEscapeCode"
  | "charsetSpecialEscape"
  
  // Inside character sets - character classes
  | "charsetCharacterClass"
  | "charsetCharacterClassAny"
  
  // Inside character sets - unicode properties
  | "charsetUnicodePropertyName"
  | "charsetUnicodePropertyValue"
  | "charsetUnicodePropertyOperator";

// Complete style definitions from Atom LESS files
const STYLE: Record<StyleKey, vscode.DecorationRenderOptions> = {
  
  // Core / structural
  delimiter:          { color: new vscode.ThemeColor("editorBracketHighlight.foreground1") },
  pattern:            { color: new vscode.ThemeColor("editor.foreground") },
  flag:               { color: new vscode.ThemeColor("editorInfo.foreground") },

  // Errors / invalid syntax
  invalid:            { color: new vscode.ThemeColor("editorError.foreground") },

  // Operators
  disjunction:        { color: new vscode.ThemeColor("editorOperator.foreground") },  // |
  quantifier:         { color: new vscode.ThemeColor("editorOperator.foreground") },  // *, +, ?, {__}

  // Anchors / assertions
  anchor:             { color: new vscode.ThemeColor("editorWarning.foreground") },  // ^, $, \b, \B
  lookaround:         { color: new vscode.ThemeColor("editorWarning.foreground") },

  // Groups
  groupDelimiter:     { color: new vscode.ThemeColor("editorBracketHighlight.foreground2") },  // ( )
  groupIdentifier:    { color: new vscode.ThemeColor("symbolIcon.variableForeground") },       // ?<name>
  groupTagCapturing:           { color: new vscode.ThemeColor("symbolIcon.variableForeground") },

  // Backreferences
  backreference:      { color: new vscode.ThemeColor("symbolIcon.variableForeground") },

  // Character classes
  charset:            { backgroundColor: new vscode.ThemeColor("editor.wordHighlightBackground") },
  charsetDelimiter:   { color: new vscode.ThemeColor("editorBracketHighlight.foreground3") },  // [ ]
  charsetRangeDash:   { color: new vscode.ThemeColor("editorOperator.foreground") },           // -

  // Escapes
  escape:             { color: new vscode.ThemeColor("editorInfo.foreground") },
  escapeOperator:     { color: new vscode.ThemeColor("editorOperator.foreground") },

  // Numbers
  numeric:            { color: new vscode.ThemeColor("symbolIcon.numberForeground") },
  numericCharcode:    { color: new vscode.ThemeColor("symbolIcon.numberForeground") },

  // Unicode properties
  unicodePropertyName:{ color: new vscode.ThemeColor("symbolIcon.propertyForeground") },
  unicodePropertyOperator:{ color: new vscode.ThemeColor("editorOperator.foreground") },
  unicodePropertyValue:{ color: new vscode.ThemeColor("symbolIcon.propertyForeground") },

  // Fallback / unknown
  unknown:            { color: new vscode.ThemeColor("editor.foreground") },
};

// Helper to determine if a node is inside a character class
function isInsideCharacterClass(node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current.type === "character_class") {
      return true;
    }
    current = current.parent;
  }
  return false;
}

// Helper to determine if a group is capturing
function isCapturingGroup(node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current.type === "named_capturing_group" || current.type === "anonymous_capturing_group") {
      return true;
    }
    // Check if this is an assertion (lookahead/lookbehind) - these are non-capturing
    if (current.type.includes("assertion")) {
      return false;
    }
    current = current.parent;
  }
  return false;
}

// Helper to check if we're inside a backreference (for tag coloring)
function isInsideBackreference(node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current.type === "numeric_backreference" || current.type === "named_backreference") {
      return true;
    }
    current = current.parent;
  }
  return false;
}

// Helper to check if we're inside a quantifier (for content coloring)
function isInsideQuantifier(node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current.type === "count_quantifier") {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/**
 * Maps Atom scope strings to VSCode decoration style keys.
 * Implements all the styling logic from base.less.
 */
function scopeToStyleKey(scope: string, node: Node): StyleKey | null {
  const insideCharset = isInsideCharacterClass(node);
  const isCapturing = isCapturingGroup(node);
  const inBackreference = isInsideBackreference(node);
  const inQuantifier = isInsideQuantifier(node);
  
  // ============================================================================
  // INVALID (base.less lines 14-22)
  // ============================================================================
  
  if (scope.includes("invalid")) {
    return "invalid";
  }
  
  // ============================================================================
  // ANCHORS (base.less lines 34-37)
  // ============================================================================
  
  if (scope.includes("keyword.control.anchor")) {
    return "anchor";
  }
  
  // ============================================================================
  // DISJUNCTION (base.less lines 29-32)
  // ============================================================================
  
  if (scope.includes("keyword.operator.disjunction")) {
    return "disjunction";
  }
  
  // ============================================================================
  // QUANTIFIERS (base.less lines 230-238)
  // ============================================================================
  
  if (scope.includes("keyword.operator.quantifier")) {
    // Content inside quantifiers (numbers and delimiters)
    if (scope.includes("constant.numeric") || scope.includes("punctuation.definition.quantifier")) {
      return "quantifierContent";
    }
    return "quantifier";
  }
  
  // ============================================================================
  // GROUPS (base.less lines 165-210)
  // ============================================================================
  
  // Group delimiters ( and )
  if (scope.includes("punctuation.definition.group")) {
    return isCapturing ? "groupDelimiterCapturing" : "groupDelimiter";
  }
  
  // Group identifiers (?: ?= ?! ?<= ?<! ?<name>)
  if (scope.includes("entity.name.type.")) {
    return isCapturing ? "groupIdentifierCapturing" : "groupIdentifier";
  }
  
  // ============================================================================
  // GROUP NAMES & TAGS (base.less lines 188-198, 204-208)
  // ============================================================================
  
  if (scope.includes("entity.name.tag")) {
    // In backreferences (base.less lines 216-226)
    if (inBackreference) {
      return "backreferenceTag";
    }
    // In quantifiers - use quantifierContent
    if (inQuantifier) {
      return "quantifierContent";
    }
    // In capturing groups
    return "groupTagCapturing";
  }
  
  // ============================================================================
  // BACKREFERENCES (base.less lines 212-227)
  // ============================================================================
  
  if (scope.includes("keyword.other.back-reference")) {
    return "backreference";
  }
  
  // ============================================================================
  // CHARACTER SETS (base.less lines 86-163, charset-backgrounds.less)
  // ============================================================================
  
  if (scope.includes("character-class.set")) {
    // Set delimiters [ ] and negation ^
    if (scope.includes("punctuation.definition") || scope.includes("keyword.operator.negation")) {
      return "charsetDelimiter";
    }
    
    // Range hyphen
    if (scope.includes("range.hyphen") || scope.includes("range-delimiter")) {
      return "charsetRangeDash";
    }
    
    // Generic characters inside the set (base.less lines 95-98)
    if (scope.includes("string.other")) {
      return "charsetNonSyntax";
    }
    
    // The set itself gets a background
    return "charsetBackground";
  }
  
  // ============================================================================
  // CHARACTER ESCAPES (base.less lines 39-68 outside, 100-129 inside)
  // ============================================================================
  
  if (scope.includes("constant.character")) {
    
    // Identity escape (base.less lines 42-51 outside, 104-112 inside)
    if (scope.includes("escape.backslash") && !scope.includes("numeric") && !scope.includes("control") && !scope.includes("special")) {
      // The backslash operator itself
      if (scope.includes("keyword.operator.escape-character")) {
        return insideCharset ? "charsetIdentityEscape" : "identityEscapeBackslash";
      }
      // The escaped character
      return insideCharset ? "charsetIdentityEscape" : "identityEscape";
    }
    
    // Numeric and control escapes (base.less lines 53-62 outside, 114-123 inside)
    if (scope.includes("numeric") || scope.includes("control")) {
      // The character code part
      if (scope.includes("character-code")) {
        return insideCharset ? "charsetNumericEscapeCode" : "numericEscapeCode";
      }
      // The escape itself
      return insideCharset ? "charsetNumericEscape" : "numericEscape";
    }
    
    // Special escapes (base.less lines 64-67 outside, 125-128 inside)
    if (scope.includes("special")) {
      return insideCharset ? "charsetSpecialEscape" : "specialEscape";
    }
  }
  
  // ============================================================================
  // CHARACTER CLASSES (base.less lines 70-84 outside, 131-150 inside)
  // ============================================================================
  
  if (scope.includes("constant.other.character-class")) {
    
    // Any character . (appears as character-class.any)
    if (scope.includes(".any")) {
      return insideCharset ? "charsetCharacterClassAny" : "characterClassAny";
    }
    
    // Unicode properties (base.less lines 75-83 outside, 139-148 inside)
    if (scope.includes("unicode-property")) {
      if (scope.includes(".name")) {
        return insideCharset ? "charsetUnicodePropertyName" : "unicodePropertyName";
      }
      if (scope.includes(".value")) {
        return insideCharset ? "charsetUnicodePropertyValue" : "unicodePropertyValue";
      }
      if (scope.includes(".operator")) {
        return insideCharset ? "charsetUnicodePropertyOperator" : "unicodePropertyOperator";
      }
    }
    
    // Character class escapes \d \w \s etc. (base.less line 135-138)
    if (scope.includes("escape") || scope.includes("character-class")) {
      return insideCharset ? "charsetCharacterClass" : "characterClass";
    }
  }
  
  // ============================================================================
  // GENERIC CHARACTERS (base.less lines 24-27)
  // ============================================================================
  
  if (scope.includes("string.other")) {
    return "pattern";
  }
  
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
      const start = node.getStart(sourceFile);
      const end = node.getEnd();
      spans.push({ start, end, literal: text.slice(start, end) });
      return;
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return spans;
}

function splitRegexLiteral(literal: string): { pattern: string; flags: string } | null {
  if (!literal.startsWith("/")) return null;

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

const RULES: Rule[] = require("../resources/colorMap.json");
const COMPILED_RULES = compileRules(RULES);

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

      // Delimiters and flags
      add("delimiter", s.start, s.start + 1);
      add("delimiter", s.start + 1 + pattern.length, s.start + 2 + pattern.length);
      if (flags.length) add("flag", s.end - flags.length, s.end);

      // Walk nodes and apply first matching rule => style key
      walk(tree.rootNode, (node) => {
        for (const rule of COMPILED_RULES) {
          if (!matchRule(node, rule)) continue;
          const styleKey = scopeToStyleKey(rule.scope, node);
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
}

export function deactivate() {}
