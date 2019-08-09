/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var totalQuestions = 3;
	var currentQuestion = 1;
	var arraySubmitedAnswers = [];
	var currentAnswer = "";
}
$.commentBoxText._hintText = $.commentBoxText.value;

/**
 * Open Window.
 */
$.freeResponseSurvey.addEventListener("open", function(e) {
	try {
		var headerTitile = args.itemName;
		$.headerView.setTitle(headerTitile);
		loadingValues();
		var flexSpace = Ti.UI.createButton({
			systemButton : Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE
		});
		var done = Ti.UI.createButton({
			title : "Done",
		});
		done.addEventListener('click', function(e) {
			$.commentBoxText.blur();

		});

		$.commentBoxText.keyboardToolbar = [flexSpace, done];
	} catch(ex) {
		commonFunctions.handleException("freeResponseSurvey", "open", ex);
	}
});

/**
 * Loading initial Questions.
 */
function loadingValues() {
	try {
		if (arraySubmitedAnswers[currentQuestion - 1] == null) {
			currentAnswer = "";
			$.commentBoxText.value = $.commentBoxText._hintText;
		} else {
			currentAnswer = arraySubmitedAnswers[currentQuestion - 1];
			$.commentBoxText.value = currentAnswer;
		}
		var progressValue = parseFloat((currentQuestion / totalQuestions) * 100).toFixed(2);
		var progerssWidth = progressValue + "%";
		$.progressBarLine.width = progerssWidth;
		var questionNumber = currentQuestion + "/" + totalQuestions;
		$.numberLabel.text = questionNumber;
	} catch(ex) {
		commonFunctions.handleException("freeResponseSurvey", "loadingValues", ex);
	}
}

/**
 * Android back button handler
 */
$.freeResponseSurvey.addEventListener('android:back', function() {
	goBack();
});

/**
 * Handle back Click
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * goBack function handler
 */
function goBack(e) {
	try {

		if (currentQuestion == 1) {
			currentQuestion = 0;
			Alloy.Globals.SURVEY_COMMENTS = "";
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('freeResponseSurvey');
		} else {
			currentQuestion = currentQuestion - 1;
			loadingValues();
		}

	} catch(ex) {
		commonFunctions.handleException("freeResponseSurvey", "goBack", ex);
	}

}

/**
 * Submit and Continue Survey.
 */
function onSubmitClick(e) {
	try {

		if ($.commentBoxText.value == "" || $.commentBoxText.value == $.commentBoxText._hintText) {
			commonFunctions.showAlert(L('enterAnswer'));
			return;
		}

		currentAnswer = $.commentBoxText.value;
		if (arraySubmitedAnswers[currentQuestion - 1] == null) {
			arraySubmitedAnswers.push(currentAnswer);
		} else {
			arraySubmitedAnswers[currentQuestion - 1] = currentAnswer;
		}
		if (currentQuestion != totalQuestions) {
			currentQuestion = currentQuestion + 1;
			loadingValues();
		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('comments', {
				'currentSurveyType' : args.currentSurveyType
			});
		}

	} catch(ex) {
		commonFunctions.handleException("freeResponseSurvey", "onSubmitClick", ex);
	}
}

/**
 * textArea focus event
 */
$.commentBoxText.addEventListener('focus', function(e) {
	if (e.source.value == e.source._hintText) {
		e.source.value = "";
	}
});

/**
 * textArea blur event
 */
$.commentBoxText.addEventListener('blur', function(e) {
	if (e.source.value == "") {
		e.source.value = e.source._hintText;
	}
});

/**
 * Window click handler
 */
function windowClick(e) {
	try {
		if (e.source.id != "commentBoxText") {
			$.commentBoxText.blur();

		}
	} catch(ex) {
		commonFunctions.handleException("freeResponseSurvey", "windowClick", ex);
	}

}
