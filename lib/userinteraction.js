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
			topic: question.topic,
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
	percentCorrect: function(weeksAgo, subject, subcategory, topic) {
		var today = new Date();
		today.setDate(today.getDate()-(7*weeksAgo));
		var quesAnswered = UserInteraction.questionsCompTotal();
		// Subject field filled
		var numCorrect = QuestionTracker.find({
					cor: true,
					subj: subject,
					subc: subcategory,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
		if (subject) {
			// Subcategory field also filled
			if (subcategory) {
				// All three fields filled, query for all three
				if (topic) {
					var numCorrect = QuestionTracker.find({
					cor: true,
					subj: subject,
					subc: subcategory,
					topic: topic,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
				}
				// Only subject and subcategory field filled
				else {
					var numCorrect = QuestionTracker.find({
					cor: true,
					subj: subject,
					subc: subcategory,
					date: {"$gte" : today}}).count();
				return (numCorrect/quesAnswered) * 100;
				}
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
		// No fields filled, search for everything
		else {
			var numCorrect = QuestionTracker.find({
				cor: true,
				date: {"$gte" : today}}).count();
			var quesAnswered = UserInteraction.questionsCompTotal();
			return (numCorrect/quesAnswered) * 100;
		}
	},

	// Average time spent per question.
	quesTimeAverage: function(weeksAgo, subject, subcategory, topic) {
		var questions = 0;
		var today = new Date();
		today.setDate(today.getDate()-(7*weeksAgo));
		if (subject) {
			// Subject and subcategory specified, check for topic
			if (subcategory) {
				// All three fields specified, search for all three fields.
				if (topic) {
					questions = QuestionTracker.find({
						subj:subject, 
						subc:subcategory, 
						topic:topic,
						date: {"$gte" : today}}).fetch();
				}
				// Otherwise, search for subject and subcategory only.
				else {
					questions = QuestionTracker.find({
						subj:subject, 
						subc:subcategory,
						date: {"$gte" : today}}).fetch(); 			
				}
			}
			// Subcategory not specified, just search for subject
			else {
				console.log(subject);
				questions = QuestionTracker.find({
					subj:subject,
					date: {"$gte" : today}}).fetch(); 
			}
		}
		// Else, search for all questions
		else {
			questions = QuestionTracker.find({date: {"$gte" : today}}).fetch(); 
		}
		var sumDurations = 0;
		for (i = 0; i < questions.length; i++) {
			console.log()
			sumDurations += parseFloat(questions[i].dur);
		}

		console.log("sumDurations = " + sumDurations);
		// No questions in this subject/subcategory/topic
		if (sumDurations == 0) {
			return 0;
		}

		var average = sumDurations / questions.length;
		// Round to two decimal places
		return Math.round(average * 100) / 100
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
				total += parseInt(quizzes[i].total);
			}
		}
		return total;
	},

	// Average time spent per quiz.
	quizTimeAverage: function(weeksAgo, subject) {
		var today = new Date();
		today.setDate(today.getDate()-(7*weeksAgo));
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
			if (typeof quizzes[i].time_finish !== 'undefined' && typeof quizzes[i].time_start !== 'undefined') {
				sumDurations += (parseFloat(quizzes[i].time_finish) - parseFloat(quizzes[i].time_start));
			}
		}
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
		var minutes = parseInt((average / 1000) / 60, 10);
		
		var timeString = minutes + ":" + seconds;
		return timeString
	},
}
