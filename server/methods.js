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
			p1_num_answered: 0,
			p2_num_answered: 0,
			questions: randomQuestions,
			time_created: (new Date()).getTime()
		}

		// Put this quiz into the database
		// And replace any exisiting quizzes this user has running
		return ActiveQuizzes.insert(quizData);
	},
	// Checks a quiz answer
	checkQuizAnswer: function(quiz_id, question_id, answer) {
		// Check the inputs
		check(quiz_id, String);
		check(question_id, String);
		check(answer, String);

		// Make sure the answer is only a single letter
		if(answer.length !== 1)
		{
			throw new Meteor.Error("err-invalid-answer-length", "The answer to check must be a single letter");
		}

		// Select the question from the database, only grabbing the answer field
		var question = Questions.findOne({_id: question_id}, {fields: {answer: 1}});

		// Was this the right answer?
		if(question.answer === answer)
		{
			// Return an object so we can compare the truth value directly
			// Thus avoiding the client interpreting an empty value as false
			// and any set value as true
			return {
				correct: true,
				answer: question.answer
			};
		}
		else
		{
			return {
				correct: false,
				answer: question.answer
			};
		}
	}
});