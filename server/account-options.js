Accounts.config({
	// Always send a verification email
	sendVerificationEmail: true
});

// Validate user data before creating an account
Accounts.validateNewUser(function(user) {
	// Make sure we were given a username in the profile
	if(!user.profile['username'])
	{
		console.error("User did not provide a username");
		throw new Meteor.Error(403, "You must provide a username");
	}

	// Since Meteor doesn't send passwords over the wire, we can't validate passwords on the server

	// All good!
	return true;
});
