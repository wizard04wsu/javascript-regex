"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ts = __importStar(require("typescript"));
const web_tree_sitter_1 = require("web-tree-sitter");
const STYLE = {
    /*flag: { color: "#7afd7a" },
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
    unicodePropertyValue: { color: "#56b6c2" },*/
    // Theme-aware decoration styles (no hard-coded hex colors)
    flag: { color: new vscode.ThemeColor("editorInfo.foreground") || "#7afd7a" },
    delimiter: { color: new vscode.ThemeColor("editorBracketHighlight.foreground1") || "#00ff00" },
    pattern: { color: new vscode.ThemeColor("editor.foreground") || "#7da672" },
    invalid: { color: new vscode.ThemeColor("editorError.foreground") || "#ff0000" },
    disjunction: { color: new vscode.ThemeColor("editor.foreground") || "#ffffff" },
    quantifier: { color: new vscode.ThemeColor("editorWarning.foreground") || "#e2608b" },
    anchor: { color: new vscode.ThemeColor("editorBracketHighlight.foreground2") || "#ffffff" },
    groupDelimiter: { color: new vscode.ThemeColor("editorBracketHighlight.foreground3") || "#e8e888" },
    groupIdentifier: { color: new vscode.ThemeColor("editorBracketHighlight.foreground4") || "#b5b57a" },
    groupTag: { color: new vscode.ThemeColor("editorBracketHighlight.foreground5") || "#d3d3a0" },
    backreference: { color: new vscode.ThemeColor("editorWarning.foreground") || "#ffa15d" },
    // Background colors can't use opacity with ThemeColor, so pick a subtle theme background token:
    charset: { backgroundColor: new vscode.ThemeColor("editor.wordHighlightBackground") },
    charsetDelimiter: { color: new vscode.ThemeColor("editorBracketHighlight.foreground3") || "#88eeee" },
    charsetRangeDash: { color: new vscode.ThemeColor("editorBracketHighlight.foreground3") || "#88eeee" },
    escape: { color: new vscode.ThemeColor("editorInfo.foreground") || "#61afef" },
    escapeOperator: { color: new vscode.ThemeColor("editorBracketHighlight.foreground6") || "#c678dd" },
    numeric: { color: new vscode.ThemeColor("symbolIcon.numberForeground") || "#d19a66" },
    numericCharcode: { color: new vscode.ThemeColor("symbolIcon.numberForeground") || "#b07d4e" },
    characterClass: { color: new vscode.ThemeColor("symbolIcon.classForeground") || "#56b6c2" },
    unicodePropertyName: { color: new vscode.ThemeColor("symbolIcon.propertyForeground") || "#56b6c2" },
    unicodePropertyOperator: { color: new vscode.ThemeColor("editorBracketHighlight.foreground6") || "#c678dd" },
    unicodePropertyValue: { color: new vscode.ThemeColor("symbolIcon.propertyForeground") || "#56b6c2" },
};
// Map Atom-ish scope strings (from your CSON) to a VS Code decoration style key.
function scopeToStyleKey(scope) {
    if (scope.includes("invalid"))
        return "invalid";
    if (scope.includes(".anchor."))
        return "anchor";
    if (scope.includes(".quantifier."))
        return "quantifier";
    if (scope.includes(".disjunction."))
        return "disjunction";
    if (scope.includes("punctuation.definition.group"))
        return "groupDelimiter";
    if (scope.includes("entity.name.type.") || scope.includes("entity.name.tag.")) {
        // identifiers like (?:, (?=, (?<name>), and tags (name)
        // If you want capturing vs non-capturing to differ later, split here.
        return scope.includes("tag") ? "groupTag" : "groupIdentifier";
    }
    if (scope.includes("back-reference"))
        return "backreference";
    if (scope.includes("character-class.set"))
        return "charset";
    if (scope.includes("character-class.set.begin") || scope.includes("character-class.set.end"))
        return "charsetDelimiter";
    if (scope.includes("character-class.range.hyphen"))
        return "charsetRangeDash";
    if (scope.includes("character-class.escape"))
        return "characterClass";
    if (scope.includes("unicode-property.name"))
        return "unicodePropertyName";
    if (scope.includes("unicode-property.value"))
        return "unicodePropertyValue";
    if (scope.includes("unicode-property"))
        return "unicodePropertyOperator";
    if (scope.includes("keyword.operator.escape-character"))
        return "escapeOperator";
    if (scope.includes("character.numeric")) {
        return scope.includes("character-code") ? "numericCharcode" : "numeric";
    }
    // default for escapes
    if (scope.includes("constant.character") || scope.includes("escape"))
        return "escape";
    return null;
}
function isSupportedDoc(doc) {
    return (doc.languageId === "javascript" ||
        doc.languageId === "javascriptreact" ||
        doc.languageId === "typescript" ||
        doc.languageId === "typescriptreact");
}
function getConfig() {
    const cfg = vscode.workspace.getConfiguration("regexTreeSitterHighlighter");
    return {
        enable: cfg.get("enable", true),
        maxRegexLength: cfg.get("maxRegexLength", 5000),
        debug: cfg.get("debugLogNodeTypes", false),
        wasmRegex: cfg.get("wasmPathRegex", "parsers/tree-sitter-regex-js.wasm"),
        wasmRegexU: cfg.get("wasmPathRegexUnicode", "parsers/tree-sitter-regex-unicode-js.wasm"),
    };
}
function getRegexLiteralSpans(text, fileName, langId) {
    const spans = [];
    const scriptKind = langId === "typescript" ? ts.ScriptKind.TS :
        langId === "typescriptreact" ? ts.ScriptKind.TSX :
            langId === "javascriptreact" ? ts.ScriptKind.JSX :
                ts.ScriptKind.JS;
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, 
    /* setParentNodes */ true, scriptKind);
    const visit = (node) => {
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
function splitRegexLiteral(literal) {
    // TS already confirmed it's a regex literal token, so we can be simpler.
    if (!literal.startsWith("/"))
        return null;
    // trailing flags
    let i = literal.length - 1;
    while (i > 0 && /[a-z]/i.test(literal[i]))
        i--;
    if (literal[i] !== "/")
        return null;
    const flags = literal.slice(i + 1);
    const pattern = literal.slice(1, i);
    return { pattern, flags };
}
function compileRules(rules) {
    return rules.map(r => ({
        parts: r.selector.split(">").map(p => p.trim()).filter(Boolean),
        scope: r.scope,
    }));
}
function matchRule(node, rule) {
    // rule.parts like ["identity_escape", "escape_operator"]
    let cur = node;
    for (let idx = rule.parts.length - 1; idx >= 0; idx--) {
        if (!cur)
            return false;
        if (cur.type !== rule.parts[idx])
            return false;
        cur = cur.parent;
    }
    return true;
}
function walk(node, visit) {
    visit(node);
    for (let i = 0; i < node.childCount; i++) {
        const c = node.child(i);
        if (c)
            walk(c, visit);
    }
}
let initialized = false;
let parserRegex = null;
let parserRegexU = null;
async function ensureParsers(context, output) {
    if (initialized)
        return;
    await web_tree_sitter_1.Parser.init();
    const cfg = getConfig();
    const wasmRegexPath = vscode.Uri.joinPath(context.extensionUri, cfg.wasmRegex).fsPath;
    const wasmRegexUPath = vscode.Uri.joinPath(context.extensionUri, cfg.wasmRegexU).fsPath;
    const langRegex = await web_tree_sitter_1.Language.load(wasmRegexPath);
    const langRegexU = await web_tree_sitter_1.Language.load(wasmRegexUPath);
    parserRegex = new web_tree_sitter_1.Parser();
    parserRegex.setLanguage(langRegex);
    parserRegexU = new web_tree_sitter_1.Parser();
    parserRegexU.setLanguage(langRegexU);
    initialized = true;
}
function chooseParser(flags) {
    return flags.includes("u") ? parserRegexU : parserRegex;
}
// ---- Load your CSON-derived rules (compiled into JSON) ----
const RULES = require("../resources/scopeRules.json");
const COMPILED_RULES = compileRules(RULES);
// Create decoration types for each StyleKey once.
function createDecorationTypes() {
    const out = {};
    Object.keys(STYLE).forEach(k => {
        out[k] = vscode.window.createTextEditorDecorationType(STYLE[k]);
    });
    return out;
}
async function activate(context) {
    const output = vscode.window.createOutputChannel("Regex Tree-sitter Highlighter");
    context.subscriptions.push(output);
    const decos = createDecorationTypes();
    Object.values(decos).forEach(d => context.subscriptions.push(d));
    let timer;
    async function refresh(editor) {
        const cfg = getConfig();
        if (!cfg.enable)
            return;
        const doc = editor.document;
        if (!isSupportedDoc(doc))
            return;
        await ensureParsers(context, output);
        // Clear all decorations
        Object.keys(decos).forEach(k => editor.setDecorations(decos[k], []));
        const text = doc.getText();
        const spans = getRegexLiteralSpans(text, doc.fileName, doc.languageId);
        const buckets = Object.create(null);
        const add = (k, start, end) => {
            (buckets[k] ?? (buckets[k] = [])).push({ start, end });
        };
        for (const s of spans) {
            const split = splitRegexLiteral(s.literal);
            if (!split)
                continue;
            const { pattern, flags } = split;
            if (pattern.length > cfg.maxRegexLength)
                continue;
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
            if (flags.length)
                add("flag", s.end - flags.length, s.end);
            // Walk nodes and apply first matching rule => style key
            walk(tree.rootNode, (node) => {
                for (const rule of COMPILED_RULES) {
                    if (!matchRule(node, rule))
                        continue;
                    const styleKey = scopeToStyleKey(rule.scope);
                    if (!styleKey)
                        continue;
                    const start = patternOffset + node.startIndex;
                    const end = patternOffset + node.endIndex;
                    if (end > start)
                        add(styleKey, start, end);
                    break;
                }
            });
        }
        // Apply decorations
        Object.keys(buckets).forEach(k => {
            const ranges = buckets[k].map(o => new vscode.Range(doc.positionAt(o.start), doc.positionAt(o.end)));
            editor.setDecorations(decos[k], ranges);
        });
    }
    function scheduleRefresh(editor) {
        const ed = editor ?? vscode.window.activeTextEditor;
        if (!ed)
            return;
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => refresh(ed), 120);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(ed => ed && scheduleRefresh(ed)), vscode.workspace.onDidChangeTextDocument(e => {
        const ed = vscode.window.activeTextEditor;
        if (ed && e.document === ed.document)
            scheduleRefresh(ed);
    }), vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration("regexTreeSitterHighlighter"))
            scheduleRefresh();
    }));
    if (vscode.window.activeTextEditor)
        scheduleRefresh(vscode.window.activeTextEditor);
    //output.appendLine("Extension activated.");
}
function deactivate() { }
//# sourceMappingURL=extension.js.map