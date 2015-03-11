// Make a global QuizHelper object
QuizHelper = {
	// Will select a set of random questions
	// Returns an array of object _ids corresponding to questions
	// Each question 
	findRandomQuestions: function(subject, numQuestions) {
		check(subject, String);

		var query;
		// Is this a combined subject that selects from multiple subject areas?
		if(QuizHelper.isCombinedSubject(subject))
		{
			query = QuizHelper.getCombinedSubjectsQuery(subject);
		}
		// Otherwise just select from this specific subject
		else
		{
			query = {subject: subject};
		}

		// Query the questions, leaving out the answer and explanations
		// TODO: Make it so that we don't need to store the explanations and answers with the quiz
		var found = Questions.find(query);

		// Make sure there are enough questions in total
		if(found.count() < numQuestions)
		{
			throw new Meteor.Error("not-enough-questions", "Couldn't find " + numQuestions + " questions in subject " + subject);
		}

		// Generate an array of indicies to select from the found documents
		var indicies = QuizHelper.generateIndicies(numQuestions, found.count());

		// Fetch the cursor, retrieving an array of documents
		var allQuestions = found.fetch();

		// Create an empty array to store the selected questions
		questions = [];

		// Fill the questions array by choosing elements from allQuestions
		// using the random indicies
		// TODO: also randomize the order of the answers (which could be done on client side)
		// TODO: don't include answers and explanations here since they aren't needed
		for(var i = 0; i < indicies.length; i++)
		{
			questions.push(allQuestions[ indicies[i] ]);
			// Give this question a question number, which is the index + 1
			// since arrays are 0 indexed
			questions[questions.length - 1].number = i + 1;
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
	},
	// The combined subjects and their associated mappings
	// TODO: include the subjects' real percentages
	_combinedSubjects: {
		// Chemical and Physical Foundations of Biological Systems 
		cpf: {
			'Orgo': 1,
			'GenChem': 1,
			'BioChemP': 1,
			'BioChemBP': 1,
			'Phys': 1
		},
		// Biological and Biochemical Foundations of Living Systems
		bbf: {
			'Bio': 1,
			'BioN': 1,
			'BioChemB': 1,
			'BioChemBP': 1
		},
		// Psychological, Social, and Biological Foundations of Behavior
		psf: {
			'BioN': 1,
			'Psy': 1,
			'Soc': 1,
		}
	},
	// Is this subject on the list of combined subjects?
	isCombinedSubject: function(subject) {
		if(QuizHelper._combinedSubjects[subject] != null)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	// Get the query object for this combined subject
	getCombinedSubjectsQuery: function(subject) {
		try
		{
			// Get the keys of the combined subject
			var keys = Object.keys(QuizHelper._combinedSubjects[subject]);
			// Create a list of objects for each key that looks like {subject: key}
			var selectors = keys.map(function(key, index, array){ 
				return {subject: key}
			});

			// Return the combined query
			return {$or: selectors};
		}
		catch (err)
		{
			throw new Meteor.Error('invalid-subject', 'Failed to form the combined subjects query for subject "' + subject + '" Error was: + ' + err.message);
		}
	}

}