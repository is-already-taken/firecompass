define(["firebug/lib/lib", "firebug/lib/options", "firebug/lib/trace"],
function(FBL, Options, FBTrace) {
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    const PREFS = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch2);
    
    // Extend Inspector/CSS panel's options menu by two items 
	var CssPanelExtension = FBL.extend(Firebug.Module, {
		
		// reference to the Firebug inspector/CSS panel
		_cssPanel: null,
	
    	initContext: function(context) {
    		var self = this,
    			prevGetOptionsMenuItemsFn;

			this._cssPanel = context.getPanel("css"),
			
			// remember original getOptionsMenuItems() (returns menu items)
			prevGetOptionsMenuItemsFn = this._cssPanel.getOptionsMenuItems,

    		
    		FBTrace.sysout("firecompass; initContext()");
    		
			this._cssPanel.getOptionsMenuItems = function() {
				// get current list of items
    			var items = prevGetOptionsMenuItemsFn();
    			
    			try {
	    			// add our items
	    			items.push(
	    				"-",
	    				self._getMenuItem("Show CSS Path", "css"),
	    				self._getMenuItem("Show SCSS Path", "scss")
	            	);
	    			
	    			return items;
    			} catch (e){
    				FBTrace.sysout("firecompass; Runtime error while modifying CSS panel menu items: " + e.message);
    			}
    		};
    	},
    	
    	_getMenuItem: function(label, pref){
    		var self = this;
    		
    		return {
                label: "firecompass.css.panel." + label,
                tooltiptext: "firecompass.css.panel.tooltip." + label,
                
                type: "radio",
                name: "show-css-or-scss-path",
                id: "firecompass-show-"+ pref +"-path",
                
                command: function() {
                	self._setPref("showCssOrScss", pref);
                	self._cssPanel.refresh();
                },
                
                checked: self._getPref("showCssOrScss", "css") == pref
            };
    	},
    	
    	// convenience preference getter
    	isShowCss: function(){
    		return this._getPref("showCssOrScss") === "css";
    	},
   	
    	_getPref: function(name, defaultValue) {
			var pref = "firecompass.cssPanel." + name,
				type = PREFS.getPrefType(pref);
			
			if (type == Ci.nsIPrefBranch.PREF_STRING) {
				return PREFS.getCharPref(pref) || defaultValue;
				
    		} else if (type == Ci.nsIPrefBranch.PREF_INT) {
				return PREFS.getIntPref(pref) || defaultValue;
				
    		} else if (type == Ci.nsIPrefBranch.PREF_BOOL) {
				return PREFS.getBoolPref(pref) || defaultValue;
				
    		}
        },
        
        _setPref: function(name, value) {
			var pref = "firecompass.cssPanel." + name,
				type = PREFS.getPrefType(pref);

			if (type == Ci.nsIPrefBranch.PREF_STRING) {
				PREFS.setCharPref(pref, value);
				
    		} else if (type == Ci.nsIPrefBranch.PREF_INT) {
				PREFS.setIntPref(pref, value);
				
    		} else if (type == Ci.nsIPrefBranch.PREF_BOOL) {
				PREFS.setBoolPref(pref, value);
				
    		}
        },
    	
        initialize: function(context){
            Firebug.Module.initialize.apply(this, arguments);
            Firebug.registerUIListener(this);
        }
    	
	});

	return CssPanelExtension;
	
});
