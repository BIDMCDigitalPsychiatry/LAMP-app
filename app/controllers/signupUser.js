// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');

// Question collection
var questions = null;
// Total number of questions.
var totalQuestions = 0;
// Index of currently showing questions.
var currentQuestionIndex = 0;
var isAccept = false;

/**
 * Method to initialize the page.
 */
function init() {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.bodyOuterContainer.top = "80dp";
			$.supportLabel.bottom = "15dp";
		}

	}
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	var titleText = commonFunctions.L('signInUserSignUp', LangCode);
	if (Alloy.Globals.iPhone5) {
		if (LangCode == "pt-br") {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		} else {
			$.headerView.setTitle(commonFunctions.L('signInUserSignUp', LangCode));
		}

	} else {
		$.headerView.setTitle(commonFunctions.L('signInUserSignUp', LangCode));
	}
	$.quizHeadLabel.text = commonFunctions.L('quizHeading', LangCode);
	$.quizDescriptionLabel1.text = commonFunctions.L('quizDescriptionLine1', LangCode);
	$.quizDescriptionLabel2.text = commonFunctions.L('quizDescriptionLine2', LangCode);
	$.signUpNextButton.text = commonFunctions.L('next', LangCode);
	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);

	questions = GetQuestions();

	// Check for questions.
	if (questions != null && questions.length > 0) {
		// Get total number of questions
		totalQuestions = questions.length;

		// For prototype
		// questions[currentQuestionIndex].isAnswered = true;

		// Puplate quetion
		populateQuestion(questions, currentQuestionIndex);
	}
}

$.signupUser.addEventListener("open", function(e) {
	resetOptions();

});
$.signupUser.addEventListener('android:back', function() {
	goBack();
});

/**
 * Method to pupulate question
 */
function populateQuestion(questions, index) {

	if (questions != null && questions.length > 0) {

		if (index >= 0 && index < questions.length) {

			var currentQuestion = questions[index];

			// Check wther the question is already answered or not
			// Commented for prototye
			if (currentQuestion.isAnswered == false) {

				$.quizQuestion.text = currentQuestion.question;

				resetOptions();

			} else// Pupulate based on answer - not sure whether this section is required or not - anish
			{

			}

		} else {
			// Show message/throw exception for out of index if required.-anish
		}

		setProgressBar();

	}
}

/**
 * Funciton to set answer for the current question.
 */
function setAnswer(option) {

	// Check for valid questions
	if (questions != null && questions.length > 0) {
		// Check for valid index
		if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
			// Set answered status to true.
			questions[currentQuestionIndex].isAnswered = true;
			// Set anser based on provided option (Yes/No) value (1/0)
			questions[currentQuestionIndex].answer = option;
		}
	}

	//alert(JSON.stringify(questions));
}

/**
 * Function to set progress bar based on the number of questions answered.
 */
function setProgressBar() {

	var progressBarPercentage = 0;
	var currentlyAnswered = 0;

	// Check for valid questions
	if (questions != null && questions.length > 0) {

		// Loop through questions
		for ( index = 0; index < questions.length; index++) {
			var question = questions[index];

			// This commented to give proto type
			if (question.isAnswered == true) {
				currentlyAnswered++;
			}
		}
		// Get the percetage of completion that can be used for setting progress bar length
		progressBarPercentage = Math.round((currentlyAnswered / questions.length) * 100);

		// Set progress bar length.
		$.progressBarLine.width = progressBarPercentage.toString() + "%";

	}

}

/**
 * Method to reset options.
 */
function resetOptions() {
	$.optionYes.image = "/images/signupUser/yes.png";
	$.optionNo.image = "/images/signupUser/no.png";
}

/**
 * Event handler for Yes option
 */
function optionYesClick(e) {
	isAccept = true;
	// Unselected status
	if ($.optionYes.image.toLowerCase() == "/images/signupUser/yes.png".toLowerCase()) {
		$.optionYes.image = "/images/signupUser/yes-selected.png";
		$.optionNo.image = "/images/signupUser/no.png";
	}
	// Set answer to 1 - Yes
	setAnswer(1);

	setProgressBar();

}

/**
 * Event handler for No option
 */
function optionNoClick(e) {
	isAccept = false;

	// Change style
	if ($.optionNo.image.toLowerCase() == "/images/signupUser/no.png".toLowerCase()) {
		$.optionNo.image = "/images/signupUser/no-selected.png";
		$.optionYes.image = "/images/signupUser/yes.png";
	}
	// Set answer to 0 - No
	setAnswer(0);

	setProgressBar();
}

/**
 * Event handler for next button click
 */
function signUpNextClick(e) {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}
	// Check for valid question
	if (questions != null && questions.length > 0) {
		// Check whether the index is within the range.
		if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
			if (isAccept == false && questions[currentQuestionIndex].isAnswered == true) {
				commonFunctions.showAlert(commonFunctions.L('agreeTermLbl', LangCode));
				return;

			}
			// Check whether the question is answered or not. its commented to give prototype
			if (questions[currentQuestionIndex].isAnswered == true) {

				// Check for the last question.
				if (currentQuestionIndex == questions.length - 1) {
					// Move to the consent page.
					Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signupUserConsent');
				} else// Move to the next question.
				{
					// Incriment index for next question.
					currentQuestionIndex++;

					// Added for prototype, should be removed - anish
					// questions[currentQuestionIndex].isAnswered = true;

					// Populate question.
					populateQuestion(questions, currentQuestionIndex);
					// Set progress bar based on the number of questions answered.
					setProgressBar();
				}

			} else {
				commonFunctions.showAlert(commonFunctions.L('pleaseAnswerQuestion', LangCode));
			}
		}
	}

}

$.headerView.on('backButtonClick', function(e) {
	//alert("Hello");
	goBack();
});

function goBack() {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow("signupUser");
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	//Ti.API.info('enter the current window', parentWindow);
	if (parentWindow != null && parentWindow.windowName === "signin") {
		//Ti.API.info('enter the current window');
		parentWindow.window.refreshSignIn();
	}
}

/**
 * Method to get questions.
 */
function GetQuestions() {
	var LangCode = Ti.App.Properties.getString('languageCode');
	if (LangCode == "" || LangCode == null) {
		LangCode = "en";
	}

	var questions = [{
		question : commonFunctions.L('term1', LangCode),
		isAnswered : false,
		answer : 0
	}, {
		question : commonFunctions.L('term2', LangCode),
		isAnswered : false,
		answer : 0
	}, {
		question : commonFunctions.L('term3', LangCode),
		isAnswered : false,
		answer : 0
	}, {
		question : commonFunctions.L('term4', LangCode),
		isAnswered : false,
		answer : 0
	}];

	return questions;
}

// Intialize the form
init();
