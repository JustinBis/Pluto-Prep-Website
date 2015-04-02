Template.appHomeTemp.events({
	// When the take a quiz now button is clicked, redirect
	"click #jumbotron-take-quiz-button": function () {
		Router.go('quiz-select-subject');
	}
});
