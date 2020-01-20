pragma solidity ^0.5.12;

contract Election {
	//store read candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	//stocarea conturilor care au votat
	mapping(address => bool) public voters;
	//constructor
	//store candidate
	//fetch candidate
	mapping(uint => Candidate) public candidates;
	//nu poti itera peste ea, nu poti face count

	uint public candidatesCount;

	event votedEvent(
		uint indexed _candidateId
	);

	constructor () public {
		//state variable if without _
		addCandidate('Candidate 1');
		addCandidate('Candidate 2');
	}

	function addCandidate (string memory _name) private {
		candidatesCount ++;
		candidates[candidatesCount] = Candidate (candidatesCount, _name, 0);
	}

	function vote(uint _candidateId) public {
		//adresa nu a mai votat inainte
		//luam referinta celor care au votat si fac check daca acest voter a votat inainte; daca nu a votat => false, 
		//dar cu ! el va merge pe true, deci acel require este satisfacut, deci cel care a votat este unic
		require(!voters[msg.sender]);

		//votul sa fie unic de la fiecare adresa
		//votul merge la un candidat valid
		require(_candidateId > 0 && _candidateId <= candidatesCount);

		//solidity ne ofera posibilitatea de a oferi mai multe argumente, adica metadata mai mult decat candidateId;
		//pentru a avea votul unic este nevoie sa stim contul care voteaza
		voters[msg.sender] = true;
		//referinta catre voters mapping, iar cu msg.sender vedem daca contul respectiv a mai votat vreodata
		//update candidate vote count; adica posibilitatea de a vota
		candidates[_candidateId].voteCount ++;

		emit votedEvent(_candidateId);
	}
}