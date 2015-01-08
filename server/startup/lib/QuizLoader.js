// Make the QuizLoader module globally available
QuizLoader = {}

QuizLoader.files = [
	'quizdata/biology.csv'
]

QuizLoader.expectedFields = [
	'subject',
	'subcategory',
	'question',
	'a',
	'b',
	'c',
	'd',
	'answer',
	'long_explanation',
	'short_explanation'
]

/**
 * Loads the quiz data from a comma seperated values file
 * @arg filename <String> the filename of the .csv file
 */
QuizLoader.loadData = function() 
{
	// Drop the existing data from the database
	Questions.remove({});
	console.log("QuizLoader: removed all old questions");

	// Try to open the file on disk
	console.log("QuizLoader: loading quiz file");
	var filename = QuizLoader.files[0];
	QuizLoader.loadFile(filename);

	console.log("QuizLoader: finished adding new questions");

}

/**
 * Loads a single csv file from the given filename
 */
QuizLoader.loadFile = function(filename)
{
	// Load the csv string from the file
	// Done sync, but can be async if given a callback, see Meteor docs
	var csv = Assets.getText(filename);
	
	// Parse the csv string
	var results = Papa.parse(csv, {
		// We have headers naming the data
		header: true,
		// Set types so everything isn't a string
		dynamicTyping: true,
		// Skip empty lines
		skipEmptyLines: true
	});

	// Make sure the correct fields were seen
	if(!QuizLoader.checkFields(results.meta.fields))
	{
		console.error("QuizLoader error: fields don't match for data file: " + filename);
		// If the fields don't match, exit so we don't add this to the database
		return;
	}

	// Add this info to the database
	QuizLoader.addData(results.data);
}


/**
 * Compares the passed array to the expected fields array
 * Returns true if they match, false if they are different
 */
QuizLoader.checkFields = function(fieldsArray)
{
	// Compare lengths first to save time on long arrays
	if (fieldsArray.length != QuizLoader.expectedFields.length)
	{
		return false;
	}

	// Loop through each entry and compare
	for (var i = 0, l=fieldsArray.length; i < l; i++) {
		if (fieldsArray[i] != QuizLoader.expectedFields[i]) { 
			return false;   
		}
	}
	return true;
}


/**
 * Adds the passed javascript object into the quiz database
 * @arg quizdata <Array> the array of quiz data objects to insert
 * Note: this function runs synchronously, so it's slow
 */
QuizLoader.addData = function(quizdata)
{
	// Meteor currently does not support bulk insertion
	// So we iterate through the array one by one
	quizdata.forEach(function(val, index, array) { 
		// Make sure the data object is formatted correctly
		QuizLoader.formatData(val);
		// Insert this value into the database
		Questions.insert(val);
	});
}

/**
 * Formats a quiz data object to be database ready.
 *
 * Changes this will make:
 * Should make the answer string lowercase
 * TODO: will reformat newlines to be Markdown friendly
 */
QuizLoader.formatData = function(dataobject)
{
	// Make the answer field lowercase
	dataobject.answer = dataobject.answer.toLowerCase();
}


