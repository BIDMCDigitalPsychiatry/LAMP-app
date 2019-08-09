// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var serviceManager = require('serviceManager');
var commonDB = require('commonDB');
var credentials = Alloy.Globals.getCredentials();
var commonFunctions = require('commonFunctions');
var LangCode = Ti.App.Properties.getString('languageCode');
var goldenStar = "/images/prevent/star_active.png";
var starImage = "/images/prevent/star.png";

var starsCollected;
var blueStarsCollected = 0;
var goldenStarsCollected = 0;
var randomSelection;
var userTotalScore;
var tabStar = "/images/tablet/prevent/star.png";
var goldenTabStar = "/images/tablet/prevent/star_active.png";

init();
/**
 * Initializing function
 */
function init() {
	if (OS_IOS) {
		if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
			$.headerView.height = "80dp";
			$.headerLabel.top = "20dp";
			$.contentView.top = "100dp";
			$.contentView.bottom = "88dp";
		}

	}

	var spinDefaultImage;
	if (LangCode == "cmn") {
		spinDefaultImage = "/images/prevent/spin_wheel_ch.png";
	} else {
		spinDefaultImage = "/images/prevent/spin_wheel.png";
	}

	$.spinImage.image = spinDefaultImage;

	var density = Ti.Platform.displayCaps.density;
	if (density == "high" || density == "hdpi") {
		density = "hdpi";
	} else if (density == "xhigh" || density == "xhdpi") {
		density = "xhdpi";
	} else if (density == "xxhigh" || density == "xxhdpi") {
		density = "xxhdpi";
	} else if (density == "xxxhigh" || density == "xxxhdpi") {
		density = "xxxhdpi";
	} else {
		density = "mdpi";
	}

	if (Ti.Platform.displayCaps.density === 'xhigh' && (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true)) {

		$.spinImage.image = "/images/tablet/prevent/spin_wheel.png";
		$.blueStar.image = "/images/tablet/prevent/blue_star.png";
		$.spinView.height = "300dp";
		$.spinView.width = "300dp";

		$.starImage1.image = tabStar;
		$.starImage2.image = tabStar;
		$.starImage3.image = tabStar;
		$.starImage4.image = tabStar;
		$.starImage5.image = tabStar;
		$.starImage6.image = tabStar;
		$.starImage7.image = tabStar;
		$.starImage8.image = tabStar;
		$.starImage9.image = tabStar;
		$.starImage10.image = tabStar;
		$.starImage11.image = tabStar;
		$.starImage12.image = tabStar;
		$.starImage13.image = tabStar;
		$.starImage14.image = tabStar;
		$.starImage15.image = tabStar;

		$.star1.image = tabStar;
		$.star2.image = tabStar;
		$.star3.image = tabStar;
		$.star4.image = tabStar;
		$.star5.image = tabStar;
		$.star6.image = tabStar;
		$.star7.image = tabStar;
		$.star8.image = tabStar;
		$.star9.image = tabStar;
		$.star10.image = tabStar;
		$.star11.image = tabStar;
		$.star12.image = tabStar;
		$.star13.image = tabStar;
		$.star14.image = tabStar;
		$.star15.image = tabStar;
	}

	if (Alloy.Globals.iPhone5) {
		$.contentView.top = "65dp";
		$.starRateView.height = "50dp";
		$.starRateView.left = "5dp";
		$.starRateView.right = "5dp";
		$.starView1.top = "5dp";
		$.starView2.bottom = "5dp";
		$.scoreView.left = "5dp";
		$.scoreView.right = "5dp";
		$.spinView.top = "3%";
		$.scoreView.top = "3%";
		$.scoreView.height = "72dp";
		$.scoreView1.width = "72dp";
		$.scoreView2.width = "80dp";
		$.scoreView3.width = "72dp";
		$.boostLabel1.top = "20dp";
		$.boostLabel2.bottom = "20dp";
		$.dayValue.top = "10dp";
		$.percent.top = "10dp";
		$.dayLabel.bottom = "10dp";
		$.today.bottom = "10dp";
		$.spinView.height = "160dp";
		$.spinView.width = "160dp";
		$.todaySpin.top = "5dp";
		$.startButton.width = "160";
		$.startButton.top = "2%";
		$.blueStarView.top = "2%";
		$.starImage2.left = "2dp";
		$.starImage3.left = "2dp";
		$.starImage4.left = "2dp";
		$.starImage5.left = "2dp";
		$.starImage6.left = "2dp";
		$.starImage7.left = "2dp";
		$.starImage8.left = "2dp";
		$.starImage9.left = "2dp";
		$.starImage10.left = "2dp";
		$.starImage11.left = "2dp";
		$.starImage12.left = "2dp";
		$.starImage13.left = "2dp";
		$.starImage14.left = "2dp";
		$.starImage15.left = "2dp";

		$.star2.left = "2dp";
		$.star3.left = "2dp";
		$.star4.left = "2dp";
		$.star5.left = "2dp";
		$.star6.left = "2dp";
		$.star7.left = "2dp";
		$.star8.left = "2dp";
		$.star9.left = "2dp";
		$.star10.left = "2dp";
		$.star11.left = "2dp";
		$.star12.left = "2dp";
		$.star13.left = "2dp";
		$.star14.left = "2dp";
		$.star15.left = "2dp";

	}
	if (Alloy.Globals.iPhoneSixPlus) {
		$.starImage2.left = "8dp";
		$.starImage3.left = "8dp";
		$.starImage4.left = "8dp";
		$.starImage5.left = "8dp";
		$.starImage6.left = "8dp";
		$.starImage7.left = "8dp";
		$.starImage8.left = "8dp";
		$.starImage9.left = "8dp";
		$.starImage10.left = "8dp";
		$.starImage11.left = "8dp";
		$.starImage12.left = "8dp";
		$.starImage13.left = "8dp";
		$.starImage14.left = "8dp";
		$.starImage15.left = "8dp";

		$.star2.left = "8dp";
		$.star3.left = "8dp";
		$.star4.left = "8dp";
		$.star5.left = "8dp";
		$.star6.left = "8dp";
		$.star7.left = "8dp";
		$.star8.left = "8dp";
		$.star9.left = "8dp";
		$.star10.left = "8dp";
		$.star11.left = "8dp";
		$.star12.left = "8dp";
		$.star13.left = "8dp";
		$.star14.left = "8dp";
		$.star15.left = "8dp";
	}
	if (!OS_IOS) {
		if (LangCode == "pt-br" && (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true)) {
			$.boostLabel1.top = "50dp";
			$.boostLabel2.bottom = "45dp";
		}
	}

	if (LangCode == "pt-br" && (commonFunctions.getIsTablet() === false && commonFunctions.getIsTabletMini() === false)) {
		$.scoreView2.width = "95dp";
		if (Alloy.Globals.iPhone5) {
			$.boostLabel1.top = "15dp";
			$.boostLabel2.bottom = "10dp";
		} else if (!OS_IOS) {

			$.boostLabel1.top = "20dp";
			$.boostLabel2.bottom = "15dp";
		} else {
			$.boostLabel1.top = "20dp";
			$.boostLabel2.bottom = "10dp";
		}
	}

	if (LangCode == "es" && commonFunctions.getIsTablet() == false) {
		if (Alloy.Globals.iPhone5) {
			$.boostLabel1.top = "15dp";
			$.boostLabel2.bottom = "10dp";
		} else {
			$.boostLabel1.top = "25dp";
			$.boostLabel2.bottom = "10dp";
		}
	}

	$.dayLabel.text = commonFunctions.L('daystreakLbl', LangCode);
	$.boostLabel1.text = commonFunctions.L('boostScoreLbl', LangCode);
	$.boostLabel2.text = commonFunctions.L('boostLampScoreLbl', LangCode);
	$.today.text = commonFunctions.L('todayLbl', LangCode);
	$.startButton.text = commonFunctions.L('seemoreLbl', LangCode);
}

/**
 * Refresh Parent Screen
 */
$.refreshPreventScreen = function(e) {
	try {
		serviceRefresh();
	} catch(ex) {
		commonFunctions.handleException("preventIntroScreen", "refreshPreventScreen", ex);
	}
};

/**
 * Function to update stars
 */
function getGoldStars() {
	if (blueStarsCollected != 0) {
		$.blueStarCount.text = blueStarsCollected;
	}
	if (!OS_IOS && (Ti.Platform.displayCaps.density == 'xhigh') && (commonFunctions.getIsTablet() === true || commonFunctions.getIsTabletMini() === true)) {

		$.starImage1.image = tabStar;
		$.starImage2.image = tabStar;
		$.starImage3.image = tabStar;
		$.starImage4.image = tabStar;
		$.starImage5.image = tabStar;
		$.starImage6.image = tabStar;
		$.starImage7.image = tabStar;
		$.starImage8.image = tabStar;
		$.starImage9.image = tabStar;
		$.starImage10.image = tabStar;
		$.starImage11.image = tabStar;
		$.starImage12.image = tabStar;
		$.starImage13.image = tabStar;
		$.starImage14.image = tabStar;
		$.starImage15.image = tabStar;

		$.star1.image = tabStar;
		$.star2.image = tabStar;
		$.star3.image = tabStar;
		$.star4.image = tabStar;
		$.star5.image = tabStar;
		$.star6.image = tabStar;
		$.star7.image = tabStar;
		$.star8.image = tabStar;
		$.star9.image = tabStar;
		$.star10.image = tabStar;
		$.star11.image = tabStar;
		$.star12.image = tabStar;
		$.star13.image = tabStar;
		$.star14.image = tabStar;
		$.star15.image = tabStar;

		if (goldenStarsCollected == 0) {

		} else if (goldenStarsCollected == 1) {
			$.starImage1.image = goldenTabStar;
		} else if (goldenStarsCollected == 2) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
		} else if (goldenStarsCollected == 3) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
		} else if (goldenStarsCollected == 4) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
		} else if (goldenStarsCollected == 5) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
		} else if (goldenStarsCollected == 6) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
		} else if (goldenStarsCollected == 7) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
		} else if (goldenStarsCollected == 8) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
		} else if (goldenStarsCollected == 9) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
		} else if (goldenStarsCollected == 10) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
		} else if (goldenStarsCollected == 11) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
		} else if (goldenStarsCollected == 12) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
		} else if (goldenStarsCollected == 13) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
		} else if (goldenStarsCollected == 14) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
		} else if (goldenStarsCollected == 15) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
		} else if (goldenStarsCollected == 16) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
		} else if (goldenStarsCollected == 17) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
		} else if (goldenStarsCollected == 18) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
		} else if (goldenStarsCollected == 19) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
		} else if (goldenStarsCollected == 20) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
		} else if (goldenStarsCollected == 21) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
		} else if (goldenStarsCollected == 22) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
		} else if (goldenStarsCollected == 23) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
			$.star8.image = goldenTabStar;
		} else if (goldenStarsCollected == 24) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
			$.star8.image = goldenTabStar;
			$.star9.image = goldenTabStar;
		} else if (goldenStarsCollected == 25) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
			$.star8.image = goldenTabStar;
			$.star9.image = goldenTabStar;
			$.star10.image = goldenTabStar;
		} else if (goldenStarsCollected == 26) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
			$.star8.image = goldenTabStar;
			$.star9.image = goldenTabStar;
			$.star10.image = goldenTabStar;
			$.star11.image = goldenTabStar;
		} else if (goldenStarsCollected == 27) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
			$.star8.image = goldenTabStar;
			$.star9.image = goldenTabStar;
			$.star10.image = goldenTabStar;
			$.star11.image = goldenTabStar;
			$.star12.image = goldenTabStar;
		} else if (goldenStarsCollected == 28) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
			$.star8.image = goldenTabStar;
			$.star9.image = goldenTabStar;
			$.star10.image = goldenTabStar;
			$.star11.image = goldenTabStar;
			$.star12.image = goldenTabStar;
			$.star13.image = goldenTabStar;
		} else if (goldenStarsCollected == 29) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
			$.star8.image = goldenTabStar;
			$.star9.image = goldenTabStar;
			$.star10.image = goldenTabStar;
			$.star11.image = goldenTabStar;
			$.star12.image = goldenTabStar;
			$.star13.image = goldenTabStar;
			$.star14.image = goldenTabStar;
		} else if (goldenStarsCollected == 30) {
			$.starImage1.image = goldenTabStar;
			$.starImage2.image = goldenTabStar;
			$.starImage3.image = goldenTabStar;
			$.starImage4.image = goldenTabStar;
			$.starImage5.image = goldenTabStar;
			$.starImage6.image = goldenTabStar;
			$.starImage7.image = goldenTabStar;
			$.starImage8.image = goldenTabStar;
			$.starImage9.image = goldenTabStar;
			$.starImage10.image = goldenTabStar;
			$.starImage11.image = goldenTabStar;
			$.starImage12.image = goldenTabStar;
			$.starImage13.image = goldenTabStar;
			$.starImage14.image = goldenTabStar;
			$.starImage15.image = goldenTabStar;
			$.star1.image = goldenTabStar;
			$.star2.image = goldenTabStar;
			$.star3.image = goldenTabStar;
			$.star4.image = goldenTabStar;
			$.star5.image = goldenTabStar;
			$.star6.image = goldenTabStar;
			$.star7.image = goldenTabStar;
			$.star8.image = goldenTabStar;
			$.star9.image = goldenTabStar;
			$.star10.image = goldenTabStar;
			$.star11.image = goldenTabStar;
			$.star12.image = goldenTabStar;
			$.star13.image = goldenTabStar;
			$.star14.image = goldenTabStar;
			$.star15.image = goldenTabStar;
		}
		// phone
	} else {
		$.starImage1.image = starImage;
		$.starImage2.image = starImage;
		$.starImage3.image = starImage;
		$.starImage4.image = starImage;
		$.starImage5.image = starImage;
		$.starImage6.image = starImage;
		$.starImage7.image = starImage;
		$.starImage8.image = starImage;
		$.starImage9.image = starImage;
		$.starImage10.image = starImage;
		$.starImage11.image = starImage;
		$.starImage12.image = starImage;
		$.starImage13.image = starImage;
		$.starImage14.image = starImage;
		$.starImage15.image = starImage;

		$.star1.image = starImage;
		$.star2.image = starImage;
		$.star3.image = starImage;
		$.star4.image = starImage;
		$.star5.image = starImage;
		$.star6.image = starImage;
		$.star7.image = starImage;
		$.star8.image = starImage;
		$.star9.image = starImage;
		$.star10.image = starImage;
		$.star11.image = starImage;
		$.star12.image = starImage;
		$.star13.image = starImage;
		$.star14.image = starImage;
		$.star15.image = starImage;

		if (goldenStarsCollected == 0) {

		} else if (goldenStarsCollected == 1) {
			$.starImage1.image = goldenStar;
		} else if (goldenStarsCollected == 2) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
		} else if (goldenStarsCollected == 3) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
		} else if (goldenStarsCollected == 4) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
		} else if (goldenStarsCollected == 5) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
		} else if (goldenStarsCollected == 6) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
		} else if (goldenStarsCollected == 7) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
		} else if (goldenStarsCollected == 8) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
		} else if (goldenStarsCollected == 9) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
		} else if (goldenStarsCollected == 10) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
		} else if (goldenStarsCollected == 11) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
		} else if (goldenStarsCollected == 12) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
		} else if (goldenStarsCollected == 13) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
		} else if (goldenStarsCollected == 14) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
		} else if (goldenStarsCollected == 15) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
		} else if (goldenStarsCollected == 16) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
		} else if (goldenStarsCollected == 17) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
		} else if (goldenStarsCollected == 18) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
		} else if (goldenStarsCollected == 19) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
		} else if (goldenStarsCollected == 20) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
		} else if (goldenStarsCollected == 21) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
		} else if (goldenStarsCollected == 22) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
		} else if (goldenStarsCollected == 23) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
			$.star8.image = goldenStar;
		} else if (goldenStarsCollected == 24) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
			$.star8.image = goldenStar;
			$.star9.image = goldenStar;
		} else if (goldenStarsCollected == 25) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
			$.star8.image = goldenStar;
			$.star9.image = goldenStar;
			$.star10.image = goldenStar;
		} else if (goldenStarsCollected == 26) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
			$.star8.image = goldenStar;
			$.star9.image = goldenStar;
			$.star10.image = goldenStar;
			$.star11.image = goldenStar;
		} else if (goldenStarsCollected == 27) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
			$.star8.image = goldenStar;
			$.star9.image = goldenStar;
			$.star10.image = goldenStar;
			$.star11.image = goldenStar;
			$.star12.image = goldenStar;
		} else if (goldenStarsCollected == 28) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
			$.star8.image = goldenStar;
			$.star9.image = goldenStar;
			$.star10.image = goldenStar;
			$.star11.image = goldenStar;
			$.star12.image = goldenStar;
			$.star13.image = goldenStar;
		} else if (goldenStarsCollected == 29) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
			$.star8.image = goldenStar;
			$.star9.image = goldenStar;
			$.star10.image = goldenStar;
			$.star11.image = goldenStar;
			$.star12.image = goldenStar;
			$.star13.image = goldenStar;
			$.star14.image = goldenStar;
		} else if (goldenStarsCollected == 30) {
			$.starImage1.image = goldenStar;
			$.starImage2.image = goldenStar;
			$.starImage3.image = goldenStar;
			$.starImage4.image = goldenStar;
			$.starImage5.image = goldenStar;
			$.starImage6.image = goldenStar;
			$.starImage7.image = goldenStar;
			$.starImage8.image = goldenStar;
			$.starImage9.image = goldenStar;
			$.starImage10.image = goldenStar;
			$.starImage11.image = goldenStar;
			$.starImage12.image = goldenStar;
			$.starImage13.image = goldenStar;
			$.starImage14.image = goldenStar;
			$.starImage15.image = goldenStar;
			$.star1.image = goldenStar;
			$.star2.image = goldenStar;
			$.star3.image = goldenStar;
			$.star4.image = goldenStar;
			$.star5.image = goldenStar;
			$.star6.image = goldenStar;
			$.star7.image = goldenStar;
			$.star8.image = goldenStar;
			$.star9.image = goldenStar;
			$.star10.image = goldenStar;
			$.star11.image = goldenStar;
			$.star12.image = goldenStar;
			$.star13.image = goldenStar;
			$.star14.image = goldenStar;
			$.star15.image = goldenStar;
		}
	}

}

/**
 * Getting Random Number
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Boost Lamp Score
 */
function boostScoreHandler() {
	randomSelection = getRandomInt(1, 4);
	switch(randomSelection) {
	case 1:
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
			'type' : 1
		});
		break;
	case 2:
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : true
		});
		break;
	case 3:
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
			'type' : 2
		});
		break;
	case 4:
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : false
		});
		break;
	}
}

/**
 * FUnction to open Spin wheel screen
 */
function openSpin() {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spinWheelScreen');
}

/**
 * Function to open Health Data Screen
 */
function openResultScreen() {
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('resultScreen');
}

/**
 * function for screen open
 */
$.preventIntroScreen.addEventListener("open", function(e) {

	$.headerLabel.text = commonFunctions.L('prevntLbl', LangCode);

	var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
	var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
	if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
		$.footerView.setInfoIndicatorON();
	} else {
		$.footerView.setInfoIndicatorOFF();
	}
	$.footerView.setSelectedLabel(4);

	var UserID = credentials.userId;
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1;
	//months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();

	var newdate = year + "-" + month + "-" + day;

	serviceManager.GetAllGameTotalSpinWheelScore(UserID, newdate, getGameScoreSuccess, getGameScoreFailure);
});

/**
 * Function to call Service
 */
function serviceRefresh() {
	if ($.todaySpin.text == commonFunctions.L('todaySpinLbl', LangCode) + ": 1") {
		$.spinView.touchEnabled = false;
		$.todaySpin.text = commonFunctions.L('todaySpinLbl', LangCode) + ": " + 0;
	}
	var UserID = credentials.userId;
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1;
	//months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();

	var newdate = year + "-" + month + "-" + day;

	serviceManager.GetAllGameTotalSpinWheelScore(UserID, newdate, getGameScoreSuccess, getGameScoreFailure);
}

/**
 * Success api call
 */
function getGameScoreSuccess(e) {
	try {
		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {
			var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
			var noOFRecords = spinInfo.lampRecords;
			var totalScore = response.TotalScore;
			var dayStreak = 0;
			if (response.DayStreak != null) {
				dayStreak = response.DayStreak;
			}
			var streakSpin = 0;
			if (response.StrakSpin != null) {
				streakSpin = response.StrakSpin;
			}
			if (response.DayStreak != null && response.DayStreak != 0) {
				if (response.GameDate == "" || response.GameDate == null) {
					dayStreak = 0;
				} else {
					var gameDate = new Date(response.GameDate);

					var timeDiff = new Date().getTime() - gameDate.getTime();
					var dateDifference = timeDiff / (1000 * 3600 * 24);
					if (dateDifference > 1) {
						dayStreak = 0;
					}
				}

			}

			if (response.StrakSpin != null && response.StrakSpin != 0) {
				var gameDate = new Date(response.GameDate);

				var timeDiff = new Date().getTime() - gameDate.getTime();
				var dateDifference = timeDiff / (1000 * 3600 * 24);
				if (dateDifference > 0) {
					streakSpin = 0;
				}
			}
			$.streakSpin.text = commonFunctions.L('streakspinLbl', LangCode) + ": " + streakSpin;
			$.dayValue.text = dayStreak;
			if (response.TotalScore == "" || response.TotalScore == null) {
				totalScore = 0;
			}
			if (noOFRecords == 0) {
				userTotalScore = 50 + totalScore;
				Ti.App.Properties.setString('lastSpinScoreUpdated', new Date().getDate());
			} else {
				var spinScoreTime = Ti.App.Properties.getString('lastSpinScoreUpdated');

				if (spinScoreTime != "") {
					var spinScoreDate = spinScoreTime;

					if (spinScoreDate == new Date().getDate()) {

						userTotalScore = totalScore + 50;
					} else {

						userTotalScore = totalScore;
					}
				} else {

					userTotalScore = totalScore;
				}

			}
			$.percent.text = userTotalScore;
			starsCollected = response.CollectedStars;
			if (starsCollected >= 30) {
				blueStarsCollected = Math.trunc(starsCollected / 30);
				goldenStarsCollected = starsCollected - (30 * blueStarsCollected);
			} else {
				goldenStarsCollected = starsCollected;
			}
			getGoldStars();

			if (userTotalScore >= 75) {
				var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
				var completedSpin = streakSpin;

				var spinForToday = Math.trunc(userTotalScore / 75);
				spinInfo.noOFSpins = completedSpin;
				Ti.App.Properties.setObject('spinnerInfo', spinInfo);

				if (!OS_IOS) {
					$.spinAndroid.height = 0;
					$.spinAndroid.width = 0;
				}
				$.spinView.touchEnabled = true;
				if (spinForToday != 0) {
					spinForToday = parseInt(spinForToday) - parseInt(completedSpin);
				}
				$.todaySpin.text = commonFunctions.L('todaySpinLbl', LangCode) + ": " + spinForToday;

				if (spinForToday === 0) {
					if (!OS_IOS) {
						$.spinAndroid.height = Titanium.UI.FILL;
						$.spinAndroid.width = Titanium.UI.FILL;
					}
					$.spinView.touchEnabled = false;
					$.todaySpin.text = commonFunctions.L('todaySpinLbl', LangCode) + ": " + 0;
				}

			} else {
				if (!OS_IOS) {
					$.spinAndroid.height = Titanium.UI.FILL;
					$.spinAndroid.width = Titanium.UI.FILL;
				}
				$.spinView.touchEnabled = false;
				$.todaySpin.text = commonFunctions.L('todaySpinLbl', LangCode) + ": " + "0";
			}
		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		commonFunctions.closeActivityIndicator();

	} catch(ex) {
		commonFunctions.handleException("preventIntroScreen", "getGameScoreSuccess", ex);
	}
}

/**
 * Failure api call
 */
function getGameScoreFailure(e) {
	commonFunctions.closeActivityIndicator();
}

/**
 * on home button click
 */
function onHomeClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventIntroScreen');
		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow != null && parentWindow.windowName === "home") {
			parentWindow.window.refreshHomeScreen();
		}

	} catch(ex) {
		commonFunctions.handleException("prevent", "homeClick", ex);
	}
}

$.preventIntroScreen.addEventListener('android:back', function() {
	onHomeClick();
});
$.footerView.on('clickLearn', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('homeStaticPages');
	if (OS_IOS) {
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventIntroScreen');
		}, 1000);
	} else {

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventIntroScreen');

	}

});

$.footerView.on('clickAssess', function(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventIntroScreen');
	var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
	if (parentWindow != null && parentWindow.windowName === "home") {
		parentWindow.window.refreshHomeScreen();
	}

});

$.footerView.on('clickManage', function(e) {

	if (OS_IOS) {

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
		setTimeout(function() {
			Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventIntroScreen');
		}, 1000);
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchTestScreen');

		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');

		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('preventIntroScreen');

	}

});

$.footerView.on('clickPrevent', function(e) {

	return;

});

/**
 * Trigger onReportClick click event
 */
function onReportClick() {
	commonFunctions.sendScreenshot();
}