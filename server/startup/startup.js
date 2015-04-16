// This function will be run once the server has started
Meteor.startup(function () {
	// Set the email enviornment
	// TODO: Keeping the email password hardcoded is dumb and insecure
	// make this read directly from the enviornment
	var email = {
		username: "mailman@mg.plutoprep.com",
		password: "H5SPq7gHAq6HdnEuhYAZkUm2rX", // Set randomly, can change on MailGun's site
		host: "smtp.mailgun.org",
		port: "465"
	}
	process.env.MAIL_URL = "smtp://" + email.username + ":" + email.password + "@" + email.host + ":" + email.port + "/";

	// Clear the list of quiz seekers
	QuizSeekers.remove({});

});