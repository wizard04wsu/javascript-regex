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

///////////////////////////////////////////////////////////////////////////////
// COLORS USED OUTSIDE OF A CHARACTER SET
///////////////////////////////////////////////////////////////////////////////

// ============================================================================
// BASE COLORS (from colors.less)
// ============================================================================

/** Regex delimiters '/' */
export const delimiter = "#00ff00";

/** Regex flags (g, i, m, etc.) */
export const flag = "#7afd7a";

/** Pattern content (generic characters outside character sets) */
export const content = "#7da672";

/** Invalid/error content */
export const invalid = "#ff0000";

/** Anchors (^, $, \b, \B) */
export const anchor = "#ffffff";

// ============================================================================
// GROUPS
// ============================================================================

/** Group background */
export const groupBg = "transparent";

/** Non-capturing group delimiters - saturate(#e8e888, 30%, relative) */
export const groupDelimiter = "#f0f080";

/** Capturing group delimiters */
export const groupDelimiter_capturing = "#ffa15d";

/** Non-capturing group identifiers (?:, ?=, ?!, etc.) - desaturate(darken(#f0f080, 35%), 70%) */
export const groupIdentifier = "#b5b57a";

/** Capturing group identifiers (?<name>) - desaturate(darken(#ffa15d, 35%), 70%) */
export const groupIdentifier_capturing = "#c68f5e";

/** Capturing group names - saturate(lighten(#c68f5e, 25%), 50%) */
export const groupTag_capturing = "#e0a880";

// ============================================================================
// BACKREFERENCES
// ============================================================================

/** Backreference operators (\1, \k<name>) */
export const backreference = "#ffa15d";

/** Group names in backreferences - desaturate(darken(#ffa15d, 25%), 55%) */
export const backreferenceTag = "#c68f5e";

// ============================================================================
// QUANTIFIERS
// ============================================================================

/** Quantifier operators (*, +, ?, {n,m}) */
export const quantifier = "#e2608b";

/** Quantifier values (numbers in {n,m}) - desaturate(darken(#e2608b, 25%), 40%) */
export const quantifierTag = "#b07d8f";

// ============================================================================
// CHARACTER CLASSES (outside character sets)
// ============================================================================

/** Character classes (\d, \w, \s, \D, \W, \S, .) */
export const characterClass = "#bb8ad2";

/** Unicode property classes (\p{...}, \P{...}) - desaturate(darken(#bb8ad2, 30%), 40%) */
export const characterClassProperty = "#8d6ea1";

// ============================================================================
// NUMERIC & SPECIAL ESCAPES (outside character sets)
// ============================================================================

/** Numeric escapes (\xHH, \uHHHH, \u{...}, \0, \cX) */
export const characterNumeric = "#4696e2";

/** Numeric character codes (the HH/HHHH part) - desaturate(darken(#4696e2, 25%), 25%) */
export const characterNumericCharcode = "#4a87c0";

/** Special escapes (\n, \r, \t, etc.) - same as characterNumeric */
export const characterSpecial = characterNumeric;


///////////////////////////////////////////////////////////////////////////////
// COLORS USED INSIDE OF A CHARACTER SET
///////////////////////////////////////////////////////////////////////////////

// ============================================================================
// CHARACTER SETS (inside [...])
// ============================================================================

/** Base charset color (generic characters) */
export const charset = "#56b6c2";

/** Charset background - fade(#56b6c2, 8%) */
export const charsetBg = "rgba(86,182,194,0.08)";

/** Charset delimiters [, ], and negation ^ */
export const charsetDelimiter = "#88eeee";

/** Character ranges background a-z - fade(#88eeee, 8%) */
export const charsetRangeBg = "rgba(136,238,238,0.08)";

/** Range dash hyphen - */
export const charsetRangeDash = charsetDelimiter;

// ============================================================================
// INSIDE CHARACTER SETS - SPECIAL CHARACTERS
// ============================================================================

/** Special escapes inside sets - mix(#4696e2, #56b6c2, 60%) */
export const charsetCharacterSpecial = "#4fa5da";

/** Character classes inside sets (\d, \w, etc.) - mix(#bb8ad2, #56b6c2, 60%) */
export const charsetCharacterClass = "#91aeca";

/** Unicode properties inside sets - mix(#8d6ea1, #56b6c2, 75%) */
export const charsetCharacterClassProperty = "#7b7fa9";

/** Numeric escapes inside sets (same as outside) */
export const charsetCharacterNumeric = characterNumeric;

/** Numeric character codes inside sets (same as outside) */
export const charsetCharacterNumericCharcode = characterNumericCharcode;

// ============================================================================
// SPECIAL FORMATTING
// ============================================================================

/** Opacity for identity escape backslashes (from base.less line 49) */
export const identityEscapeBackslashOpacity = 0.4;

/** Font style for group names and backreference tags (from base.less) */
export const tagFontStyle = "italic";

// ============================================================================
// DISJUNCTION
// ============================================================================

/** Disjunction operator | - uses groupDelimiter color (from base.less line 31) */
export const disjunction = groupDelimiter;
