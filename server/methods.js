// Defines a set of methods to be called by the client
Meteor.methods({
	// Will create a new quiz
	createQuiz: function(subject, numQuestions) {
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
			questions: randomQuestions,
			time_created: (new Date()).getTime()
		}

		// Put this quiz into the database
		// And replace any exisiting quizzes this user has running
		return ActiveQuizzes.insert(quizData);
	},
	// Start the quiz timer
	// Takes in a quiz _id and the length of the quiz in milliseconds
	startQuiz: function(quiz_id, quiz_time) {
		// Make sure the user is logged in
		if(!this.userId)
		{
			throw new Meteor.Error("err-not-authenticated", "Requester not logged in");
		}

		// Check the inputs
		check(quiz_id, String);
		check(quiz_time, Number);

		// To help offset any trip delays, give the quiz an extra second
		quiz_time += 1000;

		// Select the quiz and make sure that the user is one of the players
		// Also make sure the quiz hasn't started yet with $exists

		// Time in msec
		var timeStart = (new Date()).getTime();
		var timeEnd = timeStart + quiz_time;
		var numAffected = ActiveQuizzes.update(
			{
				_id: quiz_id,
				time_start: { $exists: false },
				$or: [
					{ p1_id: this.userId },
					{ p2_id: this.userId }
				]
			},
			{
				$set: {time_start: timeStart, time_end: timeEnd}
			}
		);
		if(numAffected > 0)
		{
			// Say the time was set
			return {set: true, time_start: timeStart, time_end: timeEnd};
		}
		else
		{
			// Say the time was previously set
			return {set: false, time_start: timeStart, time_end: timeEnd};
		}
	},
	// Checks a quiz answer
	checkQuizAnswer: function(quiz_id, question_id, answer) {
		// Make sure the user is logged in
		if(!this.userId)
		{
			throw new Meteor.Error("err-not-authenticated", "Requester not logged in");
		}

		// Check the inputs
		check(quiz_id, String);
		check(question_id, String);
		check(answer, String);

		// Make sure the answer is only a single letter
		if(answer.length !== 1)
		{
			throw new Meteor.Error("err-invalid-answer-length", "The answer to check must be a single letter");
		}

		// Update the current quiz taker's progress in the quiz in a different thread
		// TODO: That ^
		
		var quiz = ActiveQuizzes.findOne({_id: quiz_id});

		if(!quiz)
		{
			throw new Meteor.Error("err-invalid-quiz", "Could not find the quiz with the given id");
		}

		// Make sure there is still time left in the quiz
		if(quiz.time_end <= (new Date()).getTime())
		{
			throw new Meteor.Error("err-quiz-finished", "The timer for this quiz has already run out");
		}

		// Find out what question number this is
		var questionNumber = null;
		// Loop through each question searching for the correct id
		quiz.questions.forEach(function(element, index, array) {
			if(element._id == question_id)
			{
				questionNumber = element.number;
			}

			// If the question id never matched
			if(index == array.length && questionNumber === null)
			{
				throw new Meteor.Error("err-invalid-question", "The question id wasn't found in this quiz");
			}
		});

		// Select the question from the database, only grabbing the answer field
		var question = Questions.findOne({_id: question_id}, {fields: {answer: 1}});

		var wasCorrect = question.answer === answer;

		// Update the quiz progress

		// Find out which player this user is in the quiz
		var player;
		if(quiz.p1_id === this.userId)
		{
			// Update player 1's progress
			player = 'p1';
		}
		else if(quiz.p2_id === this.userId)
		{
			// Update player 2's progress
			player = 'p2';
		}
		else
		{
			throw new Meteor.Error('err-not-authenticated', "Requester is not a member of the given quiz id");
		}

		// Don't update a question that has already been answered
		// i.e. check that the answer field doesn't yet exist
		// Subtract one from questionNumber since the numbers are 1 indexed and the arrays are 0 indexed
		if(quiz.questions[questionNumber - 1] && quiz.questions[questionNumber - 1][player+"_answer"])
		{
			throw new Meteor.Error('err-already-answered', "Requester has already answered this question");
		}

		// Update the quiz progress
		var set = {'questions.$.answer': question.answer};
		var answerField = "questions.$."+player+"_answer";
		set[answerField] = wasCorrect ? "correct" : "wrong";
		
		ActiveQuizzes.update(
			{_id: quiz_id, 'questions._id': question_id}, 
			{
				$set: set
			},
			function(err, numAffected) {
				if(err)
				{
					console.error("Database error in checkQuizAnswer:");
					console.error(err);
					throw new Meteor.Error('err-database-error', err.reason);
				}
				console.log("checkQuizAnswer: num affected " + numAffected);
			}
		);


		// Return an object so we can compare the truth value directly
		// Thus avoiding the client interpreting an empty value as false
		// and any set value as true
		return {
			// Was this the right answer?
			correct: wasCorrect,
			answer: question.answer
		};

	}
});