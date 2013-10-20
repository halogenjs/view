
describe("suite", function(){



	describe("Environment", function(){

		it("Environment", function(){

			should.exist(dom);
			should.exist(useFixture);
			should.exist(fixtures);
			should.exist(Model);
			should.exist(setValueAndTrigger);
			should.exist(require('hyperbone-form'));

		});

	});

	describe("Generating html with traverse", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		it("creates void elements", function(){

			var gen = new HyperboneForm();
			var m = new Model({
				properties : [
					{
						input : {
							type : "text",
							name : "text-test",
							value : "some text"
						}
					}
				]
			});

			var html = gen.traverse( m.get("properties") ).find('input');

			expect( html.val() ).to.equal('some text');
			expect( html.attr('name') ).to.equal('text-test');

		});

		it("doesn't add _label as an attribute", function(){

			var gen = new HyperboneForm();
			var m = new Model({
				properties : [
					{
						input : {
							type : "text",
							name : "text-test",
							value : "some text",
							_label : "Some label"
						}
					}
				]
			});

			var html = gen.traverse( m.get("properties") ).find('input');
		
			expect( html.attr('_label') ).to.be.null;

		});

		it("creates non-void elements", function(){

			var gen = new HyperboneForm();
			var m = new Model({
				properties : [
					{
						legend : {
							_text : "Some text"
						}
					}
				]
			});

			expect(
			
				gen.traverse(
					m.get("properties")
				).find('legend').els[0].outerHTML
		
			).to.equal('<legend>Some text</legend>');

		});

		it("creates nested elements", function(){

			var gen = new HyperboneForm();
			var m = new Model({
				properties : [
					{
						fieldset : [
							{
								legend : {
									_text : "Some text"
								}
							},
							{
								input : {
									name : "text-input",
									value : "I have some text"
								}
							}
						]
					}

				]
			});

			var html = gen.traverse( m.get("properties") ).find('fieldset')

			expect( html.find('legend').text() ).to.equal('Some text'); 
			expect( html.find('input').val() ).to.equal('I have some text');

		});

		it("supports _options for adding option elements to selects", function(){

			var gen = new HyperboneForm();
			var m = new Model({
				properties : [
					{
						select : {
							name : "select",
							value : "1",
							_options : [
								{
									optgroup : {
										label : "Some options",
										_options : [
											{
												option : {
													_text : "Option 1",
													value : "1"
												}
											},
											{
												option : {
													_text : "Option 2",
													value : "2"
												}
											}
										]
									}
								},
								{
									option : {
											_text : "Option 3",
											value : "3"
										}
								}
							]

						}
					}

				]
			});

			var html = gen.traverse( m.get("properties") ).find('select');

			expect( html.find('option').length() ).to.equal(3);
			expect( html.find('optgroup').length() ).to.equal(1);

			expect( html.find('optgroup').find('option').length() ).to.equal(2);
			expect( html.val() ).to.equal("1");

		});

		it("correctly generates a multi select with the correct value", function(){

			var gen = new HyperboneForm();
			var m = new Model({
				properties : [
					{
						select : {
							name : "select",
							multiple : "multiple",
							value : ["1", "2"],
							_options : [
								{
									optgroup : {
										label : "Some options",
										_options : [
											{
												option : {
													_text : "Option 1",
													value : "1"
												}
											},
											{
												option : {
													_text : "Option 2",
													value : "2"
												}
											}
										]
									}
								},
								{
									option : {
											_text : "Option 3",
											value : "3"
										}
								}
							]

						}
					}

				]
			});

			var html = gen.traverse( m.get("properties") ).find('select');

			expect( html.val() ).to.deep.equal(["1", "2"]);

		});


		it("Can generate a array of checkboxes with a single label using 'checkboxes'", function(){

			var gen = new HyperboneForm();
			var m = new Model({

				properties : [
					{
						checkboxes : {
							_label : "An array of checkboxes",
							name : "checkboxes",
							_options : [
								{
									value : "1",
									checked : "checked",
									_label : "Option One?"
								},
								{
									value : "2",
									_label : "Option Two?"
								}
							]
						}						
					}
				]

			});

			var html = gen.traverse( m.get("properties") ).find('input');

			expect( html.at(0).attr('value') ).to.equal('1');
			expect( html.at(0).attr('name') ).to.equal('checkboxes');

			expect( html.at(1).attr('value') ).to.equal('2');
			expect( html.at(1).attr('name') ).to.equal('checkboxes');

			expect( html.at(0).val() ).to.equal( '1' );	
			expect( html.at(1).val() ).to.equal( false );
		});

		it("Can generate a array of radio buttons with a single label using 'radios'", function(){

			var gen = new HyperboneForm();
			var m = new Model({

				properties : [
					{
						radios : {
							_label : "An array of radio buttons",
							name : "radios",
							_options : [
								{
									value : "1",
									checked : "checked",
									_label : "Option One"
								},
								{
									value : "2",
									_label : "Option Two"
								}
							]
						}						
					}
				]

			});

			var html = gen.traverse( m.get("properties") ).find('input');

			expect( html.at(0).attr('value') ).to.equal('1');
			expect( html.at(0).attr('name') ).to.equal('radios');

			expect( html.at(1).attr('value') ).to.equal('2');
			expect( html.at(1).attr('name') ).to.equal('radios');

			expect( html.at(0).val() ).to.equal( '1' );	
			expect( html.at(1).val() ).to.equal( false );

		});

		it("Can generate a huge default form with at least one of everything", function(){

			var gen = new HyperboneForm();
			var m = new Model( useFixture('/everything') );

			var html = gen.traverse( m.control("controls:test"), 'form');

			expect( html.attr('action') ).to.equal('/tasklist/create');
			expect( html.attr('method') ).to.equal('POST');

			expect( html.find('input').length() ).to.equal(8);
			expect( html.find('select').length() ).to.equal(2);
			expect( html.find('fieldset').length() ).to.equal(5);
			expect( html.find('legend').length() ).to.equal(5);
			expect( html.find('option').length() ).to.equal(11);
			expect( html.find('optgroup').length() ).to.equal(2);
			expect( html.find('textarea').length() ).to.equal(3);

		});

		it("Sets the value of attributes correctly", function(){

			var gen = new HyperboneForm();
			var m = new Model( useFixture('/everything') );

			var html = gen.traverse( m.control("controls:test"), 'form');

			expect( html.find('input[name="text-input"').val() ).to.equal("I am some text");
			expect( html.find('select[name="select-input"').val() ).to.equal("1");
			expect( html.find('select[name="select-multiple-input"').val() ).to.deep.equal(["2", "3"]);

		});

	});

	describe("Using controls", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		it("accepts a control as a constructor parameter and automatically generates initial HTML",function(){

			var m = new Model( useFixture('/everything'))

			var control = new HyperboneForm( m.control("controls:test") );

			var html = control.html;

			expect( html.attr('action') ).to.equal('/tasklist/create');
			expect( html.attr('method') ).to.equal('POST');

			expect( html.find('input').length() ).to.equal(8);
			expect( html.find('select').length() ).to.equal(2);
			expect( html.find('fieldset').length() ).to.equal(5);
			expect( html.find('legend').length() ).to.equal(5);
			expect( html.find('option').length() ).to.equal(11);
			expect( html.find('optgroup').length() ).to.equal(2);
			expect( html.find('textarea').length() ).to.equal(3);

		});


	});

	describe("Transformers", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		it("can transform form to standard tableless layout with line breaks and labels", function(){

			var m = new Model( useFixture('/everything') );
			var gen = new HyperboneForm( m.control("controls:test") );

			var html = gen.toHTML();

			expect( html.attr('action') ).to.equal('/tasklist/create');
			expect( html.attr('method') ).to.equal('POST');

			expect( html.find('input').length() ).to.equal(8);
			expect( html.find('select').length() ).to.equal(2);
			expect( html.find('fieldset').length() ).to.equal(5);
			expect( html.find('legend').length() ).to.equal(5);
			expect( html.find('option').length() ).to.equal(11);
			expect( html.find('optgroup').length() ).to.equal(2);
			expect( html.find('textarea').length() ).to.equal(3);

			expect( html.find('label').length() ).to.equal(19); 
			expect( html.find('br').length() ).to.equal(15); 

			expect( html.find('label').first().text() ).to.equal("Free text");
			expect( html.find('label').at(3).text() ).to.equal("Checkbox options");
			expect( html.find('label').at(4).text() ).to.equal(" One");
	
		});

		it("can transform form to Bootstrap 2 Horizontal Form", function(){

			var m = new Model( useFixture('/everything') );
			var gen = new HyperboneForm( m.control("controls:test") );

			var html = gen.toBootstrap2HTML();

			expect( html.attr('action') ).to.equal('/tasklist/create');
			expect( html.attr('method') ).to.equal('POST');

			expect( html.find('input').length() ).to.equal(8);
			expect( html.find('select').length() ).to.equal(2);
			expect( html.find('fieldset').length() ).to.equal(5);
			expect( html.find('legend').length() ).to.equal(5);
			expect( html.find('option').length() ).to.equal(11);
			expect( html.find('optgroup').length() ).to.equal(2);
			expect( html.find('textarea').length() ).to.equal(3);

			expect( html.find('label.control-label').length() ).to.equal(13); 
			expect( html.find('label.checkbox').length() ).to.equal(1); 
			expect( html.find('label.radio').length() ).to.equal(1); 
			expect( html.find('div.control-group').length() ).to.equal(15); 

			expect( html.find('label').first().text() ).to.equal("Free text");
			expect( html.find('label').at(3).text() ).to.equal("Checkbox options");
			expect( html.find('label').at(4).text() ).to.equal(" One");
		});

	});

	describe("Two way binding", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		describe("input", function(){

			it("automatically updates the form value when the model changes", function(){

				var m = new Model({
					properties : [
						{
							fieldset : [
								{
									input : {
										type : "text",
										value : "lol",
										name : "text-input"
									}
								}
							]
						}
					]

				});

				var html = new HyperboneForm().traverse( m.get("properties") );

				expect( html.find('input[name="text-input"]').val() ).to.equal("lol");

				m.set("properties[0].fieldset[0].input.value", "rofl");

				expect( html.find('input[name="text-input"]').val() ).to.equal("rofl");


			});

			it("automatically updates the model when the form value is changed", function( done ){

				var m = new Model({
					properties : [
						{
							fieldset : [
								{
									input : {
										type : "text",
										value : "lol",
										name : "text-input"
									}
								}
							]
						}
					]

				});

				var html = new HyperboneForm().traverse( m.get("properties") );

				expect( m.get("properties[0].fieldset[0].input.value") ).to.equal("lol");

				setValueAndTrigger( html.find('input'), "rofl", "change");

				setTimeout(function(){

					expect( m.get("properties[0].fieldset[0].input.value") ).to.equal("rofl");
					done();

				},50);


			});
			
		});

		describe("select", function(){

			it("automatically updates the form value when the model changes", function(){

				var m = new Model({
					properties : [
						{
							fieldset : [
								{
									select : {
										name : "select-input",
										value : "1",
										_options : [
											{
												option : {
													value : "1"
												}
											},
											{
												option : {
													value : "2"
												}
											},
											{
												option : {
													value : "3"
												}
											}							
										]
									}
								}
							]
						}
					]

				});

				var html = new HyperboneForm().traverse( m.get("properties") );

				expect( html.find('select[name="select-input"]').val() ).to.equal("1");

				m.set("properties[0].fieldset[0].select.value", "2");

				expect( html.find('select[name="select-input"]').val() ).to.equal("2");

			});

			it("automatically updates the model when the form value is changed", function( done ){

				var m = new Model({
					properties : [
						{
							fieldset : [
								{
									select : {
										name : "select-input",
										value : "1",
										_options : [
											{
												option : {
													value : "1"
												}
											},
											{
												option : {
													value : "2"
												}
											},
											{
												option : {
													value : "3"
												}
											}							
										]
									}
								}
							]
						}
					]

				});

				var html = new HyperboneForm().traverse( m.get("properties") );

				expect( m.get("properties[0].fieldset[0].select.value") ).to.equal("1");

				setValueAndTrigger( html.find('select'), "2", "change");

				setTimeout(function(){

					expect( m.get("properties[0].fieldset[0].select.value") ).to.equal("2");
					done();

				},50);

			});
			
		});

		describe("textarea", function(){

			it("automatically updates the form value when the model changes", function(){

				var m = new Model({
					properties : [
						{
							fieldset : [
								{
									textarea : {
										name : "select-input",
										value : "This is some wacky shit right here"
									}
								}
							]
						}
					]

				});

				var html = new HyperboneForm().traverse( m.get("properties") );

				expect( html.find('textarea').val() ).to.equal("This is some wacky shit right here");

				m.set("properties[0].fieldset[0].textarea.value", "Excuse me. Have you seen Colin Baker's bottom?");

				expect( html.find('textarea').val() ).to.equal("Excuse me. Have you seen Colin Baker's bottom?");

			});

			it("automatically updates the model when the form value is changed", function( done ){

				var m = new Model({
					properties : [
						{
							fieldset : [
								{
									textarea : {
										name : "select-input",
										value : "This is some wacky shit right here"
									}
								}
							]
						}
					]

				});

				var html = new HyperboneForm().traverse( m.get("properties") );

				expect( m.get("properties[0].fieldset[0].textarea.value") ).to.equal("This is some wacky shit right here");

				setValueAndTrigger( html.find('textarea'), "Excuse me. Have you seen Colin Baker's bottom?", "change");

				setTimeout(function(){

					expect( m.get("properties[0].fieldset[0].textarea.value") ).to.equal("Excuse me. Have you seen Colin Baker's bottom?");
					done();

				},50);

			});
			
		});


	});

	describe("Form serialisation", function(){


	});

});