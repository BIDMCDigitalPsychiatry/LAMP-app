// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var commonFunctions = require('commonFunctions');
var noOFBoxes = 6;
var writeArraySet1 = [2, 15, 27, 28, 29, 18, 31, 43, 55, 56, 58, 71];
var wrongArraySet1 = [41, 40, 51, 63, 4, 6, 8, 21, 23, 35, 34, 33, 47, 45, 25, 26, 37, 49, 61, 64, 65, 66, 68];
var highlightedItems = [2, 5, 14, 13, 15, 7, 31, 21, 9, 20, 32, 33, 27, 10, 28, 30, 17, 18, 23, 24, 6, 35];
var targetBoxes = [[1, 5, 14], [2, 17], [18], [13], [15, 10], [9, 28], [7, 14, 31], [2, 13, 15], [9, 21, 14], [23, 5, 18], [17, 6, 24], [21, 32], [20, 15], [17], [18], [33], [10, 30], [28, 36], [13], [20, 33], [32, 27, 35], [33]];
var targetViews = [];
var previousBox = null;
var previousGreenBoxes = [];
$.mazeGame.addEventListener("open", function(e) {
	try {
		mazeGameLogic();

	} catch(ex) {
		commonFunctions.handleException("mazeGame", "open", ex);
	}
});
function mazeGameLogic() {
	Array.prototype.contains = function(obj) {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) {
				return true;
			}
		}
		return false;
	};
	var boxWidth = 100 / noOFBoxes;
	var lineIndex = 0;
	var boxNumber = 0;
	var k = 0;
	for (var i = 0; i < noOFBoxes; i++) {

		var horizontalView = Titanium.UI.createView({
			backgroundColor : 'transparent',
			width : Ti.UI.FILL,
			height : boxWidth + "%",
			layout : 'horizontal'
		});
		for (var j = 0; j < noOFBoxes; j++) {
			var boxWidthTemp = boxWidth + "%";
			if (j == noOFBoxes - 1) {
				boxWidthTemp = (boxWidth - 1) + "%";

			}

			var verticalView = Titanium.UI.createView({
				backgroundColor : "#ffffff",
				width : boxWidthTemp,
				height : Ti.UI.FILL,

			});
			if ((i == 0 && j == 0) || (i == noOFBoxes - 1 && j == noOFBoxes - 1)) {
				var targetView = Titanium.UI.createView({
					backgroundColor : "red",
					width : '20dp',
					height : '20dp',
					borderRadius : '10dp'

				});
				if ((i == 0 && j == 0))
					previousBox = targetView;
				verticalView.add(targetView);
			}
			boxNumber += 1;

			if (highlightedItems.contains(boxNumber) == true) {
				var bgColor = "#D7D8D3";
				if (k == 0) {
					bgColor = "green";
				}

				var tempTargetView = Titanium.UI.createView({
					backgroundColor : bgColor,
					width : '20dp',
					height : '20dp',
					borderRadius : '10dp',
					targetBoxes : targetBoxes[k],
					boxNumber : boxNumber

				});
				if (k == 0)
					previousGreenBoxes.push(tempTargetView);
				targetViews.push(tempTargetView);
				tempTargetView.addEventListener('click', function(e) {

					var correctClick = false;
					for (var i = 0; i < previousGreenBoxes.length; i++) {

						if (previousGreenBoxes[i].boxNumber == e.source.boxNumber) {
							correctClick = true;
						}

					};
					if (correctClick == false) {
						return;
					}
					if (previousBox != null) {
						previousBox.backgroundColor = "#D7D8D3";
					}
					for (var i = 0; i < previousGreenBoxes.length; i++) {
						previousGreenBoxes[i].backgroundColor = "#D7D8D3";

					};

					previousGreenBoxes = [];
					e.source.backgroundColor = "red";
					previousBox = tempTargetView;
					var boxesTemp = e.source.targetBoxes;
					for (var l = 0; l < boxesTemp.length; l++) {
						for (var x = 0; x < targetViews.length; x++) {
							if (targetViews[x].boxNumber == boxesTemp[l]) {
								targetViews[x].backgroundColor = "green";
								previousGreenBoxes.push(targetViews[x]);

							}
						};

					};

				});

				k += 1;
				verticalView.add(tempTargetView);

			}

			lineIndex = lineIndex + 1;
			if (writeArraySet1.contains(lineIndex) == false && wrongArraySet1.contains(lineIndex) == false) {
				var borderLine1 = Titanium.UI.createView({
					backgroundColor : 'black',
					width : Ti.UI.FILL,
					height : '1dp',
					top : '0dp',
					index : lineIndex

				});

				verticalView.add(borderLine1);
			}

			lineIndex = lineIndex + 1;
			if (writeArraySet1.contains(lineIndex) == false && wrongArraySet1.contains(lineIndex) == false) {
				var borderLine2 = Titanium.UI.createView({
					backgroundColor : 'black',
					width : '1dp',
					height : Ti.UI.FILL,
					right : '0dp',
					index : lineIndex

				});

				verticalView.add(borderLine2);
			}

			horizontalView.add(verticalView);
		}

		$.mainView.add(horizontalView);
	};

}

function removeConnections() {

}