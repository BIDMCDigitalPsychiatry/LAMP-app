// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
var args = arguments[0] || {};
var serviceManager = require('serviceManager');
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * Window open function
 */
$.articlesDetails.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.contentWebView.bottom = "20dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('articleLbl', LangCode));
		Ti.API.info('args.imageUrl : ', args.imageUrl);
		var imgURL = "";
		if (args.imageUrl == "" || args.imageUrl == "/images/common/no-image-sm.png") {
			imgURL = "/images/common/no-image-lg.png";
		} else {
			imgURL = args.imageUrl;
		}
		$.mainImage.image = imgURL;
		$.headerLabel.text = args.headerText;
		var htmlString = "";
		if (commonFunctions.getIsTablet() == true) {
			htmlString = '<p style="font-size:16px;">' + args.contentText + '</p>';
		} else {
			htmlString = '<p style="font-size:13px;">' + args.contentText + '</p>';
		}

		$.contentWebView.html = '<html><head><LINK href="style.css" title="compact" rel="stylesheet" type="text/css"><meta name="viewport" content="width=device-width, height=device-height"><style>body{-webkit-text-size-adjust:none;}</style></head><body>' + htmlString + '</body></html>';
		$.contentWebView.visible = true;
	} catch(ex) {
		commonFunctions.handleException("articlesDetails", "open", ex);
	}

});

/**
 * Android back button handler
 */
$.articlesDetails.addEventListener('android:back', function() {
	goBack();
});

/**
 * Header back button click handler
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
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('articlesDetails');

}
