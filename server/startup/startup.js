// This function will be run once the server has started
Meteor.startup(function () {
	// Set the email enviornment
	// TODO: Keeping the email password hardcoded is dumb and insecure
	// make this read directly from the enviornment
	var email = {
		username: "mailman@mg.plutoprep.com",
		password: "s$avb*W2GP%p6y", // Set randomly, can change on MailGun's site
		host: "smtp.mailgun.org",
		port: "465"
	}
	process.env.MAIL_URL = "smtp://" + email.username + ":" + email.password + "@" + email.host + ":" + email.port + "/";

	// Clear all active quizzes since we're newly starting
	ActiveQuizzes.remove({});

	// Clear the list of quiz seekers
	QuizSeekers.remove({});

});