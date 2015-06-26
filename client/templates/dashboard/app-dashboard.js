Template.appDashboard.helpers({
	getUsername: function() {
		if (Meteor.user().profile.username !== undefined) {
			return Meteor.user().profile.username;
		}
	},

	///////////////////
	// Question Data //
	///////////////////

	totalQuestions: function () { 
		if (UserInteraction.totalQuestions() !== undefined) {
			return UserInteraction.totalQuestions();
		}
	},
	questionsCompTotal: function () {
		if (UserInteraction.questionsCompTotal() !== undefined) {
			return UserInteraction.questionsCompTotal();
		}
	},
	quesTimeAverage: function () {
		if (UserInteraction.quesTimeAverage() !== undefined) {
			return UserInteraction.quesTimeAverage();	
		}
	},

	///////////////
	// Quiz Data //
	///////////////

	quizTimeAverage: function () {
		if (UserInteraction.quizTimeAverage() !== undefined) {
			return UserInteraction.quizTimeAverage();
		}
	},

	quizScoreTotal: function () {
		if ($('#quiz-sect').text() === "Overall") {
			if (UserInteraction.quizScoreTotal() !== undefined) {
			return UserInteraction.quizScoreTotal();
			}	
		}
	}

});

Template.appDashboard.events({

	// When user chooses a section for quizzes, grab proper
	'change #quiz-sect' : function (e){
		var section = $('#quiz-sect :selected').val();
		$('#quizTimeAverage').text(UserInteraction.quizTimeAverage(section));
		$('#quizScoreTotal').text(UserInteraction.quizScoreTotal(section));
	},

	'change #ques-subj' : function (e){
		var subject = $('#ques-subj :selected').val();
		$('#questionsCompTotal').text(UserInteraction.questionsCompTotal(subject));
		$('#quesTimeAverage').text(UserInteraction.quesTimeAverage(5, subject));
	},

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
