/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var totalQuestions = 0;
	var currentQuestion = 2;
	var arraySubmitedAnswers = [];
	var currentAnswer1 = null;
	var currentAnswer2 = null;
	var allQuestionsArray = [];
	var commonDB = require('commonDB');
	var pickerValues = require('pickerValues');
	var serviceManager = require('serviceManager');
	var Picker = require('picker');
	var symptomStartTime = null;
	var symptomEndTime = null;
	var surveyStartTime = null;
	var surveyEndTime = null;
	var currentPro = 0;
	var pageAnswerCount = 0;
	var credentials = Alloy.Globals.getCredentials();
	var surveyQuesAns = [];
	var surveyDataArray = [];
	var flexSpace;
	var done;
	var flexSpace1;
	var done1;
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
	var LangCode = Ti.App.Properties.getString('languageCode');
}
$.commentBoxText._hintText = $.commentBoxText.value;
$.commentBoxText.color = "#b0bec5";
$.commentBoxTextBottom._hintText = $.commentBoxTextBottom.value;
$.commentBoxTextBottom.color = "#b0bec5";

/**
 * function for window open
 */

$.symptomSurvey.addEventListener("open", function(e) {
	try {

		if (Ti.Platform.osname == "ipad") {
			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
		}
		if (args.isFrom == "memoryTest") {
			$.headerView.setLeftViewVisibility(false);
		}
		Ti.API.info('args.surveyID  : ', args.surveyID);
		if (OS_ANDROID && args.surveyID == 5) {
			$.mainView.scrollingEnabled = false;
		}
		allQuestionsArray = commonDB.getSurveyQuestions(args.surveyID);
		totalQuestions = allQuestionsArray.length;

		symptomStartTime = new Date().toUTCString();

		var surveyInfo = commonDB.getGameScore(credentials.userId);

		for (var i = 0; i < surveyInfo.length; i++) {
			if (surveyInfo[i].gameID == 15) {
				gamePoints = surveyInfo[i].points;
			}
		}
		loadingValues(2, false);
		flexSpace = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		done = Ti.UI.createButton({

			title : "Done",
		});
		done.addEventListener('click', function(e) {
			$.commentBoxText.blur();

		});
		flexSpace1 = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		done1 = Ti.UI.createButton({

			title : "Done",
		});
		done1.addEventListener('click', function(e) {
			$.commentBoxTextBottom.blur();

		});

		$.commentBoxText.keyboardToolbar = [flexSpace, done];
		$.commentBoxTextBottom.keyboardToolbar = [flexSpace1, done1];
		setTimeout(function() {
			commonFunctions.closeActivityIndicator();
			$.outerMostView.visible = true;
		}, 100);

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "open", ex);
	}
});
function loadingValues(displayNumb, isBack) {
	try {
		callScoreView = 0;
		pageAnswerCount = 0;
		//Load Top Area Question
		if (arraySubmitedAnswers[currentQuestion - displayNumb] == null) {
			currentAnswer1 = null;
			$.commentBoxText.color = "#b0bec5";
			$.commentBoxText.value = $.commentBoxText._hintText;
			setAnswerTop(null, allQuestionsArray[currentQuestion - displayNumb].surveyType, 0);
		} else {
			$.commentBoxText.color = "#456e7a";
			setAnswerTop(arraySubmitedAnswers[currentQuestion - displayNumb].answer, arraySubmitedAnswers[currentQuestion - displayNumb].surveyType, arraySubmitedAnswers[currentQuestion - displayNumb].selectedRow);
			if (isBack == false) {
				currentPro = currentPro + 1;
			}

		}
		answer1Distance = "";
		answer2Distance = "";
		answerDistance = "";
		Ti.API.info('allQuestionsArray[currentQuestion -displayNumb].surveyType : ', allQuestionsArray[currentQuestion - displayNumb].surveyType);
		if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 1) {
			$.checkBoxView.visible = true;
			$.linkertView.visible = false;
			$.commentBoxView.visible = false;
			$.pickerView.visible = false;
			$.pickerViewLabel.visible = false;
		} else if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 2) {
			$.checkBoxView.visible = false;
			$.linkertView.visible = false;
			$.commentBoxView.visible = true;
			$.pickerView.visible = false;
			$.pickerViewLabel.visible = false;
			if (allQuestionsArray[currentQuestion - displayNumb].keybordType == 1) {
				$.commentBoxText.keyboardType = Titanium.UI.KEYBOARD_TYPE_NUMBER_PAD;
			} else if (allQuestionsArray[currentQuestion - displayNumb].keybordType == 2) {
				$.commentBoxText.keyboardType = Titanium.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION;
			} else {
				$.commentBoxText.keyboardType = Titanium.UI.KEYBOARD_TYPE_DEFAULT;
			}
		} else if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 3) {
			$.checkBoxView.visible = false;
			$.linkertView.visible = true;
			$.commentBoxView.visible = false;
			$.pickerView.visible = false;
			$.pickerViewLabel.visible = false;
		} else if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 4) {
			$.checkBoxView.visible = false;
			$.linkertView.visible = false;
			$.commentBoxView.visible = false;
			$.pickerView.visible = true;

		} else if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 5) {
			$.checkBoxView.visible = false;
			$.linkertView.visible = false;
			$.commentBoxView.visible = false;
			$.pickerView.visible = false;
			$.selfQuestionView.visible = true;
			$.pickerViewLabel.visible = false;
		}
		$.questionLabel.text = allQuestionsArray[currentQuestion - displayNumb].surveyQuestions;
		Ti.API.info('displayNumb : ', displayNumb);
		//Load Bottom Area Question
		if (displayNumb == 2) {
			$.QuestionContentBottomView.visible = true;
			Ti.API.info('display 2');
			Ti.API.info('arraySubmitedAnswers[currentQuestion - 1] : ', arraySubmitedAnswers[currentQuestion - 1]);
			if (arraySubmitedAnswers[currentQuestion - 1] == null) {
				currentAnswer2 = null;
				$.commentBoxTextBottom.color = "#b0bec5";
				$.commentBoxTextBottom.value = $.commentBoxTextBottom._hintText;
				setAnswerBottom(null, allQuestionsArray[currentQuestion - 1].surveyType, 0);
			} else {
				$.commentBoxTextBottom.color = "#456e7a";
				setAnswerBottom(arraySubmitedAnswers[currentQuestion - 1].answer, arraySubmitedAnswers[currentQuestion - 1].surveyType, arraySubmitedAnswers[currentQuestion - 1].selectedRow);
				if (isBack == false) {
					currentPro = currentPro + 1;
				}

			}

			if (allQuestionsArray[currentQuestion - 1].surveyType == 1) {
				$.checkBoxViewBottom.visible = true;
				$.linkertViewBottom.visible = false;
				$.commentBoxViewBottom.visible = false;
				$.pickerViewBottom.visible = false;
			} else if (allQuestionsArray[currentQuestion - 1].surveyType == 2) {
				$.checkBoxViewBottom.visible = false;
				$.linkertViewBottom.visible = false;
				$.commentBoxViewBottom.visible = true;
				$.pickerViewBottom.visible = false;
				if (allQuestionsArray[currentQuestion - 1].keybordType == 1) {
					$.commentBoxTextBottom.keyboardType = Titanium.UI.KEYBOARD_TYPE_NUMBER_PAD;
				} else if (allQuestionsArray[currentQuestion - 1].keybordType == 2) {
					$.commentBoxTextBottom.keyboardType = Titanium.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION;
				} else {
					$.commentBoxTextBottom.keyboardType = Titanium.UI.KEYBOARD_TYPE_DEFAULT;
				}
			} else if (allQuestionsArray[currentQuestion - 1].surveyType == 3) {
				$.checkBoxViewBottom.visible = false;
				$.linkertViewBottom.visible = true;
				$.commentBoxViewBottom.visible = false;
				$.pickerViewBottom.visible = false;
			} else if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 4) {
				$.checkBoxViewBottom.visible = false;
				$.linkertViewBottom.visible = false;
				$.commentBoxViewBottom.visible = false;
				$.pickerViewBottom.visible = true;

			} else if (allQuestionsArray[currentQuestion - displayNumb].surveyType == 5) {
				$.checkBoxViewBottom.visible = false;
				$.linkertViewBottom.visible = false;
				$.commentBoxViewBottom.visible = false;
				$.pickerViewBottom.visible = false;
				$.selfQuestionViewBottom.visible = true;
			}

			$.questionLabelBottom.text = allQuestionsArray[currentQuestion - 1].surveyQuestions;
		} else {

			$.QuestionContentBottomView.visible = false;
		}

		setProgressBar(currentPro, totalQuestions);
		questionDisplayedTime = new Date();

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "loadingValues", ex);
	}
}

var topPickerData = [];
function setAnswerTop(answer, type, selectedRow) {
	selectedRow1 = selectedRow;
	currentAnswer1 = answer;
	var pickerType = Ti.UI.PICKER_TYPE_PLAIN;
	if (currentQuestion == 2) {
		picker_data = pickerValues.getWeeks();
		topPickerData = pickerValues.getWeeks();
	} else if (currentQuestion == 4) {
		picker_data = pickerValues.getDay();
		topPickerData = pickerValues.getDay();
	} else {
		pickerType = Ti.UI.PICKER_TYPE_TIME;
		picker_data = [];
		topPickerData = [];
	}
	Ti.API.info('topPickerData : ', topPickerData);

	if (picker_data !== null && type == 4) {
		if (pickerControlTop != null) {
			$.pickerView.remove(pickerControlTop);
			pickerControlTop = null;
		}
		if (picker_data.length == 0) {
			defaultTimeVal = new Date();

			defaultTimeVal.setHours(0);
			defaultTimeVal.setMinutes(0);
			defaultTimeVal.setSeconds(0);
			defaultTimeVal.setMilliseconds(0);
			Ti.API.info('defaultTimeVal : ', defaultTimeVal);
			if (OS_IOS) {
				pickerControlTop = Titanium.UI.createPicker({
					useSpinner : true,

					selectionIndicator : true,
					type : pickerType,
					width : '200dp',
					value : defaultTimeVal,

				});
				pickerControlTop.addEventListener('change', pickerControlTopChange);

			} else {
				$.pickerView.visible = false;
				$.pickerViewLabel.text = "00:00";
				$.pickerViewLabel.visible = true;
				$.pickerViewLabel.addEventListener('click', function(e) {
					clearTimeout(scrollTimer);
					ShowTimePicker(defaultTimeVal, function(val, index) {
						if (answerDistance == "") {
							answer1Distance = "Valid";
						} else {
							answer1Distance = answerDistance + "," + "Valid";
						}
						answerDistance = "";
						answer1Time = new Date();
						Ti.API.info('ShowTimePicker return : ', val, index);
						defaultTimeVal = val;

						var date = new Date(val);
						var hours = date.getHours();
						var minutes = date.getMinutes();
						minutes = minutes < 10 ? '0' + minutes : minutes;
						hours = hours < 10 ? '0' + hours : hours;
						var timePart = hours + ':' + minutes;

						currentAnswer1 = timePart;
						$.pickerViewLabel.text = timePart;

						selectedRow1 = e.rowIndex;
						if (isSubmited == false) {
							scrollTimer = setTimeout(function() {
								if (currentAnswer2 != null) {
									if (isSubmited == false) {
										isSubmited = true;
										Ti.API.info('Submit click');
										onSubmitClick();
									}

								}
							}, 3000);
						}

					});
				});

			}

			currentAnswer1 = defaultTimeVal;
			var selectedDate = new Date(currentAnswer1);
			var hours = selectedDate.getHours();
			hours = hours < 10 ? "0" + hours : hours;
			var minute = selectedDate.getMinutes();
			minute = minute < 10 ? "0" + minute : minute;
			currentAnswer1 = hours + ":" + minute;
			pageAnswerCount += 1;
			currentPro += 1;
			setProgressBar(currentPro, totalQuestions);
		} else {
			if (OS_IOS) {
				pickerControlTop = Titanium.UI.createPicker({
					useSpinner : true,
					selectionIndicator : true,
					type : pickerType,

				});
				pickerControlTop.addEventListener('change', pickerControlTopChange);
			} else {
				$.pickerView.backgroundColor = "#E5E5E5";
				var plainTemplate = {
					childTemplates : [{
						type : 'Ti.UI.Label', // Use a label
						bindId : 'rowtitle', // Bind ID for this label
						properties : {
							textAlign : "center",
							font : Alloy.Globals.MediumSemiBoldTablet,
							height : '40dp',
							color : '#000',
							width : '100%',
							touchEnabled : false,

						}
					}]
				};
				pickerControlTop = Ti.UI.createListView({
					templates : {
						'plain' : plainTemplate
					},
					defaultItemTemplate : 'plain',
					height : Ti.UI.SIZE,
					width : Ti.UI.SIZE,
					separatorInsets : {
						left : 0,
						right : 0
					}
				});
				pickerControlTop.addEventListener('itemclick', pickerControlTopChangeAndroid);

			}
		}

		$.pickerView.add(pickerControlTop);
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
				if (answer == null) {
					var item = Listsection.getItemAt(0);
					item.properties.backgroundColor = "#f1f5f7";
					Listsection.updateItemAt(0, item);
				}

				pickerControlTop.sections = [Listsection];
			}

		}

	}

	if (answer == null) {
		$.checkYes.image = "/images/surveyTypes/yes.png";
		$.checkNo.image = "/images/surveyTypes/no.png";
		$.ans1Button.image = "/images/surveyTypes/check-box.png";
		$.ans2Button.image = "/images/surveyTypes/check-box.png";
		$.ans3Button.image = "/images/surveyTypes/check-box.png";
		$.ans4Button.image = "/images/surveyTypes/check-box.png";
		$.yesButton.image = '/images/surveyTypes/check-box.png';
		$.noButton.image = '/images/surveyTypes/check-box.png';
		$.maybeButton.image = '/images/surveyTypes/check-box.png';

	} else {
		pageAnswerCount += 1;
		if (type == 1) {
			if (answer == "Yes") {
				$.checkYes.image = "/images/surveyTypes/yes-active.png";
				$.checkNo.image = "/images/surveyTypes/no.png";
			} else if (answer == "No") {
				$.checkYes.image = "/images/surveyTypes/yes.png";
				$.checkNo.image = "/images/surveyTypes/no-active.png";
			}

		} else if (type == 2) {
			$.commentBoxText.value = answer;
		} else if (type == 3) {
			$.ans1Button.image = "/images/surveyTypes/check-box.png";
			$.ans2Button.image = "/images/surveyTypes/check-box.png";
			$.ans3Button.image = "/images/surveyTypes/check-box.png";
			$.ans4Button.image = "/images/surveyTypes/check-box.png";
			if (answer == "Not at all" || answer == "12:00AM - 06:00AM" || answer == "0-3") {
				$.ans1Button.image = "/images/surveyTypes/check-box-active.png";
			} else if (answer == "Several Times" || answer == "06:00AM - 12:00PM" || answer == "3-6") {
				$.ans2Button.image = "/images/surveyTypes/check-box-active.png";
			} else if (answer == "More than Half the Time" || answer == "12:00PM - 06:00PM" || answer == "6-9") {
				$.ans3Button.image = "/images/surveyTypes/check-box-active.png";
			} else if (answer == "Nearly All the Time" || answer == "06:00PM - 12:00AM" || answer == ">9") {
				$.ans4Button.image = "/images/surveyTypes/check-box-active.png";
			}

		} else if (type == 4) {
			Ti.API.info('currentAnswer1 : ', currentAnswer1, selectedRow1);

			if (OS_IOS) {
				pickerControlTop.setSelectedRow(0, selectedRow1, false);
			} else {
				var item = pickerControlTop.sections[0].getItemAt(selectedRow1);
				item.properties.backgroundColor = "#f1f5f7";
				pickerControlTop.sections[0].updateItemAt(selectedRow1, item);

			}

		} else if (type == 5) {
			$.yesButton.image = '/images/surveyTypes/check-box.png';
			$.noButton.image = '/images/surveyTypes/check-box.png';
			$.maybeButton.image = '/images/surveyTypes/check-box.png';
			if (answer == "Yes") {
				$.yesButton.image = '/images/surveyTypes/check-box-active.png';
			} else if (answer == "No") {
				$.noButton.image = '/images/surveyTypes/check-box-active.png';
			} else if (answer == "Maybe") {
				$.maybeButton.image = '/images/surveyTypes/check-box-active.png';
			}
		}

	}
	if (args.surveyID == 4) {
		if (currentQuestion == 6) {
			$.ans1Label.text = "12:00AM - 06:00AM";
			$.ans2Label.text = "06:00AM - 12:00PM";
			$.ans3Label.text = "12:00PM - 06:00PM";
			$.ans4Label.text = "06:00PM - 12:00AM";

		} else if (currentQuestion == 8) {
			$.ans1Label.text = "0-3";
			$.ans2Label.text = "3-6";
			$.ans3Label.text = "6-9";
			$.ans4Label.text = ">9";

		} else {
			$.ans1Label.text = "Not at all";
			$.ans2Label.text = "Several Times";
			$.ans3Label.text = "More than Half the Time";
			$.ans4Label.text = "Nearly All the Time";

		}
	}
	Ti.API.info('setAnswerTop finish');

}

var bottomPickerData = [];
function setAnswerBottom(answer, type, selectedRow) {
	Ti.API.info('setAnswerBottom');
	currentAnswer2 = answer;
	if (selectedRow != null && selectedRow != undefined) {
		selectedRow2 = selectedRow;
	}

	if (currentQuestion == 2) {
		picker_data = pickerValues.getMonths();
		bottomPickerData = pickerValues.getMonths();
	} else if (currentQuestion == 4) {
		picker_data = pickerValues.getYear();
		bottomPickerData = pickerValues.getYear();
	} else {
		picker_data = [];
		bottomPickerData = [];
	}

	if (picker_data !== null && type == 4) {
		Ti.API.info('picker_data not null');
		if (pickerControlBottom != null) {
			$.pickerViewBottom.remove(pickerControlBottom);
			pickerControlBottom = null;
		}
		if (OS_IOS) {
			pickerControlBottom = Titanium.UI.createPicker({
				useSpinner : true,
				selectionIndicator : true,
				type : Ti.UI.PICKER_TYPE_PLAIN,
				width : '200dp',

			});
			pickerControlBottom.addEventListener('change', pickerControlBottomChange);
		} else {
			$.pickerViewBottom.backgroundColor = "#E5E5E5";
			var plainTemplate = {
				childTemplates : [{
					type : 'Ti.UI.Label', // Use a label
					bindId : 'rowtitle', // Bind ID for this label
					properties : {
						textAlign : "center",
						font : Alloy.Globals.MediumSemiBoldTablet,
						height : '40dp',
						color : '#000',
						width : '100%',
						touchEnabled : false,

					}
				}]
			};
			pickerControlBottom = Ti.UI.createListView({
				templates : {
					'plain' : plainTemplate
				},
				defaultItemTemplate : 'plain',
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				separatorInsets : {
					left : 0,
					right : 0
				}
			});

			pickerControlBottom.addEventListener('itemclick', pickerControlBottomChangeAndroid);

		}
		$.pickerViewBottom.add(pickerControlBottom);
		if (Ti.Platform.osname != 'android') {
			var picker_column1 = Ti.UI.createPickerColumn();
			for (var i = 0,
			    ilen = picker_data.length; i < ilen; i++) {
				var title = picker_data[i].title;
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

				picker_column1.addRow(row);
			}

			pickerControlBottom.add(picker_column1);
		} else {
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
			if (answer == null) {
				var item = Listsection.getItemAt(0);
				item.properties.backgroundColor = "#f1f5f7";
				Listsection.updateItemAt(0, item);
			}

			pickerControlBottom.sections = [Listsection];
		}
	}

	if (answer == null) {
		$.checkYesBottom.image = "/images/surveyTypes/yes.png";
		$.checkNoBottom.image = "/images/surveyTypes/no.png";
		$.ans1ButtonBottom.image = "/images/surveyTypes/check-box.png";
		$.ans2ButtonBottom.image = "/images/surveyTypes/check-box.png";
		$.ans3ButtonBottom.image = "/images/surveyTypes/check-box.png";
		$.ans4ButtonBottom.image = "/images/surveyTypes/check-box.png";
		$.yesButtonBottom.image = '/images/surveyTypes/check-box.png';
		$.noButtonBottom.image = '/images/surveyTypes/check-box.png';
		$.maybeButtonBottom.image = '/images/surveyTypes/check-box.png';

	} else {
		pageAnswerCount += 1;
		if (type == 1) {
			if (answer == "Yes") {
				$.checkYesBottom.image = "/images/surveyTypes/yes-active.png";
				$.checkNoBottom.image = "/images/surveyTypes/no.png";
			} else if (answer == "No") {
				$.checkYesBottom.image = "/images/surveyTypes/yes.png";
				$.checkNoBottom.image = "/images/surveyTypes/no-active.png";
			}

		} else if (type == 2) {
			$.commentBoxTextBottom.value = answer;
		} else if (type == 3) {
			$.ans1ButtonBottom.image = "/images/surveyTypes/check-box.png";
			$.ans2ButtonBottom.image = "/images/surveyTypes/check-box.png";
			$.ans3ButtonBottom.image = "/images/surveyTypes/check-box.png";
			$.ans4ButtonBottom.image = "/images/surveyTypes/check-box.png";
			if (answer == "Not at all" || answer == "12:00AM - 06:00AM" || answer == "0-3") {
				$.ans1ButtonBottom.image = "/images/surveyTypes/check-box-active.png";
			} else if (answer == "Several Times" || answer == "06:00AM - 12:00PM" || answer == "3-6") {
				$.ans2ButtonBottom.image = "/images/surveyTypes/check-box-active.png";
			} else if (answer == "More than Half the Time" || answer == "12:00PM - 06:00PM" || answer == "6-9") {
				$.ans3ButtonBottom.image = "/images/surveyTypes/check-box-active.png";
			} else if (answer == "Nearly All the Time" || answer == "06:00PM - 12:00AM" || answer == ">9") {
				$.ans4ButtonBottom.image = "/images/surveyTypes/check-box-active.png";
			}

		} else if (type == 4) {
			Ti.API.info('currentAnswer2 : ', currentAnswer2, selectedRow2);
			if (OS_IOS) {
				pickerControlBottom.setSelectedRow(0, selectedRow2, false);
			} else {
				var item = pickerControlBottom.sections[0].getItemAt(selectedRow2);
				item.properties.backgroundColor = "#f1f5f7";
				pickerControlBottom.sections[0].updateItemAt(selectedRow2, item);

			}

			//pickerControlBottom.value = 2;
		} else if (type == 5) {
			$.yesButtonBottom.image = '/images/surveyTypes/check-box.png';
			$.noButtonBottom.image = '/images/surveyTypes/check-box.png';
			$.maybeButtonBottom.image = '/images/surveyTypes/check-box.png';
			if (answer == "Yes") {
				$.yesButtonBottom.image = '/images/surveyTypes/check-box-active.png';
			} else if (answer == "No") {
				$.noButtonBottom.image = '/images/surveyTypes/check-box-active.png';
			} else if (answer == "Maybe") {
				$.maybeButtonBottom.image = '/images/surveyTypes/check-box-active.png';
			}
		}

	}
	if (args.surveyID == 4) {
		if (currentQuestion == 6) {
			$.ans1LabelBottom.text = "12:00AM - 06:00AM";
			$.ans2LabelBottom.text = "06:00AM - 12:00PM";
			$.ans3LabelBottom.text = "12:00PM - 06:00PM";
			$.ans4LabelBottom.text = "06:00PM - 12:00AM";

		} else if (currentQuestion == 8) {
			$.ans1LabelBottom.text = "12:00AM - 06:00AM";
			$.ans2LabelBottom.text = "06:00AM - 12:00PM";
			$.ans3LabelBottom.text = "12:00PM - 06:00PM";
			$.ans4LabelBottom.text = "06:00PM - 12:00AM";

		} else {
			$.ans1LabelBottom.text = "Not at all";
			$.ans2LabelBottom.text = "Several Times";
			$.ans3LabelBottom.text = "More than Half the Time";
			$.ans4LabelBottom.text = "Nearly All the Time";

		}
	}

}

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
$.headerView.on('backButtonClick', function(e) {

	goBack();
});
function goBack(e) {
	try {
		clearTimeout(scrollTimer);

		if (currentQuestion == 2) {
			Ti.App.removeEventListener('getValues', getSurveyValues);
			currentQuestion = 0;
			Alloy.Globals.SURVEY_COMMENTS = "";
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');
			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}
		} else {
			Ti.API.info('currentPro : ', currentPro, pageAnswerCount, currentQuestion);
			currentPro = currentPro - pageAnswerCount;
			if (isOdd(currentQuestion)) {
				currentQuestion = currentQuestion - 1;
			} else {
				currentQuestion = currentQuestion - 2;
			}
			Ti.API.info('currentPro : ', currentPro, currentQuestion);
			$.pickerViewLabel.visible = false;
			loadingValues(2, true);

		}
	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "goBack", ex);
	}

}

/**
 * function for android back
 */
$.symptomSurvey.addEventListener('android:back', function() {
	if (args.isFrom == "memoryTest") {
		return;
	}
	goBack();
});

function isOdd(num) {
	return num % 2;
}

function onSubmitClick() {
	try {
		Ti.API.info('onSubmitClick');
		if (allQuestionsArray[currentQuestion - 2].surveyType != 2) {
			if (currentAnswer1 == null) {
				commonFunctions.showAlert(L('slectAnswerType'));
				return;
			}
		} else {
			if ($.commentBoxText.value == "" || $.commentBoxText.value == $.commentBoxText._hintText) {
				commonFunctions.showAlert(L('enterAnswer'), function(e) {
					$.commentBoxText.setSelection(0, 0);
				});
				return;
			}
			if (currentAnswer1 == null) {
				pageAnswerCount += 1;
				currentPro += 1;

			}
			setProgressBar(currentPro, totalQuestions);

			currentAnswer1 = $.commentBoxText.value;

		}
		if (allQuestionsArray[currentQuestion - 1].surveyType != 2) {
			if (currentAnswer2 == null) {
				commonFunctions.showAlert(L('slectAnswerType'));
				return;
			}
		} else {
			if ($.commentBoxTextBottom.value == "" || $.commentBoxTextBottom.value == $.commentBoxTextBottom._hintText) {
				commonFunctions.showAlert(L('enterAnswer'), function(e) {
					$.commentBoxTextBottom.setSelection(0, 0);
				});
				return;
			}
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;

			}
			setProgressBar(currentPro, totalQuestions);
			currentAnswer2 = $.commentBoxTextBottom.value;

		}
		Ti.API.info('currentQuestion');
		if (currentQuestion % 2 == 0) {
			Ti.API.info('arraySubmitedAnswers : ', arraySubmitedAnswers.length);
			if (arraySubmitedAnswers[currentQuestion - 2] == null) {
				var timeDiff = Math.abs(answer1Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				arraySubmitedAnswers.push({
					"surveyType" : allQuestionsArray[currentQuestion - 2].surveyType,
					"answer" : currentAnswer1,
					"questionID" : allQuestionsArray[currentQuestion - 2].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 2].surveyQuestions,
					"selectedRow" : selectedRow1,
					"timeTaken" : timeTaken,
					"distance" : answer1Distance
				});
			} else {
				var timeDiff = Math.abs(answer1Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				var jObject = {
					"surveyType" : allQuestionsArray[currentQuestion - 2].surveyType,
					"answer" : currentAnswer1,
					"questionID" : allQuestionsArray[currentQuestion - 2].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 2].surveyQuestions,
					"selectedRow" : selectedRow1,
					"timeTaken" : timeTaken,
					"distance" : answer1Distance
				};
				arraySubmitedAnswers[currentQuestion - 2] = jObject;
			}
			if (arraySubmitedAnswers[currentQuestion - 1] == null) {
				var timeDiff = Math.abs(answer2Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				arraySubmitedAnswers.push({
					"surveyType" : allQuestionsArray[currentQuestion - 1].surveyType,
					"answer" : currentAnswer2,
					"questionID" : allQuestionsArray[currentQuestion - 1].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 1].surveyQuestions,
					"selectedRow" : selectedRow2,
					"timeTaken" : timeTaken,
					"distance" : answer2Distance
				});
			} else {
				var timeDiff = Math.abs(answer2Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				var jObject = {
					"surveyType" : allQuestionsArray[currentQuestion - 1].surveyType,
					"answer" : currentAnswer2,
					"questionID" : allQuestionsArray[currentQuestion - 1].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 1].surveyQuestions,
					"selectedRow" : selectedRow2,
					"timeTaken" : timeTaken,
					"distance" : answer2Distance
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
					"answer" : currentAnswer1,
					"questionID" : allQuestionsArray[currentQuestion - 1].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 1].surveyQuestions,
					"selectedRow" : selectedRow1,
					"timeTaken" : timeTaken,
					"distance" : answer1Distance
				});
			} else {
				var timeDiff = Math.abs(answer1Time.getTime() - questionDisplayedTime.getTime());
				timeTaken = Math.ceil(timeDiff / 1000);
				var jObject = {
					"surveyType" : allQuestionsArray[currentQuestion - 1].surveyType,
					"answer" : currentAnswer1,
					"questionID" : allQuestionsArray[currentQuestion - 1].questionID,
					"surveyID" : args.surveyID,
					"surveyQuestions" : allQuestionsArray[currentQuestion - 1].surveyQuestions,
					"selectedRow" : selectedRow1,
					"timeTaken" : timeTaken,
					"distance" : answer1Distance
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
			loadingValues(displayNumb, false);
		} else {
			if (args.isFrom == "memoryTest") {
				Ti.API.info('closed symptom');
				Ti.App.removeEventListener('getValues', getSurveyValues);

				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "simpleMemoryTask" || parentWindow.windowName === "visualAssociation" || parentWindow.windowName === "temporalOrder" )) {
					Ti.API.info('Call restart');
					parentWindow.window.restartGame();
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
					});

				};
				clearTimeout(scrollTimer);
				surveyDataArray = resultArray;
				points = points + 1;
				gamePoints = gamePoints + points;
				commonDB.insertGameScore(15, 0, gamePoints, points);
				surveyEndTime = new Date().getTime();
				var timeDiff = commonFunctions.getMinuteSecond(symptomStartTime, symptomEndTime);
				Ti.API.info('time taken is', timeDiff);
				commonFunctions.getScoreView(0, points, timeDiff);

			}
		}
		Ti.API.info('onSubmitClick End');
	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onSubmitClick", ex);
	}
}

Ti.App.addEventListener('getValues', getSurveyValues);
function getSurveyValues() {

	for (var i = 0; i < surveyDataArray.length; i++) {
		surveyQuesAns.push({
			Question : surveyDataArray[i].surveyQuestions,
			Answer : surveyDataArray[i].answer,
			TimeTaken : surveyDataArray[i].timeTaken,
			ClickRange : surveyDataArray[i].distance,
		});
	}
	Ti.API.info('Submitting Suevry with surveyQuesAns : ', surveyQuesAns);
	var surveyParam = {
		"UserID" : credentials.userId,
		"SurveyType" : arraySubmitedAnswers[0].surveyType,
		"SurveyName" : args.surveyName,
		"StartTime" : symptomStartTime,
		"EndTime" : symptomEndTime,
		"Rating" : "",
		"Point" : points,
		"QuestAndAnsList" : surveyQuesAns,
	};
	if (symptomStartTime == null || arraySubmitedAnswers[0].surveyType == null) {
		saveUserSurveyFailure();
		return;
	}

	if (Ti.Network.online) {
		commonFunctions.openActivityIndicator(L('activitySaving'));
		serviceManager.saveUserSurvey(surveyParam, saveUserSurveySuccess, saveUserSurveyFailure);

	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(L('noNetwork'), function() {
			saveUserSurveyFailure();

		});

	}
}

/**
 * Signin API Calling Success
 */
function saveUserSurveySuccess(e) {
	try {

		var response = JSON.parse(e.data);

		commonFunctions.closeActivityIndicator();
		if (response.ErrorCode == 0) {
			Ti.App.removeEventListener('getValues', getSurveyValues);
			Alloy.Globals.SURVEY_COMMENTS = "";
			commonDB.insertSurveyResult(arraySubmitedAnswers);
			Alloy.Globals.SURVEY_POINTS = Alloy.Globals.SURVEY_POINTS + 1;
			var diff = 0;
			var curTime = new Date().getTime();
			var setTime = Ti.App.Properties.getString('EnvTime', "");
			if (args.isFrom == "memoryTest") {
				Ti.API.info('closed symptom');

				refreshValues();
				Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');
				var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
				if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
					parentWindow.window.refreshHomeScreen();
				}

			} else {
				if (setTime != "") {
					diff = curTime - setTime;
				}
				if (diff == 0 || diff > 3600000) {
					Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spaceBlockScreen', {
						'backDisable' : true,
						'surveyID' : args.surveyID
					});
					if (OS_IOS) {
						setTimeout(function() {
							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');

							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');
							var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
							if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
								parentWindow.window.refreshHomeScreen();
							}

						}, 1000);
					} else {

						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');

						Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');
						var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
						if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
							parentWindow.window.refreshHomeScreen();
						}

					}
				} else {

					Ti.API.info('args.surveyID : ', args.surveyID);
					if (args.surveyID == 1) {
						commonFunctions.showConfirmation(L("helpconfirmation"), ['Later', 'Yes'], onYesClick, onLaterClick);
					} else {
						if (OS_IOS) {
							setTimeout(function() {
								Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');

								Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');

								var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
								if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
									parentWindow.window.refreshHomeScreen();
								}
							}, 1000);
						} else {
							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');

							Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');

							var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
							if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
								parentWindow.window.refreshHomeScreen();
							}

						}

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

function refreshValues() {
	Ti.API.info('Refrsh values');
	Ti.App.fireEvent("viewImages");
}

/**
 * Signin API Calling Failure
 */
function saveUserSurveyFailure() {
	commonFunctions.closeActivityIndicator();
	Ti.App.removeEventListener('getValues', getSurveyValues);
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('comments');
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');

	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
		parentWindow.window.refreshHomeScreen();
	}

}

function onYesAnswerClick(e) {
	try {
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
		currentAnswer1 = "Yes";

		$.checkYes.image = "/images/surveyTypes/yes-active.png";
		$.checkNo.image = "/images/surveyTypes/no.png";

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onYesAnswerClick", ex);
	}

}

/**
 * function for yes click
 */
var onYesClick = function(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('helpScreen');
	Ti.App.removeEventListener('getValues', getSurveyValues);
	if (OS_IOS) {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('comments');
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');

			var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
			if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
				parentWindow.window.refreshHomeScreen();
			}

		}, 1000);
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('comments');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');

		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}
	}

};
/**
 * function for later click
 */
var onLaterClick = function(e) {
	try {
		Ti.App.removeEventListener('getValues', getSurveyValues);
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('surveysList');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('comments');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('symptomSurvey');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && (parentWindow.windowName === "home" || parentWindow.windowName === "newHomeScreen")) {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("spaceblock", "onLaterClick", ex);
	}
};
function onNoAnswerClick(e) {
	try {
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
		currentAnswer1 = "No";
		$.checkNo.image = "/images/surveyTypes/no-active.png";
		$.checkYes.image = "/images/surveyTypes/yes.png";

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onNoAnswerClick", ex);
	}

}

/**
 * Click of first answer response.
 */
function answerOneClick(e) {
	try {

		if (answerDistance == "") {
			answer1Distance = "Valid";
		} else {
			answer1Distance = answerDistance + "," + "Valid";
		}
		answerDistance = "";
		answer1Time = new Date();

		$.ans1Button.image = "/images/surveyTypes/check-box.png";
		$.ans2Button.image = "/images/surveyTypes/check-box.png";
		$.ans3Button.image = "/images/surveyTypes/check-box.png";
		$.ans4Button.image = "/images/surveyTypes/check-box.png";

		if (e.source.id == "ans1ButtonView") {
			if (currentAnswer1 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			$.ans1Button.image = "/images/surveyTypes/check-box-active.png";
			currentAnswer1 = $.ans1Label.text;
		} else if (e.source.id == "ans2ButtonView") {
			if (currentAnswer1 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			$.ans2Button.image = "/images/surveyTypes/check-box-active.png";
			currentAnswer1 = $.ans2Label.text;
		} else if (e.source.id == "ans3ButtonView") {
			if (currentAnswer1 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			$.ans3Button.image = "/images/surveyTypes/check-box-active.png";
			currentAnswer1 = $.ans3Label.text;
		} else if (e.source.id == "ans4ButtonView") {
			if (currentAnswer1 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			$.ans4Button.image = "/images/surveyTypes/check-box-active.png";
			currentAnswer1 = $.ans4Label.text;
		}
		setProgressBar(currentPro, totalQuestions);
		if (currentAnswer2 != null && currentAnswer1 != null) {
			onSubmitClick();

		}
	} catch(ex) {
		commonFunctions.handleException("likertSurvey", "answerOneClick", ex);
	}
}

function onYesAnswerBottomClick(e) {
	try {
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
		currentAnswer2 = "Yes";
		$.checkYesBottom.image = "/images/surveyTypes/yes-active.png";
		$.checkNoBottom.image = "/images/surveyTypes/no.png";

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onYesAnswerClick", ex);
	}

}

function onNoAnswerBottomClick(e) {
	try {
		if (currentAnswer2 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		//answer2Distance = "";
		if (answerDistance == "") {
			answer2Distance = "Valid";
		} else {
			answer2Distance = answerDistance + "," + "Valid";
		}
		answerDistance = "";
		answer2Time = new Date();
		setProgressBar(currentPro, totalQuestions);
		currentAnswer2 = "No";
		$.checkNoBottom.image = "/images/surveyTypes/no-active.png";
		$.checkYesBottom.image = "/images/surveyTypes/yes.png";
	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onNoAnswerClick", ex);
	}

}

/**
 * Click of first answer response.
 */
function answerTwoClick(e) {
	try {

		if (answerDistance == "") {
			answer2Distance = "Valid";
		} else {
			answer2Distance = answerDistance + "," + "Valid";
		}
		answerDistance = "";
		answer2Time = new Date();

		$.ans1ButtonBottom.image = "/images/surveyTypes/check-box.png";
		$.ans2ButtonBottom.image = "/images/surveyTypes/check-box.png";
		$.ans3ButtonBottom.image = "/images/surveyTypes/check-box.png";
		$.ans4ButtonBottom.image = "/images/surveyTypes/check-box.png";

		if (e.source.id == "ans1ButtonViewBottom") {
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			$.ans1ButtonBottom.image = "/images/surveyTypes/check-box-active.png";
			currentAnswer2 = $.ans1LabelBottom.text;
		} else if (e.source.id == "ans2ButtonViewBottom") {
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			$.ans2ButtonBottom.image = "/images/surveyTypes/check-box-active.png";
			currentAnswer2 = $.ans2LabelBottom.text;
		} else if (e.source.id == "ans3ButtonViewBottom") {
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			$.ans3ButtonBottom.image = "/images/surveyTypes/check-box-active.png";
			currentAnswer2 = $.ans3LabelBottom.text;
		} else if (e.source.id == "ans4ButtonViewBottom") {
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			$.ans4ButtonBottom.image = "/images/surveyTypes/check-box-active.png";
			currentAnswer2 = $.ans4LabelBottom.text;
		}
		setProgressBar(currentPro, totalQuestions);
		if (currentAnswer1 != null && currentAnswer2 != null) {
			onSubmitClick();

		}
	} catch(ex) {
		commonFunctions.handleException("likertSurvey", "answerOneClick", ex);
	}
}

function pickerControlTopChange(e) {
	Ti.API.info('pickerControlTopChange');
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
		//currentAnswer1 = e.rowIndex;
		currentAnswer1 = e.row.value;
		selectedRow1 = e.rowIndex;
		scrollTimer = setTimeout(function() {
			if (currentAnswer2 != null) {
				onSubmitClick();
			}
		}, 2000);

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
		if (isSubmited == false) {
			scrollTimer = setTimeout(function() {
				if (currentAnswer2 != null) {
					if (isSubmited == false) {
						isSubmited = true;
						onSubmitClick();
					}

				}
			}, 5000);
		}
	}

}

function pickerControlTopChangeAndroid(e) {
	Ti.API.info('pickerControlTopChangeAndroid Clear row : ', selectedRow1);
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
		return;
	}
	if (currentAnswer1 == null) {
		pageAnswerCount += 1;
		currentPro += 1;
	}
	setProgressBar(currentPro, totalQuestions);
	if (e.itemIndex != null) {

		currentAnswer1 = topPickerData[e.itemIndex].title;
		selectedRow1 = e.itemIndex;
		scrollTimer = setTimeout(function() {
			if (currentAnswer2 != null) {
				onSubmitClick();
			}
		}, 2000);

	}

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
	Ti.API.info('e.row.value : ', e.row.value);

	currentAnswer2 = e.row.value;
	selectedRow2 = e.rowIndex;
	scrollTimer = setTimeout(function() {
		if (currentAnswer1 != null) {
			onSubmitClick();
		}
	}, 2000);

}

function pickerControlBottomChangeAndroid(e) {
	clearTimeout(scrollTimer);

	if (selectedRow2 != null) {
		var item = e.section.getItemAt(selectedRow2);
		Ti.API.info('item : ', item, selectedRow2);
		item.properties.backgroundColor = "#fff";
		e.section.updateItemAt(selectedRow2, item);
	}

	//}

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
	Ti.API.info('topPickerData[e.itemIndex].title : ', bottomPickerData[e.itemIndex].title);
	Ti.API.info('e.itemIndex : ', e.itemIndex);

	currentAnswer2 = bottomPickerData[e.itemIndex].title;
	selectedRow2 = e.itemIndex;
	Ti.API.info('call settimeout');
	scrollTimer = setTimeout(function() {
		Ti.API.info('currentAnswer1 : ', currentAnswer1);
		if (currentAnswer1 != null) {
			Ti.API.info('Onsubmit click');
			onSubmitClick();
		}
	}, 2000);

}

/**
 * on radio btn click
 */
function onYesRadioBtnClick(e) {
	try {
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
		currentAnswer1 = "Yes";
		$.yesButton.image = '/images/surveyTypes/check-box-active.png';
		$.noButton.image = '/images/surveyTypes/check-box.png';
		$.maybeButton.image = '/images/surveyTypes/check-box.png';
		if (currentAnswer2 != null) {
			onSubmitClick();

		}

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onYesAnswerClick", ex);
	}

}

function onNoRadioBtnClick(e) {
	try {
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
		currentAnswer1 = "No";
		$.yesButton.image = '/images/surveyTypes/check-box.png';
		$.noButton.image = '/images/surveyTypes/check-box-active.png';
		$.maybeButton.image = '/images/surveyTypes/check-box.png';
		if (currentAnswer2 != null) {
			onSubmitClick();

		}

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onYesAnswerClick", ex);
	}

}

function onMaybeRadioBtnClick(e) {
	try {
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
		currentAnswer1 = "Maybe";
		$.yesButton.image = '/images/surveyTypes/check-box.png';
		$.noButton.image = '/images/surveyTypes/check-box.png';
		$.maybeButton.image = '/images/surveyTypes/check-box-active.png';
		if (currentAnswer2 != null) {
			onSubmitClick();

		}

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onYesAnswerClick", ex);
	}

}

function onYesRadioBtnBottomClick() {
	try {
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
		currentAnswer2 = "Yes";
		$.yesButtonBottom.image = '/images/surveyTypes/check-box-active.png';
		$.noButtonBottom.image = '/images/surveyTypes/check-box.png';
		$.maybeButtonBottom.image = '/images/surveyTypes/check-box.png';
		if (currentAnswer1 != null) {
			onSubmitClick();

		}

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onYesAnswerClick", ex);
	}
}

function onNoRadioBtnBottomClick() {
	try {
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
		currentAnswer2 = "No";
		$.yesButtonBottom.image = '/images/surveyTypes/check-box.png';
		$.noButtonBottom.image = '/images/surveyTypes/check-box-active.png';
		$.maybeButtonBottom.image = '/images/surveyTypes/check-box.png';
		if (currentAnswer1 != null) {
			onSubmitClick();

		}

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onYesAnswerClick", ex);
	}
}

function onMaybeRadioBtnBottomClick() {
	try {
		if (currentAnswer2 == null) {
			pageAnswerCount += 1;
			currentPro += 1;
		}
		//answer2Distance = "";
		answer2Time = new Date();
		if (answerDistance == "") {
			answer2Distance = "Valid";
		} else {
			answer2Distance = answerDistance + "," + "Valid";
		}
		answerDistance = "";
		setProgressBar(currentPro, totalQuestions);
		currentAnswer2 = "Maybe";
		$.yesButtonBottom.image = '/images/surveyTypes/check-box.png';
		$.noButtonBottom.image = '/images/surveyTypes/check-box.png';
		$.maybeButtonBottom.image = '/images/surveyTypes/check-box-active.png';
		if (currentAnswer1 != null) {
			onSubmitClick();

		}

	} catch(ex) {
		commonFunctions.handleException("symptomSurvey", "onYesAnswerClick", ex);
	}
}

$.commentBoxText.addEventListener('focus', function(e) {
	//$.commentBoxText.keyboardToolbar = [flexSpace, done];
	if (e.source.value == e.source._hintText) {
		$.commentBoxText.color = "#456e7a";
		e.source.value = "";
	}
});
$.commentBoxText.addEventListener('blur', function(e) {
	if (e.source.value == "") {
		$.commentBoxText.color = "#b0bec5";
		e.source.value = e.source._hintText;
	} else {

		if (e.source.value != e.source._hintText) {
			$.commentBoxText.color = "#456e7a";
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
			currentAnswer1 = e.source.value;
			setProgressBar(currentPro, totalQuestions);
		}

	}
});
$.commentBoxTextBottom.addEventListener('focus', function(e) {
	//$.commentBoxTextBottom.keyboardToolbar = [flexSpace, done];
	if (e.source.value == e.source._hintText) {
		$.commentBoxTextBottom.color = "#456e7a";
		e.source.value = "";
	}
});
$.commentBoxTextBottom.addEventListener('blur', function(e) {
	if (e.source.value == "") {
		$.commentBoxTextBottom.color = "#b0bec5";
		e.source.value = e.source._hintText;
	} else {
		if (e.source.value != e.source._hintText) {
			$.commentBoxTextBottom.color = "#456e7a";
			if (currentAnswer2 == null) {
				pageAnswerCount += 1;
				currentPro += 1;
			}
			if (answerDistance == "") {
				answer2Distance = "Valid";
			} else {
				answer2Distance = answerDistance + "," + "Valid";
			}
			if (answerDistance == "") {
				answer2Distance = "Valid";
			} else {
				answer2Distance = answerDistance + "," + "Valid";
			}
			answerDistance = "";
			answer2Time = new Date();
			currentAnswer2 = e.source.value;
			setProgressBar(currentPro, totalQuestions);
		}

	}
});
function windowClick(e) {
	try {
		if (e.source.id != "commentBoxText") {
			$.commentBoxText.blur();
		}
		if (e.source.id != "commentBoxTextBottom") {
			$.commentBoxTextBottom.blur();
		}
	} catch(ex) {
		commonFunctions.handleException("freeResponseSurvey", "windowClick", ex);
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

function ShowTimePicker(defaultValue, doneCallBack) {
	try {
		var listPickerTime = null;
		listPickerTime = new Picker(null, defaultValue, 'Select Time', 'time', "");

		listPickerTime.addToWindow($.symptomSurvey);
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
				//defaultTimeVal.setHours(00, 00, 00, 00);
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
		commonFunctions.handleException("settings", "ShowTimePicker", ex);
	}
}

function tooFarClick(e) {
	if (answerDistance == "") {
		answerDistance = "Far Off";
	} else {
		answerDistance = answerDistance + "," + "Far Off";
	}

}

function nearbyClick(e) {
	if (answerDistance == "") {
		answerDistance = "Close";
	} else {
		answerDistance = answerDistance + "," + "Close";
	}

}
