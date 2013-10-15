
describe("suite", function(){

	it("Environment", function(){

		should.exist($);
		should.exist(useFixture);
		should.exist(fixtures);
		should.exist(Model);
		should.exist(require('hyperbone-form'))

	})

})