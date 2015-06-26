// Global User Interaction helper for tracking user stats

UserInteraction = {
	// When a user answers a question, keep track of the necessary information.
	// TODO: keep track of how long the user took to answer this question
	questionAnswered: function(user_id, question_id, user_answer, correct, time) {
		var question = Questions.findOne({_id: question_id});
		var date = new Date();

		// TODO: add passage vs discrete field, and a flagged/starred field
		QuestionTracker.insert({
			uid: user_id,
			qid: question_id,
			ans: user_answer,
			cor: correct,
			subj: question.subject,
			subc: question.subcategory,
			date: date,
			dur: time
		});
	},

	///////////////////
	// Question Data //
	///////////////////

	// Total number of questions in our questions collection
	totalQuestions: function() {
		return Questions.find().count();
	},

	// Total number of questions completed for current user
	// takes subject as a parameter

	// TODO: INCORPORATE CHECKING FOR SUBCATEGORY AND TOPIC
	questionsCompTotal: function(subject) {
		if (subject) {
			return QuestionTracker.find({subj:subject}).count();
		}
		return QuestionTracker.find().count();
	},

	// Total percent of questions answered correctly out of questions answered.

	// TODO: FINISH CHECKING FOR SUBJECT AND SUBCATEGORY
	percentCorrect: function(weeksAgo, subject, subcategory) {
		var today = new Date();
		today.setDate(today.getDate()-(7*weeksAgo));
		var quesAnswered = UserInteraction.questionsCompTotal();
		// Subject field filled
		if (subject !== "Subject") 
		{
			// Subcategory field also filled
			if (subcategory !== "Subcategory") 
			{
				var numCorrect = QuestionTracker.find({
					cor: true,
					subj: subject,
					subc: subcategory,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
			}
			// Only subject field filled
			else {
				var numCorrect = QuestionTracker.find({
					cor: true,
					subj: subject,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
			}
		}
		// Subject field empty, subcategory field filled
		else if (subcategory !== "Subcategory") 
		{
			var numCorrect = QuestionTracker.find({
					cor: true,
					subc: subcategory,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
		}
		// Both fields empty, query for date only
		else 
		{
			var numCorrect = QuestionTracker.find({
				cor: true,
				date: {"$gte" : today}}).count();
			var quesAnswered = UserInteraction.questionsCompTotal();
			return (numCorrect/quesAnswered) * 100;
		}
	},

	// Average time spent per question.
	// TODO INCLUDE CHECKS FOR SUBJECT, SUBCATEGORY, AND TOPIC
	quesTimeAverage: function(subject, subcategory, topic) {
		var questions = 0;
		if (subject) {
			questions = QuestionTracker.find({subj:subject}).fetch(); 
		} 
		else {
			questions = QuestionTracker.find().fetch(); 
		}
		var sumDurations = 0;
		for (i = 0; i < questions.length; i++) {
			sumDurations += parseInt(questions[i].dur);
		}
		// No questions in this subject/subcategory/topic
		if (sumDurations == 0) {
			return 0;
		}
		return sumDurations / questions.length;
	},

	///////////////
	// Quiz Data //
	///////////////

	// Quiz total score.
	quizScoreTotal: function(subject) {
		var quizzes = 0;
		if (subject) {
			quizzes = Quizzes.find({subject:subject}).fetch();
		}
		else {
			quizzes = Quizzes.find().fetch();
		}
		var total = 0;
		for (i = 0; i < quizzes.length; i++) {
			if (typeof quizzes[i].total !== 'undefined') {
				console.log(quizzes[i].subject);
				total += parseInt(quizzes[i].total);
			}
		}
		console.log(total);
		return total;
	},

	// Average time spent per quiz.
	quizTimeAverage: function(subject) {
		var quizzes = 0;
		if (subject) {
			quizzes = Quizzes.find({subject:subject}).fetch();
		}
		else {
			quizzes = Quizzes.find().fetch();
		}
		var sumDurations = 0;
		for (i = 0; i < quizzes.length; i++) {
			// Some quizzes aren't finished (user refreshes or leaves page, so these fields may be undefined).
			if (typeof quizzes[i].time_end !== 'undefined' && typeof quizzes[i].time_start !== 'undefined') {
				console.log(parseInt(quizzes[i].time_end) - parseInt(quizzes[i].time_start));
				sumDurations += parseInt(quizzes[i].time_end) - parseInt(quizzes[i].time_start);	
			}
		}

		return sumDurations;

		// No quizzes taken in this subject, return 0.
		if (sumDurations == 0) {
			return 0;
		}
		var average = sumDurations / quizzes.length;
		var seconds = parseInt((average / 1000) % 60, 10);
		if(seconds < 10)
		{
			seconds = "0" + String(seconds);
		}
		var minutes = parseInt((average / 1000 / 60), 10);
		var timeString = minutes + ":" + seconds;
		return timeString
	},
}
