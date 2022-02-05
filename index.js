const injectionPoint_regex = {
	//name of the target grammar scope in the outer language
	type: 'regex',
	
	//get the name of the grammar that should be injected into a matching node
	language(regexNode){
		const {lastChild} = regexNode;
		if(lastChild.type === 'regex_flags'){	//flags are specified
			const flags = lastChild.text;
			let validFlags = 'gimsy'.split(''),
				f = -1;
			while(validFlags.length && ++f < flags.length){
				const v = validFlags.indexOf(flags[f]);
				if(flags[f] === 'u'){
					return 'regex_u';	//unicode flag is set
				}
				else if(v < 0){
					break;	//invalid or duplicate flag
				}
				validFlags.splice(v, 1);
			}
		}
		return 'regex';	//unicode flag is not set
	},
	
	//get the node with the text content that should be parsed using the injected grammar
	content(regexNode){
		//return the node containing the regex pattern between the slashes
		return regexNode.children[1];
	}
};

function createInjectionPointsInGrammar(scopeName){
	const grammar = atom.grammars.treeSitterGrammarsById[scopeName];
	if(!grammar) throw new Error(`Tree-sitter grammar for ${scopeName} was not found in the registry`);
	
	//remove existing injection points
	['regex', 'regex_pattern'].forEach(type => {
		let injectionPoints = grammar.injectionPointsByType[type];
		if(injectionPoints){
			for(const ip of injectionPoints){
				grammar.removeInjectionPoint(ip);
			}
		}
	});
	
	//add the one for this package
	grammar.addInjectionPoint(injectionPoint_regex);
}

exports.activate = function (){
	const thisPackageName = 'javascript-regex';
	
	//replace existing grammars with the grammars in this package
	const thisGrammars = atom.packages.loadedPackages[thisPackageName].grammars;
	thisGrammars.forEach(grammar => {
		const existingGrammar = atom.grammars.treeSitterGrammarsById[grammar.scopeName];
		if(existingGrammar.packageName !== thisPackageName){
			atom.grammars.removeGrammar(existingGrammar);
			atom.grammars.addGrammar(grammar);
		}
	});
	
	//add injection points in these grammars
	const scopeNameList = [
		'source.js',
		'source.jsx',
		'source.ts',
		'source.flow',
	];
	for(const scopeName of scopeNameList){
		try{
			createInjectionPointsInGrammar(scopeName);
		}catch(e){}
	}
};
