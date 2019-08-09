// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Controller to navigate between pages.
Alloy.Globals.NAVIGATION_CONTROLLER = null;
// This will be used in common functions.
Alloy.Globals.APP_NAME = "LAMP";
Alloy.Globals.AlarmID = 1;
var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.DEVICE_HEIGHT = pHeight;
Alloy.Globals.DEVICE_WIDTH = (pWidth > pHeight) ? pHeight : pWidth;
Alloy.Globals.BOX_WIDTH = Alloy.Globals.DEVICE_WIDTH - 40;
Alloy.Globals.BOX_WIDTH_TEMP = Alloy.Globals.DEVICE_WIDTH - 60;
Alloy.Globals.GAME_WIDTH = Alloy.Globals.DEVICE_WIDTH - 300;
Alloy.Globals.ISPAUSED = false;
Alloy.Globals.REQUEST_CODE = 0;
Alloy.Globals.REQUEST_CODE_ARRAY = [];
Alloy.Globals.CALL_START_TIME = 0;
Alloy.Globals.CALL_START_DATE = null;
Alloy.Globals.CALL_TYPE = null;
Alloy.Globals.PHONE_NUMBER = null;
Alloy.Globals.SURVEY_POINTS = 0;
Alloy.Globals.GAME_POINTS = 0;
Alloy.Globals.Prev_Time = null;
Alloy.Globals.Prev_Type = null;
Alloy.Globals.SimpleMemory_Survey = 1;
Alloy.Globals.IsSelected = 0;
Alloy.Globals.BATCH_ARRAY = [];

if (Ti.Platform.name === 'android') {
	Alloy.Globals.DPIFactor = (Ti.Platform.displayCaps.dpi / 160);
	Alloy.Globals.DEVICE_WIDTH = Math.round((Alloy.Globals.DEVICE_WIDTH / Alloy.Globals.DPIFactor));
	Alloy.Globals.DEVICE_HEIGHT_DPI = Alloy.Globals.DEVICE_HEIGHT / Alloy.Globals.DPIFactor;
	Alloy.Globals.BOX_WIDTH = Alloy.Globals.DEVICE_WIDTH - 40;
	Alloy.Globals.BOX_WIDTH_TEMP = Alloy.Globals.DEVICE_WIDTH - 60;
	Alloy.Globals.BOX_HEIGHT_TEMP = Alloy.Globals.DEVICE_WIDTH - 150;
	Alloy.Globals.GAME_WIDTH = Alloy.Globals.DEVICE_WIDTH - 300;
}

Alloy.Globals.iPhoneSixPlus = (OS_IOS && Ti.Platform.osname == "iphone" && Ti.Platform.displayCaps.platformHeight == 736);
Alloy.Globals.iPhoneSix = (OS_IOS && Ti.Platform.osname == "iphone" && Ti.Platform.displayCaps.platformHeight == 667);
Alloy.Globals.iPhone5 = (OS_IOS && Ti.Platform.osname == "iphone" && Ti.Platform.displayCaps.platformHeight == 568);
Alloy.Globals.iPhone4s = (OS_IOS && Ti.Platform.osname == "iphone" && Ti.Platform.displayCaps.platformHeight == 480);

Alloy.Globals.HEADER_COLOR = "#359ffe";


//Production Server
Alloy.Globals.SERVICEURL = 'https://psych.digital/LampAPI/api/';

Alloy.Globals.SURVEY_COMMENTS = "";
Alloy.Globals.BACKGROUND_IMAGE = "/images/common/blue-bg.png";
Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-symptom-survey-active.png";
Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-cognition-test-active.png";
Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-environment-active.png";
Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-help-active.png";
Alloy.Globals.DATABASE = 'LampDB';
Alloy.Globals.POPUPWINDOW_STACK = null;
Alloy.Globals.simpleMemorySurveyArray = [];
Alloy.Globals.temporalOrderSurveyArray = [];
Alloy.Globals.visualAssociationSurveyArray = [];
//Ti.App.Properties.setString('lastSpinScoreUpdated', "");
if (Ti.App.Properties.hasProperty("currentLevel") == false) {
	Ti.App.Properties.setString('currentLevel', "Level 1");
}
if (Ti.App.Properties.hasProperty("totalPoints") == false) {
	Ti.App.Properties.setString('totalPoints', 0);
}

Alloy.Globals.HINTTEXT_COLOR = "#D1E5FF";
Alloy.Globals.NETWORK_ACCESS_TIMEOUT = 30000;
if (OS_IOS) {
	var db = Ti.Database.open(Alloy.Globals.DATABASE);
	db.file.setRemoteBackup(false);
	db.close();
}

/**
 * Regular fonts
 */
//Regular 8
Alloy.Globals.ExtraSmallFontBold = {
	fontSize : '8sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 9
Alloy.Globals.SmallFontBold = {
	fontSize : '9sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 10
Alloy.Globals.MediumFontBold = {
	fontSize : '10sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 13
Alloy.Globals.MediumMenuFontBold = {
	fontSize : '13sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 14
Alloy.Globals.LargeMenuFontBold = {
	fontSize : '14sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 15
Alloy.Globals.LargeFontBold = {
	fontSize : '15sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 16
Alloy.Globals.PointLargeFontBold = {
	fontSize : '16sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 17
Alloy.Globals.HeaderFontBold = {
	fontSize : '17sp',
	fontFamily : 'Aileron-Regular'
};
Alloy.Globals.LargeMenuFontBoldTablet = {
	fontSize : '18sp',
	fontFamily : 'Aileron-Regular'
};
Alloy.Globals.LargeFontBoldTablet = {
	fontSize : '19sp',
	fontFamily : 'Aileron-Regular'
};

Alloy.Globals.HeaderFontBoldTablet = {
	fontSize : '20sp',
	fontFamily : 'Aileron-Regular'
};

Alloy.Globals.AileronRegular25 = {
	fontSize : '25sp',
	fontFamily : 'Aileron-Regular'
};

//Regular 35
Alloy.Globals.HeaderTabletFontlarge = {
	fontSize : '30sp',
	fontFamily : 'Aileron-Regular'
};
Alloy.Globals.LargeMenuFontScore = {
	fontSize : '32sp',
	fontFamily : 'Aileron-Regular'
};
Alloy.Globals.titleMenuFontScore = {
	fontSize : '26sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 35
Alloy.Globals.HeaderFontlarge = {
	fontSize : '35sp',
	fontFamily : 'Aileron-Regular'
};
//Regular 48
Alloy.Globals.HeaderFontExtraLarge = {
	fontSize : '48sp',
	fontFamily : 'Aileron-Regular'
};

/**
 *  fonts light
 */
//Light 8
Alloy.Globals.ExtraSmallFontLight = {
	fontSize : '8sp',
	fontFamily : 'Aileron-Light'
};
//Light 9
Alloy.Globals.SmallFontLight = {
	fontSize : '9sp',
	fontFamily : 'Aileron-Light'
};
//Light 10
Alloy.Globals.MediumFontLight = {
	fontSize : '10sp',
	fontFamily : 'Aileron-Light'
};
Alloy.Globals.MediumLargeFontLight = {
	fontSize : '12sp',
	fontFamily : 'Aileron-Light'
};
Alloy.Globals.MediumTimeLargeFontLight = {
	fontSize : '11sp',
	fontFamily : 'Aileron-Light'
};
//Light 15
Alloy.Globals.LargeFontLight = {
	fontSize : '15sp',
	fontFamily : 'Aileron-Light'
};
Alloy.Globals.ExtraSmallFontLightTablet = {
	fontSize : '12sp',
	fontFamily : 'Aileron-Light'
};
//Light 13
Alloy.Globals.MediumMenuFontLight = {
	fontSize : '13sp',
	fontFamily : 'Aileron-Light'
};
//Light 17
Alloy.Globals.HeaderFontLight = {
	fontSize : '17sp',
	fontFamily : 'Aileron-Light'
};
Alloy.Globals.LargeFontLightTablet = {
	fontSize : '19sp',
	fontFamily : 'Aileron-Light'
};
Alloy.Globals.HeaderFontLightTablet = {
	fontSize : '21sp',
	fontFamily : 'Aileron-Light'
};
Alloy.Globals.ExtraLargeFontLight = {
	fontSize : '23sp',
	fontFamily : 'Aileron-Light'
};
Alloy.Globals.ExtraLargeFontLightTablet = {
	fontSize : '27sp',
	fontFamily : 'Aileron-Light'
};
Alloy.Globals.LargestLightFont = {
	fontSize : '34sp',
	fontFamily : 'Aileron-Light'
};

Alloy.Globals.LargestLightFont35 = {
	fontSize : '35sp',
	fontFamily : 'Aileron-Light'
};

/**
 * Semi bold font
 */
//semibold 9
Alloy.Globals.SmallFontSemi = {
	fontSize : '9sp',
	fontFamily : 'Aileron-SemiBold'
};
//Semi bold 10
Alloy.Globals.smallSemiBold = {
	fontSize : '10sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.MediumFontSemi = {
	fontSize : '11sp',
	fontFamily : 'Aileron-SemiBold'
};
//semi bold 8
Alloy.Globals.ExtraSmallSemiBold = {
	fontSize : '8sp',
	fontFamily : 'Aileron-SemiBold'
};

Alloy.Globals.ExtraSmallSemiBoldTablet = {
	fontSize : '12sp',
	fontFamily : 'Aileron-SemiBold'
};
//semi bold 13
Alloy.Globals.MediumSemiBold = {
	fontSize : '13sp',
	fontFamily : 'Aileron-SemiBold'
};

Alloy.Globals.MediumSemiBold14 = {
	fontSize : '14sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.MediumSemiBoldScore = {
	fontSize : '15sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.MediumSemiBoldTablet = {
	fontSize : '17sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.LargeSemiBold = {
	fontSize : '18sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.LargeSemiBoldQuest = {
	fontSize : '20sp',
	fontFamily : 'Aileron-SemiBold'
};

Alloy.Globals.LargeSemiBoldQuest22 = {
	fontSize : '22sp',
	fontFamily : 'Aileron-SemiBold'
};

Alloy.Globals.LargeSemiBoldTab = {
	fontSize : '21sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.mediumLargeSemiBold = {
	fontSize : '25sp',
	fontFamily : 'Aileron-SemiBold'
};

Alloy.Globals.SemiBold50 = {
	fontSize : '50sp',
	fontFamily : 'Aileron-SemiBold'
};

Alloy.Globals.SemiBold40 = {
	fontSize : '35sp',
	fontFamily : 'Aileron-SemiBold'
};

Alloy.Globals.mediumLargeSemiBoldFooter = {
	fontSize : '30sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.ExtraLargeSemiBold = {
	fontSize : '122sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.SemiBold50 = {
	fontSize : '50sp',
	fontFamily : 'Aileron-SemiBold'
};

Alloy.Globals.SemiBold40 = {
	fontSize : '35sp',
	fontFamily : 'Aileron-SemiBold'
};
Alloy.Globals.LargeSemiBoldQuest22 = {
	fontSize : '22sp',
	fontFamily : 'Aileron-SemiBold'
};

/**
 * Ultra light
 */
//ultra 48
Alloy.Globals.HeaderUltraFontExtraLarge = {
	fontSize : '48sp',
	fontFamily : 'Aileron-UltraLight'
};
//ultra
Alloy.Globals.homeMenuUltraFontExtraLarge = {
	fontSize : '26sp',
	fontFamily : 'Aileron-UltraLight'
};
//ultra Light 15
Alloy.Globals.mediumMenuUltraFont = {
	fontSize : '15sp',
	fontFamily : 'Aileron-UltraLight'
};
//ultra 13
Alloy.Globals.smallFontUltraLight = {
	fontSize : '13sp',
	fontFamily : 'Aileron-UltraLight'
};
Alloy.Globals.HeaderUltraFontExtraLargeTablet = {
	fontSize : '52sp',
	fontFamily : 'Aileron-UltraLight'
};
//ultra 130
Alloy.Globals.ExtraLargeUltraFont = {
	fontSize : '130sp',
	fontFamily : 'Aileron-UltraLight'
};

/**
 * Thin font
 */
//thin 35
Alloy.Globals.HeaderThinFontlarge = {
	fontSize : '35sp',
	fontFamily : 'Aileron-Thin'
};
Alloy.Globals.HeaderThinFontlargeTablet = {
	fontSize : '39sp',
	fontFamily : 'Aileron-Thin'
};
Alloy.Globals.HeaderThinFontMedium = {
	fontSize : '20sp',
	fontFamily : 'Aileron-Thin'
};

if (OS_ANDROID) {
	Alloy.Globals.ExtraSmallFontBold = {
		fontSize : '8dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 9
	Alloy.Globals.SmallFontBold = {
		fontSize : '9dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 10
	Alloy.Globals.MediumFontBold = {
		fontSize : '10dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 13
	Alloy.Globals.MediumMenuFontBold = {
		fontSize : '13dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 14
	Alloy.Globals.LargeMenuFontBold = {
		fontSize : '14dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 15
	Alloy.Globals.LargeFontBold = {
		fontSize : '15dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 16
	Alloy.Globals.PointLargeFontBold = {
		fontSize : '16dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 17
	Alloy.Globals.HeaderFontBold = {
		fontSize : '17dp',
		fontFamily : 'Aileron-Regular'
	};
	Alloy.Globals.LargeMenuFontBoldTablet = {
		fontSize : '18dp',
		fontFamily : 'Aileron-Regular'
	};
	Alloy.Globals.LargeFontBoldTablet = {
		fontSize : '19dp',
		fontFamily : 'Aileron-Regular'
	};

	Alloy.Globals.HeaderFontBoldTablet = {
		fontSize : '20dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 35
	Alloy.Globals.HeaderTabletFontlarge = {
		fontSize : '30dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 35
	Alloy.Globals.HeaderFontlarge = {
		fontSize : '35dp',
		fontFamily : 'Aileron-Regular'
	};
	//Regular 48
	Alloy.Globals.HeaderFontExtraLarge = {
		fontSize : '48dp',
		fontFamily : 'Aileron-Regular'
	};

	/**
	 *  fonts light
	 */
	//Light 8
	Alloy.Globals.ExtraSmallFontLight = {
		fontSize : '8dp',
		fontFamily : 'Aileron-Light'
	};
	//Light 9
	Alloy.Globals.SmallFontLight = {
		fontSize : '9dp',
		fontFamily : 'Aileron-Light'
	};
	//Light 10
	Alloy.Globals.MediumFontLight = {
		fontSize : '10dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.MediumLargeFontLight = {
		fontSize : '12dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.AlieronLight13 = {
		fontSize : '13dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.MediumTimeLargeFontLight = {
		fontSize : '11dp',
		fontFamily : 'Aileron-Light'
	};
	//Light 15
	Alloy.Globals.LargeFontLight = {
		fontSize : '15dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.ExtraSmallFontLightTablet = {
		fontSize : '12dp',
		fontFamily : 'Aileron-Light'
	};
	//Light 13
	Alloy.Globals.MediumMenuFontLight = {
		fontSize : '13dp',
		fontFamily : 'Aileron-Light'
	};
	//Light 17
	Alloy.Globals.HeaderFontLight = {
		fontSize : '17dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.LargeFontLightTablet = {
		fontSize : '19dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.HeaderFontLightTablet = {
		fontSize : '21dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.ExtraLargeFontLight = {
		fontSize : '23dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.ExtraLargeFontLightTablet = {
		fontSize : '27dp',
		fontFamily : 'Aileron-Light'
	};
	Alloy.Globals.LargestLightFont = {
		fontSize : '34dp',
		fontFamily : 'Aileron-Light'
	};
	/**
	 * Semi bold font
	 */
	//semibold 9
	Alloy.Globals.SmallFontSemi = {
		fontSize : '9dp',
		fontFamily : 'Aileron-SemiBold'
	};
	//Semi bold 10
	Alloy.Globals.smallSemiBold = {
		fontSize : '10dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.MediumFontSemi = {
		fontSize : '11dp',
		fontFamily : 'Aileron-SemiBold'
	};
	//semi bold 8
	Alloy.Globals.ExtraSmallSemiBold = {
		fontSize : '8dp',
		fontFamily : 'Aileron-SemiBold'
	};

	Alloy.Globals.ExtraSmallSemiBoldTablet = {
		fontSize : '12dp',
		fontFamily : 'Aileron-SemiBold'
	};
	//semi bold 13
	Alloy.Globals.MediumSemiBold = {
		fontSize : '13dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.MediumSemiBoldScore = {
		fontSize : '15dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.MediumSemiBoldTablet = {
		fontSize : '17dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.LargeSemiBold = {
		fontSize : '18dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.LargeSemiBoldQuest = {
		fontSize : '20dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.LargeSemiBoldTab = {
		fontSize : '21dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.mediumLargeSemiBold = {
		fontSize : '25dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.mediumLargeSemiBoldFooter = {
		fontSize : '30dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.SemiBold40 = {
		fontSize : '40dp',
		fontFamily : 'Aileron-SemiBold'
	};
	Alloy.Globals.ExtraLargeSemiBold = {
		fontSize : '122dp',
		fontFamily : 'Aileron-SemiBold'
	};

	/**
	 * Ultra light
	 */
	//ultra 48
	Alloy.Globals.HeaderUltraFontExtraLarge = {
		fontSize : '48dp',
		fontFamily : 'Aileron-UltraLight'
	};
	//ultra
	Alloy.Globals.homeMenuUltraFontExtraLarge = {
		fontSize : '26dp',
		fontFamily : 'Aileron-UltraLight'
	};
	//ultra Light 15
	Alloy.Globals.mediumMenuUltraFont = {
		fontSize : '15dp',
		fontFamily : 'Aileron-UltraLight'
	};
	//ultra 13
	Alloy.Globals.smallFontUltraLight = {
		fontSize : '13dp',
		fontFamily : 'Aileron-UltraLight'
	};
	Alloy.Globals.HeaderUltraFontExtraLargeTablet = {
		fontSize : '52dp',
		fontFamily : 'Aileron-UltraLight'
	};
	//ultra 130
	Alloy.Globals.ExtraLargeUltraFont = {
		fontSize : '130dp',
		fontFamily : 'Aileron-UltraLight'
	};

	/**
	 * Thin font
	 */
	//thin 35
	Alloy.Globals.HeaderThinFontlarge = {
		fontSize : '35dp',
		fontFamily : 'Aileron-Thin'
	};
	Alloy.Globals.HeaderThinFontlargeTablet = {
		fontSize : '39dp',
		fontFamily : 'Aileron-Thin'
	};
	Alloy.Globals.HeaderThinFontMedium = {
		fontSize : '20dp',
		fontFamily : 'Aileron-Thin'
	};
}

/**
 *
 * @param {Object} userName it can be StudyId/Email as per current concept
 * @param {Object} password
 */
Alloy.Globals.setCredentials = function(userName, password, userId, isGuest) {

	if (userName != undefined && userName != null && userName.trim() != "") {

		Ti.App.Properties.setString('userName', userName.trim());
	}

	if (password != undefined && password != null && password.trim() != "") {

		Ti.App.Properties.setString('password', password.trim());
	}
	if (userId != undefined && userId != null) {
		Ti.API.info('*** userId **** : ', userId);

		Ti.App.Properties.setString('userId', userId);
	}
	Ti.API.info('setCredentials isGuest : ', isGuest);
	if (isGuest != undefined && isGuest != null) {

		Ti.App.Properties.setString('isGuest', isGuest);
	}
	if (Ti.App.Properties.hasProperty(userId.toString()) == false) {
		var jewelInfo = {
			totalgamesTrailsA : 0,
			totalgamesTrailsB : 0,
			jewelsTrailACurrentLevel : 1,
			jewelsTrailBCurrentLevel : 1,
			jewelsTrailATotalDiamonds : 0,
			jewelsTrailBTotalDiamonds : 0,
			jewelsTrailBTotalShapes : 0,
			jewelsTrailAServerDiamonds : 0,
			jewelsTrailBServerDiamonds : 0,
			jewelsTrailBServerShapes : 0

		};
		Ti.App.Properties.setObject(userId.toString(), jewelInfo);
	}
	Ti.App.Properties.setString('BlogsUpdate', false);
	Ti.App.Properties.setString('TipsUpdate', false);
	Ti.App.Properties.setString('EnvTime', "");
	//Ti.App.Properties.setString('GameVersionNumber', 1);
	var versionsInfo = {
		SimpleMemory : 1,
		TemporalOrder : 1,
		VisualAssociation : 1,
		Serial7s : 1,
		nBack : 4,
		Jewel : 1,
		ScratchImage : 1
	};
	Ti.App.Properties.setObject('GameVersionNumber', versionsInfo);

	var spinInfo = {
		goldStarCollected : 0,
		blueStarCollected : 0,
		dayStreaks : 0,
		noOFSpins : 0,
		lampRecords : 0,
		spinDate : ""
	};
	Ti.App.Properties.setObject('spinnerInfo', spinInfo);

	var reminderValues = {
		hourlySurvey : "",
		threeHourSurvey : "",
		sixHourSurvey : "",
		twelveHourSurvey : "",
		hourlyCog : "",
		threeHourCog : "",
		sixHourCog : "",
		twelveHourCog : "",

	};
	Ti.App.Properties.setObject('lastAdminReminderTime', reminderValues);
	Ti.App.Properties.setObject('lastLocalReminderTime', reminderValues);
	Ti.App.Properties.setString('distractionSurveyTemporal', 0);
	Ti.App.Properties.setString('distractionSurveySimpleMemory', 0);
	Ti.App.Properties.setString('distractionSurveyVisualAssociation', 0);
	Ti.App.Properties.setString('surveyLastUpdatedDate', "");
	Ti.App.Properties.setString('trailsbSequence', 1);
	Ti.App.Properties.setString('jewelType', 1);
	var lastSyncDate = {
		LastUpdatedSurveyDate : "",
		LastUpdatedGameDate : "",
	};
	Ti.App.Properties.setObject('lastSyncDate', lastSyncDate);
	Ti.App.Properties.setString('lastSpinScoreUpdated', "");
};

if (Ti.App.Properties.hasProperty("lastSpinScoreUpdated") == false) {
	Ti.App.Properties.setString('lastSpinScoreUpdated', "");
}

if (Ti.App.Properties.hasProperty("spinnerInfo") == false) {
	var spinInfo = {
		goldStarCollected : 0,
		blueStarCollected : 0,
		dayStreaks : 0,
		noOFSpins : 0,
		lampRecords : 0,
		spinDate : ""
	};
	Ti.App.Properties.setObject('spinnerInfo', spinInfo);
}
/**
 * Function to remove credentials, This can be used when user tap loggout.
 */
Alloy.Globals.removeCredentials = function() {

	if (Ti.App.Properties.hasProperty("userName") == true) {
		// This is commented to show the username when user loggs out.
		//Ti.App.Properties.removeProperty("userName");
	}
	if (Ti.App.Properties.hasProperty("password") == true) {
		Ti.App.Properties.removeProperty("password");
	}
	if (Ti.App.Properties.hasProperty("userId") == true) {
		Ti.App.Properties.removeProperty("userId");
	}
	if (Ti.App.Properties.hasProperty("EnvTime") == true) {
		Ti.App.Properties.removeProperty("EnvTime");
	}
	if (Ti.App.Properties.hasProperty("isGuest") == true) {
		Ti.App.Properties.removeProperty("isGuest");
	}
	if (Ti.App.Properties.hasProperty("BlogsUpdate") == true) {
		Ti.App.Properties.removeProperty("BlogsUpdate");
	}
	if (Ti.App.Properties.hasProperty("TipsUpdate") == true) {
		Ti.App.Properties.removeProperty("TipsUpdate");
	}
	if (Ti.App.Properties.hasProperty("GameVersionNumber") == true) {
		Ti.App.Properties.removeProperty("GameVersionNumber");
	}
	if (Ti.App.Properties.hasProperty("distractionSurvey") == true) {
		Ti.App.Properties.removeProperty("distractionSurvey");
	}
	if (Ti.App.Properties.hasProperty("surveyLastUpdatedDate") == true) {
		Ti.App.Properties.removeProperty("surveyLastUpdatedDate");
	}
	if (Ti.App.Properties.hasProperty("trailsbSequence") == true) {
		Ti.App.Properties.removeProperty("trailsbSequence");
	}
	if (Ti.App.Properties.hasProperty("jewelType") == true) {
		Ti.App.Properties.removeProperty("jewelType");
	}
	if (Ti.App.Properties.hasProperty("lastSyncDate") == true) {
		Ti.App.Properties.removeProperty("lastSyncDate");
	}

	Ti.App.Properties.setString('currentLevel', "Level 1");
	Ti.App.Properties.setString('totalPoints', 0);
	// Ti.App.Properties.setString('totalgamesTrailsB', 0);
	// Ti.App.Properties.setString('totalgamesTrailsA', 0);

};

/**
 * Function get credentials as an Object
 */
Alloy.Globals.getCredentials = function() {

	var credentials = {
		"userName" : "",
		"password" : "",
		"userId" : ""
	};

	//Ti.API.info('Ti.App.Properties.getString("userName") : ', Ti.App.Properties.getString("userName"));
	//Ti.API.info('Ti.App.Properties.getString("userId") : ', Ti.App.Properties.getString("userId"));
	credentials.userName = Ti.App.Properties.getString("userName", "");
	credentials.password = Ti.App.Properties.getString("password", "");
	credentials.userId = Ti.App.Properties.getString("userId", "");

	//Ti.API.info("GetCredentials");
	//Ti.API.info(credentials);

	return credentials;

};

/**
 * Function to logout, it actually remove username and password from properties so
 * next check isAutoLoginSet will fail.
 * Any event handler removal should be provided here.
 */
Alloy.Globals.logout = function() {

	Alloy.Globals.removeCredentials();

};

/**
 * Function to check whether credentials are set for auto login.
 */
Alloy.Globals.isAutoLoginSet = function() {
	var isAutologin = false;

	var userName = Ti.App.Properties.getString("userName", "");
	var password = Ti.App.Properties.getString("password", "");

	if (userName != "" && password != "") {
		isAutologin = true;
	}

	return isAutologin;

};

//Jewels Trails Common Default Values
Alloy.Globals.jewelsTrailMaxNoOfChangesInLevel = 10;
Alloy.Globals.jewelsTrailMaxTotalScore = 1000;

//Jewels Trail A Default Values
Alloy.Globals.jewelsTrailABeginnerTimerDefault = 90;
Alloy.Globals.jewelsTrailAIntermediateTimerDefault = 40;
Alloy.Globals.jewelsTrailAAdvancedTimerDefault = 30;
Alloy.Globals.jewelsTrailAExpertTimerDefault = 20;
Alloy.Globals.jewelsTrailAMinDiamonds = 15;
Alloy.Globals.jewelsTrailAMaxDiamonds = 25;

//Jewels Trail B Default Values
Alloy.Globals.jewelsTrailBBeginnerTimerDefault = 180;
Alloy.Globals.jewelsTrailBIntermediateTimerDefault = 50;
Alloy.Globals.jewelsTrailBAdvancedTimerDefault = 40;
Alloy.Globals.jewelsTrailBExpertTimerDefault = 30;
Alloy.Globals.jewelsTrailBMinDiamonds = 15;
Alloy.Globals.jewelsTrailBMaxDiamonds = 25;
Alloy.Globals.jewelsTrailBMinShapes = 2;
Alloy.Globals.jewelsTrailBMaxShapes = 4;

//Remainder Settings
Alloy.Globals.threeHoursRepeatTimeArray = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];
Alloy.Globals.sixHoursRepeatTimeArray = ["9:00 AM", "3:00 PM", "9:00 PM"];
Alloy.Globals.tewelHoursRepeatTimeArray = ["9:00 AM", "9:00 PM"];
Alloy.Globals.threeHoursRepeatUTCTimeArray = ["3:30 AM", "6:30 AM", "9:30 AM", "12:30 PM", "3:30 PM"];
Alloy.Globals.sixHoursRepeatUTCTimeArray = ["3:30 AM", "9:30 AM", "3:30 PM"];
Alloy.Globals.tewelHoursRepeatUTCTimeArray = ["3:30 AM", "3:30 PM"];
Alloy.Globals.threeHoursIntervalInMilliSeconds = "10800000";
Alloy.Globals.sixHoursIntervalInMilliSeconds = "21600000";
Alloy.Globals.tewelHoursIntervalInMilliSeconds = "43200000";
Alloy.Globals.twentyFourHoursIntervalInMilliSeconds = "86400000";
