
(function(){

	var prefs = {};

	window.Components = { 

		classes: {
			"@mozilla.org/preferences-service;1": {
				getService: function(intf){
					return intf; // return the interface, which is defined below
				}
			}
		},

		interfaces: {
			nsIPrefBranch2: {
				getPrefType: function(pref){
					return "";
				},

				setCharPref: function(prefName, prefValue){
					prefs[prefName] = prefValue;
				},

				getCharPref: function(prefName){
					return prefs[prefName];
				},

				setBoolPref: function(prefName, prefValue){
					prefs[prefName] = prefValue;
				},

				getBoolPref: function(prefName){
					return prefs[prefName];
				},

				setIntPref: function(prefName, prefValue){
					prefs[prefName] = prefValue;
				},

				getIntPref: function(prefName){
					return prefs[prefName];
				}
			},

			nsIPrefBranch: {
				PREF_STRING: "string",
				PREF_BOOL: "boolean",
				PREF_INT: "integer"
			}
		}
	};

}());

