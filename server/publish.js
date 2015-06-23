// All Meteor publish functions should go here

// Publish only the currently active quiz
Meteor.publish('activeQuizzes', function() {
	// Make sure this person has a user ID (they are logged in)
	if(this.userId)
	{
		return Quizzes.find({
			// Only publish those active quizzes for which this user is a player
			// Make sure this user is one of the players
			$or: [
				{ p1_id: this.userId },
				{ p2_id: this.userId }
			]
		});
	}
	else
	{
		// Otherwise, allow the page to proceed without publishing anything
		this.ready();
		return [];
	}
});

// For testing, push questions
// TODO: Make this for admins only
Meteor.publish('questions', function() {
	return Questions.find();
});

// Push the daily quizzes to the admins so they can edit and add to them
// TODO: Make this for admins only
Meteor.publish('dailyQuizzes', function() {
	return Questions.find();
});

// TODO: limit this to current user only?
Meteor.publish("my_question_tracker", function() {
	if (this.userId) {
		return QuestionTracker.find({uid: this.userId});
	}
    
});