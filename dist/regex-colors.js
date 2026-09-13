"use strict";
/**
 * Complete color scheme converted from Atom LESS files
 * Manual calculation of LESS color functions (saturate, desaturate, darken, lighten, mix, fade)
 *
 * Source files:
 * - colors.less: Base color definitions
 * - base.less: Main styling rules
 * - charset-backgrounds.less: Background colors for character sets
 * - group-outlines.less: Group outline decorations (not fully implemented in VSCode)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.disjunction = exports.tagFontStyle = exports.identityEscapeBackslashOpacity = exports.charsetCharacterNumericCharcode = exports.charsetCharacterNumeric = exports.charsetCharacterClassProperty = exports.charsetCharacterClass = exports.charsetCharacterSpecial = exports.charsetRangeDash = exports.charsetRangeBg = exports.charsetDelimiter = exports.charsetBg = exports.charset = exports.characterSpecial = exports.characterNumericCharcode = exports.characterNumeric = exports.characterClassProperty = exports.characterClass = exports.quantifierTag = exports.quantifier = exports.backreferenceTag = exports.backreference = exports.groupTag_capturing = exports.groupIdentifier_capturing = exports.groupIdentifier = exports.groupDelimiter_capturing = exports.groupDelimiter = exports.groupBg = exports.anchor = exports.invalid = exports.content = exports.flag = exports.delimiter = void 0;
///////////////////////////////////////////////////////////////////////////////
// COLORS USED OUTSIDE OF A CHARACTER SET
///////////////////////////////////////////////////////////////////////////////
// ============================================================================
// BASE COLORS (from colors.less)
// ============================================================================
/** Regex delimiters '/' */
exports.delimiter = "#00ff00";
/** Regex flags (g, i, m, etc.) */
exports.flag = "#7afd7a";
/** Pattern content (generic characters outside character sets) */
exports.content = "#7da672";
/** Invalid/error content */
exports.invalid = "#ff0000";
/** Anchors (^, $, \b, \B) */
exports.anchor = "#ffffff";
// ============================================================================
// GROUPS
// ============================================================================
/** Group background */
exports.groupBg = "transparent";
/** Non-capturing group delimiters - saturate(#e8e888, 30%, relative) */
exports.groupDelimiter = "#f0f080";
/** Capturing group delimiters */
exports.groupDelimiter_capturing = "#ffa15d";
/** Non-capturing group identifiers (?:, ?=, ?!, etc.) - desaturate(darken(#f0f080, 35%), 70%) */
exports.groupIdentifier = "#b5b57a";
/** Capturing group identifiers (?<name>) - desaturate(darken(#ffa15d, 35%), 70%) */
exports.groupIdentifier_capturing = "#c68f5e";
/** Capturing group names - saturate(lighten(#c68f5e, 25%), 50%) */
exports.groupTag_capturing = "#e0a880";
// ============================================================================
// BACKREFERENCES
// ============================================================================
/** Backreference operators (\1, \k<name>) */
exports.backreference = "#ffa15d";
/** Group names in backreferences - desaturate(darken(#ffa15d, 25%), 55%) */
exports.backreferenceTag = "#c68f5e";
// ============================================================================
// QUANTIFIERS
// ============================================================================
/** Quantifier operators (*, +, ?, {n,m}) */
exports.quantifier = "#e2608b";
/** Quantifier values (numbers in {n,m}) - desaturate(darken(#e2608b, 25%), 40%) */
exports.quantifierTag = "#b07d8f";
// ============================================================================
// CHARACTER CLASSES (outside character sets)
// ============================================================================
/** Character classes (\d, \w, \s, \D, \W, \S, .) */
exports.characterClass = "#bb8ad2";
/** Unicode property classes (\p{...}, \P{...}) - desaturate(darken(#bb8ad2, 30%), 40%) */
exports.characterClassProperty = "#8d6ea1";
// ============================================================================
// NUMERIC & SPECIAL ESCAPES (outside character sets)
// ============================================================================
/** Numeric escapes (\xHH, \uHHHH, \u{...}, \0, \cX) */
exports.characterNumeric = "#4696e2";
/** Numeric character codes (the HH/HHHH part) - desaturate(darken(#4696e2, 25%), 25%) */
exports.characterNumericCharcode = "#4a87c0";
/** Special escapes (\n, \r, \t, etc.) - same as characterNumeric */
exports.characterSpecial = exports.characterNumeric;
///////////////////////////////////////////////////////////////////////////////
// COLORS USED INSIDE OF A CHARACTER SET
///////////////////////////////////////////////////////////////////////////////
// ============================================================================
// CHARACTER SETS (inside [...])
// ============================================================================
/** Base charset color (generic characters) */
exports.charset = "#56b6c2";
/** Charset background - fade(#56b6c2, 8%) */
exports.charsetBg = "rgba(86,182,194,0.08)";
/** Charset delimiters [, ], and negation ^ */
exports.charsetDelimiter = "#88eeee";
/** Character ranges background a-z - fade(#88eeee, 8%) */
exports.charsetRangeBg = "rgba(136,238,238,0.08)";
/** Range dash hyphen - */
exports.charsetRangeDash = exports.charsetDelimiter;
// ============================================================================
// INSIDE CHARACTER SETS - SPECIAL CHARACTERS
// ============================================================================
/** Special escapes inside sets - mix(#4696e2, #56b6c2, 60%) */
exports.charsetCharacterSpecial = "#4fa5da";
/** Character classes inside sets (\d, \w, etc.) - mix(#bb8ad2, #56b6c2, 60%) */
exports.charsetCharacterClass = "#91aeca";
/** Unicode properties inside sets - mix(#8d6ea1, #56b6c2, 75%) */
exports.charsetCharacterClassProperty = "#7b7fa9";
/** Numeric escapes inside sets (same as outside) */
exports.charsetCharacterNumeric = exports.characterNumeric;
/** Numeric character codes inside sets (same as outside) */
exports.charsetCharacterNumericCharcode = exports.characterNumericCharcode;
// ============================================================================
// SPECIAL FORMATTING
// ============================================================================
/** Opacity for identity escape backslashes (from base.less line 49) */
exports.identityEscapeBackslashOpacity = 0.4;
/** Font style for group names and backreference tags (from base.less) */
exports.tagFontStyle = "italic";
// ============================================================================
// DISJUNCTION
// ============================================================================
/** Disjunction operator | - uses groupDelimiter color (from base.less line 31) */
exports.disjunction = exports.groupDelimiter;
//# sourceMappingURL=regex-colors.js.map