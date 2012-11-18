define(["firebug/lib/lib", "firebug/lib/trace"],
function(FBL, FBTrace) {

	// DEBUG code (print string padded)
	function pad(n, max) {
		var str = "", i, nWidth = String(n).length;

		max = max || 5;

		for (i = 0; i < (max - nWidth); i++) {
			str += " ";
		}

		return str + n;
	}

	// DEBUG code (dump cssLines) with line numbers
	function dumpCssFile(cssLines) {
		try {
			for ( var i = 0; i < cssLines.length; i++) {
				FBTrace.sysout("firecompass; CSS: " + pad(i, 5) + " " + cssLines[i].replace(/\n*$/, ""));
			}
		} catch (e) {
			FBTrace.sysout("firecompass; Error while dumping CSS: " + e.message);
		}
	}

	var FireCompass = FBL.extend(Firebug.Module, {
		CACHE : {},
	
		destroyContext : function() {
			FBTrace.sysout("firecompass; page unloading: clearing cache.");
			this.CACHE = {};
		},
	
		getCssResource : function(href) {
			return Firebug.currentContext.sourceCache.load(href);
		},
	
		parseCompassComment : function(line) {
			// /* line 19, ../scss/_wizard.scss */
	
			if (/\/\* line (\d+), (.*)+ \*\//.exec(line) == null) {
				return null;
			}
	
			return {
				path : RegExp.$2,
				line : RegExp.$1
			};
		},
	
		// get shortened Compass internal scss path
		getShortenedCompassPath : function(path) {
			// IN:
			// ../var/lib/gems/1.8/gems/compass-0.12.2/frameworks/compass/stylesheets/compass/reset/_utilities.scss
			// OUT:
			// compass/stylesheets/compass/reset/_utilities.scss
	
			if (/^.*\/gems\/compass-\d+\.\d+.\d+\/frameworks\/(.*)$/.exec(path) == null) {
				throw new Error("Unable to match Compass internal SCSS path '" + path + "'");
			}
	
			return RegExp.$1;
		},
	
		isCompassInternal : function(path) {
			// /* line 26,
			// ../var/lib/gems/1.8/gems/compass-0.12.2/frameworks/compass/stylesheets/compass/reset/_utilities.scss
			// */
			return (/^.*\/gems\/compass-\d+\.\d+.\d+\/frameworks\/.*$/.test(path));
		},
	
		getCommentByRuleLine : function(cssLines, lineNo) {
			// cssLines 0-indexed, lineNo 1-indexed
	
			// the comment line "probe"
			var commentLine,
				// comment data
				comment,
				// comment line number (-1 to get 0-indexed, -1 for previous line)
				commentLineNo = lineNo - 2;
	
			if (commentLineNo < 0) {
        		// rule's previous line number, 
        		// but for the first line this might be -1
				return null;
			}
	
			// get comment line "probe"
			commentLine = cssLines[commentLineNo];
	
			// test/parse comment line
			comment = this.parseCompassComment(commentLine);
	
			// return comment data (original path and line no)
			return comment;
		},
	
		// 
		getCommentInfoByRuleLine : function(cssResource, line) {
			var data = this.getCommentByRuleLine(cssResource, line), 
				decoratedData = {
					isCompassInternal : false
				};
	
			try {
				if (data !== null) {
					decoratedData.line = data.line;
	
					if (this.isCompassInternal(data.path)) {
						decoratedData.path = this.getShortenedCompassPath(data.path);
						decoratedData.isCompassInternal = true;
					} else {
						decoratedData.path = data.path;
					}
	
					return decoratedData;
				}
			} catch (e) {
				FBTrace.sysout("firecompass; Error while preparing compass info: " + e.message);
				return null;
			}
	
			return null;
		},
	
		cacheCompassInfo : function(sourceLink) {
			var line = sourceLink.line,
				// TODO handle object null
				obj = sourceLink.object,
				stylesheet = obj.parentStyleSheet,
				href = stylesheet.href,
        		cssResource,
        		compassInfo;
	
			if (sourceLink.type !== "css") {
				return;
			}
	
			// don't forget to cleanup this reference after page unload
			if (!FireCompass.CACHE[href]) {
				FBTrace.sysout("firecompass; No compass info for " + stylesheet.href + ", initializing it.");
				FireCompass.CACHE[href] = {
					cssResource : null,
					compassInfoMap : {}
				};
			}
	
			// check if we've already cached the resources
			if (!FireCompass.CACHE[href].cssResource) {
				FBTrace.sysout("firecompass; No CSS resources cached for " + href + ", initializing it.");
	
				cssResource = FireCompass.CACHE[href].cssResource = this.getCssResource(href);
			} else {
				// use cached css resources
				FBTrace.sysout("firecompass; Using chached CSS resource.");
	
				cssResource = FireCompass.CACHE[href].cssResource;
			}
	
			if (!FireCompass.CACHE[href].compassInfoMap[line]) {
				FBTrace.sysout("firecompass; No compass info for line " + line);
	
				compassInfo = this.getCommentInfoByRuleLine(cssResource, line);
	
				if (compassInfo !== null) {
					FBTrace.sysout("firecompass; Adding compass info for line " + line + " (" + stylesheet.href + ")");
	
					FireCompass.CACHE[href].compassInfoMap[line] = compassInfo;
				}
			}
		}
	
	});
	
	return FireCompass;
	
});
