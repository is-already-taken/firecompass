# FireCompass Firebug extension

This Firebug extension will reveal the original .scss filename and line number in the CSS inspector panel if the generated CSS code has debugging-comments in it.
This will assit you if you're generating your .css files with [Compass](http://compass-style.org/).

## Features

* Shows the original filename and line number within the tooltip
* The source link can be rendered with .scss filename and line number or .css filename and linenumber (default) 
* Compass internal styles (like reset.css) are marked with \[Compass\] (within the tooltip) or \[Filename\] (line number) (as source link)


## How it works


The plugin looks for the comment above each CSS rule containing the original filename and linenumber.
Thus, it requires that the comments are generated into the target .css file.

```
...
/* line 13, ../scss/index.scss */
body, html {
...
```


## Configure your compass project

There are two options which control this.

1. The `line_comments` option within your config.rb (default name)
   This should be true or undefined.
2. The `-e, --environment` switch of compass
   This should be not specified or of value "development" 


# Requirements (tested with) 

* Firefox 15.0 - 19.*
* Firebug 1.10.x
* Compass 0.12.x

It might work with older or newer Firebug and Compass versions too.

# Changes

#### v0.1.1
* Added newlines to addon description
* Extended Firefox version compatibility range from 16.0 - 16.* to 15.0 - 19.* 
 
#### v0.1
* Initial release.

# State

Main development done. Released.


## ToDo

* Add Make and/or Grunt.js based build script
* Optimize tooltip layout/style 
* Make the source link not clickable or ignore click if rendered with .scss path 
* Create an addon logo

# How to build

Building an Firefox addon package is simple as it's just a ZIP file with the extension .xpi. Under \*nix you might just run

```
$ zip -r ../firecompass-v<VERSION NUMBER IN install.rdf>.xpi chrome/ chrome.manifest defaults/ install.rdf LICENSE.MIT skin/
```

# Screenshots

![Screenshot: CSS Panel with options menu open](https://raw.github.com/is-already-taken/firecompass/master/doc/screenshot_firecompass_css_panel_options_menu.png "CSS Panel with options menu open")
![Screenshot: Tooltip showing generated (.css) and original (.scss) filename and line number](https://raw.github.com/is-already-taken/firecompass/master/doc/screenshot_firecompass_showing_tooltip_compass_internal_rule.png "Tooltip showing generated (.css) and original (.scss) filename and line number")
![Screenshot: Tooltip showing generated (.css) and original (.scss) filename and line number of a Compass internal style/rule](https://raw.github.com/is-already-taken/firecompass/master/doc/screenshot_firecompass_showing_tooltip_normal_rule.png "Tooltip showing generated (.css) and original (.scss) filename and line number of a Compass internal style/rule")
![Screenshot: Source link rendered with .scss filename and line number](https://raw.github.com/is-already-taken/firecompass/master/doc/screenshot_firecompass_source_link_rendered_with_scss_filename_and_line.png "Source link rendered with .scss filename and line number")


# License 

This code is licensed under the MIT license.

