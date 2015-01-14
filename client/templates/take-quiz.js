// When the template is created, create the reactive variables
Template.questionTemplate.created = function() {
	// Create the reactive state variables
	this.result = new ReactiveVar();
}

// Helpers
Template.questionTemplate.helpers({
	result: function() {
		return Template.instance().result.get();
	}
});

// Event handlers
Template.questionTemplate.events({
	// Check answers on the server
	"click .question-answers > li": function (event) {
		// Grab the quiz id from the parent's data contect
		var quiz_id = Template.parentData(1)._id;
		// Find out which answer letter was clicked
		var letter = $(event.currentTarget).attr("data-answer")
		// Get the id of this question
		var question_id = this._id;

		// Cache this template instance for use in the callback
		var this_template = Template.instance();
		
		// Ask the server if this is the right answer
		Meteor.call('checkQuizAnswer', quiz_id, question_id, letter, function(err, result) {
			if(err)
			{
				Session.set('server-error', err.reason);
				console.error("Error calling checkQuizAnswer: " + err.reason);
				return;
			}
			if(!result)
			{
				Session.set('server-error', "The server failed to check your quiz answer");
				console.error("Error calling checkQuizAnswer: result never sent.");
				return;
			}

			// If the answer was right
			if(result.correct === true)
			{
				console.log("YES");
				// Set the template result to correct
				this_template.result.set("correct");

			}
			// Otherwise mark the answer as wrong
			else
			{
				console.log("NOPE");
				// Set the template result to wrong
				this_template.result.set("wrong");
			}

			// Move on to the next question automatically
			// TODO
		});
	}
})