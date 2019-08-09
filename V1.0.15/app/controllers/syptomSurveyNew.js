// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var commonDB = require('commonDB');
	var pickerValues = require('pickerValues');
	var serviceManager = require('serviceManager');
	var Picker = require('picker');
	var credentials = Alloy.Globals.getCredentials();
	var pickerValues = require('pickerValues');

	var totalQuestions = 0;
	var currentQuestion = 2;
	var arraySubmitedAnswers = [];
	var currentAnswer1 = null;
	var currentAnswer2 = null;
	var allQuestionsArray = [];
	var symptomStartTime = null;
	var symptomEndTime = null;
	var surveyStartTime = null;
	var surveyEndTime = null;
	var currentPro = 0;
	var pageAnswerCount = 0;
	var credentials = Alloy.Globals.getCredentials();
	var answerViewSetTop = [];
	var answerViewSetBottom = [];
	var surveyQuesAns = [];
	var surveyDataArray = [];
	var distSurveyQuesAns = [];
	var distSurveyDataArray = [];
	var LangCode = Ti.App.Properties.getString('languageCode');
	var points = 0;
	var gamePoints = 0;
	var pickerControlTop = null;
	var pickerControlBottom = null;
	var picker_data = null;
	var selectedRow1 = 0;
	var selectedRow2 = 0;
	var scrollTimer = null;
	var isSubmited = false;
	var defaultTimeVal = null;
	var questionDisplayedTime = new Date();
	var answer1Time = new Date();
	var answer2Time = new Date();
	var answer1Distance = "";
	var answer2Distance = "";
	var answerDistance = "";
	var callScoreView = 0;
	var pickerDataCommon = [];
	var pickerDataCommonBottom = [];
	var StatusType = 1;
	var surveyAnsLanguage = "en";
	var enableSurveyPopup = false;
	var thresholdSelection = 0;
	var surveyPopupMessage = "";
	var currentDisplayNumb = 2;
	var responseTextArea;
	var responseTextAreaBottom;
	var isBackbuttonClicked = false;
}

/**
 * function for window open
 */

$.syptomSurveyNew.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.outerMostView.top = "80dp";
			}

		}
		var titleText = commonFunctions.L('surveyMenu', LangCode);
		if (Alloy.Globals.iPhone5) {
			$.headerView.setTitle(commonFunctions.trimText(titleText, 12));
		} else {
			$.headerView.setTitle(titleText);
		}

		$.answerlabel.text = commonFunctions.L('answeredLbl', LangCode);
		$.doneLabel.text = commonFunctions.L('next', LangCode);
		
		if (Ti.Platform.osname == "ipad") {
			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
		}
		if (args.isFrom == "memoryTest") {
			$.headerView.setLeftViewVisibility(false);
		} else {
			$.headerView.setQuitViewVisibility(true);
			
			if (OS_IOS) {
				$.headerView.setQuitViewPosition();
			} else {
				$.headerView.quitViewPositionAndroidPhone();
			}

		}
		var surveyInfo = commonDB.getGameScore(credentials.userId);
		for (var i = 0; i < surveyInfo.length; i++) {
			if (surveyInfo[i].gameID == 19) {
				gamePoints = surveyInfo[i].points;
			}
		}

		allQuestionsArray = commonDB.getSurveyQuestions(args.surveyID);
		Ti.API.info('allQuestionsArray : ', JSON.stringify(allQuestionsArray));
		var surveyPopupValues = JSON.stringify(allQuestionsArray);

		
		totalQuestions = allQuestionsArray.length;
		Ti.API.info('totalQuestions : ', totalQuestions);
		symptomStartTime = new Date().toUTCString();

		if (totalQuestions != 0) {
			if (totalQuestions == 1) {
				$.doneLabel.text = commonFunctions.L('submitLbl', LangCode);
				$.questionDevider.visible = false;
				currentQuestion = 1;
				loadingValues(1, false);
			} else {
				if (totalQuestions == 2) {
					$.doneLabel.text = commonFunctions.L('submitLbl', LangCode);
				}
				$.questionDevider.visible = true;
				loadingValues(2, false);
			}

		} else {

		}
		setTimeout(function() {
			commonFunctions.closeActivityIndicator();
			$.outerMostView.visible = true;
		}, 100);

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "open", ex);
	}
});

function restartSurvey() {
	totalQuestions = 0;
	currentQuestion = 2;
	arraySubmitedAnswers = [];
	currentAnswer1 = null;
	currentAnswer2 = null;
	allQuestionsArray = [];
	symptomStartTime = null;
	symptomEndTime = null;
	surveyStartTime = null;
	surveyEndTime = null;
	currentPro = 0;
	pageAnswerCount = 0;
	credentials = Alloy.Globals.getCredentials();
	answerViewSetTop = [];
	answerViewSetBottom = [];
	surveyQuesAns = [];
	surveyDataArray = [];
	distSurveyQuesAns = [];
	distSurveyDataArray = [];
	LangCode = Ti.App.Properties.getString('languageCode');
	points = 0;
	gamePoints = 0;
	pickerControlTop = null;
	pickerControlBottom = null;
	picker_data = null;
	selectedRow1 = 0;
	selectedRow2 = 0;
	scrollTimer = null;
	isSubmited = false;
	defaultTimeVal = null;
	questionDisplayedTime = new Date();
	answer1Time = new Date();
	answer2Time = new Date();
	answer1Distance = "";
	answer2Distance = "";
	answerDistance = "";
	callScoreView = 0;
	pickerDataCommon = [];
	pickerDataCommonBottom = [];
	StatusType = 1;

	var surveyInfo = commonDB.getGameScore(credentials.userId);
	for (var i = 0; i < surveyInfo.length; i++) {
		if (surveyInfo[i].gameID == 19) {
			gamePoints = surveyInfo[i].points;
		}
	}
	Ti.App.addEventListener('getValues', getSurveyValues);
	allQuestionsArray = commonDB.getSurveyQuestions(args.surveyID);
	totalQuestions = allQuestionsArray.length;
	Ti.API.info('totalQuestions : ', totalQuestions);
	symptomStartTime = new Date().toUTCString();

	if (totalQuestions != 0) {
		if (totalQuestions == 1) {
			$.doneLabel.text = commonFunctions.L('submitLbl', LangCode);
			$.questionDevider.visible = false;
			currentQuestion = 1;
			loadingValues(1, false);
		} else {
			if (totalQuestions == 2) {
				$.doneLabel.text = commonFunctions.L('submitLbl', LangCode);
			}
			$.questionDevider.visible = true;
			loadingValues(2, false);
		}

	} else {

	}
	setTimeout(function() {
		commonFunctions.closeActivityIndicator();
		$.outerMostView.visible = true;
	}, 100);
}

function loadingValues(displayNumb, isBack) {

	try {
		currentDisplayNumb = displayNumb;
		callScoreView = 0;
		pageAnswerCount = 0;
		//Load Top Area Question
		removeAllPreviousViews();
		if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 4) {
			Ti.API.info('Hide status bar');

		} else {

		}

		$.topAddonView.add(setQuestion(allQuestionsArray[currentQuestion - displayNumb].surveyQuestions));
		if (arraySubmitedAnswers[currentQuestion - displayNumb] == null) {
			currentAnswer1 = null;
			Ti.API.info('setAnswerTop Null : ', currentAnswer1);
			
			setAnswerTop(true, null, allQuestionsArray[currentQuestion - displayNumb].surveyType, 0, displayNumb, allQuestionsArray[currentQuestion - displayNumb].language);
		} else {
			//Add Top View here
			setAnswerTop(true, arraySubmitedAnswers[currentQuestion - displayNumb].answer, arraySubmitedAnswers[currentQuestion - displayNumb].surveyType, arraySubmitedAnswers[currentQuestion - displayNumb].selectedRow, displayNumb, allQuestionsArray[currentQuestion - displayNumb].language);
			if (isBack == false) {
				currentPro = currentPro + 1;
			}

		}
		answer1Distance = "";
		answer2Distance = "";
		answerDistance = "";
		Ti.API.info('allQuestionsArray[currentQuestion - displayNumb].surveyType : ', allQuestionsArray[currentQuestion - displayNumb].surveyType);
		if (allQuestionsArray[currentQuestion - 1].surveyType == 1 || allQuestionsArray[currentQuestion - 1].surveyType == 3) {
			$.QuestionContentTopView.height = "50%";
			$.QuestionContentBottomView.height = "50%";
			$.doneButtonOuterView.height = "0dp";
		} else {
			$.QuestionContentTopView.height = "43%";
			$.QuestionContentBottomView.height = "43%";
			$.doneButtonOuterView.height = "14%";
		}

		//Set Top Question here

		Ti.API.info('displayNumb : ', displayNumb);

		if (displayNumb == 2) {
			$.bottomAddonView.add(setQuestion(allQuestionsArray[currentQuestion - 1].surveyQuestions));
			Ti.API.info('display 2');
			Ti.API.info('arraySubmitedAnswers[currentQuestion - 1] : ', arraySubmitedAnswers[currentQuestion - 1]);
			if (arraySubmitedAnswers[currentQuestion - 1] == null) {
				currentAnswer2 = null;
				setAnswerTop(false, null, allQuestionsArray[currentQuestion - 1].surveyType, 0, displayNumb, allQuestionsArray[currentQuestion - 1].language);
				//Add bottom View here
			} else {
				//Add bottom View here
				setAnswerTop(false, arraySubmitedAnswers[currentQuestion - 1].answer, arraySubmitedAnswers[currentQuestion - 1].surveyType, arraySubmitedAnswers[currentQuestion - 1].selectedRow, displayNumb, allQuestionsArray[currentQuestion - 1].language);
				if (isBack == false) {
					currentPro = currentPro + 1;
				}
				//currentPro = currentPro + 1;
			}
			if ($.doneButtonOuterView.height != "14%") {
				if (allQuestionsArray[currentQuestion - 1].surveyType == 1 || allQuestionsArray[currentQuestion - 1].surveyType == 3) {
					$.QuestionContentTopView.height = "50%";
					$.QuestionContentBottomView.height = "50%";
					$.doneButtonOuterView.height = "0dp";
				} else {
					$.QuestionContentTopView.height = "43%";
					$.QuestionContentBottomView.height = "43%";
					$.doneButtonOuterView.height = "14%";
				}
			}

		}
		setProgressBar(currentPro, totalQuestions);
		questionDisplayedTime = new Date();

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "loadingValues", ex);
	}

}

function setAnswerTop(isTop, answer, type, selectedRow, displayNumb, language) {
	Ti.API.info('currentQuestion : ', currentQuestion);
	Ti.API.info('setAnswerTop : ', answer, type, language);
	if (isTop == true) {
		selectedRow1 = selectedRow;
		currentAnswer1 = answer;
	} else {
		selectedRow2 = selectedRow;
		currentAnswer2 = answer;
	}
	if (answer != null) {
		pageAnswerCount += 1;
	}

	if (type == 1) {
		Ti.API.info('Set linkert');
		var resultView = setLinkertAnswer(isTop, answer, language);

	} else if (type == 2) {
		Ti.API.info('Set picker', isTop);
		if (isTop == true) {
			var pickerData = allQuestionsArray[currentQuestion - displayNumb].pickerData;
			var resultView = setPickerAnswer(isTop, pickerData, selectedRow1, type, language);
		} else {
			var pickerData = allQuestionsArray[currentQuestion - 1].pickerData;
			var resultView = setPickerAnswer(isTop, pickerData, selectedRow2, type, language);
		}
		//var pickerData = pickerValues.getWeeks();

	} else if (type == 3) {
		Ti.API.info('set Yes or NO');
		var resultView = setYesOrNoAnswer(isTop, answer, language);
	} else if (type == 4) {
		Ti.API.info(' set Time Picker');

		var resultView = setTimePickerAnswer(isTop, answer, language);

	} else if (type == 5) {
		Ti.API.info(' set years in Picker');

		if (isTop == true) {
			if (selectedRow1 == 0) {
				selectedRow1 = 101;
			}
			var pickerData = pickerValues.getYear(language);
			var resultView = setPickerAnswer(isTop, pickerData, selectedRow1, type, language);
		} else {
			if (selectedRow2 == 0) {
				selectedRow2 = 101;
			}
			var pickerData = pickerValues.getYear(language);
			var resultView = setPickerAnswer(isTop, pickerData, selectedRow2, type, language);
		}

	} else if (type == 6) {
		Ti.API.info(' set months in Picker');

		if (isTop == true) {
			var pickerData = pickerValues.getMonths(language);
			var resultView = setPickerAnswer(isTop, pickerData, selectedRow1, type, language);
		} else {
			var pickerData = pickerValues.getMonths(language);
			var resultView = setPickerAnswer(isTop, pickerData, selectedRow2, type, language);
		}

	} else if (type == 7) {
		Ti.API.info(' set days in Picker');

		if (isTop == true) {
			var pickerData = pickerValues.getDay(language);
			var resultView = setPickerAnswer(isTop, pickerData, selectedRow1, type, language);
		} else {
			var pickerData = pickerValues.getDay(language);
			var resultView = setPickerAnswer(isTop, pickerData, selectedRow2, type, language);
		}

	} else if (type == 8) {
		var resultView = freeResponseSurvey(isTop, answer, language);
	}
	if (isTop == true) {
		$.topAddonView.add(resultView);
	} else {
		$.bottomAddonView.add(resultView);
	}
	if (resultView.children && resultView.children.length > 0) {
		// Make a copy of the array
		var children = resultView.children.slice(0);
		var numChildren = children.length;
		for ( m = 0; m < numChildren; m++) {
			Ti.API.info('children[m].id : ', children[m].id);
			if (children[m].id == "testID") {
				Ti.API.info('Scroll index : ', type, selectedRow);
				if (type == 5) {
					if (isTop == true) {
						children[m].scrollToItem(0, selectedRow1, {
							animated : false
						});
						if (currentAnswer1 == null) {
							pageAnswerCount += 1;
							currentPro += 1;
							setProgressBar(currentPro, totalQuestions);
						}

						currentAnswer1 = selectedRow1;

					} else {
						children[m].scrollToItem(0, selectedRow2, {
							animated : false
						});
						if (currentAnswer2 == null) {
							pageAnswerCount += 1;
							currentPro += 1;
							setProgressBar(currentPro, totalQuestions);
						}
						currentAnswer2 = selectedRow2;
					}

				}

			}

		}
	}

	Ti.API.info('setAnswerTop finish');

}

function setQuestion(QuestionText) {
	try {

		if (OS_IOS) {
			var qView = Titanium.UI.createView({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.FILL,
				left : '30dp',
				right : '30dp',
				top : '20dp',
			});
		} else {
			var qView = Titanium.UI.createView({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.FILL,
				top : '20dp',
			});
		}

		qView.addEventListener('click', nearbyClick);
		var qLabel = Ti.UI.createLabel({
			height : Titanium.UI.SIZE,
			width : Titanium.UI.SIZE,
			color : '#546e7a',
			textAlign : 'center',
			font : Alloy.Globals.LargeSemiBoldQuest,
			opacity : 1,
			text : QuestionText,
			wordWrap : true
			//borderColor : 'blue'

		});
		qView.add(qLabel);
		Ti.API.info('Return qView');
		return qView;

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "setQuestion", ex);
	}

}

function setProgressBar(currentPro, totalQuestions) {
	var progressValue = parseFloat((currentPro / totalQuestions) * 100).toFixed(2);
	if (currentPro == totalQuestions) {
		if (commonFunctions.getIsTablet() == true) {
			progressValue = 97;
		} else {
			progressValue = 98;
		}
	}
	var progerssWidth = progressValue + "%";

	$.progressBarLine.width = progerssWidth;

	var questionNumber = currentPro + "/" + totalQuestions;

	$.numberLabel.text = questionNumber;

}

function setLinkertAnswer(isTop, answer, language) {
	try {
		var linkertViewMain = Titanium.UI.createView({
			height : Titanium.UI.SIZE,
			width : Titanium.UI.FILL,
			left : '10dp',
			right : '10dp',
			top : '20dp'
		});
		var linkertAnswerview1 = Titanium.UI.createView({
			height : Titanium.UI.SIZE,
			width : Titanium.UI.FILL,
			top : '0dp',
			layout : 'horizontal',
			left : '5dp',
			right : '5dp'
		});
		if (isTop == true) {
			linkertAnswerview1.addEventListener('click', linkertAnswerClickTop);
		} else {
			linkertAnswerview1.addEventListener('click', linkertAnswerClickBottom);
		}

		for (var i = 0; i < 4; i++) {
			var numb = i + 1;
			var fetchId1 = "ansButtonView" + numb;
			var fetchId2 = "ansButton" + numb;
			var fetchId3 = "ansLabel" + numb;
			var viewWidth = "25%";
			var radioImage = '/images/surveyTypes/check-box.png';
			if (i == 0) {
				var lblText = commonFunctions.L('notatallLbl', language);

			} else if (i == 1) {
				var lblText = commonFunctions.L('severaltimesLbl', language);

			} else if (i == 2) {
				var lblText = commonFunctions.L('moreHalfTimeLbl', language);

			} else if (i == 3) {
				var lblText = commonFunctions.L('nearlyalltimeLbl', language);
				viewWidth = "24.5%";

			}
			if (answer == lblText) {
				radioImage = '/images/surveyTypes/check-box-active.png';
			}

			var answerView1 = Titanium.UI.createView({
				top : '0dp',
				left : '0dp',
				height : Titanium.UI.SIZE,
				width : viewWidth,
				layout : 'vertical',
				id : fetchId1
			});
			var answerImage = Titanium.UI.createImageView({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				image : radioImage,
				touchEnabled : 'false',
				id : fetchId2
			});
			if (isTop == true) {
				answerViewSetTop.push(answerImage);
			} else {
				answerViewSetBottom.push(answerImage);
			}

			var qLabel = Ti.UI.createLabel({
				top : '10dp',
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				color : '#546e7a',
				font : Alloy.Globals.MediumFontSemi,
				opacity : 1,
				textAlign : 'center',
				touchEnabled : 'false',
				text : lblText,
				id : fetchId3
			});

			answerView1.add(answerImage);
			answerView1.add(qLabel);
			linkertAnswerview1.add(answerView1);

		};
		linkertViewMain.add(linkertAnswerview1);
		Ti.API.info('Return linkert View');
		return linkertViewMain;

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "setQuestion", ex);
	}

}

function freeResponseSurvey(isTop, answer, language) {
	try {
		var responseViewMain = Titanium.UI.createView({
			height : "100dp",
			width : Titanium.UI.FILL,
			left : '10dp',
			right : '10dp',
			top : '20dp',
		});
		Ti.API.info(' ******isTop =' + isTop);

		if (isTop) {
			responseTextArea = Titanium.UI.createTextField({
				height : Titanium.UI.FILL,
				width : Titanium.UI.FILL,
				value : commonFunctions.L('surveyTextArea', LangCode),
				keyboardType : Ti.UI.KEYBOARD_TYPE_DEFAULT,
				font : Alloy.Globals.MediumMenuFontLight,
				color : '#546e7a',
				borderWidth : 2,
				borderColor : '#eceff1',
				borderRadius : 5,
				//returnKeyType:Titanium.UI.RETURNKEY
				suppressReturn : true,
				backgroundColor : "transparent",
				maxLength : 100
			});
			if (OS_IOS) {
				flexSpace = Ti.UI.createButton({
					systemButton : Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE
				});
				done = Ti.UI.createButton({
					title : "Done",
				});
				done.addEventListener('click', function(e) {
					responseTextArea.blur();
				});

				responseTextArea.keyboardToolbar = [flexSpace, done];
			}

			if (answer != "" && answer != null) {
				responseTextArea.value = answer;
			}
			responseTextArea.addEventListener('focus', function(e) {
				if (e.source.value == commonFunctions.L('surveyTextArea', LangCode)) {
					e.source.value = "";
				}
			});

			responseTextArea.addEventListener('blur', function(e) {
				if (e.source.value == "") {
					e.source.value = commonFunctions.L('surveyTextArea', LangCode);
				} else {

				}
			});
			responseViewMain.add(responseTextArea);
		} else {
			responseTextAreaBottom = Titanium.UI.createTextField({
				height : Titanium.UI.FILL,
				width : Titanium.UI.FILL,
				value : commonFunctions.L('surveyTextArea', LangCode),
				keyboardType : Ti.UI.KEYBOARD_DEFAULT,
				font : Alloy.Globals.MediumMenuFontLight,
				color : '#546e7a',
				borderWidth : 2,
				borderColor : '#eceff1',
				borderRadius : 5,
				suppressReturn : true,
				maxLength : 100,
				backgroundColor : "transparent",
			});

			if (answer != "" && answer != null) {
				responseTextAreaBottom.value = answer;
			}

			responseTextAreaBottom.addEventListener('focus', function(e) {
				if (e.source.value == commonFunctions.L('surveyTextArea', LangCode)) {
					e.source.value = "";
				}
			});

			responseTextAreaBottom.addEventListener('blur', function(e) {
				if (e.source.value == "") {
					e.source.value = commonFunctions.L('surveyTextArea', LangCode);
				} else {

				}
			});
			responseViewMain.add(responseTextAreaBottom);
		}

		return responseViewMain;
	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "freeResponseSurvey", ex);
	}
}

function setYesOrNoAnswer(isTop, answer, language) {
	try {
		var YeNoViewMain = Titanium.UI.createView({
			height : Titanium.UI.SIZE,
			width : Titanium.UI.FILL,
			left : '10dp',
			right : '10dp',
			top : '20dp'
		});
		var YeNoAnswerview1 = Titanium.UI.createView({
			height : Titanium.UI.SIZE,
			width : Titanium.UI.FILL,
			top : '0dp',
			layout : 'horizontal',
			left : '5dp',
			right : '5dp'
		});
		if (isTop == true) {
			YeNoAnswerview1.addEventListener('click', YesOrNoAnswerClickTop);
		} else {
			YeNoAnswerview1.addEventListener('click', YesOrNoAnswerClickBottom);
		}

		for (var i = 0; i < 3; i++) {
			var numb = i + 1;
			var fetchId1 = "ansButtonView" + numb;
			var fetchId2 = "ansButton" + numb;
			var fetchId3 = "ansLabel" + numb;
			var viewWidth = "33.3%";
			var radioImage = '/images/surveyTypes/check-box.png';
			if (i == 0) {

				var lblText = commonFunctions.L('yes', language);
			} else if (i == 1) {
				var lblText = commonFunctions.L('no', language);

			} else if (i == 2) {
				var lblText = commonFunctions.L('maybeLbl', language);
				viewWidth = "33%";
			}
			if (answer == lblText) {
				radioImage = '/images/surveyTypes/check-box-active.png';
			}
			var answerView1 = Titanium.UI.createView({
				top : '0dp',
				left : '0dp',
				height : Titanium.UI.SIZE,
				width : viewWidth,
				layout : 'vertical',
				id : fetchId1
			});
			var answerImage = Titanium.UI.createImageView({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				image : radioImage,
				touchEnabled : 'false',
				id : fetchId2
			});
			if (isTop == true) {
				answerViewSetTop.push(answerImage);
			} else {
				answerViewSetBottom.push(answerImage);
			}

			var qLabel = Ti.UI.createLabel({
				top : '10dp',
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				color : '#546e7a',
				font : Alloy.Globals.MediumFontSemi,
				opacity : 1,
				textAlign : 'center',
				touchEnabled : 'false',
				text : lblText,
				id : fetchId3
			});

			answerView1.add(answerImage);
			answerView1.add(qLabel);
			YeNoAnswerview1.add(answerView1);

		};
		YeNoViewMain.add(YeNoAnswerview1);
		return YeNoViewMain;

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "setYesOrNoAnswer", ex);
	}

}

function setPickerAnswer(isTop, picker_data, selectedRow, type, language) {
	try {
		Ti.API.info('pickerData : ', picker_data);
		var pickerView = Titanium.UI.createView({
			height : '90dp',
			width : Titanium.UI.SIZE,
			top : '20dp'
		});

		var pickerType = Ti.UI.PICKER_TYPE_PLAIN;

		if (OS_IOS) {
			var pickerControlTop = Titanium.UI.createPicker({
				useSpinner : true,
				selectionIndicator : true,
				type : pickerType,
			});

			if (isTop == true) {
				pickerControlTop.addEventListener('change', pickerControlTopChange);
			} else {
				pickerControlTop.addEventListener('change', pickerControlBottomChange);
			}

		} else {
			pickerView.backgroundColor = "#E5E5E5";
			var plainTemplate = {
				childTemplates : [{
					type : 'Ti.UI.Label', // Use a label
					bindId : 'rowtitle', // Bind ID for this label
					properties : {
						textAlign : "center",
						font : Alloy.Globals.MediumSemiBoldTablet,
						height : '50dp',
						color : '#000',
						width : '100%',
						touchEnabled : false,

					}
				}]
			};
			var pickerControlTop = Ti.UI.createListView({
				templates : {
					'plain' : plainTemplate
				},
				defaultItemTemplate : 'plain',
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				id : "testID",
				separatorInsets : {
					left : 0,
					right : 0
				}
			});
			if (isTop == true) {

				pickerDataCommon = picker_data;
				pickerControlTop.addEventListener('itemclick', pickerControlTopChangeAndroid);
			} else {

				pickerDataCommonBottom = picker_data;
				pickerControlTop.addEventListener('itemclick', pickerControlBottomChangeAndroid);
			}

			//pickerControlTop.addEventListener('itemclick', pickerControlTopChangeAndroid);

		}
		Ti.API.info('pickerView  add');

		pickerView.add(pickerControlTop);
		if (Ti.Platform.osname != 'android') {

			var picker_column = Ti.UI.createPickerColumn();
			for (var i = 0,
			    ilen = picker_data.length; i < ilen; i++) {
				var title = picker_data[i].title;
				Ti.API.info(' title', title);
				var row = Ti.UI.createPickerRow({
					value : title,
					//back
				});
				var label = Ti.UI.createLabel({
					text : title,
					font : Alloy.Globals.MediumLightSFont,
					color : '#06253a',
					width : Ti.UI.SIZE,
					textAlign : 'center',
					height : '40dp',
					backgroundColor : "transparent",
				});
				row.add(label);

				picker_column.addRow(row);
			}

			pickerControlTop.add(picker_column);
		} else {

			if (picker_data.length != 0) {
				var data = [];
				for (var i = 0; i < picker_data.length; i++) {
					data.push({
						rowtitle : {
							text : picker_data[i].title
						},

						properties : {
							itemId : 'row' + (i + 1),
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_NONE,
							selectedBackgroundColor : "#f1f5f7",
							backgroundColor : "#fff"
						}
					});
				}
				var Listsection = Ti.UI.createListSection({
					items : data
				});
				if (selectedRow == null) {
					var item = Listsection.getItemAt(0);
					item.properties.backgroundColor = "#f1f5f7";
					Listsection.updateItemAt(0, item);
				}

				pickerControlTop.sections = [Listsection];
			}

		}

		if (OS_IOS) {

			if (type == 5) {
				pickerControlTop.setSelectedRow(0, 101, false);
			} else {
				pickerControlTop.setSelectedRow(0, selectedRow, false);
			}

		} else {
			if (type == 5) {
				Ti.API.info('selectedRow setPickerAnswer : ', selectedRow);
				if (selectedRow == 0) {
					//pickerControlTop.scrollToItem(0, 10);
					var item = pickerControlTop.sections[0].getItemAt(101);
					item.properties.backgroundColor = "#f1f5f7";
					pickerControlTop.sections[0].updateItemAt(101, item);

				} else {
					//pickerControlTop.scrollToItem(0, 10);
					var item = pickerControlTop.sections[0].getItemAt(selectedRow);
					item.properties.backgroundColor = "#f1f5f7";
					pickerControlTop.sections[0].updateItemAt(selectedRow, item);

					// pickerControlTop.scrollToItem(0, selectedRow, {
					// animated : false
					// });
				}

			} else {

				Ti.API.info('selectedRow1 setPickerAnswer : ', selectedRow);
				var item = pickerControlTop.sections[0].getItemAt(selectedRow);
				item.properties.backgroundColor = "#f1f5f7";
				pickerControlTop.sections[0].updateItemAt(selectedRow, item);

				// pickerControlTop.scrollToItem(0, selectedRow, {
				// animated : false
				// });
			}

		}

		return pickerView;

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "setPickerAnswer", ex);
	}

}

function setTimePickerAnswer(isTop, picker_data) {
	try {
		var pickerView = Titanium.UI.createView({
			height : '90dp',
			width : Titanium.UI.SIZE,
			top : '20dp'
		});

		var pickerViewLabel = Ti.UI.createLabel({
			height : '100dp',
			width : Titanium.UI.SIZE,
			color : 'black',
			font : Alloy.Globals.HeaderUltraFontExtraLargeTablet
		});
		var pickerType = Ti.UI.PICKER_TYPE_TIME;

		defaultTimeVal = new Date();
		//defaultTimeVal.setHours(00, 00, 00, 00);
		defaultTimeVal.setHours(0);
		defaultTimeVal.setMinutes(0);
		defaultTimeVal.setSeconds(0);
		defaultTimeVal.setMilliseconds(0);
		Ti.API.info('defaultTimeVal : ', defaultTimeVal);
		if (OS_IOS) {
			var pickerControlTop = Titanium.UI.createPicker({
				useSpinner : true,

				selectionIndicator : true,
				type : pickerType,
				width : '200dp',
				value : defaultTimeVal,

			});
			if (isTop == true) {
				pickerControlTop.addEventListener('change', pickerControlTopChange);
			} else {
				pickerControlTop.addEventListener('change', pickerControlBottomChange);
			}

		} else {
			Ti.API.info('Android picker section');
			pickerView.visible = false;
			if (picker_data != null) {
				pickerViewLabel.text = picker_data;
				defaultTimeVal = new Date();
				var timeArray = picker_data.split(":");
				Ti.API.info('timeArray : ', timeArray);
				if (timeArray.length == 2) {
					//defaultTimeVal.setHours(timeArray[0], timeArray[1], 00, 00);
					defaultTimeVal.setHours(timeArray[0]);
					defaultTimeVal.setMinutes(timeArray[1]);
					defaultTimeVal.setSeconds(0);
					defaultTimeVal.setMilliseconds(0);
				}

			} else {
				pickerViewLabel.text = "00:00";
			}

			pickerViewLabel.visible = true;
			pickerViewLabel.addEventListener('click', function(e) {
				clearTimeout(scrollTimer);
				ShowTimePicker(defaultTimeVal, function(val, index) {
					if (answerDistance == "") {
						if (isTop == true) {
							answer1Distance = "Valid";
							if (currentAnswer1 == null) {
								pageAnswerCount += 1;
								currentPro += 1;
							}
						} else {
							answer2Distance = "Valid";
							if (currentAnswer2 == null) {
								pageAnswerCount += 1;
								currentPro += 1;
							}

						}
					} else {
						if (isTop == true) {
							answer1Distance = answerDistance + "," + "Valid";
						} else {
							answer2Distance = answerDistance + "," + "Valid";
						}
					}
					answerDistance = "";
					if (isTop == true) {
						answer1Time = new Date();
					} else {
						answer2Time = new Date();

					}

					Ti.API.info('ShowTimePicker return : ', val, index);
					defaultTimeVal = val;
					//var timePart = commonFunctions.getTwelveHrFormatTime(val);

					var date = new Date(val);
					var hours = date.getHours();
					var minutes = date.getMinutes();
					minutes = minutes < 10 ? '0' + minutes : minutes;
					hours = hours < 10 ? '0' + hours : hours;
					var timePart = hours + ':' + minutes;

					Ti.API.info('timePart : ', timePart);
					if (isTop == true) {
						currentAnswer1 = timePart;
						selectedRow1 = e.rowIndex;
					} else {
						currentAnswer2 = timePart;
						selectedRow2 = e.rowIndex;

					}

					pickerViewLabel.text = timePart;
					Ti.API.info('SelectedTime : ', currentAnswer1);

					setProgressBar(currentPro, totalQuestions);
					Ti.API.info('isSubmited : ', isSubmited);
					

				});
			});

			

			return pickerViewLabel;
		}

		// currentAnswer1 = defaultTimeVal;
		var selectedDate = new Date(currentAnswer1);
		var hours = selectedDate.getHours();
		hours = hours < 10 ? "0" + hours : hours;
		var minute = selectedDate.getMinutes();
		minute = minute < 10 ? "0" + minute : minute;
		// currentAnswer1 = hours + ":" + minute;

		pickerView.add(pickerControlTop);

		return pickerView;

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "setTimePickerAnswer", ex);
	}

}

function ShowTimePicker(defaultValue, doneCallBack) {
	try {
		var listPickerTime = null;
		listPickerTime = new Picker(null, defaultValue, 'Select Time', 'time', "");

		listPickerTime.addToWindow($.syptomSurveyNew);
		listPickerTime.show();

		listPickerTime.addEventListener("done", function(e) {
			Ti.API.info('done : ', listPickerTime.selectedText);

			if (listPickerTime.selectedValue == null || listPickerTime.selectedValue < 0) {
				return;
			}
			if (listPickerTime != null)
				listPickerTime.hide();

			if (listPickerTime.selectedText) {
				Ti.API.info('selected text:: ', listPickerTime.selectedText);
				doneCallBack(listPickerTime.selectedText);

			} else {
				var defaultTimeVal = new Date();
				
				defaultTimeVal.setHours(0);
				defaultTimeVal.setMinutes(0);
				defaultTimeVal.setSeconds(0);
				defaultTimeVal.setMilliseconds(0);
				doneCallBack(defaultTimeVal);
			}
			listPickerTime = null;
		});

		listPickerTime.addEventListener("cancel", function(e) {
			if (listPickerTime != null)
				listPickerTime.hide();
			listPickerTime = null;
		});

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "ShowTimePicker", ex);
	}
}

function nearbyClick(e) {
	if (answerDistance == "") {
		answerDistance = "Close";
	} else {
		answerDistance = answerDistance + "," + "Close";
	}
}

function tooFarClick(e) {
	if (answerDistance == "") {
		answerDistance = "Far Off";
	} else {
		answerDistance = answerDistance + "," + "Far Off";
	}

}

function linkertAnswerClickTop(e) {

	if (answerDistance == "") {
		answer1Distance = "Valid";
	} else {
		answer1Distance = answerDistance + "," + "Valid";
	}
	answerDistance = "";
	answer1Time = new Date();

	answerViewSetTop[0].image = "/images/surveyTypes/check-box.png";
	answerViewSetTop[1].image = "/images/surveyTypes/check-box.png";
	answerViewSetTop[2].image = "/images/surveyTypes/check-box.png";
	answerViewSetTop[3].image = "/images/surveyTypes/check-box.png";
	Ti.API.info('e.source.id : ', e.source.id);
	Ti.API.info('currentAnswer1 : ', currentAnswer1);
	if (e.source.id == "ansButtonView1") {

		if (currentAnswer1 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		answerViewSetTop[0].image = "/images/surveyTypes/check-box-active.png";
		currentAnswer1 = "Not at all";
		thresholdSelection = 1;
	} else if (e.source.id == "ansButtonView2") {
		if (currentAnswer1 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		answerViewSetTop[1].image = "/images/surveyTypes/check-box-active.png";
		currentAnswer1 = "Several Times";
		thresholdSelection = 2;
	} else if (e.source.id == "ansButtonView3") {
		if (currentAnswer1 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		answerViewSetTop[2].image = "/images/surveyTypes/check-box-active.png";
		currentAnswer1 = "More than Half the Time";
		thresholdSelection = 3;
	} else if (e.source.id == "ansButtonView4") {
		if (currentAnswer1 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		answerViewSetTop[3].image = "/images/surveyTypes/check-box-active.png";
		currentAnswer1 = "Nearly All the Time";
		thresholdSelection = 4;
	}
	checkEmergencyPopup();
	setProgressBar(currentPro, totalQuestions);
	if (currentAnswer2 != null && currentAnswer1 != null) {
		onSubmitClick();

	} else if (totalQuestions == 1 && currentAnswer1 != null) {
		onSubmitClick();
	}

}

function linkertAnswerClickBottom(e) {
	if (answerDistance == "") {
		answer2Distance = "Valid";
	} else {
		answer2Distance = answerDistance + "," + "Valid";
	}
	answerDistance = "";
	answer2Time = new Date();

	answerViewSetBottom[0].image = "/images/surveyTypes/check-box.png";
	answerViewSetBottom[1].image = "/images/surveyTypes/check-box.png";
	answerViewSetBottom[2].image = "/images/surveyTypes/check-box.png";
	answerViewSetBottom[3].image = "/images/surveyTypes/check-box.png";
	if (e.source.id == "ansButtonView1") {
		if (currentAnswer2 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		answerViewSetBottom[0].image = "/images/surveyTypes/check-box-active.png";
		currentAnswer2 = "Not at all";
		thresholdSelection = 1;
	} else if (e.source.id == "ansButtonView2") {
		if (currentAnswer2 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		answerViewSetBottom[1].image = "/images/surveyTypes/check-box-active.png";
		currentAnswer2 = "Several Times";
		thresholdSelection = 2;
	} else if (e.source.id == "ansButtonView3") {
		if (currentAnswer2 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		answerViewSetBottom[2].image = "/images/surveyTypes/check-box-active.png";
		currentAnswer2 = "More than Half the Time";
		thresholdSelection = 3;
	} else if (e.source.id == "ansButtonView4") {
		if (currentAnswer2 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		answerViewSetBottom[3].image = "/images/surveyTypes/check-box-active.png";
		currentAnswer2 = "Nearly All the Time";
		thresholdSelection = 4;
	}
	checkEmergencyPopupBottom();
	setProgressBar(currentPro, totalQuestions);
	if (currentAnswer1 != null && currentAnswer2 != null) {
		onSubmitClick();

	}
}

function YesOrNoAnswerClickTop(e) {

	try {

		if (answerDistance == "") {
			answer1Distance = "Valid";
		} else {
			answer1Distance = answerDistance + "," + "Valid";
		}
		answerDistance = "";
		answer1Time = new Date();

		answerViewSetTop[0].image = "/images/surveyTypes/check-box.png";
		answerViewSetTop[1].image = "/images/surveyTypes/check-box.png";
		answerViewSetTop[2].image = "/images/surveyTypes/check-box.png";
		if (e.source.id == "ansButtonView1") {
			if (currentAnswer1 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			answerViewSetTop[0].image = "/images/surveyTypes/check-box-active.png";
			currentAnswer1 = "Yes";
			thresholdSelection = 1;

		} else if (e.source.id == "ansButtonView2") {
			if (currentAnswer1 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			answerViewSetTop[1].image = "/images/surveyTypes/check-box-active.png";
			currentAnswer1 = "No";
			thresholdSelection = 2;

		} else if (e.source.id == "ansButtonView3") {
			if (currentAnswer1 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			answerViewSetTop[2].image = "/images/surveyTypes/check-box-active.png";
			currentAnswer1 = "Maybe";
			thresholdSelection = 3;
		}

		checkEmergencyPopup();
		setProgressBar(currentPro, totalQuestions);
		if (currentAnswer2 != null) {
			onSubmitClick();

		} else if (totalQuestions == 1 && currentAnswer1 != null) {
			onSubmitClick();
		}

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "YesOrNoAnswerClickTop", ex);
	}

}

function checkEmergencyPopup() {
	

	if (allQuestionsArray[currentQuestion - currentDisplayNumb].enablePopup == true || allQuestionsArray[currentQuestion - currentDisplayNumb].enablePopup == "true") {
		Ti.API.info('** enablePopup---');
		if (allQuestionsArray[currentQuestion - currentDisplayNumb].operatorValue == "=") {
			if (allQuestionsArray[currentQuestion - currentDisplayNumb].thresholdValue == thresholdSelection) {
				enableSurveyPopup = true;
				surveyPopupMessage = allQuestionsArray[currentQuestion - currentDisplayNumb].popupMessage;
			}
		} else if (allQuestionsArray[currentQuestion - currentDisplayNumb].operatorValue == "<") {
			if (thresholdSelection < allQuestionsArray[currentQuestion - currentDisplayNumb].thresholdValue) {
				enableSurveyPopup = true;
				surveyPopupMessage = allQuestionsArray[currentQuestion - currentDisplayNumb].popupMessage;
			}
		} else if (allQuestionsArray[currentQuestion - currentDisplayNumb].operatorValue == ">") {
			if (thresholdSelection > allQuestionsArray[currentQuestion - currentDisplayNumb].thresholdValue) {
				enableSurveyPopup = true;
				surveyPopupMessage = allQuestionsArray[currentQuestion - currentDisplayNumb].popupMessage;
			}
		}
	}
}

function checkEmergencyPopupBottom() {
	

	if (allQuestionsArray[currentQuestion - 1].enablePopup == true || allQuestionsArray[currentQuestion - currentDisplayNumb].enablePopup == "true") {
		if (allQuestionsArray[currentQuestion - 1].operatorValue == "=") {
			if (allQuestionsArray[currentQuestion - 1].thresholdValue == thresholdSelection) {
				enableSurveyPopup = true;
				surveyPopupMessage = allQuestionsArray[currentQuestion - 1].popupMessage;
			}
		} else if (allQuestionsArray[currentQuestion - 1].operatorValue == "<") {
			if (thresholdSelection < allQuestionsArray[currentQuestion - 1].thresholdValue) {
				enableSurveyPopup = true;
				surveyPopupMessage = allQuestionsArray[currentQuestion - 1].popupMessage;
			}
		} else if (allQuestionsArray[currentQuestion - 1].operatorValue == ">") {
			if (thresholdSelection > allQuestionsArray[currentQuestion - 1].thresholdValue) {
				enableSurveyPopup = true;
				surveyPopupMessage = allQuestionsArray[currentQuestion - 1].popupMessage;
			}
		}
	}
}

function YesOrNoAnswerClickBottom(e) {
	try {

		if (answerDistance == "") {
			answer2Distance = "Valid";
		} else {
			answer2Distance = answerDistance + "," + "Valid";
		}
		answerDistance = "";
		answer2Time = new Date();

		answerViewSetBottom[0].image = "/images/surveyTypes/check-box.png";
		answerViewSetBottom[1].image = "/images/surveyTypes/check-box.png";
		answerViewSetBottom[2].image = "/images/surveyTypes/check-box.png";
		if (e.source.id == "ansButtonView1") {
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			answerViewSetBottom[0].image = "/images/surveyTypes/check-box-active.png";
			currentAnswer2 = "Yes";
			thresholdSelection = 1;

		} else if (e.source.id == "ansButtonView2") {
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			answerViewSetBottom[1].image = "/images/surveyTypes/check-box-active.png";
			currentAnswer2 = "No";
			thresholdSelection = 2;

		} else if (e.source.id == "ansButtonView3") {
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			answerViewSetBottom[2].image = "/images/surveyTypes/check-box-active.png";
			currentAnswer2 = "Maybe";
			thresholdSelection = 3;
		}

		checkEmergencyPopupBottom();
		setProgressBar(currentPro, totalQuestions);

		if (currentAnswer1 != null) {
			onSubmitClick();

		}

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "YesOrNoAnswerClickBottom", ex);
	}

}

function pickerControlTopChange(e) {
	clearTimeout(scrollTimer);
	if (e.rowIndex == 0) {
		if (currentAnswer1 != null) {
			if (pageAnswerCount != 0) {
				pageAnswerCount -= 1;
			}
			if (currentPro != 0) {
				currentPro -= 1;
			}
			setProgressBar(currentPro, totalQuestions);
		}
		currentAnswer1 = null;
		return;
	}
	Ti.API.info('pickerControlTopChange currentAnswer1 : ', currentAnswer1);
	if (currentAnswer1 == null) {
		pageAnswerCount += 1;
		currentPro += 1;
	}
	if (answerDistance == "") {
		answer1Distance = "Valid";
	} else {
		answer1Distance = answerDistance + "," + "Valid";
	}
	answerDistance = "";
	answer1Time = new Date();

	setProgressBar(currentPro, totalQuestions);
	if (e.row != null) {
		Ti.API.info('e.row.value : ', e.row.value);
		Ti.API.info('e.rowIndex : ', e.rowIndex);
		
		currentAnswer1 = e.row.value;
		selectedRow1 = e.rowIndex;
		thresholdSelection = e.rowIndex;
		

	} else {
		Ti.API.info('e.value : ', e.value);
		Ti.API.info('e.rowIndex : ', e.rowIndex);
		//currentAnswer1 = e.rowIndex;
		currentAnswer1 = e.value;
		var selectedDate = new Date(e.value);
		var hours = selectedDate.getHours();
		hours = hours < 10 ? "0" + hours : hours;
		var minute = selectedDate.getMinutes();
		minute = minute < 10 ? "0" + minute : minute;
		currentAnswer1 = hours + ":" + minute;
		Ti.API.info('SelectedTime : ', currentAnswer1);
		selectedRow1 = e.rowIndex;
		thresholdSelection = e.rowIndex;
		

	}

	checkEmergencyPopup();

}

function pickerControlTopChangeAndroid(e) {
	Ti.API.info('pickerControlTopChangeAndroid : ', JSON.stringify(e));
	clearTimeout(scrollTimer);
	if (selectedRow1 != null) {
		var item = e.section.getItemAt(selectedRow1);
		Ti.API.info('item : ', item, selectedRow1);
		item.properties.backgroundColor = "#fff";
		e.section.updateItemAt(selectedRow1, item);
	}

	if (answerDistance == "") {
		answer1Distance = "Valid";
	} else {
		answer1Distance = answerDistance + "," + "Valid";
	}
	answerDistance = "";
	answer1Time = new Date();
	var item = e.section.getItemAt(e.itemIndex);
	item.properties.backgroundColor = "#f1f5f7";
	e.section.updateItemAt(e.itemIndex, item);

	Ti.API.info('pickerControlTopChangeAndroid');

	if (e.itemIndex == 0) {
		if (currentAnswer1 != null) {
			if (pageAnswerCount != 0) {
				pageAnswerCount -= 1;
			}
			if (currentPro != 0) {
				currentPro -= 1;
			}
			setProgressBar(currentPro, totalQuestions);
		}
		currentAnswer1 = null;
		selectedRow1 = 0;
		return;
	}
	if (currentAnswer1 == null) {
		pageAnswerCount += 1;
		currentPro += 1;
	}

	setProgressBar(currentPro, totalQuestions);
	if (e.itemIndex != null) {
		Ti.API.info('pickerDataCommon[e.itemIndex].title : ', pickerDataCommon[e.itemIndex].title);
		Ti.API.info('e.itemIndex : ', e.itemIndex);

		currentAnswer1 = pickerDataCommon[e.itemIndex].title;
		selectedRow1 = e.itemIndex;
		thresholdSelection = e.itemIndex;
		

	}
	checkEmergencyPopup();

}

function pickerControlBottomChange(e) {

	clearTimeout(scrollTimer);
	Ti.API.info('pickerControlBottomChange : ', selectedRow2);
	if (e.rowIndex == 0) {
		if (currentAnswer2 != null) {
			if (pageAnswerCount != 0) {
				pageAnswerCount -= 1;
			}
			if (currentPro != 0) {
				currentPro -= 1;
			}
			setProgressBar(currentPro, totalQuestions);
		}
		currentAnswer2 = null;
		return;
	}
	Ti.API.info('pickerControlTopChange currentAnswer2 : ', currentAnswer2);
	if (currentAnswer2 == null) {
		pageAnswerCount += 1;
		currentPro += 1;
	}
	if (answerDistance == "") {
		answer2Distance = "Valid";
	} else {
		answer2Distance = answerDistance + "," + "Valid";
	}
	answerDistance = "";
	answer2Time = new Date();
	setProgressBar(currentPro, totalQuestions);

	if (e.row != null) {
		Ti.API.info('e.row.value : ', e.row.value);
		
		currentAnswer2 = e.row.value;
		selectedRow2 = e.rowIndex;
		thresholdSelection = e.rowIndex;
		

	} else {
		Ti.API.info('e.value : ', e.value);
		Ti.API.info('e.rowIndex : ', e.rowIndex);
		//currentAnswer1 = e.rowIndex;
		currentAnswer2 = e.value;
		var selectedDate = new Date(e.value);
		var hours = selectedDate.getHours();
		hours = hours < 10 ? "0" + hours : hours;
		var minute = selectedDate.getMinutes();
		minute = minute < 10 ? "0" + minute : minute;
		currentAnswer2 = hours + ":" + minute;
		Ti.API.info('SelectedTime : ', currentAnswer1);
		selectedRow2 = e.rowIndex;
		thresholdSelection = e.rowIndex;
		
	}
	checkEmergencyPopupBottom();

}

function pickerControlBottomChangeAndroid(e) {
	clearTimeout(scrollTimer);
	
	Ti.API.info('pickerControlBottomChangeAndroid Clear row : ', selectedRow2);
	if (selectedRow2 != null) {
		var item = e.section.getItemAt(selectedRow2);
		Ti.API.info('item : ', item, selectedRow2);
		item.properties.backgroundColor = "#fff";
		e.section.updateItemAt(selectedRow2, item);
	}

	

	var item = e.section.getItemAt(e.itemIndex);
	item.properties.backgroundColor = "#f1f5f7";
	e.section.updateItemAt(e.itemIndex, item);

	if (e.itemIndex == 0) {
		if (currentAnswer2 != null) {
			if (pageAnswerCount != 0) {
				pageAnswerCount -= 1;
			}
			if (currentPro != 0) {
				currentPro -= 1;
			}
			setProgressBar(currentPro, totalQuestions);
		}
		selectedRow2 = 0;
		currentAnswer2 = null;
		return;
	}
	if (currentAnswer2 == null) {
		pageAnswerCount += 1;
		currentPro += 1;
	}
	if (answerDistance == "") {
		answer2Distance = "Valid";
	} else {
		answer2Distance = answerDistance + "," + "Valid";
	}
	answerDistance = "";
	answer2Time = new Date();
	setProgressBar(currentPro, totalQuestions);
	Ti.API.info('pickerDataCommonBottom[e.itemIndex].title : ', pickerDataCommonBottom[e.itemIndex].title);
	Ti.API.info('e.itemIndex : ', e.itemIndex);
	
	currentAnswer2 = pickerDataCommonBottom[e.itemIndex].title;
	selectedRow2 = e.itemIndex;
	thresholdSelection = e.itemIndex + 1;
	Ti.API.info('call settimeout');
	
	checkEmergencyPopupBottom();
}

/***
 * Handles report image click
 */
$.headerView.on('reportButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
$.headerView.on('quitButtonClick', function(e) {

	
	currentQuestion = 0;
	symptomEndTime = new Date().toUTCString();
	var resultArray = [];
	for (var i = 0; i < arraySubmitedAnswers.length; i++) {
		resultArray.push({
			"surveyType" : arraySubmitedAnswers[i].surveyType,
			"answer" : arraySubmitedAnswers[i].answer,
			"questionID" : arraySubmitedAnswers[i].questionID,
			"surveyID" : args.surveyID,
			"surveyQuestions" : arraySubmitedAnswers[i].surveyQuestions,
			"timeTaken" : arraySubmitedAnswers[i].timeTaken,
			"distance" : arraySubmitedAnswers[i].distance,
			"StatusType" : StatusType
		});

	};
	surveyDataArray = resultArray;
	getSurveyValues();

	
});
$.syptomSurveyNew.addEventListener('android:back', function() {
	if (args.isFrom == "memoryTest") {
		return;
	}
	goBack();
});
function goBack(e) {
	try {
		clickWindow();
		$.doneLabel.text = commonFunctions.L('next', LangCode);
		clearTimeout(scrollTimer);

		if (currentQuestion <= 2) {
			
			currentQuestion = 0;
			//StatusType = 1;
			symptomEndTime = new Date().toUTCString();
			var resultArray = [];
			for (var i = 0; i < arraySubmitedAnswers.length; i++) {
				resultArray.push({
					"surveyType" : arraySubmitedAnswers[i].surveyType,
					"answer" : arraySubmitedAnswers[i].answer,
					"questionID" : arraySubmitedAnswers[i].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : arraySubmitedAnswers[i].surveyQuestions,
					"timeTaken" : arraySubmitedAnswers[i].timeTaken,
					"distance" : arraySubmitedAnswers[i].distance,
					"StatusType" : StatusType
				});
			};
			surveyDataArray = resultArray;
			isBackbuttonClicked = true;
			getSurveyValues();
			
		} else {
			Ti.API.info('currentPro : ', currentPro, pageAnswerCount, currentQuestion);
			isSubmited = false;
			currentPro = currentPro - pageAnswerCount;
			if (isOdd(currentQuestion)) {
				currentQuestion = currentQuestion - 1;
			} else {
				currentQuestion = currentQuestion - 2;
			}
			Ti.API.info('currentPro : ', currentPro, currentQuestion);
			loadingValues(2, true);

		}
	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "goBack", ex);
	}

};
function onSubmitClick() {
	try {
		Ti.API.info('onSubmitClick', currentAnswer1, currentAnswer2);

		if (currentQuestion % 2 == 0) {
			Ti.API.info('arraySubmitedAnswers : ', arraySubmitedAnswers.length);
			if (arraySubmitedAnswers[currentQuestion - 2] == null) {
				var timeDiff = Math.abs(answer1Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				arraySubmitedAnswers.push({
					"surveyType" : allQuestionsArray[currentQuestion - 2].surveyType,
					"answer" : currentAnswer1.toString(),
					"questionID" : allQuestionsArray[currentQuestion - 2].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 2].surveyQuestions,
					"selectedRow" : selectedRow1,
					"timeTaken" : timeTaken,
					"distance" : answer1Distance,
					"SurveyName" : args.surveyName,
					"StatusType" : StatusType
				});
			} else {
				var timeDiff = Math.abs(answer1Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				var jObject = {
					"surveyType" : allQuestionsArray[currentQuestion - 2].surveyType,
					"answer" : currentAnswer1.toString(),
					"questionID" : allQuestionsArray[currentQuestion - 2].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 2].surveyQuestions,
					"selectedRow" : selectedRow1,
					"timeTaken" : timeTaken,
					"distance" : answer1Distance,
					"SurveyName" : args.surveyName,
					"StatusType" : StatusType
				};
				arraySubmitedAnswers[currentQuestion - 2] = jObject;
			}
			if (arraySubmitedAnswers[currentQuestion - 1] == null) {
				var timeDiff = Math.abs(answer2Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				arraySubmitedAnswers.push({
					"surveyType" : allQuestionsArray[currentQuestion - 1].surveyType,
					"answer" : currentAnswer2.toString(),
					"questionID" : allQuestionsArray[currentQuestion - 1].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 1].surveyQuestions,
					"selectedRow" : selectedRow2,
					"timeTaken" : timeTaken,
					"distance" : answer2Distance,
					"SurveyName" : args.surveyName,
					"StatusType" : StatusType
				});
			} else {
				var timeDiff = Math.abs(answer2Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				var jObject = {
					"surveyType" : allQuestionsArray[currentQuestion - 1].surveyType,
					"answer" : currentAnswer2.toString(),
					"questionID" : allQuestionsArray[currentQuestion - 1].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 1].surveyQuestions,
					"selectedRow" : selectedRow2,
					"timeTaken" : timeTaken,
					"distance" : answer2Distance,
					"SurveyName" : args.surveyName,
					"StatusType" : StatusType
				};
				arraySubmitedAnswers[currentQuestion - 1] = jObject;
			}
		} else {
			Ti.API.info('Its single last question');
			if (arraySubmitedAnswers[currentQuestion - 1] == null) {
				var timeDiff = Math.abs(answer1Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				arraySubmitedAnswers.push({
					"surveyType" : allQuestionsArray[currentQuestion - 1].surveyType,
					"answer" : currentAnswer1.toString(),
					"questionID" : allQuestionsArray[currentQuestion - 1].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 1].surveyQuestions,
					"selectedRow" : selectedRow1,
					"timeTaken" : timeTaken,
					"distance" : answer1Distance,
					"SurveyName" : args.surveyName,
					"StatusType" : StatusType
				});
			} else {
				var timeDiff = Math.abs(answer1Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				var jObject = {
					"surveyType" : allQuestionsArray[currentQuestion - 1].surveyType,
					"answer" : currentAnswer1.toString(),
					"questionID" : allQuestionsArray[currentQuestion - 1].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 1].surveyQuestions,
					"selectedRow" : selectedRow1,
					"timeTaken" : timeTaken,
					"distance" : answer1Distance,
					"SurveyName" : args.surveyName,
					"StatusType" : StatusType
				};
				arraySubmitedAnswers[currentQuestion - 1] = jObject;
			}

		}
		Ti.API.info('arraySubmitedAnswers : ', arraySubmitedAnswers);
		if (currentQuestion != totalQuestions) {

			currentQuestion = currentQuestion + 2;
			var displayNumb = 2;
			Ti.API.info('currentQuestion : ', currentQuestion, totalQuestions);
			if (currentQuestion > totalQuestions) {
				displayNumb = 1;
				currentQuestion = currentQuestion - 1;
			}
			if (currentQuestion == totalQuestions) {
				$.doneLabel.text = commonFunctions.L('submitLbl', LangCode);
			}
			loadingValues(displayNumb, false);
		} else {
			setProgressBar(currentPro, totalQuestions);
			if (args.isFrom == "memoryTest") {
				Ti.API.info('memoryTest');
				Ti.App.removeEventListener('getValues', getSurveyValues);
				//refreshValues();
				var distractResultArray = [];
				symptomEndTime = new Date().toUTCString();
				for (var i = 0; i < arraySubmitedAnswers.length; i++) {
					distractResultArray.push({
						"surveyType" : arraySubmitedAnswers[i].surveyType,
						"answer" : arraySubmitedAnswers[i].answer,
						"questionID" : arraySubmitedAnswers[i].questionID,
						"surveyID" : args.surveyID,
						"surveyQuestions" : arraySubmitedAnswers[i].surveyQuestions,
						"timeTaken" : arraySubmitedAnswers[i].timeTaken,
						"distance" : arraySubmitedAnswers[i].distance,
						"StatusType" : StatusType
					});

				};
				Ti.API.info(' ***distSurveyDataArray : ' + distractResultArray[0].timeTaken);
				distSurveyDataArray = distractResultArray;
				points = points + 1;
				gamePoints = gamePoints + points;
				commonDB.insertGameScore(19, 0, gamePoints, points);
				surveyEndTime = new Date().getTime();
				var timeDiff = commonFunctions.getMinuteSecond(symptomStartTime, symptomEndTime);
				Ti.API.info('time taken is', timeDiff);
				StatusType = 2;
				//commonFunctions.getScoreView(0, points, timeDiff);
				for (var i = 0; i < distSurveyDataArray.length; i++) {
					surveyQuesAns.push({
						Question : distSurveyDataArray[i].surveyQuestions,
						Answer : distSurveyDataArray[i].answer,
						TimeTaken : distSurveyDataArray[i].timeTaken,
						ClickRange : distSurveyDataArray[i].distance,
					});
				}
				Ti.API.info('Submitting Distraction Suevry with surveyQuesAns : ', surveyQuesAns);
				var surveyParam = {
					"UserID" : credentials.userId,
					"SurveyType" : arraySubmitedAnswers[0].surveyType,
					"SurveyName" : args.surveyName,
					"StartTime" : symptomStartTime,
					"EndTime" : symptomEndTime,
					"Rating" : "",
					"Point" : points,
					"QuestAndAnsList" : surveyQuesAns,
					"StatusType" : StatusType

				};

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "simpleMemoryTask" || parentWindow.windowName === "visualAssociation" || parentWindow.windowName === "temporalOrder" )) {
					Ti.API.info('Call restart');
					parentWindow.window.restartGame(surveyParam);
				}
			} else {
				if (callScoreView == 0) {
					callScoreView = 1;
				} else {
					return;
				}
				var resultArray = [];
				symptomEndTime = new Date().toUTCString();
				for (var i = 0; i < arraySubmitedAnswers.length; i++) {
					resultArray.push({
						"surveyType" : arraySubmitedAnswers[i].surveyType,
						"answer" : arraySubmitedAnswers[i].answer,
						"questionID" : arraySubmitedAnswers[i].questionID,
						"surveyID" : args.surveyID,
						"surveyQuestions" : arraySubmitedAnswers[i].surveyQuestions,
						"timeTaken" : arraySubmitedAnswers[i].timeTaken,
						"distance" : arraySubmitedAnswers[i].distance,
						"StatusType" : StatusType
					});

				};
				clearTimeout(scrollTimer);
				surveyDataArray = resultArray;
				points = points + 1;
				gamePoints = gamePoints + points;
				commonDB.insertGameScore(19, 0, gamePoints, points);
				surveyEndTime = new Date().getTime();
				var timeDiff = commonFunctions.getMinuteSecond(symptomStartTime, symptomEndTime);
				Ti.API.info('time taken is', timeDiff);
				StatusType = 2;
				

				commonFunctions.showAlert("Your responses have been submitted successfully.", okClick);
			}
		}
		Ti.API.info('onSubmitClick End');
	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "onSubmitClick", ex);
	}

}

var okClick = function(e) {
	Ti.App.fireEvent("getValues");

};

function removeAllPreviousViews() {

	answerViewSetTop = [];
	answerViewSetBottom = [];

	if ($.topAddonView.children) {
		for (var c = $.topAddonView.children.length - 1; c >= 0; c--) {
			$.topAddonView.remove($.topAddonView.children[c]);
		}
	}
	if ($.bottomAddonView.children) {
		for (var c = $.bottomAddonView.children.length - 1; c >= 0; c--) {
			$.bottomAddonView.remove($.bottomAddonView.children[c]);
		}
	}

}

function isOdd(num) {
	return num % 2;
}

var calculateTime;
var playedTime;
Ti.App.addEventListener('getValues', getSurveyValues);
function getSurveyValues() {
	Ti.API.info('enter the 1 part', arraySubmitedAnswers[0]);
	if (symptomStartTime == null || arraySubmitedAnswers[0] == null) {
		Ti.API.info('enter the error part');
		saveUserSurveyFailure();
		return;
	}
	
	for (var i = 0; i < surveyDataArray.length; i++) {
		surveyQuesAns.push({
			Question : surveyDataArray[i].surveyQuestions,
			Answer : surveyDataArray[i].answer,
			TimeTaken : surveyDataArray[i].timeTaken,
			ClickRange : surveyDataArray[i].distance,
		});
	}
	Ti.API.info('Submitting Suevry with surveyQuesAns : ', surveyQuesAns);
	var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	var spinRecords = spinInfo.lampRecords;
	var notiGameScore;
	var spinWheelScore;

	var notificationGame;
	if (args.fromNotification === true && args.isLocal != 1) {
		notificationGame = true;
		dateTimeFormat(args.createdDate);
		if (spinRecords != 0) {
			notiGameScore = Math.trunc(100 / spinRecords);
			Ti.API.info(' ***** notiGameScore ***** ' + notiGameScore);
			if (playedTime >= 5) {
				calculateTime = Math.trunc(parseInt(playedTime) / 5);
				Ti.API.info(' ***** calculateTime ***** ' + calculateTime);
				spinWheelScore = notiGameScore - calculateTime;
			} else {
				spinWheelScore = notiGameScore;
			}
		}
	} else {
		notificationGame = false;
		spinWheelScore = 5;
	}
	
	if (args.isBatch == true && Alloy.Globals.BATCH_ARRAY.length != 1) {
		spinWheelScore = 0;
	}
	if (spinWheelScore < 0) {
		spinWheelScore = 0;
	}
	var surveyParam = {
		"UserID" : credentials.userId,
		"SurveyID" : args.surveyID,
		"SurveyType" : arraySubmitedAnswers[0].surveyType,
		"SurveyName" : args.surveyName,
		"StartTime" : symptomStartTime,
		"EndTime" : symptomEndTime,
		"Rating" : "",
		"Point" : points,
		"QuestAndAnsList" : surveyQuesAns,
		"StatusType" : StatusType,
		"IsDistraction" : false,
		"IsNotificationGame" : notificationGame,
		"AdminBatchSchID" : args.isBatch == true ? args.testID : 0,
		"SpinWheelScore" : spinWheelScore
	};
	Ti.API.info('**** surveyParam SpinWheelScore **** = ' + surveyParam.SpinWheelScore);
	Ti.API.info('**** Survey Params to Save = ' + JSON.stringify(surveyParam));
	if (Ti.Network.online) {
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySaving', LangCode));
		serviceManager.saveUserSurvey(surveyParam, saveUserSurveySuccess, saveUserSurveyFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode), function() {
			saveUserSurveyFailure();

		});
	}
}

/**
 * Date Time Format
 */
function dateTimeFormat(createdDate) {
	Ti.API.info('args.createdDate : ', createdDate);
	var createdDateTime = createdDate.split(" ");
	Ti.API.info(' ***** createdDateTime ***** ' + createdDateTime);
	var datePart = createdDateTime[0].split("-");
	var day = datePart[1];
	var month = datePart[2];
	var year = datePart[0];
	var myCreatedDate = day + "/" + month + "/" + year;

	var timePart = createdDateTime[1].split(":");
	var hour = timePart[0];
	var min = timePart[1];
	var second = timePart[2];
	var myCreatedTime = hour + ":" + min + ":" + second;

	var resultDate = myCreatedDate + " " + myCreatedTime;

	Ti.API.info('*** resultDate **** ' + resultDate);

	var myDate = new Date(resultDate).getTime();
	var curDate = new Date().getTime();
	Ti.API.info(' ***** myDate ***** ' + myDate);
	Ti.API.info(' ***** curDate ***** ' + curDate);
	var timeDifference = curDate - myDate;
	Ti.API.info(' ***** timeDifference ***** ' + timeDifference);

	playedTime = parseInt(timeDifference) / 60000;
	Ti.API.info(' ***** playedTime ***** ' + playedTime);
}



/**
 * Signin API Calling Success
 */
function saveUserSurveySuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SAVE USER SURVEY RESPONSE****  ', JSON.stringify(response));
		commonFunctions.closeActivityIndicator();
		if (response.ErrorCode == 0) {

			Ti.App.removeEventListener('getValues', getSurveyValues);
			Alloy.Globals.SURVEY_COMMENTS = "";
			Ti.API.info('INSERT arraySubmitedAnswers : ', arraySubmitedAnswers);
			commonDB.insertSurveyResult(arraySubmitedAnswers);
			Alloy.Globals.SURVEY_POINTS = Alloy.Globals.SURVEY_POINTS + 1;
			var diff = 0;
			var curTime = new Date().getTime();
			var setTime = Ti.App.Properties.getString('EnvTime', "");

			if (args.isBatch == true) {
				var surveyName = "";
				Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
				if (Alloy.Globals.BATCH_ARRAY.length != 0) {
					Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
					var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
					if (surveyId[0] == "S") {
						surveyName = commonDB.getSurveyName(surveyId[1]);
						args.surveyID = surveyId[1];
						args.surveyName = surveyName.toUpperCase();
						restartSurvey();
						//commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID);
					} else {
						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');
						commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

					}

				} else {
					if (setTime != "") {
						diff = curTime - setTime;
					}
					if (diff == 0 || diff > 900000) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
							'backDisable' : true,
						});
					}

					Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');
					var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
					if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
						parentWindow.window.refreshHomeScreen();
					}
				}
			} else if (args.isFrom == "memoryTest") {
				Ti.API.info('closed symptom');
				refreshValues();
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}

			} else {
				Ti.API.info('** enableSurveyPopup = ' + enableSurveyPopup);
				if (enableSurveyPopup == true && isBackbuttonClicked == false) {

					commonFunctions.showAlert(surveyPopupMessage, popupClick);
				} else {
					isBackbuttonClicked = false;
					if (setTime != "") {
						diff = curTime - setTime;
					}
					if (diff == 0 || diff > 3600000) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
							'backDisable' : true,
							'surveyID' : args.surveyID
						});

						setTimeout(function() {
							
							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');
							var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
							if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
								parentWindow.window.refreshHomeScreen();
							}

						}, 1000);

					} else {

						Ti.API.info('args.surveyID : ', args.surveyID);

						setTimeout(function() {
							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');

							var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
							if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
								parentWindow.window.refreshHomeScreen();
							}
						}, 1000);

					}
				}

			}

		} else {
			commonFunctions.closeActivityIndicator();
			commonFunctions.showAlert(response.ErrorMessage);
		}
	} catch(ex) {
		commonFunctions.handleException("comment", "saveUserSurveySuccess", ex);
	}
}

var popupClick = function(e) {
	var diff = 0;
	var curTime = new Date().getTime();
	var setTime = Ti.App.Properties.getString('EnvTime', "");

	if (setTime != "") {
		diff = curTime - setTime;
	}
	if (diff == 0 || diff > 3600000) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
			'backDisable' : true,
			'surveyID' : args.surveyID
		});

		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}

		}, 1000);

	} else {

		Ti.API.info('args.surveyID : ', args.surveyID);

		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');

			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}, 1000);

	}

};

/**
 * Signin API Calling Failure
 */
function saveUserSurveyFailure() {
	commonFunctions.closeActivityIndicator();
	Ti.App.removeEventListener('getValues', getSurveyValues);
	if (args.isBatch == true) {
		var surveyName = "";
		Alloy.Globals.BATCH_ARRAY = Alloy.Globals.BATCH_ARRAY.splice(1, Alloy.Globals.BATCH_ARRAY.length);
		if (Alloy.Globals.BATCH_ARRAY.length != 0) {
			Ti.API.info('Alloy.Globals.BATCH_ARRAY in nback', Alloy.Globals.BATCH_ARRAY);
			var surveyId = Alloy.Globals.BATCH_ARRAY[0].trim().split(" ");
			if (surveyId[0] == "S") {
				surveyName = commonDB.getSurveyName(surveyId[1]);
				args.surveyID = surveyId[1];
				args.surveyName = surveyName.toUpperCase();
				restartSurvey();
				//commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID);
			} else {
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');
				commonFunctions.navigateToWindow(Alloy.Globals.BATCH_ARRAY[0], 0, surveyName, surveyId[1], args.testID, args.createdDate);

			}

		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		}
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('comments');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('syptomSurveyNew');

		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}

}

function doneButtonClick(e) {
	var displayNumb = 2;
	if (totalQuestions == 1 || currentQuestion % 2 != 0) {
		displayNumb = 1;
	}

	if (displayNumb == 2 && allQuestionsArray[currentQuestion - 1].surveyType == 8) {
		if (responseTextAreaBottom.value != commonFunctions.L('surveyTextArea', LangCode) && responseTextArea.value != commonFunctions.L('surveyTextArea', LangCode)) {
			if (arraySubmitedAnswers[currentQuestion - displayNumb] == null) {
				currentAnswer1 = responseTextArea.value;
				currentAnswer2 = responseTextAreaBottom.value;
				pageAnswerCount += 2;
				currentPro += 2;
			}
		}
	} else {
		if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 8) {
			if (responseTextArea.value != commonFunctions.L('surveyTextArea', LangCode)) {
				if (arraySubmitedAnswers[currentQuestion - displayNumb] == null) {
					currentAnswer1 = responseTextArea.value;
					pageAnswerCount += 1;
					currentPro += 1;
				}
			}
		}
	}
	if (currentAnswer1 != null && currentAnswer2 != null) {
		onSubmitClick();

	} else if (totalQuestions == 1 && currentAnswer1 != null) {
		onSubmitClick();
	} else {
		if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 8 || allQuestionsArray[currentQuestion - 1].surveyType == 8) {
			commonFunctions.showAlert(commonFunctions.L('textAreaValidation', LangCode));
		} else {
			commonFunctions.showAlert(commonFunctions.L('slectAnswerType', LangCode));
		}
	}
}

function clickWindow() {
	if (responseTextAreaBottom != null && responseTextAreaBottom != undefined) {
		responseTextAreaBottom.blur();
	}
	if (responseTextArea != null && responseTextArea != undefined) {
		responseTextArea.blur();
	}

}
