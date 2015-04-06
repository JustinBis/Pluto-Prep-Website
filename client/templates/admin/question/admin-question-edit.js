Template.adminQuestionEdit.created = function() {
	// Create the reactive state variables for each question template
	this.saved = new ReactiveVar();
	this.saved.set(false);
}

Template.adminQuestionEdit.helpers({
	saved: function() {
		return Template.instance().saved.get();
	},
	nonreactiveQuestion: function() {
		return Questions.findOne({_id: Template.instance().data._id}, {reactive: false});
	}
});

Template.adminQuestionEdit.events({
	// When the save button is clicked, switch back to the original
	"click .save-button": function () {
		// Get the question data
		var questionId = Template.instance().data._id;
		var data = getEditedQuestion(questionId);

		// Save the context for our callback
		var self = Template.instance();

		console.log(data);

		// Save the question
		Meteor.call('updateQuestion', questionId, data, function(err, result) {
			if(err)
			{
				Session.set('server-error', err.reason);
				console.error("Error calling updateQuestion: " + err.reason);
			}
			// Mark it as saved
			self.saved.set(true);
		});
	}
});

/*
 * Grabs all of the editibale question fields from a question template
 * and returns them as an object
 */
var getEditedQuestion = function(questionId) {
	// Select all of the info we need from the page
	var data = {
		question: $('#'+questionId+' [name="data-question"]').val().trim(),
		a: $('#'+questionId+' [data-answer="a"]').val().trim(),
		b: $('#'+questionId+' [data-answer="b"]').val().trim(),
		c: $('#'+questionId+' [data-answer="c"]').val().trim(),
		d: $('#'+questionId+' [data-answer="d"]').val().trim(),
		short_explanation: $('#'+questionId+' [name="data-short-explanation"]').val().trim(),
		long_explanation: $('#'+questionId+' [name="data-long-explanation"]').val().trim()
	}

	// Return the compiled data
	return data;
}