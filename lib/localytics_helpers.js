// Helper file for localytics events

Localytics = {
	// Localytics function to call for when a user closes leaves the screen.
	// Records duration that user was on the current screen.
	// TODO: IMPLEMENT TRACKING OF QUIZ PAGE! URL changes when quiz progresses,
	// can't use 'unload' option on routes in this case.
	llViewDuration: function(page) {
		console.log("llview start time = " + Session.get("startTime"));
		var endTime = (new Date()).getTime();
		var duration = endTime - Session.get("startTime");
		
		duration = duration / 1000;
		
		var secondBuckets = [3, 10, 30, 60, 180, 600, 1800, 3600];
		var secondBucketsName = ["0 - 3 seconds", 
	    "3 - 10 seconds", "10 - 30 seconds", "30 - 60 seconds",
	    "1 - 3 minutes", "3 - 10 minutes", "10 - 30 minutes", "30 - 60 minutes",
	    "> 1 hour"];

	    console.log(duration);

	    for (i = 0; i < secondBuckets.length; i++) {
	    	if (secondBuckets[i] > duration) {
	    		console.log("page duration = " + secondBucketsName[i]);
	    		console.log("page name = " + page);
	    		var eventName = page + " Duration";
	    		console.log(eventName);
	    		ll('tagEvent', eventName, {'Time': secondBucketsName[i]});
	    		return;
	    	}
	    }
	    throw new Meteor.Error("err-view-duration", "View duration invalid.");
	},

	setDurStartTime: function(startTime, page) {
		Session.set("startTime", startTime);
	},
}