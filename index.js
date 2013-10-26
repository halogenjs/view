var _ = require('underscore'),
  dom = require('dom'),
  walkDOM,
  getExpressions,
  tachRegex = /\{\{|\}\}/,
  findHelperRegex = /^([A-Za-z\_]+)\(([A-Za-z0-9\_\.]+)\)$/,
  passExpression = /^([A-Za-z\_]+)\((|(.+))\)$/
  aliasRegex = /^[A-Za-z0-9\_\.]+$/,
  TEXTNODE = 3,
  NODE = 1

walkDOM = function(node, func){
  func(node);
  node = node.firstChild;
  while (node){
    walkDOM(node, func);
    node = node.nextSibling;
  }
};

getExpressions = function(toks){

  var expr = [];

  _.each(toks, function(t, i){
    if(i % 2 === 1){
      expr.push(t.trim());
    }

  })

  return expr;

}



var HyperboneView = function( el, model ){

  var self = this;

  this.activeNodes = [];

  this.helpers = {
    get : function(prop){
      return self.model.get(prop);
    },
    url : function(){
      return self.model.url();
    },
    rel : function(rel){
      return self.model.rel(rel);
    }
  }

  return this;

};


HyperboneView.prototype = {

  create : function(el, model){

    this.el = _.isString(el) ? dom(el) : el;
    this.model = model;

    this.setup();

    return this;

  },

  addHelper : function(name, fn){

    this.helpers[name] = fn;
    return this;

  },

  setup : function(){

    var self = this;

    walkDOM(this.el.els[0], function(node){

      var toks;

      if (node.nodeType === NODE){

        // check for templated attributes

        _.each(node.attributes, function(attr){

          var toks = attr.nodeValue.split(tachRegex);

          if(toks.length > 1){

            self.activeNodes.push({
              node : node,
              attribute : attr.name,
              type : NODE,
              original : attr.nodeValue,
              expressions : getExpressions(toks)
            });

          }

        });

        if(node.tagName === "A" && node.getAttribute('rel') && node.getAttribute('rel').split(tachRegex).length === 1){

          node.setAttribute('href', self.model.rel( node.getAttribute('rel') ) );

        }

      } else if (node.nodeType === TEXTNODE){

        // check for textnodes that are templates
        toks = node.wholeText.split(tachRegex);

        if (toks.length > 1){

          self.activeNodes.push({
            node : node,
            expressions : getExpressions(toks),
            type : TEXTNODE,
            original : node.wholeText
          });

        }

      }

    });

    _.each(this.activeNodes, function( node ){

      node.fn = compile(node.original);

      _.each(node.expressions, function( expr ){

        var matches, ev = "change";

        if (aliasRegex.test(expr)){

          ev = 'change:' + expr;

        } else if (matches = expr.match(findHelperRegex)){

          if(aliasRegex.test(matches[2])) {

            ev = 'change:' + matches[2];

          }

        }

        this.model.on(ev, function(val){

          if (node.type === TEXTNODE){

            node.node.replaceWholeText( node.fn(self.model, self.helpers) );

          } else {

            node.node.setAttribute(node.attribute, node.fn(self.model, self.helpers));

          }

        });

        this.model.trigger(ev);

      }, this);


    }, this);

    return this;

  }

};

module.exports.HyperboneView = HyperboneView;

// temporary working gubbins

/**
 * Compile the given `str` to a `Function`.
 *
 * @param {String} str
 * @return {Function}
 * @api public
 */

function compile(str) {
  var js = [];
  var toks = parse(str);
  var tok;
  var matches;

  for (var i = 0; i < toks.length; ++i) {
    tok = toks[i];
    if (i % 2 == 0) {
      js.push('"' + tok.replace(/"/g, '\\"') + '"');
    } else {
      switch (tok[0]) {
        case '!':
          tok = tok.slice(1);
          assertProperty(tok);
          js.push(' + model.get("' + tok + '") + ');
          break;
        default:
          if (aliasRegex.test(tok)){
            js.push(' + escape( model.get("' + tok + '") ) + ');
          } else if (matches = tok.match(findHelperRegex)) {
            if(aliasRegex.test(matches[2]) && matches[1] !== "get"){
              js.push(' + escape( helpers["' + matches[1] + '"]( model.get("' + matches[2]+ '") ) ) + ')
            }else if(aliasRegex.test(matches[2])){
              js.push(' + escape( helpers["get"]("' + matches[2]+ '") ) + ')
            }
          }else if(matches = tok.match(passExpression)){
            js.push(' + escape( helpers["' + matches[1] + '"](' + (matches[2] ? matches[2] : "")+ ') ) + ')
          
          }
      }
    }
  }

  js = '\n'
    + indent(escape.toString()) + ';\n\n'
    + '  return ' + js.join('').replace(/\n/g, '\\n');

  return new Function('model','helpers', js);
}


/**
 * Parse `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function parse(str) {
  return str.split(/\{\{|\}\}/);
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

/**
 * Escape the given `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

function escape(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}