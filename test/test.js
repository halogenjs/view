
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

	describe("Generating elements", function(){

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
			
				gen.partial(
					m.get("properties")
				).find('input').els[0].outerHTML
		
			).to.equal('<input type="text" name="text-test" value="some text">');

		});

	});
})