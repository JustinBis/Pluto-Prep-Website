// All Meteor publish functions should go here

// Will become relevant once autopublish is gone

/*
// Likely not needed, as we do quiz matching server side
// Allow access to all quiz seekers
Meteor.publish('quizSeekers', function() {
	return QuizSeekers.find({});
});
*/

// Publish only the currently active quiz
Meteor.publish('activeQuiz', function() {
	// Make sure this person has a user ID (they are logged in)
	if(this.userId)
	{
		return ActiveQuizzes.find(
		{
			// Only publish those active quizzes for which this user is a player
			// Make sure this user is one of the players
			$or: [
				{ p1_id: this.userId },
				{ p2_id: this.userId }
			]
		},
		// Don't publish the answers
		{
			fields: {
			'questions.answer': 0,
			'questions.short_explanation': 0,
			'questions.long_explanation': 0
			}
		}
		);
	}
	else
	{
		// Otherwise, allow the page to proceed without publishing anything
		this.ready();
		return [];
	}
});