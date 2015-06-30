Template.quizSelectSubject.created = function () {
	// Tagging screen for user flow in Localytics
	Localytics.setDurStartTime((new Date()).getTime(), "Select Subject Page");
	ll('tagScreen', 'Quiz Subject Page');
};