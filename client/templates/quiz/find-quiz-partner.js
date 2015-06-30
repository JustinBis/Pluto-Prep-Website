// The number of desired quiz questions
var NUM_QUIZ_QUESTIONS = 8;

Template.findQuizPartner.created = function() {
	// Create the reactive state variables
	this.progress = new ReactiveVar();
	this.quizId = new ReactiveVar();
	Localytics.setDurStartTime((new Date()).getTime(), "Find Partner Page");
}

Template.findQuizPartner.rendered = function() {
	// Save the subject from the URL
	var subject = Router.current().params.subject;

	// When the template renders, find a partner
	this.progress.set('Finding an opponent');

	

	// For now, act like there is never a partner


	// If no partner, make a new quiz
	this.progress.set('Creating new quiz');

	// Store the context
	var self = this;
	Meteor.call('createQuiz', subject, NUM_QUIZ_QUESTIONS, function(err, result) {
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
		self.quizId.set(result);
	});
}

Template.findQuizPartner.events({
	// When the take a quiz now button is clicked, redirect
	"click #take-quiz-button": function () {
		Router.go('take-quiz', {_id: Template.instance().quizId.get(), question_number: 1});
	}
});

Template.findQuizPartner.helpers({
	quizId: function() {
		return Template.instance().quizId.get();
	},
	progress: function() {
		return Template.instance().progress.get();
	},
	error: function () {
		return Session.get('server-error');
	}
})