// Make a global QuizHelper object
QuizHelper = {
	// Will select a set of random questions
	// Returns an array of object _ids corresponding to questions
	// Each question 
	findRandomQuestions: function(subject, numQuestions) {
		check(subject, String);

		// Create an empty array to store the selected questions
		questions = [];

		// Query the questions
		var found = Questions.find({subject: subject});

		// Make sure there are enough questions in total
		if(found.count() < numQuestions)
		{
			throw new Meteor.Error("not-enough-questions", "Couldn't find " + numQuestions + " questions in subject " + subject);
		}

		// Generate an array of indicies to select from the found documents
		var indicies = QuizHelper.generateIndicies(numQuestions, found.count());

		console.log("QuizHelper: generated indicies: ");
		console.log(indicies);

		// Fetch the cursor, retrieving an array of documents
		var allQuestions = found.fetch();

		// Fill the questions array by choosing elements from allQuestions
		// using the random indicies
		// TODO: also randomize the order of the answers
		for(var i = 0; i < indicies.length; i++)
		{
			questions.push(allQuestions[ indicies[i] ]);
		}

		// Return the questions
		return questions;
	},

	//
	// Helper functions
	//
	validateNumQuestions: function(numQuestions) {
		// Make sure there is a valid number of questions
		check(numQuestions, Number);
		if(numQuestions % 1 !== 0)
		{
			throw new Meteor.Error("num-questions-not-int", "The number of questions must be an integer.");
		}
		// Don't allow more than 20 questions to go through
		if(numQuestions > 20)
		{
			throw new Meteor.Error("num-questions-too-high", "The number of questions must be less than 20.");
		}
		// For now, only work with 6 questions
		// TODO: generalize this code
		if(numQuestions !== 6)
		{
			throw new Meteor.Error("invalid-num-questions", "The number of questions must be 6.");
		}
	},

	// Generates an array of count unique indexes less than max
	generateIndicies: function(count, max) {
		var indicies = [];

		// Generate a set of possible indicies
		var possible = [];
		for(var i = 0; i < max; i++)
		{
			possible[i] = i;
		}

		// Select indicies randomly from the remaining possible indicies
		while(indicies.length < count)
		{
			// Create a random number between 0 and possible.length - 1, inclusive
			var index = Math.floor(Math.random() * possible.length);

			// Splice that index out of the array
			var toAdd = possible.splice(index, 1)[0];

			// Add this to the indicies
			indicies.push(toAdd);
		}

		// Finally, return the random indicies
		return indicies;
	}

}