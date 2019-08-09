// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var welcomeInfo;
/**
 * Open Window.
 */
$.welcomeScreen.addEventListener("open", function(e) {
	Ti.API.info('welcomeContent open', Ti.App.Properties.getString('isAgreeClick'));
	if (args.isAlreadyLogged == true && Ti.App.Properties.getString('isAgreeClick') == "true") {
		$.nextButton.text = "NEXT";
	} else {
		$.nextButton.text = "AGREE";
	}
	welcomeInfo = Ti.App.Properties.getObject("welcomeInfo");
	var welcomeContent = welcomeInfo.welcomeContent;
	Ti.API.info('welcomeContent', welcomeContent);
	if (welcomeContent == null) {

		Ti.API.info('welcomeContent enter');
		$.contentView1.visible = true;
		$.contentWebView.visible = false;

	} else {
		$.contentView1.visible = false;

		var htmlString = "";
		var cleanText = replaceHtmlEntities(welcomeContent);

		if (commonFunctions.getIsTablet() == true) {
			htmlString = '<p style="font-size:18px;">' + cleanText + '</p>';
		} else {
			htmlString = '<p style="font-size:14px;">' + cleanText + '</p>';
		}

		$.contentWebView.html = '<html><head><LINK href="style.css" title="compact" rel="stylesheet" type="text/css"><meta name="viewport" content="width=device-width, height=device-height"><style>body{-webkit-text-size-adjust:none;}</style></head><body>' + htmlString + '</body></html>';
		$.contentWebView.visible = true;
	}

});
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

/**
 * on back button click
 */

function onBackClick() {
	if (args.isFrom == "signUpUser") {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('signin');
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signupUserRegister');
	} else if (args.isFrom == "signinStudy") {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeScreen');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('signin');
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signinStudy');
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeScreen');
	}

}

/**
 * on next button click
 */
function onNextClick() {
	Ti.App.Properties.setString('isAgreeClick', "true");
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('welcomeContentScreen', {
		CognitionSettings : args.CognitionSettings

	});
}

/**
 * function for android back
 */
$.welcomeScreen.addEventListener('android:back', function() {
	//Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('welcomeScreen');
	return;
});
