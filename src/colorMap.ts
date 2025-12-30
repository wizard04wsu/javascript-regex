// This assigns colors for scopes related to regular expressions in JavaScript.

const COLOR = {
	javaScriptRegexBg: "#00ff0020",
	javaScriptRegexDelim: "#00ff00",
	javaScriptRegexFlag: "#7afd7a",
	
	generic: "#7da672",
	invalid: "#ff0000",
	disjunction: "#f0f080",
	boundary: "#ffffff",
	noncapGroupDelim: "#f0f080",
	noncapGroupType: "#b5b57a",
	capGroupDelim: "#ffa15d",
	capGroupType: "#c68f5e",
	capGroupName: "#e0a880",
	quantifierDelim: "#e2608b",
	quantifierComma: "#e2608b",
	quantifierValues: "#b07d8f",
	charClassGeneric: "#bb8ad2",
	charClassAny: "#bb8ad2",
	charClassEscape: "#bb8ad2",
	charClassUnicodeProperty: "#bb8ad2",
	escape: "#4696e2",
	escapeCode: "#4a87c0",
	escapeCodeSpecial: "#91aeca",
	identityEscapeOperator: "#7da67266",
	
	charSet: {
		generic: "#56b6c2",
		genericBg: "#56b6c220",
		delimiter: "#88eeee",
		rangeBg: "#56b6c220",
		rangeDash: "#88eeee",
		charClassGeneric: "#91aeca",
		charClassEscape: "#91aeca",
		charClassUnicodeProperty: "#91aeca",
		escape: "#4a87c0",
	},
};

const colorMap = {
	/*
	"Tree-sitter selector": {
		"vscForeground": "VSCode foreground color selector",
		"vscBackground": "VSCode background color selector",
		"staticForeground": "#00ff00",
		"staticBackground": "#00ff0020",
		"charset": {
			"vscForeground": "VSCode foreground color selector",
			"vscBackground": "VSCode background color selector",
			"staticForeground": "#00ff00",
			"staticBackground": "#00ff0020"
		}
	},
	*/
	
	
	/////////////////////////////////////////////////////////////////////////
	// JavaScript Syntax (outside of the regex itself)
	/////////////////////////////////////////////////////////////////////////
	
	// RegExp delimiters: /.../...
	// staticForeground: #00ff00
	// staticBackground: #00ff0020
	
	// RegExp flags
	// staticForeground: #7afd7a
	
	
	/////////////////////////////////////////////////////////////////////////
	// Basic Colors
	/////////////////////////////////////////////////////////////////////////
	
	// Pattern
	"regex": {
		"vscForeground": "string.regexp",
		"staticForeground": COLOR.generic,
	},
	"character": {
		"vscForeground": "string.regexp",
		"staticForeground": COLOR.generic,
	},
	
	// Invalid syntax
	"invalid": {
		"vscForeground": "string.regexp",
		"staticForeground": COLOR.invalid,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Disjunctions
	/////////////////////////////////////////////////////////////////////////
	
	// Disjunction: |
	"disjunction_delimiter": {
		"vscForeground": "keyword.operator",
		"staticForeground": COLOR.disjunction,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Boundary Assertions
	/////////////////////////////////////////////////////////////////////////
	
	// Start anchor: ^
	"start_assertion": {
		"vscForeground": "editorWarning.foreground",
		"staticForeground": COLOR.boundary,
	},
	
	// End anchor: $
	"end_assertion": {
		"vscForeground": "editorWarning.foreground",
		"staticForeground": COLOR.boundary,
	},
	
	// Boundary: \b
	"boundary_assertion": {
		"vscForeground": "editorWarning.foreground",
		"staticForeground": COLOR.boundary,
	},
	
	// Non-boundary: \B
	"non_boundary_assertion": {
		"vscForeground": "editorWarning.foreground",
		"staticForeground": COLOR.boundary,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Lookaround Assertions
	/////////////////////////////////////////////////////////////////////////
	
	// Lookahead: (?=...)
	"lookahead_assertion": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupDelim,
	},
	// Lookahead identifier: ?=
	"lookahead_assertion > lookahead_identifier": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupType,
	},
	
	// Negative lookahead: (?!...)
	"negative_lookahead_assertion": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupDelim,
	},
	// Negative lookahead identifier: ?!
	"negative_lookahead_assertion > negative_lookahead_identifier": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupType,
	},
	
	// Lookbehind: (?<=...)
	"lookbehind_assertion": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupDelim,
	},
	// Lookbehind identifier: ?<=
	"lookbehind_assertion > lookbehind_identifier": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupType,
	},
	
	// Negative lookbehind: (?<!...)
	"negative_lookbehind_assertion": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupDelim,
	},
	// Negative lookbehind identifier: ?<!
	"negative_lookbehind_assertion > negative_lookbehind_identifier": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupType,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Non-capturing Groups
	/////////////////////////////////////////////////////////////////////////
	
	// Non-capturing group: (?:...)
	"non_capturing_group": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupDelim,
	},
	// Non-capturing group identifier: ?:
	"non_capturing_group > non_capturing_group_identifier": {
		"vscForeground": "editorBracketHighlight.foreground3",
		"staticForeground": COLOR.noncapGroupType,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Capturing Groups
	/////////////////////////////////////////////////////////////////////////
	
	// Anonymous group: (...)
	"anonymous_capturing_group": {
		"vscForeground": "editorBracketHighlight.foreground2",
		"staticForeground": COLOR.capGroupDelim,
	},
	
	// Named group: (?<...>...)
	"named_capturing_group": {
		"vscForeground": "editorBracketHighlight.foreground2",
		"staticForeground": COLOR.capGroupDelim,
	},
	// Named group identifier: ?<...>
	"named_capturing_group > named_capturing_group_identifier": {
		"vscForeground": "editorBracketHighlight.foreground2",
		"staticForeground": COLOR.capGroupType,
	},
	// Named group name
	"named_capturing_group > named_capturing_group_identifier > group_name": {
		"vscForeground": "symbolIcon.variableForeground",
		"staticForeground": COLOR.capGroupName,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Backreferences
	/////////////////////////////////////////////////////////////////////////
	
	// Numeric backreference: \...
	"numeric_backreference": {
		"vscForeground": "editorBracketHighlight.foreground2",
		"staticForeground": COLOR.capGroupDelim,
	},
	// Numeric backreference identifier
	"numeric_backreference > group_name": {
		"vscForeground": "symbolIcon.variableForeground",
		"staticForeground": COLOR.capGroupName,
	},
	
	// Named backreference: \k<...>
	"named_backreference": {
		"vscForeground": "editorBracketHighlight.foreground2",
		"staticForeground": COLOR.capGroupDelim,
	},
	// Named backreference name
	"named_backreference > group_name": {
		"vscForeground": "symbolIcon.variableForeground",
		"staticForeground": COLOR.capGroupName,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Quantifiers
	/////////////////////////////////////////////////////////////////////////
	
	// Quantifier: * + ? {...} {,...} {...,} {...,...}
	"zero_or_more, one_or_more, optional, count_quantifier": {
		"vscForeground": "symbolIcon.operatorForeground",
		"staticForeground": COLOR.quantifierDelim,
	},
	
	// Quantifier range delimiter: ,
	"count_quantifier > count_quantifier_delimiter": {
		"vscForeground": "symbolIcon.operatorForeground",
		"staticForeground": COLOR.quantifierComma,
	},
	
	// Quantifier range value
	"count_quantifier > count_quantifier_value": {
		"vscForeground": "symbolIcon.numberForeground",
		"staticForeground": COLOR.quantifierValues,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Character Sets
	/////////////////////////////////////////////////////////////////////////
	
	// Character set: [...]
	"character_set": {
		//"vscForeground": "",
		"vscBackground": "editorBracketPairGuide.background4",
		"staticForeground": COLOR.charSet.generic,
		"staticBackground": COLOR.charSet.genericBg,
	},
	"character_set > set_begin": {
		"vscForeground": "editorBracketHighlight.foreground4",
		"staticForeground": COLOR.charSet.delimiter,
	},
	"character_set > set_end": {
		"vscForeground": "editorBracketHighlight.foreground4",
		"staticForeground": COLOR.charSet.delimiter,
	},
	// Character set negation: ^
	"character_set > set_negation": {
		"vscForeground": "editorBracketHighlight.foreground4",
		"staticForeground": COLOR.charSet.delimiter,
	},
	
	// Character range: ...-...
	"character_set > character_range": {
		//"vscBackground": "",
		"staticBackground": COLOR.charSet.rangeBg,
	},
	// Character range delimiter: -
	"character_set > character_range > range_delimiter": {
		"vscForeground": "editorBracketHighlight.foreground4",
		"staticForeground": COLOR.charSet.rangeDash,
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Character Classes
	/////////////////////////////////////////////////////////////////////////
	
	// Character class (any): .
	"any_character": {
		"vscForeground": "symbolIcon.classForeground",
		"staticForeground": COLOR.charClassAny,
	},
	
	// Character class (escape): \d \D \s \S \w \W
	"character_class_escape": {
		"vscForeground": "symbolIcon.classForeground",
		"staticForeground": COLOR.charClassEscape,
		"charset": {
			"vscForeground": "symbolIcon.classForeground",
			"staticForeground": "#91aeca"
		}
	},
	
	// Unicode property class: \p{...} \P{...}
	"unicode_property": {
		"vscForeground": "symbolIcon.classForeground",
		"staticForeground": COLOR.charClassUnicodeProperty,
		"charset": {
			"vscForeground": "symbolIcon.classForeground",
			"staticForeground": "#91aeca"
		}
	},
	
	
	/////////////////////////////////////////////////////////////////////////
	// Character Escapes
	/////////////////////////////////////////////////////////////////////////
	
	// Null: \0 \00 \000
	"null_character": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escape
	},
	
	// Octal escape: \01 \07 \010 \077
	"octal_escape": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escape
	},
	// Octal code
	"octal_escape > octal_code": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escapeCode
	},
	
	// Hexadecimal escape: \x00 \xff \xFF
	"hexadecimal_escape": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escape
	},
	// Hexadecimal code
	"hexadecimal_escape > hexadecimal_code": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escapeCode
	},
	
	// Unicode escape: \u0001 \u9999
	"unicode_escape": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escape
	},
	// Unicode code
	"unicode_escape > unicode_code": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escapeCode
	},
	
	// Unicode codepoint escape: \u{...}
	"unicode_codepoint_escape": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escape
	},
	// Unicode codepoint code
	"unicode_codepoint_escape > unicode_code": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escapeCode
	},
	
	// Control letter escape: \ca \cz \cA \cZ
	"control_letter_escape": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escape
	},
	// Control letter code
	"control_letter_escape > control_letter_code": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escapeCode
	},
	
	// Special character escape: \b (inside a character set) \f \n \r \t \v
	"special_escape": {
		"vscForeground": "symbolIcon.stringForeground",
		"staticForeground": COLOR.escape,
		"charset": {
			"vscForeground": "symbolIcon.stringForeground",
			"staticForeground": COLOR.escapeCodeSpecial
		}
	},
	
	// Identity escape (any other character): \...
	"identity_escape": {
		//"vscForeground": "",
		"staticForeground": COLOR.generic
	},
	// Identity escape operator: \
	"identity_escape > escape_operator": {
		"vscForeground": "editorUnnecessaryCode.opacity",
		"staticForeground": COLOR.identityEscapeOperator
	}
}

export {
	colorMap as default,
	colorMap,
};
