# Hyperbone View

[![Build Status](https://travis-ci.org/green-mesa/hyperbone-view.png?branch=master)](https://travis-ci.org/green-mesa/hyperbone-view)

## tldr; 

Bind Hyperbone Models to the DOM.

Currently implemented: 

- Logicless templates within attributes and innerText of nodes. 
- Ability to register helper functions to do in template processing/formatting.
- Automatic mapping of urls to anchor tags if the rel is recognised inside the hypermedia model
- Create delegates to handle DOM events
- Subscribe to and trigger Backbone events on the View itself.
- Iterate through collections - (very early functionality - dealing with add/change/delete still needs a lot of work)
- Classic 'Backbone' style two way binding of form inputs directly to models.
- Register custom attributes to take control of parts of a view yourself

## To Do:

- Collection change/add/remove events. Another tricky one this
- Extensions - Crucial, really, to allow for complex modules to 'own' sections of the view
- Two way binding for forms, linked to an underlying `_control` in the model. This may be done as an extension. 

## Example

In the page..

```html
<div id="some-view" class="{{type}}">
  <p>Hello, {{name}}</p>
  <label>Enter your name: <input hb-bind="name"></label>
  <div class="description">{{parser(description)}}</div>
  <a rel="some-rel"> Some link </a>
  <a rel="self" class="{{clicked}}">A link to myself</a>
  <ul hb-with="noodle-flavours">
    <li class="flavour {{className}}">{{flavour}}</li>
  </ul>
</div>
```

In the code...

```js
// create an instance of Hyperbone View
var view =  new (require('hyperbone-view')).HyperboneView();

// create an instance of Hyperbone Model (you may be able to use standard Backbone models but this is untested)
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
	type : "testing-thing",
	clicked : "",
  "noodle-flavours" : [
    {
      flavour : "Chickenesque",
      className : "edible"
    },
    {
      flavour : "Spicy Beef substitute",
      className : "toxic"
    },
    {
      flavour : "Curry. Just Curry.",
      className : "edible"
    }
  ],
  name : ""

});

// with our view instance...
view

	// add a helper
	.addHelper('parser', require('marked')) // we want to convert markdown to html

	// add a delegate..
	.addDelegate('click a[rel="self"]', function( event ){
		// scope in the callback is the model
		this.set('clicked', 'clicked');

	})

	// initialse the view..
	.create( dom('#some-view'), model );

```
Back in the page, without you having to do anything else...
```html
<div id="some-view" class="testing-thing">
  <p>Hello, </p>
  <label>Enter your name: <input hb-bind="name"></label>
  <div class="description">
  	<p>This is <strong>very</strong> exciting</p>
  </div>
  <a href="/some-link" rel="some-rel"> Some link </a>
  <a href="/a-link-to-me" rel="self" class="">A link to myself</a>
  <ul>
    <li class="flavour edible">Chickenesque</li>
    <li class="flavour toxic">Spicy Beef substitute</li>
    <li class="flavour edible">Curry. Just Curry.</li>
    <li>
  </ul>
</div>
```
Then if you happen to do this in your code....
```js
model.set('type', 'sure-hope-this-works')
```
Then the page automatically updates to...
```html
<div id="some-view" class="sure-hope-this-works">
```
And if you happen to click on `A link to myself`, the delegate fires, updates the model and that results in..
```html
  <a href="/a-link-to-me" rel="self" class="clicked">A link to myself</a>
</div>
```
And if you type something into the the 'Enter your name box'
```html
<p>Hello, something</p>
```

## Installation

Install with [component(1)](http://component.io):

```sh
    $ component install green-mesa/hyperbone-view
```

Hyperbone View has a number of dependencies which are installed at the same time. These are:

- Underscore
- component/dom
-

Note that unlike Backbone View this does not have a dependency on jQuery. It does use a smaller dom manipulation component called Dom, and this is the recommended tool to use for Hyperbone applications. 

## API

### .addHelper( name, fn )

Register a helper function for use inside templates. You must do this before you call .create(). 

Register your helper...
```js
  view.addHelper('shout', function( str ){

  	return str.toUpperCase();

  });
```
The template calls the helper...
```html
<p>Hello {{shout(name)}}</p>
```
Which products
```html
<p>Hello SQUIRREL</p>
```

### .addDelegate( obj )

Register a delegate for an event with an object. Callbacks are passed an event and have the model as the scope. This is because the philosophy is that all changes should happen on the model rather than on the DOM. _Get your truth out of the DOM_ etc.

```js
view.addDelegate({
	'click a.thing' : function(event){
		model.set('something', 'somevalue');
	}
})
```

### .addDelegate( selector, fn )

As above, except you register a delegate with a selector and a callback

```js
view.addDelegate('click a.thing', function(){
	model.set('something', 'somevalue')
})
```

### .on( event, callback )

HyperboneView instances are Backbone event emitters. There are three events emitted currently: `initialised`, `updated` and `delegate-fired`.

The callbacks are passed a [dom](http://github.com/component/dom) object, which is the view HTML and the model. For updated and delegate fired, information about what has changed is also added.

The philosphy behind these events is that they're useful for running integration tests, keeping a track on your application's state directly.

```js
view.on('initialised', function(el, model){
  // I want to set some stuff in the model that's specific to the view but isn't in the Hypermedia
  // that came from the server.
  model.set('status', 'active');

})
```

```js
view.on('updated', function(el, model, event){
  // event is 'change:someproperty' or something like that

  if (event==="change:status"){
    // do some horrible philosphy breaking stuff here
  }

})
```

```js
view.on('delegate-fired', function(el, model, selector){

  if (selector==="click a.status"){
    logger('a.status clicked');
  }

})
```

### .create( dom, hyperboneModel )

Nothing happens until `.create()` is called. Pass it either a CSS selector or a `dom` List object along with the model and this then binds the model to the view.

Generally best to call this last.


## Custom Attributes

Custom attributes are added to the HTML, and allow for additional functionality not provided in the logicless templates.

### hb-with

Changes the scope for the innerHTML to the selected model or collection.

This HTML...
```html
<div hb-with="nested-model">
  <p>{{greeting}}</p>
</div>
```
... is equivilant to
```html
<div><p>{{nested-model.greeting}}</p></div>
```
... except when you use `hb-with` for a model you create a subview and any change events that fire show only the sub-view and the sub-model.

Slightly more useful than this is the ability to iterate through collections with `hb-with`
```html
<ul hb-with="nested-collection">
  <li>{{name}}</li>
</ul>
```
... this then automatically clones the li tag for every model inside the collection.

### hb-bind

This attribute allows two-way binding to form inputs to allow an easy way to let your users interact with your model.

```html
<body class="{{theme}}">
  <select hb-bind="theme">
    <option value="default">Default</option>
    <option value="dark">Dark</option>
    <option value="light">Light</option>
  </select>
</body>
```
When used with a model..
```js
{
  theme : "default"
}
```
...results in the class on the body tag being automatically updated when the user changes the select. Etc.

### Adding your own custom attributes

HyperboneView exposes a method to add additional helpers for specific attributes:

### .addCustomAttributeHandler( attributeName, fn )

`fn` is called when HyperboneView finds an element with your attribute. When called, it is passed the element and the value of the attribute as arguments. The scope is the instance of HyperboneView itself, meaning you can use this.model and this.el (this may not be true forever)

Helpers should return either true or false. Return true to instruct the HyperboneView to continue processing the element -- templates will be compiled etc -- or return false to stop any further processing -- templates will be ignored.

Here's a non-disruptive 'return true' example. We want a link to switch between `.on` and `.off` whenever it's clicked..
```html
<a x-switch="status:off|on" class="{{status}}" href="#"></a>
```
```js

var model = new HyperboneModel({
  status : ""
});

var view = new HyperboneView()
  .addCustomAttributeHandler('x-switch', function(node, propertyValue){

    var self = this; // hey, 'this' is the HyperboneView.

    // it's a custom attribute so you need to do your own 
    // parsing. You get 'status:on|off' passed to you.
    var parts = propertyValue.split(":");
    var prop = parts[0];
    var options = parts[1].split("|");

    // we're in the HyperboneView scope so this works... 
    this.model.set(prop, options[1]);

    // Create a click handler for this element..
    dom(node).on('click', function(e){

      e.preventDefault();

      // we tweak the model here.. 
      if (self.model.get(prop) === options[0]){
        self.model.set(prop, options[1])
      } else {
        self.model.set(prop, options[0])
      }

    })

    // and we want the View to continue processing this node, so we...
    return true;

  })
  .create( html, model )
```

A `return false` example: Creating a new instance of HyperboneView with a different model to process the element and all its children.

This is the parent Hypermedia document. Note that it contains a rel `some-rel` which points to `/some-other-document`.
```json
{
  "_links" : {
    "self" : {
      "href" : "/some-document"
    },
    "some-rel" : {
      "href" : "/some-other-document"
    }
  },
  "greeting" : "Welcome to the magic world of Hypermedia"
}
```
And this is the JSON for `/some-other-document`
```json
{
  "_links" : {
    "self" : {
      "href" : "/some-other-document"
    },
    "other-thing" : {
      "href" : "/some-document"
    }
  },
  "greeting" : "Woooo!"
}
```
Our HTML. We want to manually embed `/some-other-document` into our page. We don't use the href, only the rel.
```html
<div>
<p>{{greeting}}</p>
<div x-embed="some-rel"><p>{{greeting}}</p></div>
</div>
```
Now we add our custom attribute handler...
```js
var view = new HyperboneView()
  .addCustomAttributeHandler('x-embed', function(node, propertyValue){

    // remove the attribute so that when we create a subview
    // we don't end up back inside this handler.
    node.removeAttribute('x-embed');

    // Hyperbone Models have a special helper method for looking
    // up the hrefs of rels.
    var uri = this.model.rel(propertyValue);

    // load the model...
    request.get(uri).set('Accept', 'application/json+hal').end(function(err, doc){

      if(!err){
        // create a new view, passing it our element and a new Hyperbone Model.
        new HyperboneView()
          .create( dom(node), new HyperboneModel( doc ) );

      }

    })

    return 

    // assume html points to our HTML and model points to the loaded `/some-document`
    new HyperboneView().create( html, model );

    // and we don't want the original View to continue processing this node
    // and the node's children, so we...
    return false;

  })
  .create( html, someModel )
```
WHich should, after everything's loaded, result in..
```html
<div>
<p>Welcome to the magic world of Hypermedia</p>
<div x-embed="some-rel"><p>Woooo!</p></div>
</div>
```

As these two examples should demonstrate, using the custom attribute handler API is fairly powerful, largely unopinionated... and very very easy to abuse

## Template rules

It looks like moustache templating but it's not. It supports referencing model attributes, calling custom helpers (which are passed the referenced model attribute) and... if you really really must... you can just send in arbitrary javascript so long as it's inside a call to a custom helper.

Built ins:

- `{{property}}` automatically becomes model.get("property")
- `{{get(property)}}` for when you absolutely want everyone to know there's some backbone happening
- `{{url()}}` gets the _links.self.href
- `{{rel('some-rel')}}` gets a specific rel
- `{{expresion(1 + 2 + model.get('current-value'))}}` - expression helper lets you add arbitrary javascript. Note the use of model.get to access data in the model is required in this situation.

Custom helpers:

- `{{myHelper(property)}}` passes model.get('property') to your custom handler

Won't work:

- `{{1 + 2}}` 

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
