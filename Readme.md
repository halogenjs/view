# Hyperbone Form

## tldr; 

Generate JSON representations of forms on your server. Add to JSON hypermedia document as hypermedia controls.

Client loads the Hypermedia JSON. Automatically turns the controls into styleable HTML forms with two-way binding. Never touch form HTML ever again.


## Intro

Working with [Hyperbone Model](http://github.com/green-mesa/hyperbone-model), this module is for turning JSON hypermedia controls into fully two-way bound, styleable HTML.

A "JSON Hypermedia Control" is a semantic JSON representation of an HTML form, in that it specifies the names, values and types of specific controls but does not expect to be used with any particular layout style.

For a control to be rendered into HTML, there are three requirements:

- The JSON representation of the form must be inside a Hyperbone model. A standard backbone model or naked javascript object will not work.
- There must be a 'method' attribute at the top level and probably at least one form field defined.
- The JSON representation must match the spec detailed here.

The typical/expected use case is to transform controls that exist in full Hypermedia Documents using the `.control()` method on Hyperbone Models.

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
which generates a default HTML transformation which adds a simple line break after each control group along with labels etc:
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

### Defining form elements

JSON Controls are a hierachical and ordered list of objects representing form elements, where the name of an object represents the HTML tagName, and the contents of the object represent the attributes.

```js
	tagname : {
		attribute1 : "value",
		attribute2 : "value"
	}
```
```html
<!-- raw untransformed generated html -->
<tagname attribute1="value" attribute2="value"></tagName>
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
		type : "button",
		name : "the-button",
		_text : "Click me!"
	}
},

```
```html
<!-- raw untransformed generated html -->
<input type="checkbox" name="a-checkbox" checked="checked">
<button type="button" name="the-button">Click me!</button>
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
<!-- raw untransformed generated html -->
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
<!-- raw untransformed generated html -->
<option value="GB">United Kingdom</option>
```

Note that for `textarea` elements `_value` (the _actual_ value of the form field) is preferred to `_text` although they're functionally identical. 

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
<!-- raw untransformed generated html -->
<textarea name="big-intput">This is my content</textarea>
```

### Defining labels

Because we want to preserve the semantic labels, the `_label` reserved attribute lets the JSON define an element's label independently of the HTML layout to be used.

This becomes especially useful when wishing to label both an individual checkbox input and a group of checkbox inputs separately. More on `_checkboxes` and `_radios`

```js
{
	input : {
		type : "text",
		_label  : "I'm a text box",
		name : "text-input"
	}
}
```
```html
<!-- default basic tranformation -->
<label>I'm a text box</label>
<input type="text" name="text-input">
<br>
```

### Groups of Checkboxes and Radios

Because groups of checkboxes and radio buttons is a fairly common use case for forms, two special objects have been added to make defining these groups easier.

Note that it is assumed that the `_children` of `_checkboxes` and `_radios` are inputs of the relevant type, so you only need declare the value the child input represents and a label. 

```js
{
	_checkboxes : {
		name : "group-of-checkboxes",
		_value : "a",
		_label : "I am the label for this group",
		_children : [
			{
				value : "a",
				_label : "I am the label for this checkbox"
			},
			{
				value : "b",
				_label : "And I'm the label for this checkbox"
			}
		]
	}
},
{
	_radios : {
		name : "group-of-radios",
		_value : "a",
		_label : "I am the label for this group",
		_children : [
			{
				value : "a",
				_label : "I am the label for this checkbox"
			},
			{
				value : "b",
				_label : "And I'm the label for this checkbox"
			}
		]
	}
}
```

```html
<!-- default basic transformation -->
<label>I am the label for this group</label>
<label>
	<input type="checkbox" value="a"> I am the label for this checkbox
</label>
<br>
<label></label> <!-- we don't show the group label a second time -->
<label>
	<input type="checkbox" value="b"> And I'm the label for this checkbox
</label>
<br>
```

## API

### new HyperboneForm( control )

Create a new converter from a control. 

```js
var HyperboneForm = require('hyperbone-form').Hyperbone;
var control = new HyperboneForm( aHyperboneModel.control('controls:some-control') );
```

### .toHTML()

Project the control onto the default basic line break based layout

### .toBackbone2HTML()

Project the control onto the Backbone 2 Horizontal Form based layout. Lots and lots of divs and classes.


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
