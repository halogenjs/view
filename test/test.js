
describe("suite", function(){



	describe("Environment", function(){

		it("Environment", function(){

			should.exist(dom);
			should.exist(useFixture);
			should.exist(fixtures);
			should.exist(Model);
			should.exist(setValueAndTrigger);
			should.exist(require('hyperbone-view'));
			should.exist(require('hyperbone-view').HyperboneView);
			should.exist(require('hyperbone-view').registerHelper);
			should.exist(require('hyperbone-view').registerAttributeHandler);

		})

	})


	describe("Templates within Innertext", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

			require('hyperbone-view').registerHelper('uppercase', function(str){ return str.toUpperCase(); });

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

			require('hyperbone-view').registerHelper('uppercase', function(str){ return str.toUpperCase(); })

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

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

			require('hyperbone-view').registerHelper('lowercase', function(str){ return str.toLowerCase() })

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

			require('hyperbone-view').registerHelper('lowercase', function(str){ return str.toLowerCase(); })

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

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

			setValueAndTrigger( html.find('input'), "Yay REST level 2 friendly!", "change");

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

			setValueAndTrigger( html.find('select'), "knockout", "change");

		});

	});

	describe("Built In Extensions", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

				simulateClick(html.find('button'));

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

				simulateClick(html.find('li').last());

			});

		});

	})

	describe("Custom attribute handlers", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("will pass a node and all its contents to the custom attribute handler", function( done ){

			var html, test, view;

			html = dom('<div custom-attribute="test"><p>{{test}}</p></div>');
			test = new Model({
				test : "Hello"
			});

			require('hyperbone-view').registerAttributeHandler('custom-attribute', function(node, prop, cancel){

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

		var hyperboneView = require('hyperbone-view');

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

	// Tests for bugs that have emerged

	describe("Issues", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

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

		})

	})


});