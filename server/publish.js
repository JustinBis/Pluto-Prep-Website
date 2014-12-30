// All Meteor publish functions should go here

// Will become relevant once autopublish is gone

// Allow access to all quiz seekers
Meteor.publish('quizSeekers', function() {
	return QuizSeekers.find({});
});

// Publish only the currently active quiz
Meteor.publish('activeQuiz', function() {
	// Make sure this person has a user ID (they are logged in)
	if(this.userId)
	{
		return ActiveQizzes.find({
			// Only publish those active quizzes for which this user is a player
			// Make sure this user is one of the players
			$or: [
    			{ player1Id: this.userId },
    			{ player2Id: this.userId }
    		]
		});	
	}
	else
	{
		// Otherwise, allow the page to proceed without publishing anything
		this.ready();
	}
});