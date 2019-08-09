/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var commonDB = require('commonDB');
	var resultArray = [];
	var resultDetailsArray = [];
	var indexNumber;

}
if (args.itemName != null || args.itemName != undefined) {

}

$.surveyResultScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "120dp";
			}
		}
		init();
	} catch(ex) {
		commonFunctions.handleException("surveyResultScreen", "open", ex);
	}
});
$.surveyResultScreen.addEventListener('android:back', function() {
	goBack();
});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
/**
 * Initialisation function
 */
function init() {
	try {

		resultDetailsArray = commonDB.getSurveyResultDetails(args.surveyId, args.groupId);
		Ti.API.info('resultDetailsArray : ', JSON.stringify(resultDetailsArray));
		var totalQuestions = resultDetailsArray.length;
		var outerViewHeight;

		for (var i = 0; i < resultDetailsArray.length; i++) {
			Ti.API.info('indexNumber : ', i, resultDetailsArray.length);
			if (i < 9) {
				indexNumber = "0" + "" + (i + 1);

			} else {
				indexNumber = i + 1;
			}
			var upperLineVisiblity = true;
			var bottomLineVisiblity = true;

			if (i == 0) {
				upperLineVisiblity = false;
			} else if (i == totalQuestions - 1) {
				bottomLineVisiblity = false;
			}
			Ti.API.info('indexNumber: ', indexNumber);
			var questionText = resultDetailsArray[i].surveyQuestions;
			Ti.API.info('questionText : ', questionText);
			var questionTextLength = questionText.length;

			outerViewHeight = (questionTextLength / 25) * 12 + 100;
			var lineheight = outerViewHeight / 2;
			var answerText = resultDetailsArray[i].answer;
			Ti.API.info('answ test is', answerText.length);
			resultArray.push({
				template : "freeResponseSurveyResultTemplate",
				indexLabel : {
					text : indexNumber
				},
				questionLabel : {
					text : questionText

				},
				listOuterView : {
					height : outerViewHeight + 'dp',
				},
				upperLineView : {
					height : lineheight + 'dp',
					visible : upperLineVisiblity
				},
				bottomLineView : {
					height : lineheight,
					top : lineheight - 1 + 'dp',
					visible : bottomLineVisiblity
				},
				answerLabel : {
					color : "#359ffe"
				},
				userResultLabel : {
					text : answerText
				}

			});

		}
		$.surveyResultSection.setItems(resultArray);
	} catch(ex) {
		commonFunctions.handleException("surveyResultScreen", "init", ex);
	}

}

$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveyResultScreen');
}
