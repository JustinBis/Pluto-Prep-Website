/*
 * These methods should be shared on the client and server so the client
 * can take advantage of Meteor's latency compensation
 * These methods should all be public logic since they are shared in source with the client
 */

Meteor.methods({
	// Update a specific quiz question
	updateQuestion: function(questionId, data){
		// Make sure this user is logged in and has permission to edit questions


		// Update the question
		Questions.update({_id: questionId}, {$set: 
			{
				question: data.question,
				a: data.a,
				b: data.b,
				c: data.c,
				d: data.d,
				short_explanation: data.short_explanation,
				long_explanation: data.long_explanation
			}
		});

		// This function returns nothing
		return null;
	},
	// Checks a quiz answer
	// This is the local version of the server function
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
		var question = Questions.findOne({_id: question_id}, {fields: {answer: 1, short_explanation: 1, long_explanation: 1}});

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
		// TODO: Make it so that we don't need to store the explanations and answers with the quiz
		var set = {};
		// Set this player's answer
		var answerField = "questions.$."+player+"_answer";
		set[answerField] = answer;
		
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
					throw new Meteor.Error('err-database-error', "Unknown database error");
				}
			}
		);


		// Return an object so we can compare the truth value directly
		// Thus avoiding the client interpreting an empty value as false
		// and any set value as true
		return {
			// Was this the right answer?
			correct: question.answer == answer,
			answer: question.answer
		};

	}
})