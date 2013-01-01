define(["firebug/lib/lib", "firecompass/firecompass", "firecompass/cssPanelExtension"],
function(FBL, FireCompass, CssPanelExtension) {
	var SourceLink, origGetSourceLinkTitleFn;
	
	// TODO Didn't find a way to import SourceLink through AMD.
	// 
	// Importing "firebug/js/sourceLink" returned an object but changing 
	// getTooltip() on that object didn't work: 
	//	- SourceLink.[...]
	//	- SourceLink.prototype.[...]
	//	- Firebug.getRep(SourceLink).[...]
	//	- Firebug.getRep(new SourceLink()).[...]
	
	// Get SourceLink reference to override getTooltip()
	// SourceLink represents the link to a source in the CSS panel
	SourceLink = Firebug.getRep(new FBL.SourceLink());
	
	
	// link: SourceLink reference 
	// short: whether the label is rendered short or not 
	function formatCompassInfoString(link, short){
		var line = link.line,
			href = link.href,
			compassInfo,
			cache = FireCompass.CACHE,
			str, filename;
		
		if (!cache[href] || !cache[href].compassInfoMap[line]) {
			return "";
		}
		
		// Get previously cached compass info by href and line
		compassInfo = cache[href].compassInfoMap[line];
		
		if (short) {
			// get filename part and shorten string (if too long)
			filename = compassInfo.path;
			filename = filename.substring(filename.lastIndexOf("/") + 1);
			filename = decodeURIComponent(filename);
			filename = FBL.cropString(filename, 17);
			
			// If it's a Compass internal file return with brackets around the name
			//	Compass: [reset.scss]
			//	Normal: _wizard.scss
			filename = compassInfo.isCompassInternal ? "["+ filename +"] " : filename;
			
			// TODO Maybe make the link italic if Compass internal?
			
			str = FBL.$STRF("Line", [filename, compassInfo.line]);
		} else {
			// If it's a Compass internal file, prefix with [Compass]
			str = (compassInfo.isCompassInternal ? "[Compass] " : "");
			str += FBL.$STRF("Line", [compassInfo.path, compassInfo.line]);
		}
		
		return str;
	}
	
	// Remember original getSourceLinkTitle() for reuse
	origGetSourceLinkTitleFn = SourceLink.getSourceLinkTitle;
	
	// Override to change the source link in the CSS panel (right to the rules)
	SourceLink.getSourceLinkTitle = function(link) {
		var str;
		
		if (link == null) {
			return "";
		}
		
		// Link to CSS file (default), reuse original method
		if (CssPanelExtension.isShowCss()) {
			return origGetSourceLinkTitleFn(link);
		}
		
		// Show SCSS path in source link as !isShowCss(), therefor chache data
		FireCompass.cacheCompassInfo(link);
		
		str = formatCompassInfoString(link, true);
		
		return str !== "" ? str : origGetSourceLinkTitleFn(link);
	};	
	
	// Override to manipulate the tooltip string with our content/format
	SourceLink.getTooltip = function(link) {
		var line = link.line,
			href = link.href,
			str;
		
		// If showing the CSS path (default), do caching upon tooltip-show
		if (CssPanelExtension.isShowCss()) {
			// cache compass info when building the title
			FireCompass.cacheCompassInfo(link);
		}
		
		str = formatCompassInfoString(link, false);
		
		return decodeURI(FBL.$STRF("Line", [link.href, link.line]) + (str !== "" ? "\n" + str : ""));
	};
	
	
	
	return {
		initialize: function(){
			Firebug.registerModule(FireCompass);
			Firebug.registerModule(CssPanelExtension);
			Firebug.registerStringBundle("chrome://firecompass/locale/firecompass.properties");
		},
		
		shutdown: function(){
			Firebug.unregisterModule(FireCompass);			
			Firebug.unregisterModule(CssPanelExtension);			
			Firebug.unregisterStringBundle("chrome://firecompass/locale/firecompass.properties");
		}
	};
	
});
