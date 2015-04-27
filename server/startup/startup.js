// This function will be run once the server has started
Meteor.startup(function () {
	// Set up the HTTP forwarding enviornment variable
	// This is the number of servers (reverse proxies) between a client and this server
	// See http://docs.meteor.com/#/full/meteor_onconnection for more info
	process.env.HTTP_FORWARDED_COUNT = 1;
	
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

});