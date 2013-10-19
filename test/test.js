
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

			var inputs = gen.traverse( m.get("properties") )

			expect( inputs.find('input').els[0].outerHTML ).to.equal('<input type="checkbox" name="checkboxes" value="1" checked="checked">');
			expect( inputs.find('input').els[1].outerHTML ).to.equal('<input type="checkbox" name="checkboxes" value="2">');

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

			var inputs = gen.traverse( m.get("properties") )

			expect( inputs.find('input').els[0].outerHTML ).to.equal('<input type="radio" name="radios" value="1" checked="checked">');
			expect( inputs.find('input').els[1].outerHTML ).to.equal('<input type="radio" name="radios" value="2">');

		});

		it("Can generate a huge default form with at least one of everything", function(){

			var gen = new HyperboneForm();
			var m = new Model( useFixture('/everything') );

			expect(
				gen.traverse(
					m.control("controls:test"), 'form'
				).els[0].outerHTML
			).to.equal('<form action="/tasklist/create" method="POST" encoding="application/x-www-form-urlencoded"><fieldset><legend>Inputs (inc. checkbox)</legend><input type="text" name="text-input" value="I am some text" required="required" placeholder="Some default helptext"><input type="checkbox" name="checkbox-input" value="checked-1"><input type="radio" name="radio-input" value="radio-1" checked="checked"></fieldset><fieldset><legend>Checkboxes and radios (special)</legend><input type="checkbox" name="checkboxes" value="1" checked="checked"><input type="checkbox" name="checkboxes" value="2"><input type="radio" name="radios" value="1" checked="checked"><input type="radio" name="radios" value="2"></fieldset><fieldset><legend>Text area and labels</legend><textarea id="textarea-input-1" name="textarea-input-1">a lot of text goes here</textarea><textarea id="textarea-input-2" name="textarea-input-2">a lot of text goes here</textarea><textarea id="textarea-input-3" name="textarea-input-3">a lot of text goes here</textarea></fieldset><select name="select-input" value="1"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><select name="select-multiple-input" multiple="multiple"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2" selected="selected">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><button name="a-button" type="submit">A button!</button><fieldset><legend>Data list</legend><input list="browsers" name="datalisted"><datalist id="browsers"><option value="Internet Explorer"></option><option value="Mozilla Firefox"></option><option value="Google Chrome"></option></datalist></fieldset><fieldset><legend>Output</legend><output name="output-test" value="Hello"></output></fieldset></form>')
		
		});



	});

	describe("Using controls", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		it("accepts a control as a constructor parameter and automatically generates initial HTML",function(){

			var m = new Model( useFixture('/everything'))

			var control = new HyperboneForm( m.control("controls:test") );

			expect( control.control ).to.equal( m.control("controls:test") );
			expect( control.html.els[0].outerHTML ).to.equal('<form action="/tasklist/create" method="POST" encoding="application/x-www-form-urlencoded"><fieldset><legend>Inputs (inc. checkbox)</legend><input type="text" name="text-input" value="I am some text" required="required" placeholder="Some default helptext"><input type="checkbox" name="checkbox-input" value="checked-1"><input type="radio" name="radio-input" value="radio-1" checked="checked"></fieldset><fieldset><legend>Checkboxes and radios (special)</legend><input type="checkbox" name="checkboxes" value="1" checked="checked"><input type="checkbox" name="checkboxes" value="2"><input type="radio" name="radios" value="1" checked="checked"><input type="radio" name="radios" value="2"></fieldset><fieldset><legend>Text area and labels</legend><textarea id="textarea-input-1" name="textarea-input-1">a lot of text goes here</textarea><textarea id="textarea-input-2" name="textarea-input-2">a lot of text goes here</textarea><textarea id="textarea-input-3" name="textarea-input-3">a lot of text goes here</textarea></fieldset><select name="select-input" value="1"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><select name="select-multiple-input" multiple="multiple"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2" selected="selected">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><button name="a-button" type="submit">A button!</button><fieldset><legend>Data list</legend><input list="browsers" name="datalisted"><datalist id="browsers"><option value="Internet Explorer"></option><option value="Mozilla Firefox"></option><option value="Google Chrome"></option></datalist></fieldset><fieldset><legend>Output</legend><output name="output-test" value="Hello"></output></fieldset></form>')

		});


	});

	describe("Transformers", function(){

		var HyperboneForm = require('hyperbone-form').HyperboneForm;

		it("can transform form to standard tableless layout with line breaks and labels", function(){

			var m = new Model( useFixture('/everything') );
			var gen = new HyperboneForm( m.control("controls:test") );

			var html = gen.toHTML();

			expect( html.els[0].outerHTML ).to.equal('<form action="/tasklist/create" method="POST" encoding="application/x-www-form-urlencoded"><fieldset><legend>Inputs (inc. checkbox)</legend><label>Free text</label><input type="text" name="text-input" value="I am some text" required="required" placeholder="Some default helptext"><br><label>Checkbox 1</label><input type="checkbox" name="checkbox-input" value="checked-1"><br><label>Radio 1</label><input type="radio" name="radio-input" value="radio-1" checked="checked"><br></fieldset><fieldset><legend>Checkboxes and radios (special)</legend><label>Checkbox options</label><label><input type="checkbox" name="checkboxes" value="1" checked="checked"> One</label><br><label></label><label><input type="checkbox" name="checkboxes" value="2"> Two</label><br><label>Radio options</label><label><input type="radio" name="radios" value="1" checked="checked"> One</label><br><label></label><label><input type="radio" name="radios" value="2"> Two</label><br></fieldset><fieldset><legend>Text area and labels</legend><label>Big Text input</label><textarea id="textarea-input-1" name="textarea-input-1">a lot of text goes here</textarea><br><label>Big Text input 2</label><textarea id="textarea-input-2" name="textarea-input-2">a lot of text goes here</textarea><br><label>Big Text input 3</label><textarea id="textarea-input-3" name="textarea-input-3">a lot of text goes here</textarea><br></fieldset><label>select-input</label><select name="select-input" value="1"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><br><label>select-multiple-input</label><select name="select-multiple-input" multiple="multiple"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2" selected="selected">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select><br><label>a-button</label><button name="a-button" type="submit">A button!</button><br><fieldset><legend>Data list</legend><label>datalisted</label><input list="browsers" name="datalisted"><br><datalist id="browsers"><option value="Internet Explorer"></option><option value="Mozilla Firefox"></option><option value="Google Chrome"></option></datalist></fieldset><fieldset><legend>Output</legend><label>output-test</label><output name="output-test" value="Hello"></output><br></fieldset></form>');

		});

		it("can transform form to Bootstrap 2 Horizontal Form", function(){

			var m = new Model( useFixture('/everything') );
			var gen = new HyperboneForm( m.control("controls:test") );

			var html = gen.toBootstrap2HTML();

			expect( html.els[0].outerHTML ).to.equal('<form action="/tasklist/create" method="POST" encoding="application/x-www-form-urlencoded" class="form-horizontal"><fieldset><legend>Inputs (inc. checkbox)</legend><div class="control-group"><label class="control-label">Free text</label><div class="controls"><input type="text" name="text-input" value="I am some text" required="required" placeholder="Some default helptext"></div></div><div class="control-group"><div class="controls"><label class="checkbox"><input type="checkbox" name="checkbox-input" value="checked-1"> Checkbox 1</label></div></div><div class="control-group"><div class="controls"><label class="radio"><input type="radio" name="radio-input" value="radio-1" checked="checked"> Radio 1</label></div></div></fieldset><fieldset><legend>Checkboxes and radios (special)</legend><div class="control-group"><label class="control-label">Checkbox options</label><div class="controls"><label class="null"><input type="checkbox" name="checkboxes" value="1" checked="checked"> One</label></div></div><div class="control-group"><label class="control-label"></label><div class="controls"><label class="null"><input type="checkbox" name="checkboxes" value="2"> Two</label></div></div><div class="control-group"><label class="control-label">Radio options</label><div class="controls"><label class="null"><input type="radio" name="radios" value="1" checked="checked"> One</label></div></div><div class="control-group"><label class="control-label"></label><div class="controls"><label class="null"><input type="radio" name="radios" value="2"> Two</label></div></div></fieldset><fieldset><legend>Text area and labels</legend><div class="control-group"><label class="control-label">Big Text input</label><div class="controls"><textarea id="textarea-input-1" name="textarea-input-1">a lot of text goes here</textarea></div></div><div class="control-group"><label class="control-label">Big Text input 2</label><div class="controls"><textarea id="textarea-input-2" name="textarea-input-2">a lot of text goes here</textarea></div></div><div class="control-group"><label class="control-label">Big Text input 3</label><div class="controls"><textarea id="textarea-input-3" name="textarea-input-3">a lot of text goes here</textarea></div></div></fieldset><div class="control-group"><label class="control-label"></label><div class="controls"><select name="select-input" value="1"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select></div></div><div class="control-group"><label class="control-label"></label><div class="controls"><select name="select-multiple-input" multiple="multiple"><optgroup label="Options group 1"><option value="1">option 1</option><option value="2" selected="selected">option 2</option></optgroup><option value="3">option 3</option><option value="4">option 4</option></select></div></div><div class="control-group"><label class="control-label"></label><div class="controls"><button name="a-button" type="submit">A button!</button></div></div><fieldset><legend>Data list</legend><div class="control-group"><label class="control-label"></label><div class="controls"><input list="browsers" name="datalisted"></div></div><datalist id="browsers"><option value="Internet Explorer"></option><option value="Mozilla Firefox"></option><option value="Google Chrome"></option></datalist></fieldset><fieldset><legend>Output</legend><div class="control-group"><label class="control-label"></label><div class="controls"><output name="output-test" value="Hello"></output></div></div></fieldset></form>');

		});

	});

	describe("Form serialisation", function(){


	});

});