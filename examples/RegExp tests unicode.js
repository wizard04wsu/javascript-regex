//===== Dot =====

//valid
/./u;
/a.c/u;


//===== Boundary Assertions =====

//valid
/^foobar$/u;
/\bfoo\Bbar/u;


//===== Special Escapes =====

//valid
/ \f\n\r\t\v/u;
/[\f\n\r\t\v]/u;
/[\b]/u;	//backspace
/ \0/u;
/[\0]/u;
/ \0_/u;
/[\0_]/u;

//invalid
/ \00/u;
/ \000/u;
/ \01/u;
/ \07/u;
/ \09/u;
/[\00]/u;
/[\000]/u;
/[\01]/u;
/[\07]/u;
/[\09]/u;
/ \00_/u;
/ \000_/u;
/ \01_/u;
/ \07_/u;
/ \09_/u;
/[\00_]/u;
/[\000_]/u;
/[\01_]/u;
/[\07_]/u;
/[\09_]/u;


//===== Control Letter Escapes =====

//valid
/ \ca/u;
/[\ca]/u;
/ \ca_/u;
/[\ca_]/u;

//invalid
/ \c/u;
/ \c9/u;
/[\c]/u;
/[\c9]/u;
/ \c_/u;
/ \c9_/u;
/[\c_]/u;
/[\c9_]/u;


//===== Octal Escapes =====

//invalid
/ \01/u;
/ \07/u;
/ \001/u;
/ \007/u;
/[\01]/u;
/[\07]/u;
/[\001]/u;
/[\007]/u;
/ \01_/u;
/ \07_/u;
/ \001_/u;
/ \007_/u;
/[\01_]/u;
/[\07_]/u;
/[\001_]/u;
/[\007_]/u;


//===== Hexadecimal Escapes =====

//valid
/ \xff/u;
/[\xff]/u;
/ \xff_/u;
/[\xff_]/u;

//invalid
/ \x/u;
/ \xf/u;
/ \xz/u;
/[\x]/u;
/[\xf]/u;
/[\xz]/u;
/ \x__/u;
/ \xf_/u;
/ \xz_/u;
/[\x__]/u;
/[\xf_]/u;
/[\xz_]/u;


//===== Unicode Escapes =====

//valid
/ \uffff/u;
/ \u{f}/u;
/ \u{fffff}/u;
/ \u{10ffff}/u;
/[\uffff]/u;
/[\u{f}]/u;
/[\u{fffff}]/u;
/[\u{10ffff}]/u;
/ \uffff_/u;
/ \u{f}_/u;
/ \u{fffff}_/u;
/ \u{10ffff}_/u;
/[\uffff_]/u;
/[\u{f}_]/u;
/[\u{fffff}_]/u;
/[\u{10ffff}_]/u;

//invalid
/ \u/u;
/ \uf/u;
/ \uz/u;
/ \u{/u;
/ \u{}/u;
/ \u{f/u;
/ \u{z/u;
/ \u{ffffff/u;
/[\u]/u;
/[\uf]/u;
/[\uz]/u;
/[\u{]/u;
/[\u{}]/u;
/[\u{f]/u;
/[\u{z]/u;
/[\u{ffffff]/u;
/ \u_/u;
/ \uf_/u;
/ \uz_/u;
/ \u{_/u;
/ \u{}_/u;
/ \u{f_/u;
/ \u{z_/u;
/ \u{ffffff_/u;
/[\u_]/u;
/[\uf_]/u;
/[\uz_]/u;
/[\u{_]/u;
/[\u{}_]/u;
/[\u{f_]/u;
/[\u{z_]/u;
/[\u{ffffff_]/u;


//===== Identity Escapes =====

//valid
/ \^\$\\\.\*\+\?\(\)\[\]\{\}\|\//u;
/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|\/]/u;
/[\-]/u;

//invalid
/ \-/u;
/ \a/u;	//escaping any generic character is invalid
/[\a]/u;
/ \a_/u;
/[\a_]/u;


//===== Character Class Escapes =====

//valid
/ \d\D\s\S\w\W/u;
/[\d\D\s\S\w\W]/u;


//===== Unicode Property Escapes =====

/ \p{Decimal_Number} \P{Decimal_Number}/u;
/[\p{Decimal_Number} \P{Decimal_Number}]/u;
/ \p{General_Category=Decimal_Number} \P{General_Category=Decimal_Number}/u;
/[\p{General_Category=Decimal_Number} \P{General_Category=Decimal_Number}]/u;

//invalid
/ \p/u;
/ \p{/u;
/ \p{}/u;
/ \p{a/u;
/ \p{a=/u;
/ \p{a=b/u;
/ \p{=b/u;
/ \p{=/u;
/ \p{=b}/u;
/ \p{=}/u;
/[\p]/u;
/[\p{]/u;
/[\p{}]/u;
/[\p{a]/u;
/[\p{a=]/u;
/[\p{a=b]/u;
/[\p{=b]/u;
/[\p{=]/u;
/[\p{=b}]/u;
/[\p{=}]/u;
/ \p_/u;
/ \p{_/u;
/ \p{}_/u;
/ \p{a_/u;
/ \p{a=_/u;
/ \p{a=b_/u;
/ \p{=b_/u;
/ \p{=_/u;
/ \p{=b}_/u;
/ \p{=}_/u;
/[\p;]/u;
/[\p{;]/u;
/[\p{};]/u;
/[\p{a;]/u;
/[\p{a=;]/u;
/[\p{a=b;]/u;
/[\p{=b;]/u;
/[\p{=;]/u;
/[\p{=b};]/u;
/[\p{=};]/u;


//===== Character Sets =====

//valid
/[]/u;
/[foo]/u;
/[^foo]/u;
/[foo^]/u;
/[\b]/u;	//special escape for backspace
/[\-]/u;	//identity escape for '-'
/[a-z]/u;
/[a-a]/u;
/[\t-a]/u;
/[\t-\t]/u;
/[a-\u{ffff}]/u;
/[a-\d]/u;
/[\d-a]/u;
/[\d-\d]/u;
/[-]/u;
/[--]/u;
/[---]/u;
/[-a-b-c-]/u;
/[/]/u;
/[\^\$\\\.\*\+\?\(\)\[\]\{\}\|\/\-]/u;

//invalid
/[z-a]/u;	//range out of order
/[a-\t]/u;	//range out of order


//===== Groups and Lookaround Assertions =====

//Note: Tree-sitter doesn't support Unicode property escapes, so I can't reasonably make this part match the spec.

//valid
/()/u;
/(foo)/u;
/(?:foo)/u;
/(?=foo)/u;
/(?!foo)/u;
/(?<=foo)/u;
/(?<!foo)/u;
/(?<foo>bar)/u;
/(?<aA0_$\u0066oo>bar)/u;

//invalid
/(?<#>bar)/u;
/(?<foo>a)(?<foo>b)/u;	//duplicate group name


//===== Backreferences =====

//valid
/ \1\9\10\999/u;
/ \k<foo>/u;
/ \k<aA0_$\u0066oo>/u;

//invalid
/ \k/u;
/ \k_/u;
/ \k</u;
/ \k<#/u;
/ \k<_/u;
/ \k<>/u;
/ \k<#>/u;


//===== Disjunction =====

//valid
/foo|bar/u;
/(foo|bar)/u;


//===== Quantifiers =====

//valid
/a?_/u;
/a*_/u;
/a+_/u;
/a??_/u;
/a*?_/u;
/a+?_/u;
/a{1}_/u;
/a{1,}_/u;
/a{1,2}_/u;
/a{1}?_/u;
/a{1,}?_/u;
/a{1,2}?_/u;
/\?*/u;

//invalid
/a{/u;
/a{z/u;
/a{z_/u;
/a{}_/u;
/a{z}_/u;
/a{z_}_/u;
/a{1/u;
/a{1z/u;
/a{1z_/u;
/a{1z_}_/u;
/a{,2}_/u;
/a{,_}_/u;
/a?{/u;
/a?{z/u;
/a?{z_/u;
/a?{z_}_/u;
/a?{1/u;
/a?{1z/u;
/a?{1z_/u;
/a?{1z_}_/u;
/a?{,2}_/u;
/a?{,_}_/u;

//invalid
/a?*_/u;
/a?+_/u;
/a**_/u;
/a*+_/u;
/a+*_/u;
/a++_/u;
/a{1}*_/u;
/a{1}+_/u;
/a???_/u;
/a??*_/u;
/a??+_/u;
/a*??_/u;
/a*?*_/u;
/a*?+_/u;
/a+??_/u;
/a+?*_/u;
/a+?+_/u;
/a{1}??_/u;
/a{1}?*_/u;
/a{1}?+_/u;
/a?{1}_/u;
/a*{1}_/u;
/a+{1}_/u;
/a{1}{1}_/u;
/a??{1}_/u;
/a*?{1}_/u;
/a+?{1}_/u;
/a{1}?{1}_/u;


//===== Examples =====

//URI-matching RegExp ( https://github.com/wizard04wsu/URI_Parsing )
/^(?=(?<scheme>[a-z][a-z\d+.-]*))\1:(?:\/\/(?<authority>(?:(?=(?<userinfo>(?:[\w-.~!$&'()*+,;=:]|%[\dA-F]{2})*))\3@)?(?=(?<host>\[[\dA-F:.]{2,}\]|(?:[\w-.~!$&'()*+,;=]|%[\dA-F]{2})*))\4(?::(?=(?<port>\d*))\5)?)(?<path1>\/(?=((?:[\w-.~!$&'()*+,;=:@/]|%[\dA-F]{2})*))\7)?|(?<path2>\/?(?!\/)(?=((?:[\w-.~!$&'()*+,;=:@/]|%[\dA-F]{2})*))\9)?)(?:\?(?=(?<query>(?:[\w-.~!$&'()*+,;=:@/?]|%[\dA-F]{2})*))\10)?(?:#(?=(?<fragment>(?:[\w-.~!$&'()*+,;=:@/?]|%[\dA-F]{2})*))\11)?$/ui;
