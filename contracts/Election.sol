pragma solidity ^0.5.12;

contract Election {
	//store read candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}
	//constructor
	//store candidate
	//fetch candidate
	mapping(uint => Candidate) public candidates;
	//nu poti itera peste ea, nu poti face count

	uint public candidatesCount;

	constructor () public {
		//state variable if without _
		addCandidate('Candidate 1');
		addCandidate('Candidate 2');
	}

	function addCandidate (string memory _name) private {
		candidatesCount ++;
		candidates[candidatesCount] = Candidate (candidatesCount, _name, 0);
	}
}