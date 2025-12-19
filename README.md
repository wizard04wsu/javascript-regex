# JS Regex Tree-sitter Highlighter (Option B)

This VS Code extension highlights JavaScript/TypeScript **regex literals** by:

1. Using the **TypeScript scanner** to find true `RegularExpressionLiteral` tokens (so `/` division isn't mistaken for regex).
2. Parsing the regex pattern with your Tree-sitter grammars compiled to **WASM** (`web-tree-sitter`).
3. Applying VS Code **decorations** only to the regex pattern ranges, leaving VS Code's built-in JS/TS semantic tokens untouched.

## Setup

### 1) Build WASM parsers

From each grammar repo:

- `tree-sitter-regex-js`
- `tree-sitter-regex-unicode-js`

Run:

```bash
npx tree-sitter generate --abi 15
npx tree-sitter build --wasm
```

Copy the produced `.wasm` file into this extension:

- `parsers/tree-sitter-regex-js.wasm`
- `parsers/tree-sitter-regex-unicode-js.wasm`

(Those filenames match the defaults in `settings.json`.)

### 2) Install dependencies

```bash
npm install
```

### 3) Run the extension

Open this folder in VS Code and press **F5** (Run Extension).

## Configuration

- `regexTreeSitterHighlighter.enable`
- `regexTreeSitterHighlighter.maxRegexLength`
- `regexTreeSitterHighlighter.debugLogNodeTypes`
- `regexTreeSitterHighlighter.wasmPathRegex`
- `regexTreeSitterHighlighter.wasmPathRegexUnicode`

## Scope/Style mapping

- `resources/scopeRules.json` was generated from your Atom Tree-sitter grammar CSON files.
- The extension maps Atom scopes to a smaller set of VS Code decoration styles in `src/extension.ts` (`scopeToStyleKey`).

## Notes / Limitations

- Atom's *group outlines* and some nested background effects are hard to replicate exactly with VS Code decorations.
  This starter focuses on reliable token coloring/backgrounds first; outlines can be approximated later with borders.
- If you change node names in your grammars, update `resources/scopeRules.json` (or regenerate it).
