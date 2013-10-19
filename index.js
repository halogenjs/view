var _ = require('underscore');
var Events = require('backbone-events');
var dom = require('dom');

var HyperboneForm = function( control ){

  this.control = control;

  this.modelRefs = {};
  this.partialRefs = {};

  this.fields = [];

  if(control){

    this.html = dom( document.createDocumentFragment() ).append(this.traverse( this.control, 'form' ));    

  }

	return this;

};

var validElements = ["fieldset", "legend", "input", "textarea", "select", "optgroup", "option", "button", "datalist", "output"];

HyperboneForm.prototype = {

  toHTML : function(){

    var self = this;

    _.each(this.fields, function( formField ){

      var br, label, innerLabel;

      switch(formField.type){

        case "input" : 
        case "select" :
        case "textarea" :

          label = dom('<label></label>')
                        .text( formField.model.get('_label') || formField.name )
                        .insertAfter(formField.partial);

          formField.partial.insertAfter(label);

          br = dom('<br>')
                        .insertAfter(formField.partial);

          break;

        case "checkboxes" :
        case "radios" : 

          formField.model.get("_options").each(function(option, index){

            label = dom('<label></label')
                      .text( (index===0 ? formField.model.get("_label") : "") )
                      .insertAfter(formField.partial[index]);

            formField.partial[index].insertAfter(label);

            innerLabel = dom('<label></label>')
                          .insertAfter( formField.partial[index] );

            innerLabel
              .append( formField.partial[index] )

            dom( document.createTextNode( " " + option.get("_label") ) ).insertAfter( formField.partial[index] );

            br = dom('<br>')
                          .insertAfter(innerLabel);

          }, this);

          break;
        case "default" :
          console.log("Oh shit!", formField);

      }


    }, this);

    return this.html;

  },

	traverse : function( node, tag ){

    var self = this;

		var frag = (tag ? dom('<'+ tag +'></' + tag + '>') :  dom( document.createDocumentFragment() ) );

		var attr = node.models || node.attributes;

		_.each(attr, function(obj,name){

           if(_.isObject(obj) && _.indexOf(validElements, name) !== -1){

               frag.append( this.traverse(obj, name) );

           }else if(_.isObject(obj) && (name==="checkboxes" || name==="radios") ){

              var fieldName = obj.get("name");

              var els = [];

              obj.get("_options").each(function(option){

                var el = dom('<input></input')
                  .attr('type', (name === "checkboxes" ? "checkbox" : "radio"))
                  .attr('name', fieldName);

                _.each(option.attributes, function(o, name){

                  if(name!=="_label"){
                    el.attr(name, o);
                  }

                });

                els.push(el);
                frag.append(el);

              });

              this.registerFormInput(name, fieldName, obj, els);

           }else if(_.isObject(obj)){ // any other object we recurse with a document fragment not a node

               frag.append( this.traverse(obj) );

           }else if(name==="_text"){

               frag.append( dom( document.createTextNode(obj) ) );

           }else if(name!=="_label"){

              if(name==="name"){
                
                this.registerFormInput(tag, obj, node, frag);
              }

              frag.attr(name, obj);

           }

		}, this);

		return frag;

	},

  registerFormInput : function( type, name, model, partial ){

    this.fields.push({
      type : type,
      name : name,
      model : model,
      partial : partial 
    });

    return this;

  }


};

module.exports.HyperboneForm = HyperboneForm;

/*

bootstrap 2 projection stuff:

var _ = require('underscore'); _.each(control.partials(), function(partial){
   var controlGroup = dom('<div></div>').addClass('control-group');
   var label = dom('<label></label>').text( partial.attr('name') ).addClass('control-label');
   label.appendTo( controlGroup );
   var div = dom('<div></div>').addClass('controls');

   controlGroup.insertAfter(partial);
   div.appendTo(controlGroup);
   partial.appendTo(div);
})

*/