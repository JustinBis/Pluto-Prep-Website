Template.adminQuestionTemplateEdit.created = function() {
	// Create the reactive state variables for each question template
	this.editing = new ReactiveVar();
	this.editing.set(false);
}

Template.adminQuestionTemplateEdit.helpers({
	editing: function() {
		return Template.instance().editing.get();
	}
});

Template.adminQuestionTemplateEdit.events({
	// When the edit button is clicked, switch modes
	"click .edit-button": function () {
		Template.instance().editing.set(true);
	},
	// When the save button is clicked, switch back to the original
	"click .save-button": function () {
		// Get the question data
		var questionId = Template.instance().data._id;
		var data = getEditedQuestion(questionId);

		// Turn off editing for this question
		Template.instance().editing.set(false);

		// Save the question
		Meteor.call('updateQuestion', questionId, data, function(err, result) {
			if(err)
			{
				Session.set('server-error', err.reason);
				console.error("Error calling updateQuestion: " + err.reason);
			}
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
		question: $('#'+questionId+' [data-question]').text().trim(),
		a: $('#'+questionId+' [data-answer="a"]').text().trim(),
		b: $('#'+questionId+' [data-answer="b"]').text().trim(),
		c: $('#'+questionId+' [data-answer="c"]').text().trim(),
		d: $('#'+questionId+' [data-answer="d"]').text().trim(),
		short_explanation: $('#'+questionId+' [data-short-explanation]').text().trim(),
		long_explanation: $('#'+questionId+' [data-long-explanation]').text().trim()
	}

	// Return the compiled data
	return data;
}