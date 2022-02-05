# javascript-regex
[![](https://img.shields.io/apm/v/javascript-regex)](https://atom.io/packages/javascript-regex) [![](https://img.shields.io/apm/dm/javascript-regex)](https://atom.io/packages/javascript-regex)

Improved syntax for JavaScript regular expressions.

Check out the [One Dark for Regex](https://atom.io/packages/one-dark-regex-syntax) theme for a practical use.

This package implements two tree-sitter parsers:
- [tree-sitter-regex-unicode-js](https://github.com/wizard04wsu/tree-sitter-regex-unicode-js) for regular expressions that have the Unicode flag set
- [tree-sitter-regex-js](https://github.com/wizard04wsu/tree-sitter-regex-js) for the rest

# Troubleshooting
### Unable to install on Windows
Instead of installing it from within Atom, try from the command line.

	cd %USERPROFILE%\\.atom\\packages
	apm install javascript-regex

### Failure to load package grammars when I open Atom
Whenever Atom is updated, this package needs to be rebuilt. Either click the red bug icon in the bottom-right corner of the window, or execute `Incompatible Packages: View` via the command palette. Then, click "Rebuild Packages". You'll have to restart Atom.

If anyone has a better solution, please [let me know](https://github.com/wizard04wsu/javascript-regex/issues/9).
