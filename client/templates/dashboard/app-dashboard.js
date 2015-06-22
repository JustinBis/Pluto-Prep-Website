Template.appDashboard.events({
	'click #totalQuestions': function () {
		// error here, states that UserInteraction is not defined
		console.log(UserInteraction.totalQuestions());
	},

});
