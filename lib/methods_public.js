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

		// Error checking for empty fields
		if (data.question === "" || data.a === "" || data.b === "" || data.c === "" || data.d === ""
			|| data.short_explanation === "" || data.long_explanation === "") {
			throw new Meteor.Error( 500, 'One of the text areas above is empty, please check!');
		};

		if (data.answer === "" || data.subject === "" || data.subcategory === "" || data.topic === "") {
			throw new Meteor.Error( 500, 'One of the drop down menus above is empty, please check!');
		};

		Questions.update({_id: questionId}, {$set: 
			{
				question: data.question,
				a: data.a,
				b: data.b,
				c: data.c,
				d: data.d,
				short_explanation: data.short_explanation,
				long_explanation: data.long_explanation,

				// New fields added/to be updated when admin updates a question
				subject: data.subject,
				subcategory: data.subcategory,
				topic: data.topic
			}
		});

		// This function returns nothing
		return null;
	},

	// Adds question to question collections, makes sure that proper fielids
	// are filled before inserting
	addQuestion: function(data) {

		// Error checking 
		if (data.question === "" || data.a === "" || data.b === "" || data.c === "" || data.d === ""
			|| data.short_explanation === "" || data.long_explanation === "") {
			throw new Meteor.Error( 500, 'One of the text areas above is empty, please check!');
		};

		if (data.answer === "" || data.subject === "" || data.subcategory === "" || data.topic === "") {
			throw new Meteor.Error( 500, 'One of the drop down menus above is empty, please check!');
		};

		Questions.insert({
			question: data.question,
			a: data.a,
			b: data.b,
			c: data.c,
			d: data.d,
			short_explanation: data.short_explanation,
			long_explanation: data.long_explanation,
			answer: data.answer,
			subject: data.subject,
			subcategory: data.subcategory,
			topic: data.topic
		});
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
		// i.e. use this.unblock to allow a client to start a new request in a new fiber
		// TODO: That ^
		
		var quiz = Quizzes.findOne({_id: quiz_id});

		if(!quiz)
		{
			throw new Meteor.Error("err-invalid-quiz", "Could not find the quiz with the given id");
		}

		// Make sure there is still time left in the quiz
		// TODO: Do we want quizzes timed or not?
		// if(quiz.time_end <= (new Date()).getTime())
		// {
		// 	throw new Meteor.Error("err-quiz-finished", "The timer for this quiz has already run out");
		// }

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
			throw new Meteor.Error('err-not-authenticated', "You aren't a member of the given quiz");
		}

		// Don't update a question that has already been answered
		// i.e. check that the answer field doesn't yet exist
		// Subtract one from questionNumber since the numbers are 1 indexed and the arrays are 0 indexed
		if(quiz.questions[questionNumber - 1] && quiz.questions[questionNumber - 1][player+"_answer"])
		{
			throw new Meteor.Error('err-already-answered', "You already answered this question");
		}

		// Calculate the number of points earned for this question
		// TODO: put this into the quiz helper
		var points = 0;

		// correct (correct or incorrect, to be stored in userinteraction collection)
		var correct = false;
		// Is the answer correct?
		if(question.answer == answer)
		{
			// Add 100 points for a correct answer
			points += 100;
			correct = true;
			// TODO: add points based on time
		}

		// Update the quiz progress
		// TODO: Make it so that we don't need to store the explanations and answers with the quiz
		var set = {};
		// Set this player's answer
		var field = "questions.$."+player+"_answer";
		set[field] = answer;
		// Set the points gained for this question
		field = "questions.$."+player+"_points";
		set[field] = points;

		// Update the answer in the DB		
		Quizzes.update(
			{_id: quiz_id, 'questions._id': question_id},
			{
				$set: set
			},
			function(err, numAffected) {
				if(err)
				{
					console.error("Database error in checkQuizAnswer while updating answer:");
					console.error(err);
					throw new Meteor.Error('err-database-error', "Unknown database error");
				}
			}
		);

		// Data to send to user_data collection (and proper fields for userinteraction.js methods)
		UserInteraction.questionAnswered(this.userId, question_id, answer, correct);

		// Has this user finished the quiz? Only care if this isn't a simulation on the client
		if(!this.isSimulation && Meteor.call('hasPlayerFinishedQuiz', quiz_id))
		{
			// Mark the quiz as finished at the current time
			set = {};
			set['time_finish'] = (new Date()).getTime();
			Quizzes.update(quiz_id, {$set: set}, function(err, numAffected){
				if(err)
				{
					console.error("Database error in checkQuizAnswer while finishing quiz:");
					console.error(err);
					throw new Meteor.Error('err-database-error', "Unknown database error");
				}
			});
			
		}


		// Return an object so we can compare the truth value directly
		// Thus avoiding the client interpreting an empty value as false
		// and any set value as true
		return {
			// Was this the right answer?
			correct: question.answer == answer,
			answer: question.answer
		};
	},
	// Check if this player has answered all of the questions in this quiz
	hasPlayerFinishedQuiz: function(quiz_id) {
		// Make sure the user is logged in
		if(!this.userId)
		{
			throw new Meteor.Error("err-not-authenticated", "Requester not logged in");
		}

		// Make sure the quiz_id is a string
		check(quiz_id, String);

		// Select the quiz
		var quiz = Quizzes.findOne({_id: quiz_id});

		if(!quiz)
		{
			throw new Meteor.Error("err-invalid-quiz", "Could not find the quiz with the given id");
		}

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
			throw new Meteor.Error('err-not-authenticated', "You aren't a member of the given quiz");
		}

		// Has this player answered every question?

		// Set up the selector for the player answer fields
		var answerString = player + '_answer';

		// Loop through each question and make sure it's been answered
		var isFinished = true;
		quiz.questions.forEach(function(element) {
			// If this question has not been answered, this player isn't done
			if(!(element[answerString]))
			{
				isFinished = false;
			}
		});


		// TODO: get total points per user for all quizzes user took
		//		 percentage each main category for each questions
		//		 percentage per subcategory
		//		 # of questions answere per subcategory/subject
		//		 in general, number and percentage

		// HERE check when the quiz is finished, then aggregate points for all questions answered for this quiz

		// If any question wasn't answered this will return false,
		// else returns true by default
		return isFinished;
	}
})