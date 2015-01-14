Template.appNotFound.helpers({
	quip: function() {
		var quips = [
			"Or maybe it moved. Who knows.",
			"We promise we're trying to find it.",
			"That's a 404 for you internet people",
			"Don't worry though, we have plenty more pages to be found."
		];
		// Select a random quip
		return quips[ Math.floor(Math.random() * quips.length) ];
	}
});