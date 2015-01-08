// Defines a set of methods to be called by the client
Meteor.methods({
	// Will create a new quiz
	createQuiz: function(subject, numQuestions) {
		console.log("createQuiz called");

		// Make sure the user is logged in
		if(!this.userId)
		{
			throw new Meteor.Error("err-not-authenticated", "Requester not logged in");
		}

		// Make sure the subject is a string
		check(subject, String);
		// Make sure there is a valid number of questions
		QuizHelper.validateNumQuestions(numQuestions);

		// Select a random set of question documents
		var randomQuestions = QuizHelper.findRandomQuestions(subject, numQuestions);

		// Set up the quiz info for player 1
		var quizData = {
			num_questions: numQuestions,
			p1_id: this.userId,
			p1_answers: [],
			questions: randomQuestions
		}

		// Put this quiz into the database
		// And replace any exisiting quizzes this user has running
		return ActiveQuizzes.insert(quizData);
	}
});