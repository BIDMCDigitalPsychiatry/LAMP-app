// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = arguments[0] || {};
var serviceManager = require('serviceManager');
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var LangCode = Ti.App.Properties.getString('languageCode');
var credentials = Alloy.Globals.getCredentials();
$.howToUse.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
				$.contentView.bottom = "25dp";
				$.contentView1.top = "80dp";
				$.contentView1.bottom = "25dp";
				$.supportLabel.bottom = "12dp";
			}
		}
		var titleText = commonFunctions.L('appUse', LangCode);
		if (LangCode == "twi" && Ti.Platform.osname != "ipad") {

			$.headerView.setTitle(commonFunctions.trimText(titleText, 15));
		} else {
			$.headerView.setTitle(titleText);
		}

		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		if (Ti.Network.online) {

			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
			serviceManager.getHowToUseInstructions(credentials.userId, getInstructionsSuccess, getInstructionsFailure);

		} else {
			commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));

		}

	} catch(ex) {
		commonFunctions.handleException("howToUse", "open", ex);
	}

});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});
function getInstructionsSuccess(e) {
	try {

		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
			if (response.HelpText == null || response.Content == null) {
				commonFunctions.closeActivityIndicator();
				$.contentView1.visible = true;
				return;
			}
			$.contentView1.visible = false;

			var imgURL = "";
			if (response.ImageURL == "" || response.ImageURL == null) {
				imgURL = "/images/common/no-image-lg.png";
			} else {
				imgURL = response.ImageURL;
			}
			$.mainImage.image = imgURL;

			var htmlString = "";
			var cleanText = replaceHtmlEntities(response.Content);

			if (commonFunctions.getIsTablet() == true) {
				htmlString = '<p style="font-size:16px;">' + cleanText + '</p>';
			} else {
				htmlString = '<p style="font-size:13px;">' + cleanText + '</p>';
			}

			$.contentWebView.html = '<html><head><LINK href="style.css" title="compact" rel="stylesheet" type="text/css"><meta name="viewport" content="width=device-width, height=device-height"><style>body{-webkit-text-size-adjust:none;}</style></head><body>' + htmlString + '</body></html>';
			$.contentWebView.visible = true;

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("articles", "getArticleSuccess", ex);
	}
}

function getInstructionsFailure(e) {
	commonFunctions.closeActivityIndicator();
	commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));

}

$.howToUse.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('howToUse');

}

var replaceHtmlEntities = (function() {
	var translate_re = /&(nbsp|amp|quot|lt|gt|#39|rsquo|ldquo|aacute|eth|eacute|iacute|oacute|uacute|yacute|thorn|aelig|uml|agrave|aacute|acirc|atilde|ccedil|egrave|eacute|ecirc);/g;
	var translate = {
		"nbsp" : " ",
		"amp" : "&",
		"quot" : "\"",
		"lt" : "<",
		"gt" : ">",
		"#39" : "\'",
		"rsquo" : "\'",
		"ldquo" : "\"",
		"aacute" : "\á",
		"eth" : "\ð",
		"eacute" : "\é",
		"iacute" : "\í",
		"oacute" : "\ó",
		"uacute" : "\ú",
		"yacute" : "\ý",
		"thorn" : "\þ",
		"aelig" : "\æ",
		"uml" : "\ö",
		"agrave" : "\à",
		"aacute" : "\á",
		"acirc" : "\â",
		"atilde" : "\ã",
		"ccedil" : "\ç",
		"egrave" : "\è",
		"eacute" : "\é",
		"ecirc" : "\ê",

	};

	return function(s) {
		return ( s.replace(translate_re, function(match, entity) {
				return translate[entity];
			}) );
	};
})();
