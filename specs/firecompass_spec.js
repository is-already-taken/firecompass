
define(["chrome/content/firecompass"], function(Firecompass){
	var css = [
		'',
		'/* line 17, ../lib/gems/1.8/gems/compass-0.12.2/frameworks/compass/stylesheets/compass/reset/_utilities.scss */',
		'html, body, div, span {',
		'	margin: 0;',
		'	padding: 0;',
		'}',
		'',
		'/* line 9, ../scss/index.scss */',
		'div.test {',
		'	position: absolute;',
		'}',
		''
	];

	describe("parseCompassComment()", function(){
		var info;

		it("should return the correct comment info for own scss paths", function(){
			info = Firecompass.parseCompassComment("/* line 19, ../scss/_wizard.scss */");
			expect(info.line).toBe("19");
			expect(info.path).toBe("../scss/_wizard.scss");
		});

		it("should return null for non Compass comments", function(){
			info = Firecompass.parseCompassComment("/* this is a normal comment */");
			expect(info).toBeNull();
		});
	});

	
	describe("getShortenedCompassPath()", function(){
		var path;

		it("should return shorted path for Compass internal path", function(){
			path = Firecompass.getShortenedCompassPath("../var/lib/gems/1.8/gems/compass-0.12.2/frameworks/compass/stylesheets/compass/reset/_utilities.scss");
			expect(path).toBe("compass/stylesheets/compass/reset/_utilities.scss");
			
			path = Firecompass.getShortenedCompassPath("/some/other/path/pointing/to/ruby/lib/gems/10.1/gems/compass-10.10.10/frameworks/compass/stylesheets/compass/reset/_utilities.scss");
			expect(path).toBe("compass/stylesheets/compass/reset/_utilities.scss");
		});

		it("should throw an exception when called with Compass non-internal path", function(){
			expect(function(){
				Firecompass.getShortenedCompassPath("../styles/scss/styles.scss");
			}).toThrow("Unable to match Compass internal SCSS path '../styles/scss/styles.scss'");

		});
	});

	describe("isCompassInternal()", function(){
		var isInternal;
		it("return true for compass internal paths", function(){
			isInternal = Firecompass.isCompassInternal("../var/lib/gems/1.8/gems/compass-0.12.2/frameworks/compass/stylesheets/compass/reset/_utilities.scss");
			expect(isInternal).toBe(true);

			isInternal = Firecompass.isCompassInternal("/some/other/path/pointing/to/ruby/lib/gems/10.1/gems/compass-10.10.10/frameworks/compass/stylesheets/compass/reset/_utilities.scss");
			expect(isInternal).toBe(true);

			isInternal = Firecompass.isCompassInternal("../styles/scss/styles.scss");
			expect(isInternal).toBe(false);
		});
	});


	describe("getCommentByRuleLine()", function(){
		var info;

		it("return Compass comment for CSS line number", function(){
			info = Firecompass.getCommentByRuleLine(css, 3);
			expect(info.path).toBe("../lib/gems/1.8/gems/compass-0.12.2/frameworks/compass/stylesheets/compass/reset/_utilities.scss");
			expect(info.line).toBe("17");

			info = Firecompass.getCommentByRuleLine(css, 9);
			expect(info.path).toBe("../scss/index.scss");
			expect(info.line).toBe("9");
		});

		it("return null for CSS line number out of range", function(){
			expect(Firecompass.getCommentByRuleLine(css, 1)).toBeNull();
			expect(Firecompass.getCommentByRuleLine(css, 4)).toBeNull();
			expect(Firecompass.getCommentByRuleLine(css, 100)).toBeNull();
		});
	});


	describe("getCommentInfoByRuleLine()", function(){
		var info;

		it("return Compass comment for CSS line number", function(){
			info = Firecompass.getCommentInfoByRuleLine(css, 3);
			expect(info.path).toBe("compass/stylesheets/compass/reset/_utilities.scss");
			expect(info.line).toBe("17");
			expect(info.isCompassInternal).toBe(true);

			info = Firecompass.getCommentInfoByRuleLine(css, 9);
			expect(info.path).toBe("../scss/index.scss");
			expect(info.line).toBe("9");
			expect(info.isCompassInternal).toBe(false);
		});

		it("return null for CSS line number out of range", function(){
			expect(Firecompass.getCommentByRuleLine(css, 1)).toBeNull();
			expect(Firecompass.getCommentByRuleLine(css, 4)).toBeNull();
			expect(Firecompass.getCommentByRuleLine(css, 100)).toBeNull();
		});
	});
});


