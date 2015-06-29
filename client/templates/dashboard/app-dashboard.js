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
	'click #quiz-data' : function(e) {
		var section = $('#quiz-sect :selected').val();
		var weeksAgo = $('#quiz-weeks :selected').val();
		$('#quizTimeAverage').text(UserInteraction.quizTimeAverage(weeksAgo, section));
		$('#quizScoreTotal').text(UserInteraction.quizScoreTotal(weeksAgo, section));
	},

	'click #ques-data' : function (e){
		var subject = $('#ques-subj :selected').val();
		var weeksAgo = $('#ques-weeks :selected').val();
		$('#questionsCompTotal').text(UserInteraction.questionsCompTotal(subject));
		$('#quesTimeAverage').text(UserInteraction.quesTimeAverage(weeksAgo, subject));
	},

	
});
