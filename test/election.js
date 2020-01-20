var Election = artifacts.require("./Election.sol")
//posibilitatea de a interactiona cu contractul, crearea unui artefact

contract("Election", function(accounts){
	var electionInstance;

	it("initialize 2 candidates", function(){
			//it mocha library
		return Election.deployed().then(function(instance){
			return instance.candidatesCount();
		}).then(function(count){
			assert.equal(count, 2);
			//from chai framework
			//testam daca exista 2 candidati
		});
	});

	it("it initializes the candidates with the correct values", function() {
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.candidates(1);
			//apelul este asincron, deci returnam un promise ca in JS pentru functia de call back; 
			//acest candidates din electionInstance vine din mapper--ul
		}).then(function(candidate){
			assert.equal(candidate[0], 1, "contains correct id"); //id
			assert.equal(candidate[1], "Candidate 1", "contains the correct name"); //numele
			assert.equal(candidate[2], 0, "contains the correct votes count"); //vote count
			return electionInstance.candidates(2);
		}).then(function(candidate){
			assert.equal(candidate[0], 2, "contains the correct id");
			assert.equal(candidate[1], "Candidate 2", "contains the correct name");
			assert.equal(candidate[2], 0, "contains the correct votes count");
		});
	});

	it("allows a voter to cast a vote", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, {from: accounts[0]});
		}).then(function(receipt){
			return electionInstance.voters(accounts[0]);
		}).then(function(voted){
			assert(voted, "voter marked as voted");
			return electionInstance.candidates(candidateId);
		}).then(function(candidate){
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "increments vote");
		})
	});
});