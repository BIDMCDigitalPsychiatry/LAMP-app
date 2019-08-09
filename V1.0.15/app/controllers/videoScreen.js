// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');
var instructionVideoInfo;

/**
 * Open Window.
 */
$.videoScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.videoUrl.top = "80dp";
			}

		}
		$.headerView.setTitle(commonFunctions.L('instVideo', LangCode));
		instructionVideoInfo = Ti.App.Properties.getObject("instructionVideoInfo");
		var instructionVideo = instructionVideoInfo.instructionVideo;
		Ti.API.info('****instructionVideo ' + Alloy.Globals.DEVICE_HEIGHT);

		var metaContent = "default-src * gap: data: blob: 'unsafe-inline' 'unsafe-eval' ws: wss:;  connect-src *  data: blob: ws: wss:;";
		$.videoUrl.html = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0"><meta http-equiv="Content-Security-Policy" content="' + metaContent + '"><iframe src="' + instructionVideo + '" height="100%" width="100%"></iframe><body></body></html>';

	} catch(ex) {
		commonFunctions.handleException("syptomSurveyNew", "open", ex);
	}
});

/**
 * on back button click
 */
$.headerView.on('backButtonClick', function(e) {
	goBack();
});

function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('videoScreen');
}

/**
 * function for android back
 */
$.videoScreen.addEventListener('android:back', function() {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('videoScreen');
});
