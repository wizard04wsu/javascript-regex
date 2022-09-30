const { CompositeDisposable } = require("atom");


let package,
	disposableStyleSheets = {};

const thisPackage = {
	
	name: "javascript-regex",
	
	// Scope names of languages for which relevant injection points will be overridden.
	languageScopeNames: [
		"source.js",
		"source.jsx",
		"source.ts",
		"source.flow",
	],
	
	// Rule names in the language grammar for which injection points will be overridden.
	languageGrammarRuleNames: [
		"regex",
		"regex_pattern",
	],
	
	styleSheets: {
		"showCharacterSetBackgrounds": "charset-backgrounds",
		"showGroupOutlines": "group-outlines",
	},
	
	
	injectionPoints: [
		{
			// Injection type: the name of the rule in the language grammar that this injection point is to be added to.
			type: "regex",
			
			// Get the name of the grammar that should be injected into a matching node. This should match the grammar's "injectionRegex" property.
			language(regexNode){
				const {lastChild} = regexNode;
				if(lastChild.type === "regex_flags"){	// Flags are specified.
					const flags = lastChild.text;
					let validFlags = "gimsy".split(""),
						f = -1;
					while(validFlags.length && ++f < flags.length){
						const v = validFlags.indexOf(flags[f]);
						if(flags[f] === "u"){
							return "regex_u";	// Unicode flag is set.
						}
						else if(v < 0){
							break;	// Invalid or duplicate flag.
						}
						validFlags.splice(v, 1);
					}
				}
				return "regex";	// Unicode flag is not set.
			},
			
			// Get the node with the text content that should be parsed using the injected grammar.
			content(regexNode){
				// Return the node containing the regex pattern between the slashes.
				return regexNode.children[1];
			}
		},
	],
};

function toggleConfig(configName){
	atom.config.set(`${thisPackage.name}.${configName}`, !atom.config.get(`${thisPackage.name}.${configName}`));
};

function updateStyleSheet(configName){
	disposableStyleSheets[configName]?.dispose();
	if(atom.config.get(`${thisPackage.name}.${configName}`)){
		let path = `${package.path}/styles/${thisPackage.styleSheets[configName]}.less`,
			css = package.themeManager.loadStylesheet(path);
		disposableStyleSheets[configName] = package.styleManager.addStyleSheet(css, { sourcePath: path, priority: 1 });
	}
	else{
		disposableStyleSheets[configName] = void 0;
		atom.config.set(`${thisPackage.name}.${configName}`, false);
	}
}

module.exports = {
	
	activate(state){
		
		package = atom.packages.loadedPackages[thisPackage.name];
		
		// Add or replace grammars that are associated with this package.
		// (i.e., grammars with scope names "source.js.regexp" and "source.js.regexp.unicode")
		const packageGrammars = package.grammars;
		for(const newGrammar of packageGrammars){
			
			const existingGrammar = atom.grammars.treeSitterGrammarsById[newGrammar.scopeName];
			if(existingGrammar){
				// A grammar is currently assigned to the new grammar's scope name.
				
				if(existingGrammar.packageName !== thisPackage.name){
					// The existing grammar is not the one associated with this package.
					
					// Replace the existing grammar with the new one.
					atom.grammars.removeGrammar(existingGrammar);
					atom.grammars.addGrammar(newGrammar);
				}
			}
			else{
				// Add the new grammar.
				atom.grammars.addGrammar(newGrammar);
			}
		}
		
		// For each associated language scope...
		// (i.e., scope names "source.js", "source.jsx", "source.ts", and "source.flow")
		for(const languageScopeName of thisPackage.languageScopeNames){
			
			const languageGrammar = atom.grammars.treeSitterGrammarsById[languageScopeName];
			if(!languageGrammar) continue;	// A grammar does not exist for this language scope.
			
			// Add injection points for associated rules in this language's grammar.
			for(const grammarRuleName of thisPackage.languageGrammarRuleNames){
				
				/*
				// Remove any existing injection points of this type.
				// (i.e., types matching grammar rule names "regex" and "regex_pattern")
				const existingInjectionPoints = languageGrammar.injectionPointsByType[grammarRuleName];
				for(const injectionPoint of existingInjectionPoints){
					languageGrammar.removeInjectionPoint(injectionPoint);
				}
				*/
				
				// Add new injection points of this type.
				// (i.e., types matching grammar rule names "regex" and "regex_pattern")
				for(newInjectionPoint of thisPackage.injectionPoints){
					if(newInjectionPoint.type === grammarRuleName){
						languageGrammar.addInjectionPoint(newInjectionPoint);
					}
				}
			}
		}
		
		
		// Create an instance of the CompositeDisposable class so it can register all the commands that can be called from the plugin,
		// allowing other plugins to subscribe to those events.
		this.subscriptions = new CompositeDisposable();
		
		// Register the commands.
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			"javascript-regex:toggle-character-set-backgrounds": ()=>toggleConfig("showCharacterSetBackgrounds"),
			"javascript-regex:toggle-group-outlines": ()=>toggleConfig("showGroupOutlines"),
		}));
		
		// Load the main stylesheet.
		let path = `${package.path}/styles/base.less`,
			css = package.themeManager.loadStylesheet(path);
		disposableStyleSheets["main"] = package.styleManager.addStyleSheet(css, { sourcePath: path, priority: 1 });
		
		// Load additional stylesheets per the package settings.
		updateStyleSheet("showCharacterSetBackgrounds");
		updateStyleSheet("showGroupOutlines");
		
		// Observe changes to the package settings.
		atom.config.onDidChange(`${thisPackage.name}.showCharacterSetBackgrounds`, {}, ()=>updateStyleSheet("showCharacterSetBackgrounds"));
		atom.config.onDidChange(`${thisPackage.name}.showGroupOutlines`, {}, ()=>updateStyleSheet("showGroupOutlines"));
	},
	
	serialize(){},
	
	deactivate(){
		disposableStyleSheets["showCharacterSetBackgrounds"]?.dispose();
		disposableStyleSheets["showGroupOutlines"]?.dispose();
		disposableStyleSheets["main"].dispose();
		this.subscriptions.dispose();
	},
	
	config: {
		showCharacterSetBackgrounds: {
			title: "Display character set backgrounds",
			description: "Styles character sets (the contents of a pair of square brackets) with a background to make them easier to interpret as a single character.",
			type: "boolean",
			default: true,
		},
		showGroupOutlines: {
			title: "Display group outlines",
			description: "Styles groups (the contents of a pair of parentheses) with outlines to make them easier to distinguish.",
			type: "boolean",
			default: false,
		},
	},
	
};
