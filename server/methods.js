// Defines a set of methods to be called by the client
Meteor.methods({
	// Will create a new quiz
	createQuiz: function(subject, numQuestions) {
		// Make sure the user is logged in
		if(!this.userId)
		{
			throw new Meteor.Error("err-not-authenticated", "Requester not logged in");
		}

		//
		// Begin demo section
		// Demo users: demo1 and demo2
		// Demo passwords: demo1password and demo2password
		//

		// If we're a demo user, create a demo quiz that always connects the demo users
		// Let demo1 create a regular quiz, but demo2 always connects to it
		var username = Meteor.user().username;
		if(username == "demo2")
		{
			return Meteor.call('findOpponent', subject, numQuestions);
		}

		//
		// End demo section
		//

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
	// Try to match this player with an opponent
	// will return null if no opponent can be found
	findOpponent: function(subject, numQuestions) {

		//
		// Begin demo section
		//
		// Always connect demo2 to the lastest quiz created by demo1
		var username = Meteor.user().username;
		if(username == "demo2")
		{
			var otherUser = Meteor.users.findOne({username: "demo1"});
			var otherUserId = otherUser._id;

			// Find the quiz where demo1 is p1
			// Sort descending, meaning give the newest (highest number of seconds since creation) first
			var demoquiz = ActiveQuizzes.findOne({ p1_id: otherUserId },  {sort: {time_created: -1}});

			// If there was a quiz, put us in it
			if(demoquiz)
			{
				// demo2 is always p2
				// Update the demo quiz with demo2's id
				ActiveQuizzes.update(
					demoquiz._id,
					{ $set: { p2_id: this.userId } }
				);

				// Return this quiz ID
				return demoquiz._id;
			}
			else
			{
				// If there was no quiz, don't let the 2nd demo player play
				throw new Meteor.Error("err-no-demo-quiz", "Couldn't find the demo quiz. Make sure demo1 makes a quiz first.");
			}
		}

		//
		// End demo section
		//

		// Since we're not matching people right now, return null
		return null;
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
	}
});