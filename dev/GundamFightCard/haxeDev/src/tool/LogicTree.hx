package tool;

using Lambda;

enum LogicTree {
	And(subtrees:Array<LogicTree>);
	Or(subtrees:Array<LogicTree>);
	Leaf(value:String);
}

function enumerateAll(tree:LogicTree):Array<Array<String>> {
	switch (tree) {
		case Or(subtrees):
			var result:Array<Array<String>> = [];
			for (subtree in subtrees) {
				var subResults:Array<Array<String>> = enumerateAll(subtree);
				for (subResult in subResults) {
					result.push(subResult);
				}
			}
			return result;

		case And(subtrees):
			var result:Array<Array<String>> = [[]];
			for (subtree in subtrees) {
				var subResults:Array<Array<String>> = enumerateAll(subtree);
				var updatedResult:Array<Array<String>> = [];
				for (subResult in subResults) {
					for (res in result) {
						updatedResult.push(res.concat(subResult));
					}
				}
				result = updatedResult;
			}
			return result;

		case Leaf(value):
			return [[value]];
	}

	return [];
}

function test() {
	var question1:LogicTree = Or([
		And([Leaf("1"), Leaf("action 1")]),
		And([Or([Leaf("2"), Leaf("3")]), Leaf("action 2")])
	]);
	var answer1:Array<Array<String>> = enumerateAll(question1);
	trace(answer1);

	var question2:LogicTree = And([Leaf("5"), Leaf("6"), Or([Leaf("1"), Or([Leaf("2"), Leaf("3")])])]);
	var answer2:Array<Array<String>> = enumerateAll(question2);
	trace(answer2);

	var question3:LogicTree = And([
		Leaf("5"),
		Leaf("6"),
		Or([Leaf("1"), Or([Leaf("2"), Leaf("3")])]),
		Or([Leaf("7"), And([Leaf("8"), Leaf("9")])])
	]);
	var answer3:Array<Array<String>> = enumerateAll(question3);
	trace(answer3);
}
