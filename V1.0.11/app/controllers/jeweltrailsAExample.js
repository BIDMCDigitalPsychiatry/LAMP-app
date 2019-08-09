// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
/**
 * Declarations
 */
var args = arguments[0] || {};
var commonFunctions = require('commonFunctions');
var targetIndex = 0;
var gameStarted = 0;
var LangCode = Ti.App.Properties.getString('languageCode');

/**
 * Window open function
 */
$.jeweltrailsAExample.addEventListener("open", function(e) {
	try {
		if (OS_IOS) {
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerContainer.height = "80dp";
				$.contentView.top = "80dp";
			}
		}
		$.headerView.setTitle(commonFunctions.L('exmLbl', LangCode));
		$.messageLabel.text = commonFunctions.L('pickdimnd', LangCode);
		if (args.type == 1) {
			createGame();
		} else {
			createGameB();
		}

	} catch(ex) {
		commonFunctions.handleException("jewelsTrailsA", "open", ex);
	}
});

/**
 * Android back button handler
 */
$.jeweltrailsAExample.addEventListener('android:back', function() {
	goBack();
});

/**
 * Header back button click handler
 */
$.headerView.on('backButtonClick', function(e) {

	goBack();
});

/**
 * goBack function handler
 */
function goBack(e) {
	Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jeweltrailsAExample');
}

/**
 * Handles report image click
 */
$.headerView.on('rightButtonClick', function(e) {
	commonFunctions.sendScreenshot();
});

/**
 * Function to create game
 */
function createGame() {
	try {
		Ti.API.info('createGame');
		var pWidth = Alloy.Globals.DEVICE_WIDTH - 40;
		if (OS_IOS) {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT - 220;
		} else {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT_DPI - 220;
		}
		var jewelImage = "/images/jewelTrails/diamond1.png";
		var jewelWidth = "43dp";
		var jewelHeight = "44dp";
		$.instructionImage.image = "/images/jewelTrails/diamond1-sm.png";

		var fullArrayPositions = generatePositionsArray(pWidth, pHeight, 80, 10);
		Ti.API.info('fullArrayPositions : ', fullArrayPositions.length);
		arrayPositions = getRandomPosition(fullArrayPositions, 10);

		tempArrPositions = arrayPositions.slice();
		Ti.API.info('arrayPositions.length : ', arrayPositions.length);
		for (var i = 0; i < arrayPositions.length; i++) {

			var displayText = i + 1;

			var AlphabetsView = Titanium.UI.createView({
				height : jewelHeight,
				width : jewelWidth,
				center : {
					x : arrayPositions[i].x,
					y : arrayPositions[i].y
				},
				customText : displayText,
				bubbleParent : true,
				zIndex : 10,
				indexValue : arrayPositions[i].index,
				backgroundImage : jewelImage

			});
			AlphabetsView.addEventListener("click", function(e) {

				if (e.source.indexValue == 0) {
					if ($.messageLabel.text != "") {
						$.messageView.visible = false;
						$.messageLabel2.visible = true;
						$.messageView2.visible = true;
						$.messageLabel2.text = commonFunctions.L('tapNxtNumber', LangCode);
						if (gameStarted == 0) {
							targetIndex += 1;
							//e.source.visible = false;
							e.source.backgroundImage = "/images/jewelTrails/diamond1_trans.png";
							e.source.touchEnabled = false;
						}
						gameStarted = 1;
					}

				} else {
					if (gameStarted == 1) {

						Ti.API.info('e.source.indexValue : ', e.source.indexValue, targetIndex);
						if (e.source.indexValue == targetIndex) {
							Ti.API.info('Correct answer');
							targetIndex += 1;
							if (targetIndex == 2) {
								$.messageView2.visible = true;
								$.messageLabel2.text = " " + commonFunctions.L('tapLbl', LangCode) + " " + "3" + " ";
							} else if (targetIndex == 3) {
								$.messageView2.visible = true;
								$.messageLabel2.text = " " + commonFunctions.L('tapLbl', LangCode) + " " + "4" + " " + commonFunctions.L('nwLbl', LangCode) + " ";
							} else if (targetIndex == 4) {
								$.messageView2.visible = true;
								$.messageLabel2.text = commonFunctions.L('continueTap', LangCode);
							}

							e.source.backgroundImage = "/images/jewelTrails/diamond1_trans.png";
							e.source.touchEnabled = false;

						} else {
							$.messageView2.visible = true;
							var nxtNumber = targetIndex + 1;

							$.messageLabel2.text = commonFunctions.L('wrongTapLbl', LangCode);
						}
						Ti.API.info('targetIndex : ', targetIndex);

						if (targetIndex == 10) {
							$.messageView2.visible = true;
							Ti.API.info('Finished.');
							$.messageLabel2.text = commonFunctions.L('intructionLabel1', LangCode);
							setTimeout(function() {
								Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jeweltrailsAExample');
							}, 2000);
						}

					}
				}

			});
			var lbl = Titanium.UI.createLabel({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				text : displayText,
				touchEnabled : false,
				font : Alloy.Globals.HeaderFontBoldTablet,
				color : '#ffffff'

			});
			AlphabetsView.add(lbl);

			$.contentView.add(AlphabetsView);
			Ti.API.info('Add alphabet : ' + displayText);

		};

	} catch(ex) {
		commonFunctions.handleException("trailsBNew", "createGame", ex);
	}

}

/**
 * Function to create Game B
 */
function createGameB() {
	try {
		Ti.API.info('createGame');
		var pWidth = Alloy.Globals.DEVICE_WIDTH - 40;
		if (OS_IOS) {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT - 220;
		} else {
			var pHeight = Alloy.Globals.DEVICE_HEIGHT_DPI - 220;
		}

		var fullArrayPositions = generatePositionsArray(pWidth, pHeight, 55, 10);
		Ti.API.info('fullArrayPositions : ', fullArrayPositions.length);
		arrayPositions = getRandomPosition(fullArrayPositions, 20);

		tempArrPositions = arrayPositions.slice();
		Ti.API.info('arrayPositions.length : ', arrayPositions.length);
		var displayText = 1;
		for (var i = 0; i < arrayPositions.length; i++) {
			if (i == 0) {
				var jewelImage = "/images/jewelTrails/diamond1.png";
				var jewelWidth = "35dp";
				var jewelHeight = "35dp";

			} else if (i % 2 == 0) {
				displayText = displayText + 1;
				var jewelImage = "/images/jewelTrails/diamond1.png";
				var jewelWidth = "35dp";
				var jewelHeight = "35dp";
			} else {
				jewelImage = "/images/jewelTrails/diamond2.png";
				var jewelWidth = "35dp";
				var jewelHeight = "45dp";

			}

			var AlphabetsView = Titanium.UI.createView({
				height : jewelHeight,
				width : jewelWidth,
				center : {
					x : arrayPositions[i].x,
					y : arrayPositions[i].y
				},
				customText : displayText,
				bubbleParent : true,
				zIndex : 10,
				indexValue : arrayPositions[i].index,
				backgroundImage : jewelImage

			});
			AlphabetsView.addEventListener("click", function(e) {

				if (e.source.indexValue == 0) {
					Ti.API.info('e.source.indexValue : ', e.source.indexValue, targetIndex);
					if ($.messageLabel.text != "") {

						$.messageLabel.text = commonFunctions.L('pickdimnd', LangCode);

						if (commonFunctions.getIsTablet()) {
							$.smallImageView.width = "32dp";
							$.smallImageView.height = "41dp";

						} else {
							$.smallImageView.width = "22dp";
							$.smallImageView.height = "31dp";

						}
						$.instructionImage.image = "/images/jewelTrails/diamond1.png";

						$.messageLabel1.text = "1";
						if (gameStarted == 0) {
							targetIndex += 1;

							e.source.backgroundImage = "/images/jewelTrails/diamond1_trans.png";
							e.source.touchEnabled = false;
						}
						Ti.API.info('targetIndex : ', targetIndex);
						gameStarted = 1;
					}

				} else {
					if (gameStarted == 1) {

						Ti.API.info('e.source.indexValue : ', e.source.indexValue, targetIndex);
						if (e.source.indexValue == targetIndex) {
							Ti.API.info('Correct answer');
							$.messageView2.visible = true;

							targetIndex += 1;
							if (targetIndex == 2) {
								$.messageView2.visible = false;
								$.messageView.visible = true;
								$.messageLabel2.visible = false;
								$.messageLabel1.visible = true;
								$.smallImageView.width = "22dp";
								$.smallImageView.height = "22dp";
								$.instructionImage.image = "/images/jewelTrails/diamond1.png";
								$.messageLabel1.text = "2";
							} else if (targetIndex == 3) {
								$.messageView2.visible = false;
								$.messageView.visible = true;
								$.messageLabel2.visible = false;
								$.messageLabel1.visible = true;
								$.smallImageView.width = "22dp";
								$.smallImageView.height = "31dp";
								$.instructionImage.image = "/images/jewelTrails/diamond2.png";
								$.messageLabel1.text = "2";
							} else if (targetIndex == 4) {
								$.messageView.visible = true;
								$.messageView2.visible = false;
								$.messageLabel2.visible = false;
								$.smallImageView.width = "22dp";
								$.smallImageView.height = "22dp";
								$.instructionImage.image = "/images/jewelTrails/diamond1.png";
								$.messageLabel1.visible = true;
								$.messageLabel1.text = "3";
							} else if (targetIndex == 5) {
								$.messageView.visible = true;
								$.messageView2.visible = false;
								$.messageLabel2.visible = false;
								$.smallImageView.width = "22dp";
								$.smallImageView.height = "31dp";
								$.instructionImage.image = "/images/jewelTrails/diamond2.png";
								$.messageLabel1.visible = true;
								$.messageLabel1.text = "3";
							} else if (targetIndex == 6) {
								$.messageView.visible = false;
								$.messageView2.visible = true;
								$.messageLabel2.visible = true;
								$.messageLabel2.text = commonFunctions.L('continueTap', LangCode);
							}

							$.messageLabel2.text = commonFunctions.L('continueTap', LangCode);

							if (targetIndex % 2 == 0) {
								e.source.backgroundImage = "/images/jewelTrails/diamond2_trans.png";
							} else {
								e.source.backgroundImage = "/images/jewelTrails/diamond1_trans.png";
							}
							e.source.touchEnabled = false;

						} else {
							$.messageView2.visible = true;
							$.messageView.visible = false;
							$.messageLabel2.visible = true;
							var nxtNumber = targetIndex + 1;
							$.messageLabel2.text = commonFunctions.L('wrongTapLbl', LangCode);
						}
						Ti.API.info('targetIndex : ', targetIndex);

						if (targetIndex == 20) {
							Ti.API.info('Finished.');
							$.messageView2.visible = true;
							$.messageLabel2.text = commonFunctions.L('intructionLabel1', LangCode);
							setTimeout(function() {
								Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('jeweltrailsAExample');
							}, 2000);
						}

					}
				}

			});
			var lbl = Titanium.UI.createLabel({
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				text : displayText,
				touchEnabled : false,
				font : Alloy.Globals.HeaderFontBoldTablet,
				color : '#ffffff'

			});
			AlphabetsView.add(lbl);

			$.contentView.add(AlphabetsView);
			Ti.API.info('Add alphabet : ' + displayText);

		};

	} catch(ex) {
		commonFunctions.handleException("trailsBNew", "createGame", ex);
	}

}

/**
 * Function to get random interger
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Function to get random position
 */
function getRandomPosition(arr, n) {
	try {
		var tempArray = [];
		var result = [];
		var len = arr.length;
		var indexValue = 0;
		while (tempArray.length < n) {
			var randomnumber = Math.floor(Math.random() * len);
			if (tempArray.indexOf(randomnumber) > -1)
				continue;
			tempArray[tempArray.length] = randomnumber;

			result.push({
				x : arr[randomnumber].x,
				y : arr[randomnumber].y,
				index : indexValue
			});
			indexValue = indexValue + 1;

		}

		return result;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "getRandomPosition", ex);
	}
}

/**
 * Function to get array positions
 */
function generatePositionsArray(maxX, maxY, safeRadius, irregularity) {
	try {
		var positionsArray = [];
		var r,
		    c;
		var rows;
		var columns;
		rows = Math.floor(maxY / safeRadius);
		columns = Math.floor(maxX / safeRadius);
		for ( r = 1; r <= rows; r += 1) {
			for ( c = 1; c <= columns; c += 1) {
				positionsArray.push({
					x : Math.round(maxX * c / columns) + getRandomInt(irregularity * -1, irregularity),
					y : Math.round(maxY * r / rows) + getRandomInt(irregularity * -1, irregularity),

				});

			}
		}
		return positionsArray;
	} catch(ex) {
		commonFunctions.handleException("trailsB", "generatePositionsArray", ex);
	}
}