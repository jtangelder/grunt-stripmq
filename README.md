# grunt-stripmq
> Mobile-first CSS fallback

## Getting Started
This plugin requires Grunt `~0.4.0`, and is available on [npmjs.org](https://npmjs.org/package/grunt-stripmq)

A Grunt task to generate a fallback version of your fancy mobile first stylesheet.
Since IE8 and lower dont support media queries, you can use a javascript like respond.js to enable this,
or generate a fallback version with this task.

It parses your media queries, removes the unreachable for the given viewport, and adds the query contents
to the stylesheet. It is important to keep the flow in your document from small to high, like in the example css below.

In your HTML you can use conditional comments to load the desktop.css for old IEs.

````html
<!--[if lt IE 9]><link rel="stylesheet" href="desktop.css"><![endif]-->
<!--[if gt IE 8]><!--><link rel="stylesheet" href="mobile-first.css"><!--<![endif]-->
````

## Sample with default settings
````css
body { background: url('mobile-background.png'); }

@media screen and (min-width: 640px) {
    body { background: url('tablet-background.png'); }
}

@media screen and (max-width: 800px) {
    body { background: url('until-800px-background.png'); }
}

@media screen and (min-width: 900px) {
    body { background: url('desktop-background.png'); }
}

@media screen and (min-width: 1200px) {
    body { background: url('large-background.png'); }
}

@media (-webkit-min-device-pixel-ratio: 1.5),
    (min--moz-device-pixel-ratio: 1.5),
    (-o-min-device-pixel-ratio: 3 / 2),
    (min-device-pixel-ratio: 1.5) {
    body { background: url('hd-background.png'); }
}
````

becomes

````css
body{background:url('mobile-background.png');}
body{background:url('tablet-background.png');}
body{background:url('desktop-background.png');}
````

## Grunt task
````js
    stripmq: {
        options: {
            width: 640,     // viewport width, default is 1024
            height: 480,    // viewport height, default is 768
            'device-pixel-ratio': 2          // default is 1
        }
        all: {
            files: {
                'desktop.css': ['mobile-first.css']
            }
        }
    }
````


## Todo
- Remove overwritten properties
