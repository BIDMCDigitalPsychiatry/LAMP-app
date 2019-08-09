// Arguments passed into this controller can be accessed via the `$.args` object directly or:
/**
 * variable declaration
 */
var args = $.args;
Ti.API.info('screen is' + args.isFrom);
var commonFunctions = require('commonFunctions');
var serviceManager = require('serviceManager');
var commonDB = require('commonDB');
var stopUpdate = false;
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * function for screen open
 */
$.homeStaticPages.addEventListener("open", function(e) {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerView.height = "80dp";
			$.contentView.top = "80dp";
			$.headerLabel.bottom = "20dp";
			$.reportImage.bottom = "20dp";
		}

	}
	$.headerLabel.text = commonFunctions.L('learnLbl', LangCode);
	$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
	stopUpdate = false;
	var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
	var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
	if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
		$.footerView.setInfoIndicatorON();
	} else {
		$.footerView.setInfoIndicatorOFF();
	}

	var menuArray = [];
	var menuList = [commonFunctions.L('appUse', LangCode), commonFunctions.L('profileLbl', LangCode), commonFunctions.L('helpMenu', LangCode), commonFunctions.L('articleLbl', LangCode), commonFunctions.L('tipLbl', LangCode)];
	$.footerView.setSelectedLabel(1);
	for (var i = 0; i < menuList.length; i++) {
		var notificationVisible = false;
		if (i == 4 && (BlogsUpdate == true || BlogsUpdate == "true")) {
			notificationVisible = true;
		}
		if (i == 5 && (TipsUpdate == true || TipsUpdate == "true")) {
			notificationVisible = true;
		}
		menuArray.push({
			template : "surveyListTemplate",
			gameNameLabel : {
				text : menuList[i]
			},
			notificationImage : {
				visible : notificationVisible
			}
		});
	};
	$.lstSection.setItems(menuArray);
	checkUpdate();

});

/**
 * on home button click
 */
function onHomeClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('homeStaticPages');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "newHomeScreen") {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("staticpage", "homeClick", ex);
	}
}

function onMenuClick(e) {
	if (e.itemIndex == 0) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('howToUse');
	} else if (e.itemIndex == 1) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('userProfileScreen');
	} else if (e.itemIndex == 2) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('helpScreen');
	} else if (e.itemIndex == 3) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('articles');
	} else if (e.itemIndex == 4) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('tips');
	}
}

$.homeStaticPages.addEventListener('android:back', function() {
	onHomeClick();
});
$.footerView.on('clickLearn', function(e) {

	return;
});
/**
 * Trigger onReportClick click event
 */
function onReportClick() {
	commonFunctions.sendScreenshot();
}

/**
 * Footer tab click handler
 */
$.footerView.on('clickAssess', function(e) {
	stopUpdate = true;
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('homeStaticPages');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}

});

/**
 * Footer tab click handler
 */
$.footerView.on('clickManage', function(e) {
	stopUpdate = true;

	if (OS_IOS) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('homeStaticPages');
		}, 1000);
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchTestScreen');
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
		}, 5);
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('homeStaticPages');
		}, 500);
	}

});

/**
 * Footer tab click handler
 */
$.footerView.on('clickPrevent', function(e) {
	stopUpdate = true;
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('preventIntroScreen');
	if (OS_IOS) {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('homeStaticPages');
		}, 1000);
	} else {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('homeStaticPages');
		}, 500);
	}

});

/**
 * Refresh screen handler
 */
$.refreshScreen = function(e) {
	try {
		var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
		var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
		if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
			$.footerView.setInfoIndicatorON();
		} else {
			$.footerView.setInfoIndicatorOFF();
		}
		if (BlogsUpdate == true || BlogsUpdate == "true") {
			var item = $.surveyList.sections[0].getItemAt(4);
			if (item != null) {
				item.notificationImage.visible = true;
				$.surveyList.sections[0].updateItemAt(4, item);
			}
		} else {
			var item = $.surveyList.sections[0].getItemAt(4);
			if (item != null) {
				item.notificationImage.visible = false;
				$.surveyList.sections[0].updateItemAt(4, item);
			}

		}
		if (TipsUpdate == true || TipsUpdate == "true") {
			var item = $.surveyList.sections[0].getItemAt(5);
			if (item != null) {
				item.notificationImage.visible = true;
				$.surveyList.sections[0].updateItemAt(5, item);
			}
		} else {
			var item = $.surveyList.sections[0].getItemAt(5);
			if (item != null) {
				item.notificationImage.visible = false;
				$.surveyList.sections[0].updateItemAt(5, item);
			}

		}

	} catch(ex) {
		commonFunctions.handleException("refreshScreen", "homeStaticPage", ex);
	}
};

/**
 * checkUpdate event handler
 */
function checkUpdate() {
	var credentials = Alloy.Globals.getCredentials();
	serviceManager.getStatus(credentials.userId, getStatusSuccess, getStatusFailure);
}

/**
 * getStatusSuccess event
 */
function getStatusSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		Ti.API.info('getStatusSuccess : ', JSON.stringify(response));

		if (response.ErrorCode == 0 && stopUpdate == false) {
			Ti.App.Properties.setString('BlogsUpdate', response.BlogsUpdate);
			Ti.App.Properties.setString('TipsUpdate', response.TipsUpdate);
			var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
			var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
			if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
				$.footerView.setInfoIndicatorON();
			} else {
				$.footerView.setInfoIndicatorOFF();
			}
			if (stopUpdate == false) {
				if (BlogsUpdate == true || BlogsUpdate == "true") {
					var item = $.surveyList.sections[0].getItemAt(4);
					if (item != null) {
						item.notificationImage.visible = true;
						$.surveyList.sections[0].updateItemAt(4, item);
					}
				} else {
					var item = $.surveyList.sections[0].getItemAt(4);
					if (item != null) {
						item.notificationImage.visible = false;
						$.surveyList.sections[0].updateItemAt(4, item);
					}

				}
				if (TipsUpdate == true || TipsUpdate == "true") {
					var item = $.surveyList.sections[0].getItemAt(5);
					if (item != null) {
						item.notificationImage.visible = true;
						$.surveyList.sections[0].updateItemAt(5, item);
					}
				} else {
					var item = $.surveyList.sections[0].getItemAt(5);
					if (item != null) {
						item.notificationImage.visible = false;
						$.surveyList.sections[0].updateItemAt(5, item);
					}

				}
			}

		}

	} catch(ex) {
		commonFunctions.handleException("homeStaticPage", "getStatusSuccess", ex);
	}
}

/**
 * getStatusFailure event
 */
function getStatusFailure(e) {
	Ti.API.info('getStatusFailure : ', JSON.stringify(e));
}