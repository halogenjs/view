
describe("suite", function(){



	describe("Environment", function(){

		it("Environment", function(){

			should.exist($);
			should.exist(useFixture);
			should.exist(fixtures);
			should.exist(Model);
			should.exist(require('hyperbone-form'));

		});

	});

	describe("Generating html with traverse", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		it("creates input element", function(){

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

			expect(
			
				gen.traverse(
					m.get("properties")
				).find('input').els[0].outerHTML
		
			).to.equal('<input type="text" name="text-test" value="some text">');

		});

		it("creates doesn't add _label as an attribute", function(){

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

			expect(
			
				gen.traverse(
					m.get("properties")
				).find('input').els[0].outerHTML
		
			).to.equal('<input type="text" name="text-test" value="some text">');

		});

		it("creates legend element (with _text)", function(){

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

		it("can create a fieldset with nested inputs", function(){

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

			expect(
			
				gen.traverse(
					m.get("properties")
				).find('fieldset').els[0].outerHTML
		
			).to.equal('<fieldset><legend>Some text</legend><input name="text-input" value="I have some text"></fieldset>');

		});

		it("can deal with select with options and option groups", function(){

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

			expect(
			
				gen.traverse(
					m.get("properties")
				).find('select').els[0].outerHTML
		
			).to.equal('<select name="select" value="1"><optgroup label="Some options"><option value="1">Option 1</option><option value="2">Option 2</option></optgroup><option value="3">Option 3</option></select>');

		});

		it("Can generate a huge default form with at least one of everything", function(){

			var gen = new HyperboneForm();
			var m = new Model( useFixture('/everything') );

			expect(
				gen.traverse(
					m.control("controls:test"), 'form'
				).els[0].outerHTML
			).to.equal(
				'<form action="/tasklist/create" method="POST" encoding="application/x-www-form-urlencoded"><fieldset><legend>Inputs (inc. checkbox)</legend><input type="text" name="text-input" value="I am some text" required="required" placeholder="Some default helptext"><input type="checkbox" name="checkbox-input" value="checked-1"><input type="checkbox" name="checkbox-input" value="checked-2"><input type="checkbox" name="checkbox-input" value="checked-3"><input type="radio" name="radio-input" value="radio-1" checked="checked"><input type="radio" name="radio-input" value="radio-1" checked="checked"></fieldset><fieldset><legend>Text area and labels</legend><textarea id="textarea-input-1" name="textarea-input-1">a lot of text goes here</textarea><textarea id="textarea-input-2" name="textarea-input-2">a lot of text goes here</textarea><textarea id="textarea-input-3" name="textarea-input-3">a lot of text goes here</textarea></fieldset><select name="select-input" value="1"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><select name="select-multiple-input" multiple="multiple"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2" selected="selected">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><button name="a-button" type="submit">A button!</button><fieldset><legend>Data list</legend><input list="browsers"><datalist id="browsers"><option value="Internet Explorer"></option><option value="Mozilla Firefox"></option><option value="Google Chrome"></option></datalist></fieldset><fieldset><legend>Output</legend><output name="output-test" value="Hello"></output></fieldset></form>');

		})


	});

	describe("Using controls", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		it("accepts a control as a constructor parameter and automatically generates initial HTML",function(){

			var m = new Model( useFixture('/everything'))

			var control = new HyperboneForm( m.control("controls:test") );

			control.partials();

			expect( control.control ).to.equal( m.control("controls:test") );
			expect( control.html.els[0].outerHTML ).to.equal('<form action="/tasklist/create" method="POST" encoding="application/x-www-form-urlencoded"><fieldset><legend>Inputs (inc. checkbox)</legend><input type="text" name="text-input" value="I am some text" required="required" placeholder="Some default helptext"><input type="checkbox" name="checkbox-input" value="checked-1"><input type="checkbox" name="checkbox-input" value="checked-2"><input type="checkbox" name="checkbox-input" value="checked-3"><input type="radio" name="radio-input" value="radio-1" checked="checked"><input type="radio" name="radio-input" value="radio-1" checked="checked"></fieldset><fieldset><legend>Text area and labels</legend><textarea id="textarea-input-1" name="textarea-input-1">a lot of text goes here</textarea><textarea id="textarea-input-2" name="textarea-input-2">a lot of text goes here</textarea><textarea id="textarea-input-3" name="textarea-input-3">a lot of text goes here</textarea></fieldset><select name="select-input" value="1"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><select name="select-multiple-input" multiple="multiple"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2" selected="selected">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><button name="a-button" type="submit">A button!</button><fieldset><legend>Data list</legend><input list="browsers"><datalist id="browsers"><option value="Internet Explorer"></option><option value="Mozilla Firefox"></option><option value="Google Chrome"></option></datalist></fieldset><fieldset><legend>Output</legend><output name="output-test" value="Hello"></output></fieldset></form>')

		});


	});

	describe("Automatic build up of references to useful bits of the form", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		it("can get a reference to individual field input models", function(){

			var gen = new HyperboneForm();
			var m = new Model( useFixture('/everything') );

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
				
			gen.traverse( m.get("properties") );

			expect( gen.models("text-test") ).to.equal( m.get("properties[0].input") );

		});

		it("can get array of models for ", function(){

			var gen = new HyperboneForm();
			var m = new Model( useFixture('/everything') );

			var gen = new HyperboneForm();
			var m = new Model({
				properties : [
					{
						input : {
							type : "checkbox",
							name : "check-test",
							value : "some value"
						}
					},
					{
						input : {
							type : "checkbox",
							name : "check-test",
							value : "some other value"
						}
					}
				]
			});
				
			gen.traverse( m.get("properties") );

			expect( gen.models("check-test") ).to.deep.equal( [m.get("properties[0].input"), m.get("properties[1].input")] );

		});

		it("can get a reference to a generated html partial", function(){

			var gen = new HyperboneForm();
			var m = new Model( useFixture('/everything') );

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
				
			gen.traverse( m.get("properties") );

			expect( gen.partials("text-test").els[0].outerHTML ).to.equal('<input type="text" name="text-test" value="some text">');

		});

		it("can get array of models for ", function(){

			var gen = new HyperboneForm();
			var m = new Model( useFixture('/everything') );

			var gen = new HyperboneForm();
			var m = new Model({
				properties : [
					{
						input : {
							type : "checkbox",
							name : "check-test",
							value : "some value"
						}
					},
					{
						input : {
							type : "checkbox",
							name : "check-test",
							value : "some other value"
						}
					}
				]
			});
				
			var form = gen.traverse( m.get("properties") );

			var partials = gen.partials("check-test");

			expect( partials.els[0].outerHTML ).to.equal('<input type="checkbox" name="check-test" value="some value">');
			expect( partials.els[1].outerHTML ).to.equal('<input type="checkbox" name="check-test" value="some other value">');

		});


	});

	describe("Form serialisation", function(){


	});

});