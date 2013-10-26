
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

});