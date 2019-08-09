// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var serviceManager = require('serviceManager');
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');
/**
 * variable declaration
 */
/**
 * function for screen open
 */
$.tips.addEventListener("open", function(e) {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.contentView.top = "80dp";
			$.supportLabel.bottom = "12dp";
		}

	}
	$.headerView.setTitle(commonFunctions.L('tipLbl', LangCode));
	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
	if (Ti.Network.online) {
		commonFunctions.openActivityIndicator(commonFunctions.L('activitySubmitting', LangCode));
		serviceManager.getTips(credentials.userId, getTipsSuccess, getTipsFailure);
	} else {
		commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
	}

	//$.tipsLabel.text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";

});
function getTipsSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('***GET TIPS SUCCESS  RESPONSE****  ', JSON.stringify(response));
		if (response.ErrorCode == 0) {
			Ti.App.Properties.setString('TipsUpdate', false);

			if (response.TipText != "" && response.TipText != null) {
				$.noDataLabel.visible = false;
				$.tipsLabel.text = response.TipText;
			} else {
				$.noDataLabel.visible = true;
			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("articles", "getArticleSuccess", ex);
	}
}

function getTipsFailure(e) {
	commonFunctions.closeActivityIndicator();
	commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));

}

$.tips.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('tips');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "homeStaticPages") {
		parentWindow.window.refreshScreen();
	}

}