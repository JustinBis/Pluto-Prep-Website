Template.findQuizPartner.rendered = function() {
	// When the template renders, find a partner
	// For now, act like there is never a partner

	// If no partner, make a new quiz
	Session.set('currentStep', 'Creating new quiz');
	Meteor.call('createQuiz', 'Biology', 6, function(err, result) {
		if(err)
		{
			Session.set('server-error', err.reason);
			console.error("Error calling createQuiz: " + err.reason);
			return;
		}

		// If the resultant quizId wasn't set correctly
		if(!result)
		{
			Session.set('server-error', "Failed to create a new quiz");
			console.error("findQuizPartner: quizId not set, unable to route to quiz.");
			return;
		}
		
		// Otherwise, redirect to the quiz
		//Router.go('/quiz/' + result);
		// So we can edit the page, just store the quiz id and allow it
		// to be accessed by a button
		Session.set('quizId', result);
	});
}

Template.findQuizPartner.events({
	// When the take a quiz now button is clicked, redirect
	"click #take-quiz-button": function () {
		Router.go('/quiz/' + Session.get('quizId'));
	}
});

Template.findQuizPartner.helpers({
	quizId: function() {
		return Session.get('quizId');
	},
	currentStep: function() {
		return Session.get('currentStep');
	}
})