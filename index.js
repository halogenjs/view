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

    _.each(this.fields, function( formField ){

      var br, label, innerLabel;

      switch(formField.type){

        case "input" : 
        case "select" :
        case "textarea" :
        case "button" :
        case "output" :

          label = dom('<label></label>')
                        .text( formField.model.get('_label') || formField.name )
                        .insertAfter(formField.partial);

          formField.partial.insertAfter(label);

          br = dom('<br>')
                        .insertAfter(formField.partial);

          break;

        case "_checkboxes" :
        case "_radios" :

          formField.model.get("_children").each(function(option, index){

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
      }


    }, this);

    return this.html;

  },

  toBootstrap2HTML : function( inline ){

    this.html.addClass('form-horizontal');

    _.each(this.fields, function( formField ){

      var ctrlGroup, ctrls, label, innerLabel, type;

      switch(formField.type){

        case "input" : 
        case "select" :
        case "textarea" :
        case "button" :
        case "output" :

          type = formField.model.get('type');

          ctrlGroup = dom('<div></div>').addClass('control-group'); 
          label = dom('<label></label>');

          ctrls = dom('<div></div>').addClass('controls');

          ctrlGroup.insertAfter( formField.partial );

          ctrls.appendTo( ctrlGroup );

          if(type==="radio" || type==="checkbox"){

            label.appendTo( ctrls );
            label.addClass( type );
            formField.partial.appendTo( label );

            dom( document.createTextNode(' ' + formField.model.get('_label') ) ).appendTo( label );


          }else{

            label
              .text( formField.model.get('_label') )
              .addClass('control-label');

            label.appendTo( ctrlGroup );
            formField.partial.appendTo(ctrls);
            ctrls.insertAfter(label);
            

          }

          break;

        case "_checkboxes" :
        case "_radios" : 

        

          formField.model.get("_children").each(function(option, index){

            ctrlGroup = dom('<div></div>').addClass('control-group');  
            label = dom('<label></label>')
                      .text( (index===0 ? formField.model.get("_label") : "") )
                      .addClass('control-label');

            label.appendTo( ctrlGroup );

            ctrls = dom('<div></div>').addClass('controls');

            ctrlGroup.insertAfter( formField.partial[index] );
            ctrls.appendTo( ctrlGroup );

            formField.partial[index].appendTo(ctrls);


            innerLabel = dom('<label></label>')
                          .addClass( option.get('type') )
                          .insertAfter( formField.partial[index] );

            innerLabel
              .append( formField.partial[index] );

            dom( document.createTextNode( " " + option.get("_label") ) ).insertAfter( formField.partial[index] );


          }, this);


          break;
          default:
            console.log(formField);
      }


    }, this);

    return this.html;

  },

	traverse : function( node, tag ){

    var self = this;

		var frag = (tag ? dom('<'+ tag +'></' + tag + '>') :  dom( document.createDocumentFragment() ) );

		var attr = node.models || node.attributes;

		_.each(attr, function(obj,name){

      if (_.isObject(obj)){

        if ( _.indexOf(validElements, name) !== -1 ){ // recurse for recognised HTML elements

          frag.append( this.traverse(obj, name) );

        } else if (name==="_checkboxes" || name==="_radios"){ // custom handler for 'checkboxes' and 'radios'

          var fieldName = obj.get("name");

          var els = [];

          obj.get("_children").each(function(option){

            var el = dom('<input></input')
              .attr('type', (name === "_checkboxes" ? "checkbox" : "radio"))
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

        } else if (name!=="_value"){ // recurse for any other object that doesn't require a specific tag generating.

          frag.append( this.traverse(obj) );

          if(name==="_children"){ // re-set the value here, in case the value comes before the options. 

            frag.val(node.get("_value"));

          }

        }

      } else if (name==="_text"){ // _text is a special reserved attribute

        frag.append( dom( document.createTextNode(obj) ) );

      } else if (name === "_value"){

        frag.val(node.get("_value"));

        node.on("change:_value", function(model, val){

          var oldVal = frag.val();

          if(oldVal !== val){
            frag.val(val);
          }

        });

        frag.on("change", function(e){

          var oldVal = node.get("_value");

          if(oldVal !== frag.val()){
            node.set("_value", frag.val());
          }

        });

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