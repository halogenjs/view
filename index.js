var _ = require('underscore');
var Events = require('backbone-events');
var dom = require('dom');

var HyperboneForm = function(){

	return this;

};

var generators = {

	"input" : function(o){

		var el = dom('<input></input>');
		_.each(o.attributes, function(val, attr){

			el.attr(attr, val);

		});

		o.on("change:value", function(){

			if(el.val() !== o.get("value")){

				el.val( o.get("value") );

			}

		});

		el.on('keyup', function(){

			o.set("value", el.val());

		});

		return el;

	}
	/* ,
	"select" : function(o){
		
		var el = dom('<select></select>');
		_.each(o.attributes, function(a, id){
			if(!_.isObject(a)){
				el.attr(id, a);
			}
		});
		el.append( traverse(o.get("options") ) )
		return el;
		
	}
	*/


};

HyperboneForm.prototype = {

	form : function( control, options ){


	},

	partial : function( model, name ){

		var frag = dom( document.createDocumentFragment() );
		var attr = model.models || model.attributes;

		_.each(attr, function(obj,name){
			if(generators[name]){

            	frag.append( generators[name].call(this, obj, name) );

			} else {

				frag.append(this.partial(obj, name));

			}


		}, this);

		return frag;

	}

};

module.exports.HyperboneForm = HyperboneForm;


/*

STUFF FROM SPIKE. Generalisation detected.

var traverse = function( o ){
   var frag = dom( document.createDocumentFragment() );
   var attrs = o.models || o.attributes;

     _.each(attrs, function(t, id){
        if(thingies[id]){
          frag.append( thingies[id](t) );
        }else{
          frag.append(traverse(t));
        }
     })

   return frag;
}

thingies['fieldset'] = function(o){
   var el = dom('<fieldset></fieldset>');
   _.each(o.attributes, function(a, id){
      if(!_.isObject(a)){
        el.attr(id, a);
      }
   });
  el.append( traverse(o.attributes ) )
   return el;

}

thingies['optgroup'] = function(o){
   var el = dom('<optgroup></optgroup>');
   _.each(o.attributes, function(a, id){
      if(!_.isObject(a)){
        el.attr(id, a);
      }
   });
  el.append( traverse(o.get("options") ) )
   return el;

}

 thingies["option"] = function( o ){
   var el = dom('<option></option>');
   _.each(o.attributes, function(a, id){
       if(id==="text" || id==="innerText" || id==="value"){
       el.text(a);
       }else{
          el.attr(id, a ); 
       }
   });
   return el;
}

*/