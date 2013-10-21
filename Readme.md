# Hyperbone Form

## Summary

Working with [Hyperbone Model](http://github.com/green-mesa/hyperbone-model), this module is for turning JSON hypermedia controls into fully two-way bound, styleable, correct HTML.

A "JSON Hypermedia Control" is a semantic JSON representation of an HTML form, in that it specifies the names, values and types of specific controls but does not expect to be used with any particular layout style.

For a control to be rendered into HTML, there are three requirements:

- The JSON representation of the form must be inside a Hyperbone model. A standard backbone model or naked javascript object will not work.
- There must be a 'properties' attribute at the root, containing the individual form controls.
- The JSON representation must match the spec detailed here.

The typical/expected use case is to transform controls that exist in full Hypermedia Documents using the `.control()` method:

```js
	var converter = new HyperboneForm( myHypermediaDoc.control("controls:mycontrol") );

	dom('body').append( converter.toHTML() );

	// body now has an HTML representation of the form. 
	// changes to the form are applied to the model. 
	// changes to the model are applied to the form.
```

It can also be used without a complete hypermedia document by passing your JSON representation into a Hyperbone model first.

```js
var control = new HyperboneModel({
	method : "POST",
	action : "/login",
	encoding : "application/x-form-www-urlencoding",
	_children : [
		{
			fieldset : {
				_children : [
					{
						legend : {
							_text : "Login"
						}
					},
					{
						input : {
							type : "email",
							name : "email",
							placeholder : "example@example.com",
							_label : "Email",
							_value : ""
					},
					{
						input : {
							type : "password",
							name : "password",
							placeholder : "Password",
							_label : "Password",
							_value : ""
					},
					{
						input : {
							type : "checkbox",
							_label : "Remember me",
							name : "rememberme"
						}
					},
					{
						button : {
							type : "submit",
							_text : "Submit"
						}
					}	
				]
			}
		}
	]
});

var converter = new HyperboneForm( control );

dom('body').append( converter.toHTML() );
```
which generates a default HTML transformation which adds a simple line break after each control group and any labels that are necessary. The HTML is not exactly ideal in this transformation but it is exceptionally simple to style:

```html
<body>
	<form method="POST" action="/login" encoding="application/x-form-www-urlencoded">
		<fieldset>
			<legend>Login</legend>
			<label>Email</label>
			<input type="email" name="email" placeholder="example@example.com">
			<br>
			<label>Password</label>
			<input type="password" name="password" placeholder="Password">
			<br>
			<label></label>
			<label>
				<input type="checkbox" name="rememberme"> Remember me
			</label>
			<br>			
			<label></label>
			<button type="submit">Submit</button>
		</fieldset>
	</form>
</body>
```

## Installation

  Install with [component(1)](http://component.io):

    $ component install green-mesa/hyperbone-model


## JSON Control Spec

_This spec is subject to revision_. The primary design goal is that this should be a semantic representation of a form. To this end there are some reserved attributes that attempt to normalise the differences between different kind of form elements, as well as add the all important semantic data.

In keeping with the HAL Spec, reserved attributes begin with an underscore.

They are:

- `_children` : An array holding child nodes, i.e, select options, fieldset children etc.
- `_label` : Labels an input (and/or a group of checkboxes/radiobuttons), independently of how it will ultimately be used
- `_text` : Defines the innerText for non-void elements (legend, option, textarea, button)
- `_value` : Not the normal HTML attribute 'value'. This is the *actual* value of the form field. Works for selects, multi-selects, checkbox/radio groups.
- `_checkboxes` : Special object that defines a group of checkboxes with the same `name`. 
- `_radios` : Special object that defines a group of radio buttons with the same `name`.

All other attributes are treated as normal HTML element attributes and added to generated elements.

### Creating form elements

JSON Controls are a hierachical and ordered list of objects representing form elements, where the name of an object represents the HTML tagName, and the contents of the object represent the attributes.

```js
	tagName : {
		attribute : value,
		attribute : value,
		attribute : value
	}
```

Valid tagNames are:

- fieldset
- legend
- input
- textarea
- select
- optgroup
- option
- button
- datalist
- output

All other tagnames will generate document fragments instead of HTML Elements. 

```js
{
	input : {
		type : "checkbox",
		name : "a-checkbox",
		checked : checked
	}
},
{
	button : {
		type : "checkbox",
		name : "a-checkbox",
		checked : checked
	}
},

```

### Adding child nodes with `_children`

`select`, `datalist`, `fieldset` and `optgroup` elements usually have child elements. The reserved keyword `_children` is used for this. `_children` should always be an array:

Fieldset example:
```js
{
	fieldset : {
		_children : [
			{
				legend : {
					_text : "This is a set of fields!" // _text sets the innerHTML of this legend element.
				}
			},
			// ...
		]
	}
}
```

Select example:
```js
{
	select : {
		name : "select-one",
		_value : "a", // Note: we set the literal value of this form field with `_value`. No 'selected' or other faff required.
		_label : "Select one",
		_children : [
			{
				optgroup : {
					label : "Group 1", // note we use 'label' not '_label' here. We `label="Group 1"` on the actual element.
					_children : [
						{
							option : {
								value : "a", // again note we use 'value' not '_value'. We want `value="a"` added to the actual element
								_text : "A"
							}
						},
						{
							option : {
								value : "b", // again note we use 'value' not '_value'. We want `value="a"` added to the actual element
								_text : "B"
							}
						},
					]
				}
			},
			{
				optgroup : {
					label : "Group 2",
					_children : [
						{
							option : {
								value : "c",
								_text : "C"
							}
						},
						{
							option : {
								value : "d",
								_text : "D"
							}
						},
					]
				}
			}
		]
	}
}

```
which generates...
```html
<select name="select-one">
	<optgroup label="Group 1">
		<option value="a">A</option>
		<option value="b">B</option>
	</optgroup>
	<optgroup label="Group 1">
		<option value="c">C</option>
		<option value="d">D</option>
	</optgroup>
</select>
```

and the following is true:

```js
dom('select').val() === "a"; // true
```

Note that declaring a `fieldset` as an array instead of an object with a `_children` property also works, assuming you don't want to set any other attributes.

This...
```js
{
	fieldset : [
		// ...
	]
}
```
Generates this...
```html
<fieldset>
...
</fieldset>
```


### Defining innerText

Some elements have innerText. `legend`, `textarea`, `option` and `button`. The `_text` reserved attribute is for this.

This...
```js
{
	option : {
		value : "GB",
		_text : "United Kingdom"
	}
}
```
Generates this...
```html
<option value="GB">United Kingdom</option>
```

Note that for `textarea` elements `_value` (the literal value of the form field) is preferred to `_text` although they're functionally identical. 

This...
```js
{
	textarea : {
		_value : "This is my content",
		name : "big-input"
	}
}
```
Generates this...
```html
<textarea name="big-intput">This is my content</textarea>
```



### _children

Is an array (ordered) of nodes. Every JSON control must have at least one `_children` property at the top level.

```js
{	
	_children : [
		select : {
			_children : [
				{
					option : {
						// ...
					},
					option : {
						// ...
					}
				}
			]
		}
	]
}
```

### _label

Label inputs, selects, textareas, buttons etc. Also add a label to a group of checkboxes and radio buttons (each checkbox/radio button can have its own individual label too). 

```js
{
	checkboxes	
}

```

### input
### select
### optgroup
### option
### textarea
### legend
### button

```js
{
	input : {
		name : "some-name",
		type : "text",
		value : "This is my current value",
		_label : "A Text field"
	}
}
	
```



### fieldset : array






Still to do:
- Serialisation of models for server interactions
- Ability to project JSON controls onto templates

## WARNING!

  Because of the need to remove the jQuery dependency (in keeping with the component philosophy of not bundling huge libraries with components) the .sync functionality of the Backbone models has been disabled. It can be readded. See [backbone-sync](http://github.com/green-mesa/backbone-sync). 
  
  In practice this will not be replaced. Hypermedia interactions are either read only (in the form of a self-discoverable API) or via controls (embedded forms). Sync is basically 'reload' and little more. It's likely that this functionality will be moved somewhere else and the Models themselves will not be responsible for loading themselves.

## Features

  - _links support, with 'self' mapped to .url()
  - Curie support with fully qualified rel uri lookup for curied rels
  - support for uri templating to RFC6570, thanks to https://github.com/ericgj/uritemplate
  - automatic mapping of _embedded data to attributes
  - automatic conversion of objects and arrays of objects to models and collections (including from _embedded) with events cascaded to the parent
  - ability to assign specific Model prototypes for use with specific attributes with custom _prototypes attribute.




## API

### Creating a model

Creating a hyperbone model. The minimum valid HAL document contains a _links object, but according to the spec is this optional, so you can invoke a 
hyperbone model with an empty object.

```javascript
  var Model = require('hyperbone-model').Model;

  var model = new Model({
    _links : {
      self : {
        href : "/helloworld"
      }
    }

  });

```

### .set( attr, data, options )

Usual Backbone .set(), but all objects added as attributes to a model are converted into hyperbone models. Arrays of objects are automatically converted
into a backbone Collection of models, too.

To prevent this behaviour (to make it behave rather like generic Backbone) use `{noTraverse : true}` in options. 

Setting can be done via chaining of these models 

```javascript
// nested models means no more breaking out of Backbone
m.get('thing').get('nestedthing').set("property", "hello")
```

or through dot notation

```javascript
m.set("thing.nestedthing.property", "hello");

//  internally this does... 
//  {
//    thing : {
//      nestedthing : { 
//        property : "hello"
//      }
//    }  
//  }
```

This has obvious implications - you can't, by default, use attribute names with periods in. You can, however, disabled this functionality

```javascript
m.set("foo.bar.lol", "hello", { ignoreDotNotation: true });
// creates an attribute called "foo.bar.lol" in model m.

```

Preventing recursive traversal (i.e, for DOM elements or anything with cyclical references)

```javascript
  m.set("body", document.getElementsByTagName('body')[0], { noTraverse: true });
```

### .get( attr )

Hyperbone extends the .get() method to allow dot notation and indexed access notation to access these nested properties. The attribute names can be just about anything.

The dot notation feature is just basic string manipulation and recursive calls to .get(), and obviously you can always fall back to basic chaining if there's an issue - although reports of issues are welcome.

### More about using get and set...

The philosophy behind Hyperbone means resources are embeddable within resources which means it's models and collections all the way down. 

Automatic models... 

```javascript

  var model = new Model({
    _links : {
      self : {
        href : "/helloworld"
      }
    }

  });

  model.set("test", { name : "Test", value : "Testing"});

  // chaining...
  expect( model.get("test").get("name") ).to.equal("Test"); // TRUE

  // or use the handy dot notation. This works for deeply nested models, too.
  expect( model.get("test.name").to.equal("Test") ); // TRUE!

```

And automatic collections...

```javascript

  var model = new Model({
    _links : {
      self : {
        href : "/helloworld"
      }
    }

  });

  model.set("test", [{ name : "one"}, { name : "two"}, { name : "three"}]);

  expect( model.get("test").length ).to.equal( 3 ); // TRUE

  // using chaining...
  expect( model.get("test").at(0).get("name") ).to.equal("one"); // TRUE

  // or using dot notation and indexed access notiation...
  expect( model.get("test[0].name") ).to.equal("one"); // TRUE

  // arrays of objects automatically get all the power of Backbone collections... 
  model.get("test").each(function( item ){

    console.log(item.get("name"));

  });

  > one
  > two
  > three

```


In addition, events are triggered on the parent model when nested models are manipulated

```javascript

  model.on("change:test", function(){
 
    console.log("Test has been changed!")

  })

  model.get("test").set("name", "Not Test. Something else entirely");

  > Test has been changed!
```

If you want to use a specific model, the API is as follows:

```javascript

  var ModelForThings = Model.extend({
     defaults : {
        "bar" : "ren and stimpy"
     }
  });

  var ModelForResource = Model.extend({
    _prototypes : {
      "things" : ModelForThings
    }
  });

  var model = new ModelForResource({
    _links : { self : { href : "/test"} },
    "things" : {
      "foo" : "bar"
    }
  });

  // model.things is an instance of ModelForThings rather than a default empty model...
  expect( model.get("things").get("bar") ).to.equal( "ren and stimpy" ); // TRUE
```

This applies to _embedded and generic attributes.

The main difference between an model that comes from _embedded and one that's just inside the attributes is that _embedded models have a self.href

```javascript
  
  var m = new Model({
    _links : {
      self : {
        href : "/test"
      }
    },
    _embedded : {
      "foo" : {
        _links : {
          self : {
            href : "/foo/1"
          }
        }
        "bar" : "kbo"
      }
    }

  });

  expect( m.get("foo").url() ).to.equal("/foo/1"); // TRUE

  
```

### .url()

Shortcut to .rel('self');

```javascript
  var model = new Model({
    _links : {
      self : {
        href : "/helloworld"
      }
    }
  });

  expect( model.url() ).to.equal("/helloworld"); // TRUE
```

### .rel( rel [, data])

Get a link to another rel of the resource. If a particular rel is a URI template and `templated: true` is set, then rel
can be used to expand the uri template with the data. There is currently no way of discovering the requirements for a URI template - it's on the to-do list.

```javascript
  var model = new Model({
    _links : {
      self : {
        href : "/helloworld"
      },
      test : {
        href : "/test"
      },
      clever : {
        href : "/clever/{ id }",
        templated : true
      }
    }
  });

  expect( model.rel( "self" ) ).to.equal("/helloworld"); // TRUE
  expect( model.rel( "test" ) ).to.equal("/test"); // TRUE
  expect( model.rel( "clever", { id : "lol"} ) ).to.equal("/clever/lol"); // TRUE


```
### .rels()

Returns all the links. Hypermedia is about self discovery, after all. 

### .fullyQualifiedRel( rel )

Hyperbone supports curie (and `curies` with an array, incidentally), and offers a neato utility to recover the fully qualitied uri of a curied rel.

```javascript
  var model = new Model({
    _links : {
      self : {
        href : "/helloworld"
      },
      curie : {
        href : "http://www.helloworld.com/rels/{rel}",
        name : "rofl",
        templated : true
      },
      "rofl:test" : {
        href : "/test"
      }
    }
  });

  expect( model.rel( "rofl:test" ) ).to.equal("/test"); // TRUE
  expect( model.fullyQualitiedRel( "rofl:test" ) ).to.equal("http://www.helloworld.com/rels/test"); // TRUE
```

## Controls

A foreword about controls. Hyperbone model adds another reserved property, `_controls` and offers some lightweight additional utility for those that care to use it. However, `_controls` is not part of the HAL Spec and is a Hyperbone specific thing. Mike Kelly has said that dealing with forms will be part of a separate spec, however as we are in need of this functionality now, therefore it has been included in this.

The spec for controls has not been finalised yet, but the current thinking is that `_controls` should be simple _semantic_ JSON representation of a form. It looks very similar to a straight HTML->JSON conversion but without any additional layout HTML and with a few additional reserved properties for supporting childNodes and textNodes.

Because the intention is that this JSON will only hold semantic information about the form, the following are the supported tags:

  - input
  - select
  - fieldset
  - textarea
  - legend
  - optgroup
  - option
  - button
  - datalist
  - keygen
  - output

Note that `<label />` is _not_ a supported tag.

In addition each field object has some special reserved properties, in the style of HAL: `_text` and `_options` and `_label`. 

`_text` is for declaring innerText for a field (textarea, legend, option). `_options` is for declaring nested options on select, datalist etc. (or optgroups with, itself, an `_options` property). 

`_label` is for defining a default label, independently of the eventually generated HTML. 

### Example control

```javascript
{
  _links : {
    "controls:test" : {
       href : "#_controls/test"
    }
  }
}
{
  _controls : {
    test : {
     {
        method : "/testform",
        action : "POST",
        encoding : "x-form-www-url-encoded",
        properties : [
          {
            input : {
              name : "text-input",
              value : "",
              placeholder : "Insert text here",
              _label : "Text control"
            }
          },
          {
            fieldset : [
              {
                legend : {
                  _text : "Select controls"
                }
              },
              {
                select : {
                  name : "select-control",
                  value : "1",
                  _label : "Select control"
                  _options : [
                    {
                      option : {
                        _text : "Option 1",
                        value : "1"
                      }
                    },
                    {
                      option : {
                        _text : "Option 2",
                        value : "2"
                      }
                    },       
                  ]
                }
              }
            }
          ]
        ]
      }
    }
  
  }
}
```

### .control( [rel / id] )

If, as in the above example, you're using an internal rel for your controls, you can access the control with:

```javascript
  model.control("controls:test");
```

The convention is that an internal rel to a control begins `#controls` or `#_controls` or `#control` and the path to the specific control is separated by a slash. 


Or you can access using .get() style dot notation, but this is not recommended - better to have a consistent interface for a particular 
type of resource as depending on your server side implementation, control names may not be predictable in advance.

```javascript
  model.control("edit.sample");
```

This returns the control as a Hyperbone Model, so all the usual stuff applies - the array of properties becomes a collection, etc.

```javascript
  model.control("controls:sample").get("properties").each(function(field){

    // do something with each property in the control.

  })
```

## Testing

Hyperbone is covered by tests. It does not test underlying Backbone Model functionality, but the Backbone-model component used as a dependency
has been evalated against the real Backbone test suite and passes all tests.

Install testing tools. You probably need PhantomJS on your path.

```back
  $ npm install
```

Run the tests:

```bash
  $ grunt test
```


## License

  MIT
