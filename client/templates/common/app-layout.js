Template.appLayout.rendered = function() {
	this.find('#content-container')._uihooks = {
		insertElement: function(node, next) {
			// Animate the inserted element in from the right
			var duration = 0.65;
			TweenLite.from(node, duration, {left:"100%"});

			// Insert the element into the DOM so we can see it
			$(node).insertBefore(next);
		},
		removeElement: function(node) {
			// Animate the deleted element out to the left
			var duration = 0.65;
			TweenLite.to(node, duration, {
				left: "auto",
				right:"100%",
				onComplete: function (node) {
					// Get rid of the node marked for deletion
					// once the animation finishes
					$(node).remove();
				},
				onCompleteParams: [node]
			});
		}
	};
};