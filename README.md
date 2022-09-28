# javascript-regex
[![](https://img.shields.io/apm/v/javascript-regex)](https://atom.io/packages/javascript-regex) [![](https://img.shields.io/apm/dm/javascript-regex)](https://atom.io/packages/javascript-regex)

Improved syntax for JavaScript regular expressions, with syntax highlighting.

![regex2](https://user-images.githubusercontent.com/695638/192731283-82db8798-d9b9-4f3f-8f13-7a90fb581810.gif)

This package implements two tree-sitter parsers:
- [tree-sitter-regex-unicode-js](https://github.com/wizard04wsu/tree-sitter-regex-unicode-js) for regular expressions that have the Unicode flag set
- [tree-sitter-regex-js](https://github.com/wizard04wsu/tree-sitter-regex-js) for the rest

## Troubleshooting
#### If you're unable to install the package on Windows:
Instead of installing it from within Atom, close Atom and try from the command line.

	cd /d %USERPROFILE%\.atom\packages
	rmdir /s /q javascript-regex
	apm install javascript-regex

#### If there's a failure loading the grammars when you open Atom:
Whenever Atom is updated, this package needs to be rebuilt. Either click the red bug icon in the bottom-right corner of the window, or execute `Incompatible Packages: View` via the command palette. Then, click "Rebuild Packages". You'll have to restart Atom.

If anyone has a better solution, please [let me know](https://github.com/wizard04wsu/javascript-regex/issues/9).
