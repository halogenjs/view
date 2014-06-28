var hyperboneView = require('../index.js');
var dom = require('green-mesa-dom');
var Model = require('hyperbone-model').Model;
var utils = require('./test-utils.js');

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();


describe("suite", function(){

	describe("Environment", function(){

		it("Environment", function(){

			should.exist(dom);
			should.exist(utils.useFixture);
			should.exist(Model);
			should.exist(utils.setValueAndTrigger);
			should.exist(hyperboneView);
			should.exist(hyperboneView.HyperboneView);
			should.exist(hyperboneView.registerHelper);
			should.exist(hyperboneView.registerAttributeHandler);

		})

	});

	describe("Templates within Innertext", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("Can apply a model to template within innertext with property alias", function(){

			var html, test;

			html = dom('<p>{{test}}</p>');
			test = new Model({
				test : "Hello world"
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('Hello world');

		})

		it("Can apply a model to template within innertext with the get helper", function(){

			var html, test;

			html = dom('<p>{{get(test)}}</p>');
			test = new Model({
				test : "Hello world"
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('Hello world');

		});

		it("Can apply a model to template within innertext using a custom helper", function(){

			var html, test;

			html = dom('<p>{{uppercase(test)}}</p>');
			test = new Model({
				test : "Hello world"
			});

			hyperboneView.registerHelper('uppercase', function(str){ return str.toUpperCase(); });

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('HELLO WORLD');

		})

		it("Automatically updates the view when the model changes for alias", function(){

			var html, test;

			html = dom('<p>{{test}}</p>');
			test = new Model({
				test : "Hello world"
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('Hello world');

			test.set('test', 'Goodbye, cruel world');

			expect( html.text() ).to.equal('Goodbye, cruel world');

		});

		it("Automatically updates the view when the model changes for get helper", function(){

			var html, test;

			html = dom('<p>{{get(test)}}</p>');
			test = new Model({
				test : "Hello world"
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('Hello world');

			test.set('test', 'Goodbye, cruel world');

			expect( html.text() ).to.equal('Goodbye, cruel world');

		});

		it("Automatically updates the view when the model changes for custom helper", function(){

			var html, test;

			html = dom('<p>{{uppercase(test)}}</p>');
			test = new Model({
				test : "Hello world"
			});

			hyperboneView.registerHelper('uppercase', function(str){ return str.toUpperCase(); })

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('HELLO WORLD');

			test.set('test', 'Goodbye, cruel world');

			expect( html.text() ).to.equal('GOODBYE, CRUEL WORLD');			

		});


	});

	describe("Templates within attributes", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("Can apply a model to template within an attribute with property alias", function(){

			var html, test;

			html = dom('<p class="paragraph {{className}}">Hello world</p>');
			test = new Model({
				className : "active"
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.attr('class') ).to.equal('paragraph active');

		});

		it("Can apply a model to template within an attribute with the get helper", function(){

			var html, test;

			html = dom('<p class="paragraph {{get(className)}}">Hello world</p>');
			test = new Model({
				className : "active"
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.attr('class') ).to.equal('paragraph active');

		})

		it("Can apply a model to template within an attribute with a custom helper", function(){

			var html, test;

			html = dom('<p class="paragraph {{lowercase(className)}}">Hello world</p>');
			test = new Model({
				className : "ActIve"
			});

			hyperboneView.registerHelper('lowercase', function(str){ return str.toLowerCase() })

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.attr('class') ).to.equal('paragraph active');

		});

		it("Can automatically update the attribute when the model changes", function(){

			var html, test;

			html = dom('<p class="paragraph {{active}}">Hello world</p>');
			test = new Model({
				active : "active"
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.attr('class') ).to.equal('paragraph active');

			test.set('active', 'inactive');

			expect( html.attr('class') ).to.equal('paragraph inactive');

		});

		it("Can automatically update the attribute with the get helper when the model changes", function(){

			var html, test;

			html = dom('<p class="paragraph {{get(active)}}">Hello world</p>');
			test = new Model({
				active : "active"
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.attr('class') ).to.equal('paragraph active');

			test.set('active', 'inactive');

			expect( html.attr('class') ).to.equal('paragraph inactive');

		});

		it("Can automatically update the attribute with a custom helper when the model changes", function(){

			var html, test;

			html = dom('<p class="paragraph {{lowercase(active)}}">Hello world</p>');
			test = new Model({
				active : "ACTIVE"
			});

			hyperboneView.registerHelper('lowercase', function(str){ return str.toLowerCase(); })

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.attr('class') ).to.equal('paragraph active');

			test.set("active", "INACTIVE")

			expect( html.attr('class') ).to.equal('paragraph inactive');


		});

	});

	describe("Arbitrary expressions", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("can do a sum if you like", function(){

			var html, test;

			html = dom('<div>{{expression(1 + 2)}}</div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				}
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('3');

		})

		it("can manually access attributes", function(){

			var html, test;

			html = dom('<div>{{expression( model.url() )}}</div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				}
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('/hyperlink');

		})

		it("can generally do evil horrible shit", function(){

			var html, test;

			html = dom('<div>{{expression( model.url() + ".xml" + (5 * 9) )}}</div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				}
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.text() ).to.equal('/hyperlink.xml45');

		})

	});

	describe("Hypermedia extensions", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("Can get the link to self from built in url() helper", function(){

			var html, test;

			html = dom('<div><a href={{url()}}>Myself</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				}
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});


			expect( html.find('a').first().attr('href') ).to.equal('/hyperlink');

		})

		it("Can get the link to a rel from built in rel() helper", function(){

			var html, test;

			html = dom('<div><a href={{rel("some-rel")}}>Some rel</a></div>');
			test = new Model({
				_links : {
					"some-rel": {
						href :  "/hyperlink"
					}
				}
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.find('a').first().attr('href') ).to.equal('/hyperlink');

		})

		it("Can add href to anchor tags where the rel is recognised", function(){

			var html, test;

			html = dom('<div><a rel="self">Myself</a><a rel="alternate">Alternate</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					},
					alternate : {
						href : "/hyperlink.xml"
					}
				}
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.find('a').first().attr('href') ).to.equal('/hyperlink');
			expect( html.find('a').last().attr('href') ).to.equal('/hyperlink.xml');

		});

		it("Can update the href when the rel changes", function(){

			var html, test;

			html = dom('<div><a rel="self">Myself</a><a rel="alternate">Alternate</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					},
					alternate : {
						href : "/hyperlink.xml"
					}
				}
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			test.set({
				_links : {
					self : {
						href : "/changed-hyperlink"
					},
					alternate : {
						href : "/changed-hyperlink.xml"
					}
				}
			})

			expect( html.find('a').first().attr('href') ).to.equal('/changed-hyperlink');
			expect( html.find('a').last().attr('href') ).to.equal('/changed-hyperlink.xml');

		});

		it("Rels added after initialisation still work, initially hidden", function(){


			var html, test;

			html = dom('<div><a rel="self">Myself</a><a rel="alternate">Alternate</a></div>');
			test = new Model({});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.find('a').first().attr('href')).to.equal('#');
			expect( html.find('a').first().els[0].style.display).to.equal('none');

			test.set({
				_links : {
					self : {
						href : "/hyperlink"
					},
					alternate : {
						href : "/hyperlink.xml"
					}
				}
			})

			expect( html.find('a').first().attr('href') ).to.equal('/hyperlink');
			expect( html.find('a').last().attr('href') ).to.equal('/hyperlink.xml');

			expect( html.find('a').first().els[0].style.display ).to.not.equal('none');


		});


	});

	describe("Issues its own events", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		// could really do with more extensive testing of this but really we're just testing DOM's event 
		// handler. I found the actual delegate stuff didn't work which is infuriating really.

		// Because the DOM is preserved and never just resplatted actual delegates aren't necessary. We can 
		// just use the selector to bind to the actual element. 

		it("Can register an onInitialised callback", function( done ){

			var html, test;

			html = dom('<div><a class="{{status}}" rel="self">Myself</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				},
				status : 'inactive'
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0],
				initialised : function(el, model){

					expect(model.get('status')).to.equal('inactive');
					done();

				}
			});


		});

		it("issues an 'updated' event", function( done ){

			var html, test, view;

			html = dom('<div><a class="{{status}}" rel="self">Myself</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				},
				status : 'inactive'
			});

			var view = new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			view
				.on('updated', function( el, model, event ){

					expect(event).to.equal('change:status');
					expect(model.get('status')).to.equal('active');

					done();

				});

			test.set('status', 'active');

		});

	});

	describe("Nested model handling", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("Can change scope to a nested model with hb-with attribute", function(){

			var html, test;

			html = dom('<div hb-with="embedded"><p>{{title}}</p></div>');
			test = new Model({
				embedded : {
					title : "Hello world"
				}
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect(html.find('p').text()).to.equal('Hello world');

			test.set('embedded.title', 'Test');

			expect(html.find('p').text()).to.equal('Test');
			

		});

		it("passes on updated events from generated subview", function( done ){

			var html, test, view;

			html = dom('<div hb-with="embedded"><p>{{title}}</p></div>');
			test = new Model({
				embedded : {
					title : "Hello world"
				}
			});

			var view = new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			view.on('updated', function(el, model, event){

				expect(event).to.equal("subview embedded change:title");
				expect(model.get('title')).to.equal('Test');
				done();

			});

			expect(html.find('p').text()).to.equal('Hello world');

			test.set('embedded.title', 'Test');

			expect(html.find('p').text()).to.equal('Test');
			

		});

	});

	describe("Collection handling", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("Will iterate through a collection", function(){

			var html, test;

			html = dom('<ul hb-with="collection"><li><p>{{title}}</p></li></ul>');
			test = new Model({
				collection : [
					{
						title : "One"
					},
					{
						title : "Two"
					},
					{
						title : "Three"
					}
				]
			});

			new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			expect( html.find('p').at(0).text() ).to.equal('One');
			expect( html.find('p').at(1).text() ).to.equal('Two');
			expect( html.find('p').at(2).text() ).to.equal('Three');

			test.get('collection[0]').set('title', 'No longer one!');

			expect( expect( html.find('p').at(0).text() ).to.equal('No longer one!'))
			

		});

	});

	describe("Input binding", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("will bind an input", function( done ){

			var html, test, view;

			html = dom('<p>{{test}}</p><input hb-bind="test">');
			test = new Model({
				test : "Backbone style"
			});

			var view = new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			view.on('updated', function(){

				expect( test.get("test") ).to.equal("Yay REST level 2 friendly!");
				expect( html.find('input').val() ).to.equal("Yay REST level 2 friendly!");
				expect( html.find('p').text() ).to.equal('Yay REST level 2 friendly!');
				done();

			});

			expect( html.find('p').text() ).to.equal('Backbone style');

			utils.setValueAndTrigger( html.find('input'), "Yay REST level 2 friendly!", "change");

		});

		it("will bind a select", function( done ){

			var html, test, view;

			html = dom('<p class="{{test}}""><select hb-bind="test"><option value="backbone">Backbone</option><option value="knockout">Knockout</option><option value="angular">Angular</option></select></p>');
			test = new Model({
				test : "backbone"
			});

			var view = new HyperboneView({ 
				model: test, 
				el : html.els[0]
			});

			view.on('updated',function(){

				expect( test.get("test") ).to.equal("knockout");
				done();

			});

			expect( html.find('select').val() ).to.equal('backbone');

			utils.setValueAndTrigger( html.find('select'), "knockout", "change");

		});

	});

	describe("Built In Extensions", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		describe('if', function(){

			it('Shows and hides an element based on truthiness of model attribute', function(){

				var html, test;

				html = dom('<div if="active"></div>');
				test = new Model({
					active : true
				});

				new HyperboneView({
					model : test,
					el : html.els[0]
				});

				expect(html.els[0].style.display).to.not.equal('none');

				test.set('active', false);

				expect(html.els[0].style.display).to.equal('none');

			});

		});

		describe('if-not', function(){

			it('Shows and hides an element based on truthiness of model attribute', function(){

				var html, test;

				html = dom('<div if-not="active"></div>');
				test = new Model({
					active : true
				});

				new HyperboneView({
					model : test,
					el : html.els[0]
				});

				expect(html.els[0].style.display).to.equal('none');

				test.set('active', false);

				expect(html.els[0].style.display).to.not.equal('none');

			});

		});

		describe('hb-trigger', function(){
			
			it('triggers a hyperbone event on click and passes the correct model', function( done ){

				var test, html, view;

				html = dom('<div><button hb-trigger="test-hb-trigger">Click me</button></div>');
				
				test = new Model({
					val : "hello"
				});

				new HyperboneView({ 
					model: test, 
					el : html.els[0]
				});
	
				test.on('test-hb-trigger', function(){

					expect(this.get('val')).to.equal('hello');
					done();

				});

				utils.simulateClick(html.find('button'));

			});
			
			it('triggers a hyperbone event and passes the correct model for nested models', function( done ){

				var test, html, view;

				html = dom('<div><ul hb-with="collection"><li hb-trigger="some-event">{{name}}</li></ul></div>');
				
				test = new Model({
					val : "hello",
					collection : [
						{
							name : "One"
						},
						{
							name : "Two"
						}
					]
				});

				new HyperboneView({ 
					model: test, 
					el : html.els[0]
				});
	
				test.on('some-event:collection', function( model ){

					expect(model.get('name')).to.equal('Two');
					done();

				});

				utils.simulateClick(html.find('li').last());

			});

		});

	})

	describe("Custom attribute handlers", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("will pass a node and all its contents to the custom attribute handler", function( done ){

			var html, test, view;

			html = dom('<div custom-attribute="test"><p>{{test}}</p></div>');
			test = new Model({
				test : "Hello"
			});

			hyperboneView.registerAttributeHandler('custom-attribute', function(node, prop, cancel){

					expect( prop ).to.equal('test');
					expect( cancel ).to.be.a('function');
					expect( this.model.get('test') ).to.equal('Hello');
					expect( node.outerHTML ).to.equal('<div custom-attribute="test"><p>{{test}}</p></div>')

			})

			new HyperboneView({ 
				model: test, 
				el : html.els[0],
				initialised : function(){

					expect( html.find('p').text() ).to.equal('Hello');
					done();

				}
			});

		});

	});

	describe("Extensions API", function(){

		it("has a use method", function(){

			expect(hyperboneView.use).to.be.a('function');

		});

		it('takes an object containing custom attribute handlers', function( done ){

			var html, test, extension;

			html = dom('<div test="wally"><p>Hello</p></div>');
			test = new Model({});

			extension = {
				attributeHandlers : {
					"test" : function(node, prop, cancel){
						expect( prop ).to.equal('wally')
						done();
					}
				}
			};

			hyperboneView.use(extension);

			new hyperboneView.HyperboneView({
				model : test,
				el : html.els[0]
			});

		});

		it('takes an object containing custom template helpers', function( done ){

			var html, test, extension;

			html = dom('<div><p>{{test(fine)}}</p></div>');
			test = new Model({
				fine : 'young cannibals'
			});

			extension = {
				templateHelpers : {
					"test" : function( str ){
						expect( str ).to.equal('young cannibals')
						done();
					}
				}
			};

			hyperboneView.use(extension);

			new hyperboneView.HyperboneView({
				model : test,
				el : html.els[0]
			});

		});

	});

describe("hb-with-command", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("successfully binds properties to a form", function(){

			var html, m;

			html = dom('<div><form hb-with-command="do-something"><input name="username"><input name="password"><input type="submit" value="Submit"></form></div>');

			m = new Model( utils.useFixture('simple') );

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			expect( m.command('do-something').get('properties.username') ).to.equal('');
			expect( m.command('do-something').get('properties.password') ).to.equal('');
			
			m.command('do-something').set('properties.username', "Hello");
			m.command('do-something').set('properties.password', "World");

			expect( html.find('input[name="username"]').val() ).to.equal("Hello");
			expect( html.find('input[name="password"]').val() ).to.equal("World");

		});

		it("issues a submit:cmds:do-something when user clicks submit", function( done ){

			var html, m;

			html = dom('<div><form hb-with-command="do-something"><input name="username"><input name="password"><input type="submit" id="submit" value="Submit"></form></div>');

			m = new Model( utils.useFixture('simple') );

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			m.command('do-something').set('properties.username', 'Hello world');

			m.on('submit:do-something', function(cmd){
				// verify we're getting the command model back
				expect(cmd.get('properties').get('username')).to.equal('Hello world');
				done();

			});

			utils.simulateClick(html.find('#submit'));

		});

		it("issues a change:do-something event when the user changes an input value", function( done ){

			var html, m;

			html = dom('<div><form hb-with-command="do-something"><input name="username"><input name="password"><input type="submit" value="Submit"></form></div>');

			m = new Model( utils.useFixture('simple') );

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			m.on('change:do-something', function(cmd){

				expect(cmd.isHyperbone).to.equal(true);
				done();

			});

			utils.setValueAndTrigger(html.find('[name="username"]'), 'Hello world', 'change');

		});

		it("successfully binds inputs in a form to properties", function( done ){

			var html, m;

			html = dom('<div><form hb-with-command="do-something"><input name="username"><input name="password"><input type="submit" value="Submit"></form></div>');

			m = new Model( utils.useFixture('simple') );

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			m.on('change:do-something', function( cmd ){

				expect( m.command('do-something').get('properties.username') ).to.equal("Hello");
				done();
			});

			utils.setValueAndTrigger(html.find('[name="username"]'), "Hello", 'change');

		});

		it('can populate the options of a select with an appropriate schema', function(){

			var html, m;

			html = dom('<div><form hb-with-command="with-select"><select name="select-input"></select></form></div>');

			m = new Model({
				_commands : {
					'with-select' : {
						href : "/",
						method : "POST",
						properties : {
							'select-input' : '1'
						},
						schema : {
							'select-input' : {
								options : [
									{
										name : 'One',
										value : '1'
									},
									{
										name : 'Two',
										value : '2'
									},
									{
										name : 'Three',
										value : '3'
									}
								]
							}
						}

					}
				}
			});

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			expect( html.find('option').length() ).to.equal(3);
			expect( html.find('option').first().els[0].selected ).to.equal(true);
			expect( html.find('option').first().attr('value')).to.equal('1');
			expect( html.find('option').first().text() ).to.equal('One');

			expect( html.find('option').at(1).els[0].selected ).to.equal(false);
			expect( html.find('option').at(1).attr('value')).to.equal('2');
			expect( html.find('option').at(1).text() ).to.equal('Two');

			expect( html.find('option').at(2).els[0].selected ).to.equal(false);
			expect( html.find('option').at(2).attr('value')).to.equal('3');
			expect( html.find('option').at(2).text() ).to.equal('Three');	

		});

		it('can automatically set an input to required with the appropriate schema', function(){

			var html, m;

			html = dom('<div><form hb-with-command="with-required"><label for="required-input">Required Input</label><input name="required-input"></form></div>');

			m = new Model({
				_commands : {
					'with-required' : {
						href : "/",
						method : "POST",
						properties : {
							'required-input' : 'Hello'
						},
						schema : {
							'required-input' : {
								required : "required"
							}
						}

					}
				}
			});

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			expect( html.find('input').attr('required') ).to.equal('required');
			expect( html.find('label').hasClass('required')).to.equal(true);

		});

		it('gets the "checked" value of checkbox input from the schema', function(){

			var html, m;

			html = dom('<div><form hb-with-command="with-required"><label for="checkbox-input">Checkbox Input</label><input type="checkbox" name="checkbox-input"></form></div>');

			m = new Model({
				_commands : {
					'with-required' : {
						href : "/",
						method : "POST",
						properties : {
							'checkbox-input' : true
						},
						schema : {
							'checkbox-input' : {
								type : 'html-checkbox',
								value : "true" // the default is 'on'. 
							}
						}

					}
				}
			});

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			expect( html.find('input').attr('value') ).to.equal("true");
			expect( html.find('input').els[0].checked ).to.equal(true);
			expect( html.find('input').val() ).to.equal("true");
			
			m.setCommandProperty('with-required.checkbox-input', false);

			expect( html.find('input').els[0].checked ).to.equal(false);
			expect( html.find('input').val() ).to.equal(false);


		});

		describe('hb-sync-with', function(){

			it('can synchronise a command property with an attribute on the parent model', function( done ){

				var html, m;

				html = dom('<div><form hb-with-command="do-something"><input name="username" hb-sync-with="username"><input name="password"><input type="submit" value="Submit"></form></div>');

				m = new Model( utils.useFixture('simple') );

				new HyperboneView({
					model : m,
					el : html.els[0]
				});

				m.on('change:username', function( cmd ){

					expect( m.get('username') ).to.equal('Transformed');
					done();
				});

				utils.setValueAndTrigger(html.find('[name="username"]'), "Transformed", 'change');


			});

		});

		describe('if-property', function(){

			it('can show/hide form fields depending on whether the property exists', function(){

				var html, m;

				html = dom('<div><form hb-with-command="do-something"><input name="username" hb-sync-with="username"><input name="password"><span id="to-be-turned-invisible" if-property="invisible"><input name="invisible"></span><input type="submit" value="Submit"></form></div>');

				m = new Model( utils.useFixture('simple') );

				new HyperboneView({
					model : m,
					el : html.els[0]
				});

				expect( html.find('#to-be-turned-invisible').els[0].style.display ).to.equal('none');

			});

			it('toggles dynamically depending', function(){

				var html, m;

				html = dom('<div><form hb-with-command="do-something"><input name="username" hb-sync-with="username"><input name="password"><span id="to-be-turned-invisible" if-property="invisible"><input name="invisible"></span><input type="submit" value="Submit"></form></div>');

				m = new Model( utils.useFixture('simple') );

				new HyperboneView({
					model : m,
					el : html.els[0]
				});

				expect( html.find('#to-be-turned-invisible').els[0].style.display ).to.equal('none');

				m.reinit( utils.useFixture('simple-extended') );

				expect( html.find('#to-be-turned-invisible').els[0].style.display ).to.not.equal('none');

				m.reinit( utils.useFixture('simple') );
				
				expect( html.find('#to-be-turned-invisible').els[0].style.display ).to.equal('none');

			});

		});
	});

	describe('Async hb-with-command', function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it('can bind to a command that appears after view initialised', function(){

			var html, m;

			html = dom('<div><form hb-with-command="do-something"><input name="username"><input name="password"><input type="submit" value="Submit"></form></div>');

			// no command yet...
			m = new Model({});

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			// first, the form should be hidden
			expect( html.find('form').els[0].style.display ).to.equal('none');
			expect( html.find('form').is('.bound-to-command')).to.equal(false);

			// now we add the command to teh model with a reinit
			m.reinit( utils.useFixture('simple') );

			expect( html.find('form').els[0].style.display ).to.not.equal('none');
			expect( html.find('form').is('.bound-to-command') ).to.equal(true);

		});

		it('can unbind a form if the command disappears', function(){

			var html, m;

			html = dom('<div><form hb-with-command="do-something"><input name="username"><input name="password"><input type="submit" value="Submit"></form></div>');

			// no command yet...
			m = new Model( utils.useFixture('simple') );

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			expect( html.find('form').els[0].style.display ).to.not.equal('none');
			expect( html.find('form').is('.bound-to-command') ).to.equal(true);

			// first, the form should be hidde

			// now we add the command to teh model with a reinit
			m.reinit({
				_commands : {}
			});

			expect( html.find('form').els[0].style.display ).to.equal('none');
			expect( html.find('form').is('.bound-to-command')).to.equal(false);


		});


		it('can bind, unbind, rebind...', function( done ){

			var html, m;

			html = dom('<div><form hb-with-command="do-something"><input name="username"><input name="password"><input type="submit" value="Submit"></form></div>');

			// no command yet...
			m = new Model( utils.useFixture('simple') );

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			expect( html.find('form').els[0].style.display ).to.not.equal('none');
			expect( html.find('form').is('.bound-to-command') ).to.equal(true);

			// first, the form should be hidde

			// now we add the command to teh model with a reinit
			m.reinit({
				_commands : {}
			});

			expect( html.find('form').els[0].style.display ).to.equal('none');
			expect( html.find('form').is('.bound-to-command')).to.equal(false);

			m.reinit(utils.useFixture('simple'));

			expect( html.find('form').els[0].style.display ).to.not.equal('none');
			expect( html.find('form').is('.bound-to-command') ).to.equal(true);	
				
			m.on('change:do-something', function(cmd){

				expect(cmd.isHyperbone).to.equal(true);
				done();

			});

			utils.setValueAndTrigger(html.find('[name="username"]'), 'Hello world', 'change');

		});

	});

	describe("if-command and if-not-command", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it('Hides and shows an element correctly if a command exists or not', function(){


			var html, m;

			html = dom('<div><p if-command="do-something">Do something command exists!</div>');

			// no command yet...
			m = new Model( utils.useFixture('simple') );

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			expect( html.find('p').els[0].style.display ).to.not.equal('none');

			m.reinit({
				_commands : {}
			});

			expect( html.find('p').els[0].style.display ).to.equal('none');

			m.reinit( utils.useFixture('simple'));

			expect( html.find('p').els[0].style.display ).to.not.equal('none');

		});

		it('Hides and shows an element correctly if a command exists or not', function(){


			var html, m;

			html = dom('<div><p if-not-command="do-something">Do Something command doesn\'t exist!</div>');

			// no command yet...
			m = new Model( utils.useFixture('simple') );

			new HyperboneView({
				model : m,
				el : html.els[0]
			});

			expect( html.find('p').els[0].style.display ).to.equal('none');

			m.reinit({
				_commands : {}
			});

			expect( html.find('p').els[0].style.display ).to.not.equal('none');

			m.reinit( utils.useFixture('simple'));

			expect( html.find('p').els[0].style.display ).to.equal('none');

		});

	});

	// Tests for bugs that have emerged

	describe("Issues", function(){

		var HyperboneView = hyperboneView.HyperboneView;

		it("doesn't crash when template uses hb-with for non-existent collection", function(){

			var html, test, view;

			html = dom('<ul hb-with="not-in-model"><li>{{Name}}</li></ul>');
			test = new Model({
			});

			expect(function(){
				new HyperboneView({
					model : test,
					el : html.els[0]
				});
			}).to.not.throw();

		});

		it("does, however, pick up the collection/model once its added", function(){

			var html, test, view;

			html = dom('<ul hb-with="not-in-model"><li>{{Name}}</li></ul>');
			test = new Model({
			});

			expect(function(){
				new HyperboneView({
					model : test,
					el : html.els[0]
				});
			}).to.not.throw();

			test.set('not-in-model', [{ Name : 'well done'}]);

			expect( html.find('li').text() ).to.equal('well done');

		});

		it("defaults to a collection for a non-existent property for hb-with", function(){

			var html, test, view;

			html = dom('<ul hb-with="not-in-model"><li>{{Name}}</li></ul>');
			test = new Model({
			});

			new HyperboneView({
				model : test,
				el : html.els[0]
			});

			expect(test.get('not-in-model').models).to.be.ok;

		});

		it('doesnt destroy text nodes if the result of a template is a totally empty string (issue #3)', function(){

			var html, test, view;

			html = dom('<p>{{empty}}</p>');
			test = new Model({
				empty : ''
			});

			new HyperboneView({
				model : test,
				el : html.els[0]
			});

			expect( html.text() ).to.equal('\u200b');

			test.set('empty', 'not empty');

			expect( html.text() ).to.equal('not empty');			

		});

		it('doesnt ignore the second use of hb-with in the same scope when added later (issue #1)', function(){

			var html, test, view;

			html = dom('<section><p hb-with="spans"><span>1: {{name}}</span></p><p hb-with="spans"><span>2: {{name}}</span></p></section>');
			test = new Model({
				spans : [
				]
			});

			new HyperboneView({
				model : test,
				el : html.els[0]
			});

			test.get('spans').add({ name : "test 1"});

			expect( html.find('p').at(0).text() ).to.equal('1: test 1');
			expect( html.find('p').at(1).text() ).to.equal('2: test 1');

		});

		it('can recognise use of somehelper(model.get("attribute")), subscribes to right event', function(){

			var html, test, view;

			html = dom("<section>{{test(model.get('thing'))}}</section>");

			hyperboneView.use({
				templateHelpers : {
					'test' : function(val){
						return val;
					}
				}
			});

			test = new Model({
				thing : "some value"
			});

			new HyperboneView({
				model : test,
				el : html.els[0]
			});

			test.set('thing', 'some other value', {silent : true});

			test.trigger('change:thing');

			expect( html.text() ).to.equal('some other value');

		})

		it('subscribes to rel change events when using url() or rel()', function(){

			var html, test, view;

			html = dom("<section><p>{{url()}}</p><p>{{rel('test')}}</p></section>");

			hyperboneView.use({
				templateHelpers : {
					'test' : function(val){
						return val;
					}
				}
			});

			test = new Model({
				_links : {
					self : {
						href : '/test'
					},
					test : {
						href : '/other'
					}
				}
			});

			new HyperboneView({
				model : test,
				el : html.els[0]
			});

			expect( html.find('p').first().text()).to.equal('/test');
			expect( html.find('p').last().text()).to.equal('/other');

			test.set({
				_links : {
					self : {
						href : '/moved'
					},
					test : {
						href : "/also-moved"
					}
				}
			})

			expect( html.find('p').first().text()).to.equal('/moved');
			expect( html.find('p').last().text()).to.equal('/also-moved');

		})

	})


});