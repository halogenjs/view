var _ = require('underscore');
var Events = require('backbone-events');
var dom = require('dom');
var Model = require('hyperbone-model').Model;

var HyperboneForm = function( control ){

  this.control = control;
  this.form = new Model();

	return this;

};

var validElements = ["fieldset", "legend", "input", "textarea", "select", "optgroup", "option", "button", "datalist", "keygen", "output"];

HyperboneForm.prototype = {

	form : function( control, options ){



	},

	partial : function( node, name ){

		var frag = (name ? dom('<'+ name +'></' + name + '>') :  dom( document.createDocumentFragment() ) );

		var attr = node.models || node.attributes;

		_.each(attr, function(obj,name){

           if(_.isObject(obj) && _.indexOf(validElements, name) !== -1){

               frag.append( this.partial(obj, name) );

           }else if(_.isObject(obj)){ // any other object we recurse with a document fragment not a node

               frag.append( this.partial(obj) );

           }else if(name==="_text"){

               frag.append( dom( document.createTextNode(obj) ) );

           }else if(name!=="_label"){

              //if(name==="name"){
               // this.form.set(obj, { model : node });
              //  this.form.get(obj).set("element", frag, { noTraverse: true });
             // }

              frag.attr(name, obj);

           }

		}, this);

		return frag;

	},

  field : function( name ){

    return this.form.get(name);

  }

};

module.exports.HyperboneForm = HyperboneForm;