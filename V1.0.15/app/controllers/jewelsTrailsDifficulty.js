// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');

$.jewelsTrailsDifficulty.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('difficultyLbl', LangCode));
		$.beginerLbl.text = commonFunctions.L('beginerLbl', LangCode);
		$.IntermediateLbl.text = commonFunctions.L('intermediateLbl', LangCode);
		$.Advanced.text = commonFunctions.L('advancedLbl', LangCode);
		$.Expert.text = commonFunctions.L('expertLbl', LangCode);

		if (args.type == 1) {
			var level = Ti.App.Properties.getInt('difficultyTypeA');
		} else {
			var level = Ti.App.Properties.getInt('difficultyTypeB');
		}
		Ti.API.info('level is', level);
		if (level == 1 || level == "" || level == 0 || level == null) {
			$.beginerLevel.backgroundColor = "#000000";
			$.beginerLevel.opacity = 0.5;

		} else if (level == 2) {
			$.intermediateLevel.backgroundColor = "#000000";
			$.intermediateLevel.opacity = 0.5;
		} else if (level == 3) {
			$.advanceLevel.backgroundColor = "#000000";
			$.advanceLevel.opacity = 0.5;
		} else if (level == 4) {
			$.expertLevel.backgroundColor = "#000000";
			$.expertLevel.opacity = 0.5;
		}

	} catch(ex) {
		commonFunctions.handleException("nBackTest", "open", ex);
	}
});
$.jewelsTrailsDifficulty.addEventListener('android:back', function() {
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
	
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jewelsTrailsDifficulty');
	

}

function onBeginnerClick(e) {
	$.beginerLevel.backgroundColor = "#000000";
	$.beginerLevel.opacity = 0.5;
	$.intermediateLevel.backgroundColor = "transparent";
	$.intermediateLevel.opacity = null;
	$.advanceLevel.backgroundColor = "transparent";
	$.advanceLevel.opacity = null;
	$.expertLevel.backgroundColor = "transparent";
	$.expertLevel.opacity = null;
	if (args.type == 1) {
		Ti.App.Properties.setInt('difficultyTypeA', 1);
	} else {
		Ti.App.Properties.setInt('difficultyTypeB', 1);
	}
	

}

function onIntermediateClick(e) {
	$.intermediateLevel.backgroundColor = "#000000";
	$.intermediateLevel.opacity = 0.5;
	$.beginerLevel.backgroundColor = "transparent";
	$.beginerLevel.opacity = null;
	$.advanceLevel.backgroundColor = "transparent";
	$.advanceLevel.opacity = null;
	$.expertLevel.backgroundColor = "transparent";
	$.expertLevel.opacity = null;
	if (args.type == 1) {
		Ti.App.Properties.setInt('difficultyTypeA', 2);
	} else {
		Ti.App.Properties.setInt('difficultyTypeB', 2);
	}
	

}

function onAdvancedClick(e) {
	$.advanceLevel.backgroundColor = "#000000";
	$.advanceLevel.opacity = 0.5;
	$.intermediateLevel.backgroundColor = "transparent";
	$.intermediateLevel.opacity = null;
	$.beginerLevel.backgroundColor = "transparent";
	$.beginerLevel.opacity = null;
	$.expertLevel.backgroundColor = "transparent";
	$.expertLevel.opacity = null;
	if (args.type == 1) {
		Ti.App.Properties.setInt('difficultyTypeA', 3);
	} else {
		Ti.App.Properties.setInt('difficultyTypeB', 3);
	}
	

}

function onExpertClick(e) {
	$.expertLevel.backgroundColor = "#000000";
	$.expertLevel.opacity = 0.5;
	$.advanceLevel.backgroundColor = "transparent";
	$.advanceLevel.opacity = null;
	$.intermediateLevel.backgroundColor = "transparent";
	$.intermediateLevel.opacity = null;
	$.beginerLevel.backgroundColor = "transparent";
	$.beginerLevel.opacity = null;
	if (args.type == 1) {
		Ti.App.Properties.setInt('difficultyTypeA', 4);
	} else {
		Ti.App.Properties.setInt('difficultyTypeB', 4);
	}
	

}