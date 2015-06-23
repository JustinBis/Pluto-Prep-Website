if (Meteor.isClient) {
	Meteor.subscribe("my_question_tracker");
};

Template.appDashboard.events({
	// Total questions
	'click #total-questions': function (e) {
		console.log(UserInteraction.totalQuestions());
	},
	// Total questions complete
	'click #ques-comp-total': function (e) {
		console.log(UserInteraction.questionsCompTotal());
	},

	// QUESTIONS COMPLETE

	// Dropdown value of subject for complete by subject
	'click #dropdown-comp-subject': function(e) {
		$('#comp-subject').text($(e.target).text());
	},
	// Questions complete by subject
	'click #ques-comp-subj' : function(e) {
		console.log(UserInteraction.questionsCompSubject($('#comp-subject').text()));
	},

	// PERCENT CORRECT

	// Dropdown value of weeks for % complete
	'click #dropdown-perc-weeks': function(e) {
		$('#perc-weeks').text($(e.target).text());
	},
	// Dropdown value of subject for % complete
	'click #dropdown-perc-subj': function(e) {
		$('#perc-subj').text($(e.target).text());
	},
	// Dropdown value of subcategory for % complete
	'click #dropdown-perc-subc': function(e) {
		$('#perc-subc').text($(e.target).text());
	},
	// Percent correct for proper parameters
	'click #perc-cor-total' : function(e) {
		console.log(UserInteraction.percentCorrect($('#perc-weeks').text(), $('#perc-subj').text(), $('#perc-subc').text()));
	}
});
