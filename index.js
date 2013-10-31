var _ = require('underscore'),
  dom = require('dom'),
  regex = {
    alias : /^[A-Za-z0-9\_\.]+$/,
    helper : /^([A-Za-z\_]+)\(([A-Za-z0-9\_\.]+)\)$/,
    expression : /^([A-Za-z\_]+)\((|(.+))\)$/,
    tache : /\{\{|\}\}/
  },
  Events = require('backbone-events').Events,
  attributeHandlers = {};



/**
 * Constructor.
 *
 * @param null
 * @return {Object} this
 * @api public
 */

var HyperboneView = function(){

  var self = this;

  this.activeNodes = [];
  this.delegates = [];

  this.helpers = {
    get : function( prop ){
      return  prop;
    },
    url : function(){
      return self.model.url();
    },
    rel : function(rel){
      return self.model.rel(rel);
    },
    expression : function( result ){
      return result;
    }
  }

  _.extend(this, Events);

  return this;

};


HyperboneView.prototype = {

/**
 * Initialise this instance of Hyperbone View with an element and model.
 *
 * @param {Object} element, {Object} hyperboneModel
 * @return {Object} this
 * @api public
 */

  create : function(el, model){

    this.el = _.isString(el) ? dom(el) : el;

    this._original = this.el.clone();

    this.model = model;

    this.evaluate();
    this.bindToModel();
    this.activateDelegates();

    this.trigger('initialised', this.el, this.model);

    return this;

  },

/**
 * Register a helper function.
 *
 * @param {String} name, {Function}, fn
 * @return {Object} this
 * @api public
 */

  addHelper : function(name, fn){

    this.helpers[name] = fn;
    return this;

  },

/**
 * Register an event delegate.
 *
 * @param {String} selector, {Function}, fn
 * @return {Object} this
 * @api public
 */

  addDelegate: function(selector, fn){

    if(_.isObject(selector)){
      _.each(selector, function(fn, sel){
        this.addDelegate(sel, fn);
      }, this);
      return this;
    }

    this.delegates.push({ selector : selector, fn : fn});
    return this;

  },


/**
 * Traverse the DOM, finding templates.
 *
 * @param null
 * @return {Object} this
 * @api private
 */

  evaluate : function(){

    var self = this;

    // Visit every node in the dom to check for templated attributes and innerText
    walkDOM(this.el.els[0], function(node){

      var toks, rel, escape = false;

      if (isNode(node)){

        // check for templated attributes
        _.each(node.attributes, function(attr){

          if(attributeHandlers[attr.name]){

            // custom attribute detected. 
            attributeHandlers[attr.name].call(self, node, node.getAttribute(attr.name));

            // do not traverse further.
            escape = true;

            return;

          }

          var toks = tokenise(attr.nodeValue);

          if(toks.length > 1){

            self.activeNodes.push({
              node : node,
              attribute : attr.name,
              original : attr.nodeValue,
              expressions : getExpressions(toks),
              tokens : toks
            });

          }

        });

        // want to be careful that we only operate on anchor tags with untemplated rels
        if(node.tagName === "A"){

          rel = node.getAttribute('rel');

          if(rel && tokenise(rel).length === 1){

            node.setAttribute('href', self.model.rel( rel ) );

          }

        }

        return !escape;

      } else if (isTextNode(node)){

        // check for textnodes that are templates
        toks = tokenise(node.wholeText);

        if (toks.length > 1){

          self.activeNodes.push({
            node : node,
            expressions : getExpressions(toks),
            original : node.wholeText,
            tokens : toks
          });

        }

        return true;

      }
      // in case we get DOM fragments...
      return true;

    });

    return this;

  },

/**
 * Bind to the model, registering on change handlers and rendering templates.
 *
 * @param null
 * @return {Object} this
 * @api private
 */

  bindToModel : function(){

    var self = this;

    // having established our list of templates, iterate through
    // bind to model events and execute the template immediately.
    _.each(this.activeNodes, function( node ){

      node.fn = compile(node.tokens);

      _.each(node.expressions, function( expr ){

        var expr, ev = "change";

        if (isAlias(expr)){

          ev = 'change:' + expr;

        } else if (expr = tokeniseHelper(expr)){

            ev = 'change:' + expr.val;

        }

        this.model.on(ev, function(val){

          render.call(self, node);

          self.trigger('updated', self.el, self.model, ev);

        });

      }, this);

      render.call(self, node);


    }, this);

    return this;

  },

/**
 * register our delegates
 *
 * @param null
 * @return {Object} this
 * @api private
 */

  activateDelegates : function(){

    var self = this;

    // having established our list of templates, iterate through
    // bind to model events and execute the template immediately.
    _.each(this.delegates, function( delegate ){

      var parts = delegate.selector.split(' ');
      var event = parts[0];
      var selector = parts[1];

      this.el.find(selector).on(event, function(e){
        e.preventDefault();
        delegate.fn.call( self.model, e );
        self.trigger('delegate-fired', self.el, self.model, delegate.selector);
      })

    }, this);

    return this;

  }

};

// Export HyperboneView
module.exports.HyperboneView = HyperboneView;

_.extend(attributeHandlers, {

/**
 * "hb-with" custom attribute handler. Creates subview with a different scope.
 *
 * @param {Object} node, {String} hb-width value
 * @return null
 * @api private
 */
  "hb-with" : function( node, prop){

    var collection, inner, self = this;

    // remove this attribute so it's not found when the subview walks the dom
    node.removeAttribute('hb-with');

    collection = this.model.get(prop);

    if(collection.models){

      inner = document.createDocumentFragment();

      _.each(node.children, function(el){

        inner.appendChild(el);

      });

      collection.__hyperbone_view = node;
      collection.__hyperbone_subview = inner;

      collection.each(function( model ){

        var html = inner.cloneNode(true);
          new HyperboneView()
            .create( dom(html), model);

        node.appendChild(html);

      });

    } else {

    // create a subview which passes updated events back to the primary view
      new HyperboneView()
        .on('updated', function( el, model, event){

          self.trigger('updated', el, model, "subview " + prop + " " + event);

        })
        .create( dom(node), self.model.get(prop));

    }

  },
/**
 * "hb-bind" custom attribute handler
 *
 * @param {Object} node, {String} hb-width value
 * @return null
 * @api private
 */
  "hb-bind" : function( node, prop){

    var self = this, el = dom(node), attrValue = this.model.get(prop);

    el.on('change', function(){

      var oldVal = self.model.get(prop);

      if (oldVal !== el.val()){
        self.model.set(prop, el.val());
      }

    });

    this.model.on('change:' + prop, function( val ){

      var oldVal = el.val();
      if (oldVal !== val){
        el.val(val);
        self.trigger('updated', self.el, self.model, 'change:' + prop);
      }

    })

    el.val( attrValue );

  }
  
});
/**
 *
 *
 *
 */


/**
 * Render a template to a node.
 *
 * @param {Object} node, {Function} mode
 * @return null
 * @api private
 */

function render( node ){
  if (isNode(node.node)){
    node.node.setAttribute( node.attribute, node.fn( this.model, this.helpers ) );
  } else {
    node.node.replaceWholeText( node.fn( this.model, this.helpers ) );
  }
};

/**
 * Walk Dom `node` and call `func`.
 *
 * @param {Object} domNode, {Function} callback
 * @return null
 * @api private
 */

function walkDOM(node, func){
  var go = func(node);
  if(go){
    node = node.firstChild;
    while (node){
      walkDOM(node, func);
      node = node.nextSibling;
    }
  }
};

/**
 * Find expressions within an array of Tokens.
 *
 * @param {Array} toks
 * @return {Array} expressions
 * @api private
 */

function getExpressions(toks){
  var expr = [];
  _.each(toks, function(t, i){
    if(i % 2 === 1){
      expr.push(t.trim());
    }

  })
  return expr;
}

/**
 * Compile the given `str` to a `Function`.
 *
 * @param {String} str
 * @return {Function}
 * @api public
 */

function compile(tokens) {
  var js = [],
      tokens,
      token,
      expr,
      subTokens;

  for (var i = 0; i < tokens.length; ++i) {

    token = tokens[i];

    if (i % 2 == 0) {

      js.push('"' + token.replace(/"/g, '\\"') + '"');

    } else {

      if (isAlias(token)){

        js.push(' + model.get("' + token + '") + ');

      } else if (expr = tokeniseHelper( token )) {

        js.push(' + helpers["' + expr.fn + '"]( model.get("' + expr.val + '") ) + ')

      }else if (expr = tokeniseExpression( token )){

        js.push(' + helpers["' + expr.fn + '"](' + (expr.val ? expr.val : "")+ ') + ')   
      
      }
    }
  }

  js = '\n return ' + js.join('').replace(/\n/g, '\\n');

  return new Function('model','helpers', js);

}

/**
 * Tokenise `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function tokenise(str) {
  return str.split( regex.tache );
}

/**
 * Check if the node is a standard node.
 *
 * @param {Object} node
 * @return {Boolean}
 * @api private
 */

function isNode(node) {
  return node.nodeType === 1;
}

/**
 * Check if the node is a standard node.
 *
 * @param {Object} node
 * @return {Boolean}
 * @api private
 */

function isTextNode(node) {
  return node.nodeType === 3;
}

/**
 * Check if `str` looks like a model property name.
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

function isAlias(str) {
  return regex.alias.test(str);
}

/**
 * Validate and return tokens for a call to a helper with a model property alias
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function tokeniseHelper(str) {
  var matches = str.match( regex.helper );
  return (matches ? { fn : matches[1], val : matches[2] } : false);
}

/**
 * Validate and return tokens for a call to a helper with freeform expression.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function tokeniseExpression(str) {
  var matches = str.match( regex.expression );
  return (matches ? { fn : matches[1], val : matches[2] } : false);
}


/**
 * Indent `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function indent(str) {
  return str.replace(/^/gm, '  ');
}