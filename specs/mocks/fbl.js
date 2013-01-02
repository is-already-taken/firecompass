
define("FBL-MOCK", [], function(){
	return {
		extend: function(base, override){
			// Return object to be defiend - suites our needs.
			return override;
		},

		$STRF: function(property, values){
			var value;

			if (!props) {
				props = [];
			} else if (typeof props !== "object" || typeof props.shift !== "function") {
				props = [String(props)];
			}
			
			while (props.length > 0) {
				value = props.shift();
				str = str.replace(/%S/, value);
			}
			
			return str;
		},

		// Return maximal the last 17 chars - might not be Firebug's behaviour, but suites our needs.
		cropString: function(str){
			str = str || "";
			return str.substr(-Math.min(str.length, 17));
		},

		// Stub class
		SourceLink: function(){
			return  /* should be further mocked in the test */ };
		}
		
	};
});

