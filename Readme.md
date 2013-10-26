# Hyperbone View

[![Build Status](https://travis-ci.org/green-mesa/hyperbone-view.png?branch=master)](https://travis-ci.org/green-mesa/hyperbone-view)

## tldr; 

Bind Hyperbone Models to the DOM.

Currently implemented: 

- Templates within attributes and innerText of nodes. 
- Ability to register helper functions to do in template processing/formatting. 
- Automatic mapping of urls to anchor tags if the rel is recognised inside the hypermedia model

To Do:

- Custom attributes to support looping, embedding HyperboneForms etc. 

In the page..

```html
<div id="some-view" class="{{type}}">
  <div class="description">{{parser(description)}}</div>
  <a rel="some-rel"> Some link </a>
  <a rel="self">A link to myself</a>
</div>
```

In the code...

```js
var view =  new (require('hyperbone-view')).HyperboneView();

var model = new (require('hyperbone-model')).HyperboneModel({
	_links : {
		self : {
			href : "/a-link-to-me"
		},
		"some-rel" : {
			href : "/some-link"
		}
	},
	description : "This is __very__ exciting",
	type : "testing-thing"

});

view
	.addHelper('parser', require('marked')) // we want to convert markdown to html
	.create( dom('#some-view'), model );
```

Then back in the page...
```html
<div id="some-view" class="testing-thing">
    <div class="description">
    	<p>This is <strong>very</strong> exciting</p>
    </div>
  <a href="/some-link" rel="some-rel"> Some link </a>
  <a href="/a-link-to-me" rel="self">A link to myself</a>
</div>
```

Then back in the code

```js
model.set('type', 'sure-hope-this-works')
```

And back to the page..

Then back in the page...
```html
<div id="some-view" class="sure hope this works">
    <div class="description">
    	<p>This is <strong>very</strong> exciting</p>
    </div>
  <a href="/some-link" rel="some-rel"> Some link </a>
  <a href="/a-link-to-me" rel="self">A link to myself</a>
</div>
```


## Installation

  Install with [component(1)](http://component.io):

    $ component install green-mesa/hyperbone-model


## API

### .addHelper( name, fn )

Register a helper function for use inside templates. 

### .create( dom, hyperboneModel )

Pass in a reference to an element and a model and this then goes through 


## Template rules

It looks like moustache templating but it's not. It supports referencing model attributes, calling custom helpers (which are passed the referenced model attribute) and... that's about it. 

- `{{property}}` automatically becomes model.get("property")
- `{{get(property)}}` for when you absolutely want everyone to know there's some backbone happening
- `{{somethingelse(property)}}` passes model.get('property') to your custom handler


## Testing

Install testing tools. You probably need PhantomJS on your path.

```back
  $ npm install && npm install -g grunt-cli
```

Run the tests:

```bash
  $ grunt test
```

## License

  MIT
