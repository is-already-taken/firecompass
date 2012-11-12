define(["firebug/lib/lib", "firecompass/firecompass"],
function(FBL, FireCompass) {
	
    function formatCompassInfoString(link){
    	var line = link.line,
    		href = link.href,
    		compassInfo,
    		cache = FireCompass.CACHE;
    	
    	if (!cache[href] || !cache[href].compassInfoMap[line]) {
    		return "";
    	}
    	
    	compassInfo = cache[href].compassInfoMap[line];
    	
    	return "\n" + (compassInfo.isCompassInternal ? "[Compass] " : "") + FBL.$STRF("Line", [compassInfo.path, compassInfo.line]);
    }
    
    // TODO Didn't find a way to import SourceLink through AMD.
	// 
    // Importing "firebug/js/sourceLink" returned an object but changing 
    // getTooltip() on that object didn't work: 
    // 	- SourceLink.[...]
    // 	- SourceLink.prototype.[...]
    //	- Firebug.getRep(SourceLink).[...]
    // 	- Firebug.getRep(new SourceLink()).[...]
	
	// Get SourceLink reference to override getTooltip()
	// SourceLink represents the link to a source in the CSS panel
	// 
	// Override getTooltip() to manipulate the tooltip string with our content/format
	Firebug.getRep(new FBL.SourceLink()).getTooltip = function(link) {
    	var line = link.line,
			href = link.href;
		
		// cache compass info when building the title
		FireCompass.cacheCompassInfo(link);

		return decodeURI(FBL.$STRF("Line", [link.href, link.line]) + formatCompassInfoString(link));
	};

});
