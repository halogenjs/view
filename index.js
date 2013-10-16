var _ = require('underscore');
var Events = require('backbone-events');
var dom = require('dom');

var HyperboneForm = function(){

	return this;

};

HyperboneForm.prototype = {

	form : function( control, options ){


	},

	partial : function( node, name ){


		var frag = (name ? dom('<'+ name +'></' + name + '>') :  dom( document.createDocumentFragment() ) );

		var attr = node.models || node.attributes;

		_.each(attr, function(obj,name){

           if(_.isObject(obj) && name!=="options" && name!=="childNodes"){
               frag.append( this.partial(obj, name) );
           }else if(_.isObject(obj)){
               frag.append( this.partial(obj) );
           }else if(name==="text" || name==="innerText"){
               frag.append( dom( document.createTextNode(obj) ) );
           }else{
               frag.attr(name, obj);
           }

		}, this);

		return frag;

	}

};

module.exports.HyperboneForm = HyperboneForm;

/*

var traverse = function(node, name){
  		var frag = (name ? dom('<'+ name +'></' + name + '>') :  dom( document.createDocumentFragment() ) );

		var attr = node.models || node.attributes;

		_.each(attr, function(obj,name){

           if(_.isObject(obj) && name!=="options" && name!=="childNodes"){
               frag.append( traverse(obj, name) );
           }else if(_.isObject(obj)){
               frag.append( traverse(obj) );
           }else if(name==="text" || name==="innerText"){
               frag.append( dom( document.createTextNode(obj) ) );
           }else{
               if(name==="name"){
                  fields[obj]={ el: frag, model : node};
               }
               frag.attr(name, obj);
           }

		}, this);

		return frag;
}

*/