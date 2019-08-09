/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var totalQuestions;
	var currentQuestion = 1;
	var arraySubmitedAnswers = [];
	var currentAnswer1 = 0;
	var currentAnswerType = 0;
	var commonDB = require('commonDB');
	var question = [];
}
/**
 * Open Window
 */
$.likertSurvey.addEventListener("open", function(e) {
	try {
		
		question = commonDB.getSurveyQuestions(args.surveyID);
		totalQuestions = question.length;
		loadingValues(question);
	} catch(ex) {
		commonFunctions.handleException("likertSurvey", "open", ex);
	}
});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
/**
 * Loading Initial Questions.
 */
function loadingValues() {
	try {
		if (currentQuestion % 2 != 0) {
			$.linkertAnswerview1.visible = true;
			$.linkertAnswerview2.visible = false;
		} else {
			$.linkertAnswerview1.visible = false;
			$.linkertAnswerview2.visible = true;
		}
		if (arraySubmitedAnswers[currentQuestion - 1] == null) {
			currentAnswer1 = 0;
			currentAnswerType = 0;
		} else {

			currentAnswer1 = arraySubmitedAnswers[currentQuestion - 1].answer1;
			currentAnswerType = arraySubmitedAnswers[currentQuestion - 1].currentAnswerType;
		}
		setAnswer(currentAnswer1, currentAnswerType);
		$.questionLabel.text = question[currentQuestion - 1].surveyQuestions;
		var progressValue = parseFloat((currentQuestion / totalQuestions) * 100).toFixed(2);
		var progerssWidth = progressValue + "%";
		$.progressBarLine.width = progerssWidth;
		var questionNumber = currentQuestion + "/" + totalQuestions;
		$.numberLabel.text = questionNumber;
	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "loadingValues", ex);
	}
}

/**
 * Handle back button click.
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	try {
		if (currentQuestion == 1) {
			currentQuestion = 0;
			Alloy.Globals.SURVEY_COMMENTS = "";
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('likertSurvey');
		} else {
			currentQuestion = currentQuestion - 1;
			loadingValues();
		}

	} catch(ex) {
		commonFunctions.handleException("likertSurvey", "goBack", ex);
	}

}

/**
 * Submit questions and contine survey.
 */
function onSubmitClick(e) {
	try {

		if (currentAnswer1 == 0) {
			commonFunctions.showAlert(L('slectLikertAnswerType'));
			return;
		}

		if (arraySubmitedAnswers[currentQuestion - 1] == null) {

			arraySubmitedAnswers.push({
				"answer1" : currentAnswer1,
				"currentAnswerType" : currentAnswerType,
			});
		} else {
			var jObject = {
				"answer1" : currentAnswer1,
				"currentAnswerType" : currentAnswerType,
			};
			arraySubmitedAnswers[currentQuestion - 1] = jObject;
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
		commonFunctions.handleException("likertSurvey", "onSubmitClick", ex);
	}

}

/**
 * Set answer response.
 */
function setAnswer(an1, type) {
	try {
		$.neverButton.image = "/images/surveyTypes/check-box.png";
		$.rarelyButton.image = "/images/surveyTypes/check-box.png";
		$.someTimesButton.image = "/images/surveyTypes/check-box.png";
		$.oftenButton.image = "/images/surveyTypes/check-box.png";
		$.alltimeButton.image = "/images/surveyTypes/check-box.png";
		$.agreeButton.image = "/images/surveyTypes/check-box.png";
		$.stronglyAgreeButton.image = "/images/surveyTypes/check-box.png";
		$.normalButton.image = "/images/surveyTypes/check-box.png";
		$.disAgreeButton.image = "/images/surveyTypes/check-box.png";
		$.stronglyDisagreeButton.image = "/images/surveyTypes/check-box.png";
		if (type == 1) {

			if (an1 == 1) {
				$.neverButton.image = "/images/surveyTypes/check-box-active.png";
			} else if (an1 == 2) {
				$.rarelyButton.image = "/images/surveyTypes/check-box-active.png";
			} else if (an1 == 3) {
				$.someTimesButton.image = "/images/surveyTypes/check-box-active.png";
			} else if (an1 == 4) {
				$.oftenButton.image = "/images/surveyTypes/check-box-active.png";
			} else if (an1 == 5) {
				$.alltimeButton.image = "/images/surveyTypes/check-box-active.png";
			}
		} else if (type == 2) {

			if (an1 == 1) {
				$.agreeButton.image = "/images/surveyTypes/check-box-active.png";
			} else if (an1 == 2) {
				$.stronglyAgreeButton.image = "/images/surveyTypes/check-box-active.png";
			} else if (an1 == 3) {
				$.normalButton.image = "/images/surveyTypes/check-box-active.png";
			} else if (an1 == 4) {
				$.disAgreeButton.image = "/images/surveyTypes/check-box-active.png";
			} else if (an1 == 5) {
				$.stronglyDisagreeButton.image = "/images/surveyTypes/check-box-active.png";
			}
		}

	} catch(ex) {
		commonFunctions.handleException("likertSurvey", "setAnswer", ex);
	}

}

/**
 * Click of first answer response.
 */
function answerOneClick(e) {
	try {
		currentAnswerType = 1;
		if (e.source.id == "neverButtonView") {
			currentAnswer1 = 1;
		} else if (e.source.id == "rarelyButtonView") {
			currentAnswer1 = 2;
		} else if (e.source.id == "someTimesButtonView") {
			currentAnswer1 = 3;
		} else if (e.source.id == "oftenButtonView") {
			currentAnswer1 = 4;
		} else if (e.source.id == "alltimeButtonView") {
			currentAnswer1 = 5;
		}
		setAnswer(currentAnswer1, currentAnswerType);
	} catch(ex) {
		commonFunctions.handleException("likertSurvey", "answerOneClick", ex);
	}
}

/**
 * Click of second answer response.
 */
function answerTwoClick(e) {
	try {
		currentAnswerType = 2;
		if (e.source.id == "agreeButtonView") {
			currentAnswer1 = 1;
		} else if (e.source.id == "stronglyAgreeButtonView") {
			currentAnswer1 = 2;
		} else if (e.source.id == "normalButtonView") {
			currentAnswer1 = 3;
		} else if (e.source.id == "disAgreeButtonView") {
			currentAnswer1 = 4;
		} else if (e.source.id == "stronglyDisagreeButtonView") {
			currentAnswer1 = 5;
		}
		setAnswer(currentAnswer1, currentAnswerType);
	} catch(ex) {
		commonFunctions.handleException("likertSurvey", "answerTwoClick", ex);
	}

}
