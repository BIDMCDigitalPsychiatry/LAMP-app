// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
{
	var args = arguments[0] || {};
	var commonFunctions = require('commonFunctions');
	var commonDB = require('commonDB');
	var currentTab = 1;
	var locationListing = [];
	var envListing = [];
	var LangCode = Ti.App.Properties.getString('languageCode');
}

/**
 * Window open event
 */
$.activityScreen.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.tabView.top = "80dp";
				$.contentView.top = "120dp";
				$.supportLabel.bottom = "17dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('envLbl', LangCode));
		$.noDataLabel.text = commonFunctions.L('noDataLabel', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		$.environmentLabel.text = commonFunctions.L('environmentCapsMenu', LangCode);
		$.locationLabel.text = commonFunctions.L('locCapsMenu', LangCode);
		$.supportLabel.text = commonFunctions.L('copyrightLbl', LangCode);
		locationListing = commonDB.getLocationList();
		envListing = commonDB.getEnvironmentList();
		loadLocation();
	} catch(ex) {
		commonFunctions.handleException("activityScreen", "open", ex);
	}
});

function loadLocation() {
	try {
		var locationArray = [];
		for (var i = 0; i < locationListing.length; i++) {
			locationArray.push({
				template : "locationListTemplate",
				addressLabel : {
					text : locationListing[i].address
				},
				timeLabel : {
					text : commonFunctions.formatDateTime(locationListing[i].updateTime)
				}

			});
		};
		if (locationArray.length == 0) {
			$.noDataLabel.visible = true;
		} else {
			$.noDataLabel.visible = false;

		}
		$.lstSection.setItems(locationArray);

	} catch(ex) {
		commonFunctions.handleException("activityScreen", "loadLocation", ex);
	}

}

function loadEnvironment() {
	try {
		var locationArray = [];
		for (var i = 0; i < envListing.length; i++) {
			surveyNumber = envListing[i].questions;
			locationArray.push({
				template : "environmentListTemplate",
				envPickLabel : {
					text : envListing[i].selectedLocation
				},
				envAddressLabel : {
					text : envListing[i].address
				},
				envTimeLabel : {
					text : commonFunctions.formatDateTime(envListing[i].updateTime)
				}

			});
		};
		if (locationArray.length == 0) {
			$.noDataLabel.visible = true;
		} else {
			$.noDataLabel.visible = false;

		}
		$.lstSection.setItems(locationArray);

	} catch(ex) {
		commonFunctions.handleException("activityScreen", "loadEnvironment", ex);
	}

}

$.activityScreen.addEventListener('android:back', function() {
	goBack();
});
$.headerView.on('backButtonClick', function(e) {
	goBack();
});
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('activityScreen');

}

/***
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

function locationTabClick(e) {
	try {
		if (currentTab == 2) {
			currentTab = 1;
			$.locationTabDiv.visible = true;
			$.cenvironmentTabDiv.visible = false;
			$.locationLabel.opacity = 1;
			$.environmentLabel.opacity = 0.5;
			loadLocation();
		}

	} catch(ex) {
		commonFunctions.handleException("activityScreen", "locationTabClick", ex);
	}

}

function environmentTabClick(e) {
	try {
		if (currentTab == 1) {
			currentTab = 2;
			$.cenvironmentTabDiv.visible = true;
			$.locationTabDiv.visible = false;
			$.locationLabel.opacity = 0.5;
			$.environmentLabel.opacity = 1;
			loadEnvironment();
		}

	} catch(ex) {
		commonFunctions.handleException("activityScreen", "environmentTabClick", ex);
	}

}