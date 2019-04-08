// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');
var setTimer = null;
var randomNumber = null;
var slowPoint = 0;
var timeOut = 10;
var fullCircle = 360;
var noOfRotation;
var rotation;
var valueOfRotation;
var subValue;
var degree;
var quadrant;
var quadrantValue;
var spinWonImage = "/images/prevent/Spinwheel/star_lg.png";
var spinLooseImage = "/images/prevent/Spinwheel/empty_star.png";
var spinWonComment = commonFunctions.L('wonLbl', LangCode);
var spinLooseComment = commonFunctions.L('tryagainLbl', LangCode);
var spinLooseBonus = "";
var startSpinning = 0;
var goldenStars = 0;
var blueStars = 0;
var collectedStars;
var StartTime;
var countDownTimer = null;

init();

function init() {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerView.height = "80dp";
			$.contentView.top = "100dp";
			$.titleview.top = "20dp";
			$.reportView.top = "20dp";
			$.homeView.top = "20dp";
			$.headerLabel.top = "0dp";

		}

	}
	$.headerLabel.text = commonFunctions.L('spinWheelLabel', LangCode);
	var defaultSpinWheel;
	var defaultSpinner;
	if (LangCode == "cmn") {
		defaultSpinWheel = "/images/prevent/Spinwheel/spin_wheel_ch.png";
		defaultSpinner = "/images/prevent/Spinwheel/spin_arrow_ch.png";
	} else {
		defaultSpinWheel = "/images/prevent/Spinwheel/spin_wheel.png";
		defaultSpinner = "/images/prevent/Spinwheel/spin_arrow.png";
	}
	$.spinWheel.image = defaultSpinWheel;
	$.spinner.image = defaultSpinner;
	$.spinLabel.text = commonFunctions.L('spinwinLbl', LangCode);
	$.continueLabel.text = commonFunctions.L('continueCapsLbl', LangCode);
}

/**
 * Function to get the Random Number
 */
function getRandomInt(min, max) {
	return Math.round((Math.random() * (max - min) + min) / 5) * 5;
}

/**
 * Spin To Win handler
 */
$.spinTapView.addEventListener('click', function() {
	StartTime = new Date().toUTCString();
	randomNumber = getRandomInt(600, 1100);
	startSpinning = 1;
	if (startSpinning == 1) {
		if (!OS_IOS) {
			$.androidView.height = Titanium.UI.FILL;
			$.androidView.width = Titanium.UI.FILL;
		}
		$.spinTapView.touchEnabled = false;
	} else {
		if (!OS_IOS) {
			$.androidView.height = 0;
			$.androidView.width = 0;
		}
		$.spinTapView.touchEnabled = true;
	}
	checkQuadrant();
	slowPoint = randomNumber - 150;
	Ti.API.info('randomNumber = ' + randomNumber);
	rotate(0);
});

/**
 * To Check the Quadrant
 */
function checkQuadrant() {
	noOfRotation = randomNumber / fullCircle;
	rotation = Math.floor(noOfRotation);
	Ti.API.info('noOfRotation = ' + rotation);
	valueOfRotation = rotation * fullCircle;
	Ti.API.info('valueOfRotation = ' + valueOfRotation);
	subValue = randomNumber - valueOfRotation;
	Ti.API.info('subValue = ' + subValue);
	degree = fullCircle - subValue;
	Ti.API.info('degree = ' + degree);
	quadrantValue = degree / 45;
	quadrant = Math.ceil(quadrantValue);
	Ti.API.info('quadrant = ' + quadrant);

	switch(quadrant) {
	case 1:
		Ti.API.info('quadrant 1');
		$.bonusImage.image = spinWonImage;
		$.commentLabel.top = (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true) ? "30dp" : "10dp";
		$.commentLabel.text = spinWonComment;
		$.bonusLabel.text = "4 " + commonFunctions.L('starLbl', LangCode);
		collectedStars = 4;
		break;
	case 2:
		Ti.API.info('quadrant 2');
		$.bonusImage.image = spinLooseImage;
		$.commentLabel.top = (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true) ? "40dp" : "15dp";
		$.commentLabel.text = spinLooseComment;
		$.bonusLabel.text = spinLooseBonus;
		collectedStars = 0;
		break;
	case 3:
		Ti.API.info('quadrant 3');
		$.bonusImage.image = spinWonImage;
		$.commentLabel.top = (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true) ? "30dp" : "10dp";
		$.commentLabel.text = spinWonComment;
		$.bonusLabel.text = "2 " + commonFunctions.L('starLbl', LangCode);
		collectedStars = 2;
		break;
	case 4:
		Ti.API.info('quadrant 4');
		$.bonusImage.image = spinWonImage;
		$.commentLabel.top = (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true) ? "30dp" : "10dp";
		$.commentLabel.text = spinWonComment;
		$.bonusLabel.text = "5 " + commonFunctions.L('starLbl', LangCode);
		collectedStars = 5;
		break;
	case 5:
		Ti.API.info('quadrant 5');
		$.bonusImage.image = spinLooseImage;
		$.commentLabel.top = (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true) ? "40dp" : "15dp";
		$.commentLabel.text = spinLooseComment;
		$.bonusLabel.text = spinLooseBonus;
		collectedStars = 0;
		break;
	case 6:
		Ti.API.info('quadrant 6');
		$.bonusImage.image = spinWonImage;
		$.commentLabel.top = (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true) ? "30dp" : "10dp";
		$.commentLabel.text = spinWonComment;
		$.bonusLabel.text = "20 " + commonFunctions.L('starLbl', LangCode);
		collectedStars = 20;
		break;
	case 7:
		Ti.API.info('quadrant 7');
		$.bonusImage.image = spinWonImage;
		$.commentLabel.top = (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true) ? "30dp" : "10dp";
		$.commentLabel.text = spinWonComment;
		$.bonusLabel.text = "3 " + commonFunctions.L('starLbl', LangCode);
		collectedStars = 3;
		break;
	case 8:
		Ti.API.info('quadrant 8');
		$.bonusImage.image = spinLooseImage;
		$.commentLabel.top = (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true) ? "40dp" : "15dp";
		$.commentLabel.text = spinLooseComment;
		$.bonusLabel.text = spinLooseBonus;
		collectedStars = 0;
		break;
	}
}

/**
 * Spin
 */
var rotate = function(degrees) {

	var t = Ti.UI.create2DMatrix();
	t = t.rotate(degrees);

	var a = Titanium.UI.createAnimation();
	a.transform = t;
	a.duration = 5;
	$.spinWheel.animate(a);
	Ti.API.info('degrees = ' + degrees);
	if (slowPoint == degrees && degrees != randomNumber) {
		timeOut = timeOut + 10;
		slowPoint = slowPoint + 50;
	} else if (degrees === randomNumber) {
		if (countDownTimer != null) {
			clearTimeout(countDownTimer);
		}

		setTimeout(function() {
			$.bgview.visible = true;
			$.popupView.visible = true;
		}, 2000);

		return;
	}

	countDownTimer = setTimeout(function() {
		rotate(++degrees);
	}, timeOut);

};

/**
 * Continue Click Handler
 */
function continueClickHandler() {
	$.bgview.visible = false;
	$.popupView.visible = false;
	if (Ti.Network.online) {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		if (spinInfo.spinDate != new Date().getDate()) {
			spinInfo.dayStreaks = parseInt(spinInfo.dayStreaks) + 1;
		}
		spinInfo.spinDate = new Date().getDate();
		spinInfo.noOFSpins = parseInt(spinInfo.noOFSpins) + 1;
		Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var gameDate = new Date();
		var resultParameter = {
			"UserID" : credentials.userId,
			"StartTime" : StartTime,
			"CollectedStars" : collectedStars,
			"DayStreak" : spinInfo.dayStreaks,
			"GameDate" : gameDate,
			"StrakSpin" : spinInfo.noOFSpins
		};
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.SaveSpinWheelGame(resultParameter, spinWheelSuccess, spinWheeFailure);
	} else {
		commonFunctions.closeActivityIndicator();
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));

		return;
	}

}

/**
 * Success api call
 */
function spinWheelSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***SPIN WHEEL SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spinWheelScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		Ti.API.info('parentWindow = ' + parentWindow);
		if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
			Ti.API.info('parentWindow Name = ' + parentWindow.windowName);
			parentWindow.window.refreshPreventScreen();
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("scratchImageScreen", "spinWheelSuccess", ex);
	}
}

/**
 * Failure api call
 */
function spinWheeFailure(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spinWheelScreen');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	Ti.API.info('parentWindow = ' + parentWindow);
	if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
		Ti.API.info('parentWindow Name = ' + parentWindow.windowName);
		parentWindow.window.refreshPreventScreen();
	}
	commonFunctions.closeActivityIndicator();
}

/**
 * on home button click
 */
function onHomeClick(e) {
	try {
		if (countDownTimer != null) {
			clearTimeout(countDownTimer);
		}
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('spinWheelScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
			parentWindow.window.refreshPreventScreen();
		}
	} catch(ex) {
		commonFunctions.handleException("spinWheelScreen", "homeClick", ex);
	}
}

/**
 * Trigger onReportClick click event
 */
function onReportClick() {
	commonFunctions.sendScreenshot();
}

