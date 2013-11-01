
describe("suite", function(){



	describe("Environment", function(){

		it("Environment", function(){

			should.exist(dom);
			should.exist(useFixture);
			should.exist(fixtures);
			should.exist(Model);
			should.exist(setValueAndTrigger);
			should.exist(require('hyperbone-view'));

		})

	})

	describe("Registering helpers", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("Can set a helper", function( done ){

			var view = new HyperboneView();

			view.addHelper('test',function(val){

				expect(val).to.equal("Hello world");
				done();

			});

			view.helpers['test']("Hello world");

		})


	})


	describe("Templates within Innertext", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("Can apply a model to template within innertext with property alias", function(){

			var html, test, view;

			html = dom('<p>{{test}}</p>');
			test = new Model({
				test : "Hello world"
			});

			view = new HyperboneView().create( html, test );

			expect( html.text() ).to.equal('Hello world');

		})

		it("Can apply a model to template within innertext with the get helper", function(){

			var html, test, view;

			html = dom('<p>{{get(test)}}</p>');
			test = new Model({
				test : "Hello world"
			});

			view = new HyperboneView().create( html, test )

			expect( html.text() ).to.equal('Hello world');

		});

		it("Can apply a model to template within innertext using a custom helper", function(){

			var html, test, view;

			html = dom('<p>{{uppercase(test)}}</p>');
			test = new Model({
				test : "Hello world"
			});

			view = new HyperboneView()
				.addHelper('uppercase', function( str ){ return str.toUpperCase(); })
				.create( html, test )

			expect( html.text() ).to.equal('HELLO WORLD');

		})

		it("Automatically updates the view when the model changes for alias", function(){

			var html, test, view;

			html = dom('<p>{{test}}</p>');
			test = new Model({
				test : "Hello world"
			});

			view = new HyperboneView().create( html, test );

			expect( html.text() ).to.equal('Hello world');

			test.set('test', 'Goodbye, cruel world');

			expect( html.text() ).to.equal('Goodbye, cruel world');

		});

		it("Automatically updates the view when the model changes for get helper", function(){

			var html, test, view;

			html = dom('<p>{{get(test)}}</p>');
			test = new Model({
				test : "Hello world"
			});

			view = new HyperboneView().create( html, test );

			expect( html.text() ).to.equal('Hello world');

			test.set('test', 'Goodbye, cruel world');

			expect( html.text() ).to.equal('Goodbye, cruel world');

		});

		it("Automatically updates the view when the model changes for custom helper", function(){

			var html, test, view;

			html = dom('<p>{{uppercase(test)}}</p>');
			test = new Model({
				test : "Hello world"
			});

			view = new HyperboneView()
				.addHelper('uppercase', function( str ){ return str.toUpperCase(); })
				.create( html, test )

			expect( html.text() ).to.equal('HELLO WORLD');

			test.set('test', 'Goodbye, cruel world');

			expect( html.text() ).to.equal('GOODBYE, CRUEL WORLD');			

		});


	});

	describe("Templates within attributes", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("Can apply a model to template within an attribute with property alias", function(){

			var html, test, view;

			html = dom('<p class="paragraph {{className}}">Hello world</p>');
			test = new Model({
				className : "active"
			});

			view = new HyperboneView().create( html, test );

			expect( html.attr('class') ).to.equal('paragraph active');

		});

		it("Can apply a model to template within an attribute with the get helper", function(){

			var html, test, view;

			html = dom('<p class="paragraph {{get(className)}}">Hello world</p>');
			test = new Model({
				className : "active"
			});

			view = new HyperboneView().create( html, test );

			expect( html.attr('class') ).to.equal('paragraph active');

		})

		it("Can apply a model to template within an attribute with a custom helper", function(){

			var html, test, view;

			html = dom('<p class="paragraph {{lowercase(className)}}">Hello world</p>');
			test = new Model({
				className : "ActIve"
			});

			view = new HyperboneView()
				.addHelper('lowercase', function( str ){ return str.toLowerCase(); })
				.create( html, test );

			expect( html.attr('class') ).to.equal('paragraph active');

		});

		it("Can automatically update the attribute when the model changes", function(){

			var html, test, view;

			html = dom('<p class="paragraph {{active}}">Hello world</p>');
			test = new Model({
				active : "active"
			});

			view = new HyperboneView().create( html, test );

			expect( html.attr('class') ).to.equal('paragraph active');

			test.set('active', 'inactive');

			expect( html.attr('class') ).to.equal('paragraph inactive');

		});

		it("Can automatically update the attribute with the get helper when the model changes", function(){

			var html, test, view;

			html = dom('<p class="paragraph {{get(active)}}">Hello world</p>');
			test = new Model({
				active : "active"
			});

			view = new HyperboneView().create( html, test );

			expect( html.attr('class') ).to.equal('paragraph active');

			test.set('active', 'inactive');

			expect( html.attr('class') ).to.equal('paragraph inactive');

		});

		it("Can automatically update the attribute with a custom helper when the model changes", function(){

			var html, test, view;

			html = dom('<p class="paragraph {{lowercase(active)}}">Hello world</p>');
			test = new Model({
				active : "ACTIVE"
			});

			view = new HyperboneView()
				.addHelper('lowercase', function( str ){ return str.toLowerCase(); })
				.create( html, test );

			expect( html.attr('class') ).to.equal('paragraph active');

			test.set("active", "INACTIVE")

			expect( html.attr('class') ).to.equal('paragraph inactive');


		});

	});

	describe("Arbitrary expressions", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("can do a sum if you like", function(){

			var html, test, view;

			html = dom('<div>{{expression(1 + 2)}}</div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				}
			});

			view = new HyperboneView()
				.addHelper('expression', function(params){

					return params;

				})
				.create( html, test );

			expect( html.text() ).to.equal('3');

		})

		it("can manually access attributes", function(){

			var html, test, view;

			html = dom('<div>{{expression( model.url() )}}</div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				}
			});

			view = new HyperboneView()
				.addHelper('expression', function(params){

					return params;

				})
				.create( html, test );

			expect( html.text() ).to.equal('/hyperlink');

		})

		it("can generally do evil horrible shit", function(){

			var html, test, view;

			html = dom('<div>{{expression( model.url() + ".xml" + (5 * 9) )}}</div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				}
			});

			view = new HyperboneView()
				.addHelper('expression', function(params){

					return params;

				})
				.create( html, test );

			expect( html.text() ).to.equal('/hyperlink.xml45');

		})

	});

	describe("Hypermedia extensions", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("Can get the link to self from built in url() helper", function(){

			var html, test, view;

			html = dom('<div><a href={{url()}}>Myself</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				}
			});

			view = new HyperboneView().create( html, test );

			expect( html.find('a').first().attr('href') ).to.equal('/hyperlink');

		})

		it("Can get the link to a rel from built in rel() helper", function(){

			var html, test, view;

			html = dom('<div><a href={{rel("some-rel")}}>Some rel</a></div>');
			test = new Model({
				_links : {
					"some-rel": {
						href :  "/hyperlink"
					}
				}
			});

			view = new HyperboneView().create( html, test );

			expect( html.find('a').first().attr('href') ).to.equal('/hyperlink');

		})

		it("Can add href to anchor tags where the rel is recognised", function(){

			var html, test, view;

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

			view = new HyperboneView().create( html, test );

			expect( html.find('a').first().attr('href') ).to.equal('/hyperlink');
			expect( html.find('a').last().attr('href') ).to.equal('/hyperlink.xml');

		})


	})	

	describe("Event delegates", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		// could really do with more extensive testing of this but really we're just testing DOM's event 
		// handler. I found the actual delegate stuff didn't work which is infuriating really.

		// Because the DOM is preserved and never just resplatted actual delegates aren't necessary. We can 
		// just use the selector to bind to the actual element. 

		it("Allows us to bind a callback to a dom event", function( done ){

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

			view = new HyperboneView();

			view.addDelegate({
				'click a[rel="self"]' : function(event){

					this.set('status', 'active');

					// test that we've actually done the work.
					expect( html.find('a').attr('class') ).to.equal('active');
					// test we're being passed the element wrapped in a dom object
					expect( test.get('status') ).to.equal('active');

					done();
				}
			}).create( html, test );

			simulateClick( html.find('a') );

		});

	});

	describe("Issues its own events", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		// could really do with more extensive testing of this but really we're just testing DOM's event 
		// handler. I found the actual delegate stuff didn't work which is infuriating really.

		// Because the DOM is preserved and never just resplatted actual delegates aren't necessary. We can 
		// just use the selector to bind to the actual element. 

		it("issues an 'initialised' event'", function( done ){

			html = dom('<div><a class="{{status}}" rel="self">Myself</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				},
				status : 'inactive'
			});

			view = new HyperboneView();

			view
				.on('initialised', function( el, model ){

					expect(model.get('status')).to.equal('inactive');

					done();

				})
				.create( html, test );

		});

		it("issues an 'updated' event", function( done ){

			html = dom('<div><a class="{{status}}" rel="self">Myself</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				},
				status : 'inactive'
			});

			view = new HyperboneView();

			view
				.on('updated', function( el, model, event ){

					expect(event).to.equal('change:status');
					expect(model.get('status')).to.equal('active');

					done();

				})
				.create( html, test );

			test.set('status', 'active');

		});

		it("issues an 'delegate-fired' event when a delegate is fired", function( done ){

			html = dom('<div><a class="{{status}}" rel="self">Myself</a></div>');
			test = new Model({
				_links : {
					self : {
						href : "/hyperlink"
					}
				},
				status : 'inactive'
			});

			view = new HyperboneView();

			var triggerCount = 0;

			view
				.addDelegate({
					'click a[rel="self"]' : function(event){

						this.set('status', 'active');

					}
				})
				.on('delegate-fired', function(el, model, selector){

					expect(++triggerCount).to.equal(1);

					expect(model.get('status')).to.equal('active');
					expect(selector).to.equal('click a[rel="self"]')

					done();

				})
				.create( html, test );

			simulateClick( html.find('a') );

		});

	});

	describe("Nested model handling", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("Can change scope to a nested model with hb-with attribute", function(){

			var html, test, view;

			html = dom('<div hb-with="embedded"><p>{{title}}</p></div>');
			test = new Model({
				embedded : {
					title : "Hello world"
				}
			});

			var view = new HyperboneView().create( html, test );

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

			var view = new HyperboneView()
				.on('updated', function(el, model, event){


					expect(event).to.equal("subview embedded change:title");
					expect(model.get('title')).to.equal('Test');
					done();

				})
				.create( html, test );

			expect(html.find('p').text()).to.equal('Hello world');

			test.set('embedded.title', 'Test');

			expect(html.find('p').text()).to.equal('Test');
			

		});

	});

	describe("Collection handling", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("Will iterate through a collection", function(){

			var html, test, view;

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

			var view = new HyperboneView().create( html, test );

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

			var view = new HyperboneView().create( html, test );

			expect( html.find('p').text() ).to.equal('Backbone style');

			view.on('updated', function(){

				expect( test.get("test") ).to.equal("Yay REST level 2 friendly!");
				expect( html.find('input').val() ).to.equal("Yay REST level 2 friendly!");
				expect( html.find('p').text() ).to.equal('Yay REST level 2 friendly!');
				done();

			})

			setValueAndTrigger( html.find('input'), "Yay REST level 2 friendly!", "change");

		});

		it("will bind a select", function( done ){

			var html, test, view;

			html = dom('<p class="{{test}}""><select hb-bind="test"><option value="backbone">Backbone</option><option value="knockout">Knockout</option><option value="angular">Angular</option></select></p>');
			test = new Model({
				test : "backbone"
			});

			var view = new HyperboneView().create( html, test );

			expect( html.find('select').val() ).to.equal('backbone');

			view.on('updated',function(){

				expect( test.get("test") ).to.equal("knockout");
				done();

			});

			setValueAndTrigger( html.find('select'), "knockout", "change");

		});

	});

	describe("Custom attribute handlers", function(){

		var HyperboneView = require('hyperbone-view').HyperboneView;

		it("will pass a node and all its contents to the custom attribute handler", function( done ){

			var html, test, view;

			html = dom('<div custom-attribute="test"><p>{{test}}</p></div>');
			test = new Model({
				test : "Hello"
			});

			var view = new HyperboneView()
				.addCustomAttributeHandler('custom-attribute', function( node, prop ){

					expect( prop ).to.equal('test');
					expect( this.model.get('test') ).to.equal('Hello');
					expect( node.outerHTML ).to.equal('<div custom-attribute="test"><p>{{test}}</p></div>')

				})
				.on('initialised', function(){

					expect( html.find('p').text() ).to.equal('Hello');
					done();

				})
				.create( html, test );
			

		});

	});


});