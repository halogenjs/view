# Hyperbone View

[![Build Status](https://travis-ci.org/green-mesa/hyperbone-view.png?branch=master)](https://travis-ci.org/green-mesa/hyperbone-view)

## tldr; 

Bind Hyperbone Models to the DOM.

## Features

- Logicless templates for attributes and text 
- Register custom helpers to do string processing inside templates
- Hypermedia extensions: Insert href attributes for recognised rels.
- Create delegates to handle DOM events
- Subscribe to and trigger Backbone events on the View itself.
- Iterate through collections
- Classic 'Backbone' style two way binding of form inputs directly to models.
- Register custom attribute handlers

## To Do:

There's a bit of work around Collections that needs doing. Most additional functionality will come in the form of plugins though.

## Example

HTML in your page:
```html
<div id="some-view" class="{{type}}">
  <p>Hello, {{name}}</p>
  <label>Enter your name: <input hb-bind="name"></label>
  <div class="description">{{strip(description)}}</div>
  <a rel="some-rel"> Some link </a>
  <a rel="self" class="{{clicked}}">A link to myself</a>
  <ul hb-with="noodle-flavours">
    <li class="flavour {{className}}"><a rel="self">{{flavour}}</a></li>
  </ul>
</div>
```
JSON HAL document on the server
```json
{
  "_links" : {
    "self" : {
      "href" : "/a-link-to-me"
    },
    "some-rel" : {
      "href" : "/some-link"
    }
  },
  "description" : "This is __very__ exciting",
  "type" : "testing-thing",
  "_embedded" : {
    "noodle-flavours" : [
      {
        "_links" : {
          "self" : {
            "href" : "/flavours/chicken"
          }
        },
        "flavour" : "Chickenesque",
        "classification" : "edible"
      },
      {
        "_links" : {
          "self" : {
            "href" : "/flavours/beef"
          }
        },
        "flavour" : "Spicy Beef substitute",
        "classification" : "toxic"
      },
      {
        "_links" : {
          "self" : {
            "href" : "/flavours/curry"
          }
        },
        "flavour" : "Curry. Just Curry.",
        "classification" : "edible"
      }
    ]
  }
  "name" : ""
}
```
Presume that we've loaded this JSON into a HyperboneModel instance..

```js

var HyperboneView = require('hyperbone-view').HyperboneView;

// we want to register a helper called 'strip'. This will be available to all Views in the system.

require('hyperbone-view').registerHelper('strip', function( str ){
  return markdownStripper( str )
})

// now we can create our view instance.
new HyperboneView({

  // the model...
  model : myHypermediaDocument,

  // our view root
  el : '#some-view',
 
  // an event delegate
  delegates : {
    'click a[rel="self"]' : function( event ){

      this.set('clicked', 'clicked');

    }

  }

});
```
As soon as the initial processing is done, our DOM has been transformed.

Some things to note:

- The collection of flavours has been expanded
- Each flavour has automatically had its own href added to the link because of the rel='self'
- Our link to rel='some-rel' has had its href added as well.
- Our 'strip' helper has removed the markdown from 'description'.

```html
<div id="some-view" class="testing-thing">
  <p>Hello, </p>
  <label>Enter your name: <input hb-bind="name"></label>
  <div class="description">This is very exciting</div>
  <a href="/some-link" rel="some-rel"> Some link </a>
  <a href="/a-link-to-me" rel="self" class="">A link to myself</a>
  <ul>
    <li class="flavour edible"><a href="/flavour/chicken" rel="self">Chickenesque</a></li>
    <li class="flavour toxic"><a href="/flavour/beef" rel="self">Spicy Beef substitute</a></li>
    <li class="flavour edible"><a href="/flavour/curry" rel="self">Curry. Just Curry.</a></li>
    <li>
  </ul>
</div>
```
If you happen to do this in your code....
```js
myHypermediaDocument.set('type', 'sure-hope-this-works')
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
- Parts of Backbone

Note that unlike Backbone View this does not have a dependency on jQuery. It does use a tiny standalone dom manipulation component called Dom instead.

## Module API

### require('hyperbone-view').registerHelper(name, fn)

Register a helper function for use inside templates. It becomes globally available to all views.

Example:
```js
  require('hyperbone-view').registerHelper('shout', function( str ){

  	return str.toUpperCase();

  });
  new HyperboneView({ model: new HyperboneModel({ name : "squirrel"}), el : dom('#namebox')});
```
The template calls the helper...
```html
<p id="namebox">Hello {{shout(name)}}</p>
```
Which produces
```html
<p>Hello SQUIRREL</p>
```

### require('hyperbone-view').registerAttributeHandler(name, fn)

Register a custom attribute handler for extending the capabilities of View. More on this below.


### require('hyperbone-view').HyperboneView

Your reference to the HyperboneView prototype.

```js
var HyperboneView = require('hyperbone-view').HyperboneView;

new HyperboneView({
    model : model,
    el : el,
    delegates : delegates,
    initialised : function(){

      // i get called after it's initialised for the first time.

    }
});
```
or
```js
new HyperboneView().create(el, model);
```

## HyperboneView Instance API

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

If you want to postpone the view initialising, you can manually triggered this by invoking HyperboneView without a model and el and then calling .create(). Pass it either a CSS selector or a `dom` List object along with the model and this then binds the model to the view.

### .addDelegate(obj | name, fn)

If you're using the .create() method, you can manually set up delegates using this.

```js
new HyperboneView({
  delegates : {
    'click .icon' : function( event ){
      // do something here. Scope is the model.
    }
  },
  model : model,
  el: el
})
```
is equivilant to 
```js
new HyperboneView()
  .addDelegate('click .icon', function(event){
    // do something here
  })
  .create(el, model)
```


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

HyperboneView exposes a method to add additional helpers for specific attributes. These are available globally to all Views.

### require('hyperbone-view').registerAttributeHandler( attributeName, fn )

`fn` is called when HyperboneView finds an element with your attribute. When called, it is passed the element, the value of the attribute as arguments and a 'cancel' function. The scope is the instance of HyperboneView itself, meaning you can use this.model and this.el (this may not be true forever)

The cancel function should be called if you do not wish the View to continue processing the node (i.e, recurse into the childNodes etc).

Here's a non-disruptive non-cancelled example. We want a link to switch between `.on` and `.off` whenever it's clicked..
```html
<a x-switch="status:off|on" class="{{status}}" href="#"></a>
```
```js
// create a model
var model = new HyperboneModel({
  status : ""
});
// register an attribute handler
require('hyperbone-view').registerAttributeHandler('x-switch', function(node, propertyValue, cancel){

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

    // we don't call cancel here, so the childNodes will be processed as normal

  });
// create a view
new HyperboneView({ model: model, el : html});
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
// add attribute handler
require('hyperbone-view').registerAttributeHandler('x-embed', function(node, propertyValue, cancel){

    // remove the attribute so that when we create a subview
    // we don't end up back inside this handler.
    node.removeAttribute('x-embed');

    // Hyperbone Models have a special helper method for looking
    // up the hrefs of rels.
    var uri = this.model.rel(propertyValue);

    // wrap our naked element in a dom object.
    var root = dom(node);

    // load the model...
    request.get(uri).set('Accept', 'application/json+hal').end( function(err, doc){

      if(!err){

        // create a new view, passing it our wrapped element and a new Hyperbone Model.
        new HyperboneView()
          .create( root, new HyperboneModel( doc ) );

      }

    });

    // and we don't want the original View to continue processing this node
    // and the node's children, so we...
    cancel();

  });

// create a view
new HyperboneView({model : someModel, el : myElement });

```
WHich should, after everything's loaded, result in..
```html
<div>
<p>Welcome to the magic world of Hypermedia</p>
<div x-embed="some-rel"><p>Woooo!</p></div>
</div>
```

As these two examples should demonstrate, using the custom attribute handler API is fairly powerful, largely unopinionated... and very very easy to abuse.

## Logicless Template rules

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
