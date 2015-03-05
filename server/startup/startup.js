// This function will be run once the server has started
Meteor.startup(function () {
	// Clear all active quizzes since we're newly starting
	ActiveQuizzes.remove({});

	// Clear the list of quiz seekers
	QuizSeekers.remove({});

	// Load the questions into the database when the server loads
	// Only use if the database isn't permanent
	// TODO: Check for an empty database, then update
	//QuizLoader.loadData();
	
	return;
});