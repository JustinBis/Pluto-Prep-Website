// This function will be run once the server has started
Meteor.startup(function () {
	// Clear all active quizzes since we're newly starting
	ActiveQuizzes.remove({});
	// Load the questions into the database when the server loads
	QuizLoader.loadData();
	return;
});