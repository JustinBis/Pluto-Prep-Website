Template.adminDailyQuiz.created = function() {
	// Create the reactive state variables for each question template
	this.saved = new ReactiveVar();
	this.saved.set(false);
	this.errorResponse = new ReactiveVar();
	this.errorResponse.set(false);
}

Template.adminDailyQuiz.helpers({
	saved: function() {
		return Template.instance().saved.get();
	},
	error: function() {
		return Template.instance().errorResponse.get();
	}
});

Template.adminDailyQuiz.events({
	// When the save button is clicked, switch back to the original
	"click .save-button": function () {
		// Get the question data
		var data = getQuizData();

		// Save the context for our callback
		var self = Template.instance();

		// Save the question
		Meteor.call('addDailyQuiz', data, function(err, result) {
			if(err)
			{
				self.errorResponse.set(err.reason);
				console.error("Error calling updateQuestion: " + err.reason);
				return;
			}
			// Mark it as saved
			self.errorResponse.set(false);
			self.saved.set(true);
		});
	}
});

/*
 * Grabs all of the editable quiz data fields and collects them into an object
 */
var getQuizData = function() {
	// Select all of the info we need from the page

	// Get the starting date as a date object
	var time = (new Date($('[name="data-date"]').val()));
	// Convert the time into the date, 00:00 EST
	time.setHours(0);
	time.setMinutes(0);
	time.setSeconds(0);

	// Get the question ids from the text input box
	var questions = $('[name="data-questions"]').val().trim();
	// Split the question ids over new lines and trim each question
	questions = questions.split("\n").map(function(val){return val.trim()});

	// Get the selected subject
	var subject = $('[name="data-subject"]').val();

	var data = {
		start_date: time,
		subject: subject,
		question_ids: questions
	}

	// Return the compiled data
	return data;
}