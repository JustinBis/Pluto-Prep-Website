
// For the login buttons, show an optional email feild
if(Meteor.isClient)
{
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
	});
}