// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var serviceManager = require('serviceManager');
var LangCode = Ti.App.Properties.getString('languageCode');
var commonFunctions = require('commonFunctions');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var startLimit = 0;
/**
 * variable declaration
 */
/**
 * function for screen open
 */
$.articles.addEventListener("open", function(e) {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerContainer.height = "80dp";
			$.contentView.top = "80dp";
			$.articlesList.bottom = "25dp";
			$.supportLabel.bottom = "17dp";
		}
	}
	var titleText = commonFunctions.L('articleLbl', LangCode);
	if (LangCode == "twi" && Ti.Platform.osname != "ipad") {
		$.headerView.setTitle(commonFunctions.trimText(titleText, 15));
	} else {
		$.headerView.setTitle(titleText);
	}
	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
	loadingDataTiListView();
	if (Ti.Network.online) {
		if ($.noDataLabel.visible == true) {
			commonFunctions.openActivityIndicator(commonFunctions.L('activityLoading', LangCode));
		}
		serviceManager.getArticles(credentials.userId, getArticleSuccess, getArticleFailure);

	} else {

	}

});
/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

function getArticleSuccess(e) {
	try {
		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
			Ti.App.Properties.setString('BlogsUpdate', false);

			commonDB.deleteArticles();
			for (var i = 0; i < response.BlogList.length; i++) {
				var blogTitle = "";
				var blogContent = "";
				var blogImageURL = "";
				var mainContent = "";

				if (response.BlogList[i].BlogTitle != null && response.BlogList[i].BlogTitle != "") {
					blogTitle = response.BlogList[i].BlogTitle.trim();
				}
				if (response.BlogList[i].Content != null && response.BlogList[i].Content != "") {
					blogContent = response.BlogList[i].Content;
				}
				if (response.BlogList[i].ImageURL != null && response.BlogList[i].ImageURL != "") {
					blogImageURL = response.BlogList[i].ImageURL;
				}
				if (response.BlogList[i].BlogText != null && response.BlogList[i].BlogText != "") {
					mainContent = response.BlogList[i].BlogText.trim();

				}

				commonDB.insertArticles(blogTitle, blogContent, blogImageURL, mainContent);

			};

			loadingDataTiListView();

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("articles", "getArticleSuccess", ex);
	}
}

function getArticleFailure(e) {
	commonFunctions.closeActivityIndicator();
	loadingDataTiListView();
}

function loadingDataTiListView() {

	var articlesResult = commonDB.getArticles(startLimit);
	if (startLimit == 0 && articlesResult.length == 0) {
		$.noDataLabel.visible = true;
		return;
	}
	$.noDataLabel.visible = false;
	var articleArray = [];
	for (var i = 0; i < articlesResult.length; i++) {
		var text = articlesResult[i].Content;
		var blogTitle = "";
		var blogContent = "";
		if (articlesResult[i].BlogTitle != null && articlesResult[i].BlogTitle != "") {
			if (commonFunctions.getIsTablet() == true) {
				blogTitle = commonFunctions.trimText(articlesResult[i].BlogTitle, 120);
			} else {
				blogTitle = commonFunctions.trimText(articlesResult[i].BlogTitle, 70);
			}

		}

		if (commonFunctions.getIsTablet() == true) {
			blogContent = commonFunctions.trimText(articlesResult[i].MainContent, 400);
		} else {
			blogContent = commonFunctions.trimText(articlesResult[i].MainContent, 150);
		}

		var cleanText = replaceHtmlEntities(text);
		var imgURL = "";
		if (articlesResult[i].ImageURL != "" && articlesResult[i].ImageURL != null) {
			imgURL = articlesResult[i].ImageURL;
		} else {
			imgURL = "/images/common/no-image-sm.png";
		}
		articleArray = [];
		articleArray.push({
			template : "articlesListTemplate",
			thumbImage : {
				image : imgURL
			},
			heaerLabel : {
				text : blogTitle
			},
			descrptionLabel : {
				text : blogContent
			},
			fullContent : cleanText,
			fullTitle : articlesResult[i].BlogTitle

		});
		$.lstSection.appendItems(articleArray);
	};
	if (articlesResult.length != 0) {
		startLimit += 10;
	}

}

$.articles.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('articles');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "homeStaticPages") {
		parentWindow.window.refreshScreen();
	}

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

function openDetails(e) {
	var headerText = "";
	var contentText = "";
	var imageUrl = "";
	if (e.itemIndex != null) {
		var item = $.articlesList.sections[0].getItemAt(e.itemIndex);
		if (item != null) {

			headerText = item.fullTitle;
			contentText = item.fullContent;
			imageUrl = item.thumbImage.image;

		} else {
			return;
		}
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('articlesDetails', {
			'headerText' : headerText,
			'contentText' : contentText,
			'imageUrl' : imageUrl
		});

	}
}

function scrollEndEvent(e) {
	loadingDataTiListView();
}