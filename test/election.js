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
			assert.equal(receipt.logs.length, 1, "event was triggered");
			assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
			assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the vote was correct");
			return electionInstance.voters(accounts[0]);
		}).then(function(voted){
			assert(voted, "voter marked as voted");
			return electionInstance.candidates(candidateId);
		}).then(function(candidate){
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "increments vote");
		})
	});

	it("throws exception for invalid candidate", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.vote(99, {from: accounts[1]})
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
			return electionInstance.candidates(1);
		}).then(function(candidate1){
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "candidate 1 did not receive votes");
			return electionInstance.candidates(2);
		}).then(function(candidate2){
			var voteCount = candidate2[2];
			assert.equal(voteCount, 0, "candidate 2 did not receive votes");
		});
	});

	it("throws an exception for double voting", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			candidateId = 2;
			electionInstance.vote(candidateId, {from:accounts[1]});
			return electionInstance.candidates(candidateId);
		}).then(function(candidate){
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "accepts first vote");
			return electionInstance.vote(candidateId, {from: accounts[1]});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
			return electionInstance.candidates(1);
		}).then(function(candidate1){
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "candidate 1 did not receive any votes");		
			return electionInstance.candidates(2);
		}).then(function(candidate2){
			var voteCount = candidate2[2];
			assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
		});
	});
});