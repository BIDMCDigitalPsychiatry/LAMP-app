/**
 * Declarations
 */
{
	var args = $.args;
	var commonFunctions = require('commonFunctions');
	var commonDB = require('commonDB');
	var Picker = require('picker');
	var dismissItemIndex = -1;
	var settingsInfo = Ti.App.Properties.getObject("SettingsInfo");
	var menuLabel;
	var firstGameID;
	var secondGameID;
	var firstFavGame;
	var secondFavGame;
	var serviceManager = require('serviceManager');
	var notificationManager = require('notificationManager');
	if (OS_IOS) {
		var locationupdatemodule = require('com.zco.location');
		var notify = require('zco.alarmmanager');
	}
	var menueClicked = false;
	var openFromNotificationClick = false;
	var LangCode = Ti.App.Properties.getString('languageCode');
	var notificationDataArray=[];
	var surveyList=[];
}
function getGameSlot() {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		var gameList= [{
			"value" : 1,
			"title" : commonFunctions.L('nbackTest', LangCode),
			"type":"C"
		}, {
			"value" : 2,
			"title" : commonFunctions.L('trailsBTest', LangCode),
			"type":"C"
		}, {
			"value" : 3,
			"title" : commonFunctions.L('spatialFrwd', LangCode),
			"type":"C"
		}, {
			"value" : 4,
			"title" : commonFunctions.L('spatialBckwrd', LangCode),
			"type":"C"
		}, {
			"value" : 5,
			"title" : commonFunctions.L('memoryTest', LangCode),
			"type":"C"
		}, {
			"value" : 6,
			"title" : commonFunctions.L('serial7', LangCode),
			"type":"C"
		}, {
			"value" : 8,
			"title" : commonFunctions.L('figCopy', LangCode),
			"type":"C"
		}, {
			"value" : 9,
			"title" : commonFunctions.L('visualGame', LangCode),
			"type":"C"
		}, {
			"value" : 10,
			"title" : commonFunctions.L('digitFWrd', LangCode),
			"type":"C"
		}, {
			"value" : 13,
			"title" : commonFunctions.L('digitBckWrd', LangCode),
			"type":"C"
		}, {
			"value" : 11,
			"title" : commonFunctions.L('catdog', LangCode),
			"type":"C"
		}, {
			"value" : 12,
			"title" : commonFunctions.L('temporalOrder', LangCode),
			"type":"C"
		}, {
			"value" : 15,
			"title" : commonFunctions.L('trailsBTestNew', LangCode),
			"type":"C"
		}, {
			"value" : 14,
			"title" : commonFunctions.L('nbackTestNew', LangCode),
			"type":"C"
		}, {
			
			"value" : 16,
			"title" : commonFunctions.L('trailsBTouch', LangCode),
			"type":"C"
		}, {
			
			"value" : 17,
			"title" : commonFunctions.L('jwelA', LangCode),
			"type":"C"
		}, {
			
			"value" : 18,
			"title" : commonFunctions.L('jwelB', LangCode),
			"type":"C"
		}];
		
		surveyList=commonDB.getSurveyTypes();
		
		
		for(var i=0;i<surveyList.length;i++){
			gameList.push({
				"value" :surveyList[i].surveyID,
				"title" : surveyList[i].questions,
				"type":"S"
			});	
			
		}
		
		if(Ti.App.Properties.getString('firstFavouriteId')!=null && Ti.App.Properties.getString('firstFavouriteId')!=""){
			 firstFavGame=commonFunctions.getGameNameFromId(Ti.App.Properties.getString('firstFavouriteId'));
		}
		if(Ti.App.Properties.getString('secondFavouriteId')!=null && Ti.App.Properties.getString('secondFavouriteId')!=""){
			 secondFavGame=commonFunctions.getGameNameFromId(Ti.App.Properties.getString('secondFavouriteId'));
		}
	
		if(Ti.App.Properties.getString('firstSurveyFavouriteId')!=null && Ti.App.Properties.getString('firstSurveyFavouriteId')!=""){
			
			for(var i=0;i<surveyList.length;i++){
						if(surveyList[i].surveyID==Ti.App.Properties.getString('firstSurveyFavouriteId')){
							firstFavGame=surveyList[i].questions;
						}
					}
		}
		if(Ti.App.Properties.getString('secondSurveyFavouriteId')!=null && Ti.App.Properties.getString('secondSurveyFavouriteId')!=""){
			for(var i=0;i<surveyList.length;i++){
						if(surveyList[i].surveyID==Ti.App.Properties.getString('secondSurveyFavouriteId')){
							secondFavGame=surveyList[i].questions;
						}
					}
		}
		
		var indexArray=[];
		for(var i=0;i<gameList.length;i++){
			if(gameList[i].title==firstFavGame || gameList[i].title==secondFavGame){
				indexArray.push(i);
				
			}
		}
		
		for(var j=indexArray.length-1;j>=0;j--){
			gameList.splice(indexArray[j],1);
		}
		
		return gameList;

	} catch(ex) {
		commonFunctions.handleException("home", "getSlot", ex);
	}
}

if (settingsInfo != null && settingsInfo != undefined) {
	Alloy.Globals.HEADER_COLOR = settingsInfo.appColor;
	Alloy.Globals.BACKGROUND_IMAGE = settingsInfo.appBackground;
	$.home.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
}
/**
 * Trigger onReportClick click event
 */
function onReportClick() {
	commonFunctions.sendScreenshot();
}

/**
 * Open Window.
 */
$.home.addEventListener("open", function(e) {
	try {
		surveyList=commonDB.getSurveyTypes();
		if(Ti.App.Properties.getString('firstFavouriteId')!=null && Ti.App.Properties.getString('firstFavouriteId')!="" ){
			$.startFirstView.visible=true;
			$.favOneLbl.text = commonFunctions.getGameNameFromId(Ti.App.Properties.getString('firstFavouriteId'));
			var gameId=Ti.App.Properties.getString('firstFavouriteId');
			$.firstFavIcn.image="/images/newHome/"+"C" + gameId + ".png";
			
		}else if(Ti.App.Properties.getString('firstSurveyFavouriteId')!=null && Ti.App.Properties.getString('firstSurveyFavouriteId')!="" ){
			var surveyID="";
			$.startFirstView.visible=true;
			var surveyName="";
				for(var i=0;i<surveyList.length;i++){
						if(surveyList[i].surveyID==Ti.App.Properties.getString('firstSurveyFavouriteId')){
							surveyID=surveyList[i].surveyID;
							surveyName=surveyList[i].questions;
						}
					}
				$.favOneLbl.text = surveyName;
				var fileName = "S" + surveyID + ".png";
				var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
				if(file.exists() == true){
					$.firstFavIcn.image = Ti.Filesystem.applicationDataDirectory + fileName;
				}else{
				$.firstFavIcn.image="/images/gameIcons/surveyIcon.png";
					}
			}
		
		else{
			$.startFirstView.visible=false;
		}
		if(Ti.App.Properties.getString('secondFavouriteId')!=null && Ti.App.Properties.getString('secondFavouriteId')!=""){
			$.startSecondView.visible=true;
			$.favTwoLbl.text = commonFunctions.getGameNameFromId(Ti.App.Properties.getString('secondFavouriteId'));
			var gameId=Ti.App.Properties.getString('secondFavouriteId');
			$.secondFavIcn.image="/images/newHome/"+"C" + gameId + ".png";
		}
		
		else if(Ti.App.Properties.getString('secondSurveyFavouriteId')!=null && Ti.App.Properties.getString('secondSurveyFavouriteId')!=""){
			$.startSecondView.visible=true;
			var surveyID="";
			var surveyName="";
			for(var i=0;i<surveyList.length;i++){
						if(surveyList[i].surveyID==Ti.App.Properties.getString('secondSurveyFavouriteId')){
							surveyID=surveyList[i].surveyID;
							surveyName=surveyList[i].questions;
						}
					}
				$.favTwoLbl.text = surveyName;
				var fileName = "S" + surveyID + ".png";
				var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
				if(file.exists() == true){
					$.secondFavIcn.image = Ti.Filesystem.applicationDataDirectory + fileName;
				}else{
				$.secondFavIcn.image="/images/gameIcons/surveyIcon.png";
				}
			}
		
		else{
			$.startSecondView.visible=false;
		}
		
		
		
		
		
		
		Ti.App.Properties.setString('isFirstTimeLogin', "true");
		if (OS_IOS) {
			if(Alloy.Globals.iPhone5){
				$.firstFavouriteView.bottom="2dp";
				$.secondFavouriteView.bottom="2dp";
				$.notificationMainMenu.bottom="10dp";
			}
			
			if (Alloy.Globals.DEVICE_HEIGHT >= 812) {
				$.headerView.height = "80dp";
				$.menuSectionview.top="20dp";
				$.firstFavouriteView.top="50dp";
				$.secondFavouriteView.top="50dp";
				$.notificationMainMenu.top="40dp";
				$.notificationRightMenu.top="40dp";
				$.notificationLeftMenu.top="40dp";
			}

		}
		
		if (Ti.App.Properties.hasProperty("appVersion")) {
			if (Ti.App.Properties.getString("appVersion") != Titanium.App.version && Titanium.App.version == "1.0.7.0") {
				if (!Ti.App.Properties.hasProperty('languageCode')) {
					Ti.App.Properties.setString('languageCode', "en");
				}

			}
		}
		var LangCode = Ti.App.Properties.getString('languageCode');
		initDB();
		var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
		var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
		if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
			$.footerView.setInfoIndicatorON();
		} else {
			$.footerView.setInfoIndicatorOFF();
		}
		var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
		var isGuest = Ti.App.Properties.getString("isGuest", "");
		if (surveyReminder == null || surveyReminder == undefined) {

			var allSurvey = commonDB.getSurveyTypes();

			if (allSurvey.length != 0) {
				var surveyIds = [allSurvey[0].surveyID];
				var surveyTexts = [allSurvey[0].questions];
				var surveyReminder = {
					surveyId : surveyIds,
					surveyText : surveyTexts,
					currentSurvey : 0
				};

			} else {
				var surveyIds = [0];
				var surveyTexts = [];
				var surveyReminder = {
					surveyId : surveyIds,
					surveyText : surveyTexts,
					currentSurvey : 0
				};
			}
			Ti.App.Properties.setObject("surveyReminder", surveyReminder);
		}
		var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
	
		if (coginitionReminder == null || coginitionReminder == undefined) {
			var coginitionIds = [1];
			var coginitionTexts = ["Number Hunt"];
			var coginitionReminder = {
				coginitionId : coginitionIds,
				coginitionText : coginitionTexts,
				currentCoginition : 0
			};
			
			Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);
		}
		var settingsInfo = Ti.App.Properties.getObject("SettingsInfo");
		$.footerView.setSelectedLabel(2);
		$.home.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
		insertReminderToDB();
		var showPopUp = false;
		var MonthlyAlertTime = Ti.App.Properties.getString("monthlyPopUp", "");
		if (MonthlyAlertTime != "") {
			var curTime = new Date().toUTCString();
			var timeDiff = Math.abs(new Date(curTime).getTime() - new Date(MonthlyAlertTime).getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			if (diffDays >= 30) {
				showPopUp = true;
			}

		} else {
			showPopUp = true;
		}
		if (showPopUp == true) {
			
		}
		var proto = Ti.App.Properties.getString('isProtocolActivated');
		if (proto == 1 || proto == "1") {
			commonFunctions.protoTypeReminder();
		}
		if (Ti.Network.online) {
			var LastUpdatedDate = "";
			var credentials = Alloy.Globals.getCredentials();
			serviceManager.getSurveyList(credentials.userId, LastUpdatedDate, getSurveyListSuccess, getSurveyListFailure);
		}
		
		
	if (OS_ANDROID) {
		Ti.API.info('Log ONE******');
			var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions();
			if (hasLocationPermissions == false) {
				Ti.API.info('Log Two ******');
				Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
					if (e.success) {
						Ti.API.info('Log Three******');
						if (parseInt(Ti.Platform.version)>=6){
						        var permissionsToRequest = ["android.permission.WRITE_EXTERNAL_STORAGE"];
						        if (permissionsToRequest.length > 0) {
						            Ti.Android.requestPermissions(permissionsToRequest, function(e) {
						                if (e.success) {
						
						                } else {
						                  
						                }
						            });
						        }
						}

						Ti.App.fireEvent("getCurrentLocation");
					}
					else {
						if(parseInt(Ti.Platform.version)>=6){
							Ti.API.info('Log HREF******');
						    var permissionsToRequest = ["android.permission.WRITE_EXTERNAL_STORAGE"];
								
					        if (permissionsToRequest.length > 0) {
						
					            Ti.Android.requestPermissions(permissionsToRequest, function(e) {
					                if (e.success) {
					                  
					                } else {
					                    
					                }
					            });
					        }
					}

					}
				});
			} else {
				if(parseInt(Ti.Platform.version)>=6){
					Ti.API.info('Log ONE dfsdgsfdg******');
				        var permissionsToRequest = ["android.permission.WRITE_EXTERNAL_STORAGE"];
				
				        if (permissionsToRequest.length > 0) {
					
				            Ti.Android.requestPermissions(permissionsToRequest, function(e) {
				                if (e.success) {
				                  
				                } else {
				                   
				                }
				            });
				        }
				}

				Ti.App.fireEvent("getCurrentLocation");
			}

		}

		else {
			
			Ti.App.fireEvent("getCurrentLocation");
		}
		resetAllNotifications();
		Ti.App.fireEvent("updateHealthData");
		var sleepValue = Ti.App.Properties.getString('SleepValue');
		var stepValue = Ti.App.Properties.getString('StepValue');
		if(stepValue!="" && stepValue!=null){
			stepValue=stepValue.split(" ");
			$.stepValueLabel.text = stepValue[0];
		}else{
			$.stepValueLabel.text ='NA';
		}
		if(sleepValue!=null && sleepValue!=""){
			sleepValue=sleepValue.split(":");
			$.sleepValueLabel.text = sleepValue[0];
		}else{
			$.sleepValueLabel.text = 'NA';
		}
		
		
		var currentDay = new Date().getDate();
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	 	if(spinInfo.spinDate != currentDay){
	 		var dayDiff = parseInt(currentDay) - parseInt(spinInfo.spinDate);
	 		if(dayDiff > 1) {
	 			spinInfo.dayStreaks = 0;
	 		}
	 		spinInfo.noOFSpins = 0;
	 		Ti.App.Properties.setObject('spinnerInfo', spinInfo);
	 	}

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "open", ex);
	}
});

/**
 * api success of getsurvey
 */
function getSurveyListSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		
		var credentials = Alloy.Globals.getCredentials();
		if (response.ErrorCode == 0) {
			var resultArrayList = response.Survey;
			Ti.App.Properties.setString('surveyLastUpdatedDate', response.LastUpdatedDate);
			for (var i = 0; i < resultArrayList.length; i++) {
				var surveyID = resultArrayList[i].SurveyID;
				var surveyName = resultArrayList[i].SurveyName;
				var surveyInstruction = resultArrayList[i].Instruction;
				
				if (surveyName != null && surveyName != "") {
					commonDB.insertSurveyTypes(surveyID, surveyName, credentials.userId, resultArrayList[i].IsDeleted, surveyInstruction);
					commonDB.insertSurveyQuestions(resultArrayList[i].Questions, credentials.userId, surveyID,resultArrayList[i].LanguageCode);
				}

			};

			var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
			if (Ti.App.Properties.hasProperty("surveyReminder")) {

				var prfSurvey = Ti.App.Properties.getString("PrefferedSurveys", "");
				if (prfSurvey != "") {
					var preSurveyArray = prfSurvey.split(",");
					var preSurveyTextArray = [];
					var tempPrevSurveyId = [];
					for (var i = 0; i < preSurveyArray.length; i++) {
						if (preSurveyArray[i] != 0) {
							var tempText = commonDB.getSurveyName(preSurveyArray[i]);
							if (tempText != "") {
								tempPrevSurveyId.push(preSurveyArray[i]);
								preSurveyTextArray.push(tempText);
							}

						}
					};
					surveyReminder.surveyId = tempPrevSurveyId;
					surveyReminder.surveyText = preSurveyTextArray;
					surveyReminder.currentSurvey = 0;
					Ti.App.Properties.setObject("surveyReminder", surveyReminder);

				}

			}

		} else {
			commonFunctions.showAlert(response.ErrorMessage);
		}
		checkAdminNotification();
	}catch(ex) {
		commonFunctions.handleException("newHomeScreen", "getSurveyListSuccess", ex);
	}
}
/**
 * Failure api call
 */
function getSurveyListFailure(e) {

}
/**
 * Loading all remider alerts.
 */
function loadingAlerts(notificationArray) {
	try {
		notificationDataArray=[];
		if(notificationArray.length>=2){
			$.firstNotificationLbl.text= commonFunctions.trimText(notificationArray[0].testName,15);
			$.secondNotificationLbl.text=commonFunctions.trimText(notificationArray[1].testName,15);
			if(notificationArray[0].type=="survey"){
				var fileName = "S" + notificationArray[0].testID + ".png";
				var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
				
				if(file.exists() == true){
					$.firstNotIcon.image = Ti.Filesystem.applicationDataDirectory + fileName;
			}else{
				$.firstNotIcon.image="/images/gameIcons/surveyIcon.png";
			}
			
				
			}
			
			else if(notificationArray[0].type=="Batch"){
				$.firstNotIcon.image="/images/homeNotifications/no_image.png";
			}
			else{
				var fileName = "C" + notificationArray[0].TestID + ".png";
				var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
				if(file.exists() == true){
					$.firstNotIcon.image=Ti.Filesystem.applicationDataDirectory + fileName;
				}else{
					$.firstNotIcon.image="/images/gameIcons/" + "C" + notificationArray[0].testID + ".png";
				}
				
			}
 			 
			 if(notificationArray[1].type=="survey"){
			 	var fileName = "S" + notificationArray[1].testID + ".png";
				var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
				
				if(file.exists() == true){
					$.secondNotIcon.image=Ti.Filesystem.applicationDataDirectory + fileName;
				}
				else{
				$.secondNotIcon.image="/images/gameIcons/surveyIcon.png";
				}
				
			}else if(notificationArray[1].type=="Batch"){
				$.secondNotIcon.image="/images/homeNotifications/no_image.png";
			}else{
				var fileName = "C" + notificationArray[1].testID + ".png";
				var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
				if(file.exists() == true){
					$.secondNotIcon.image=Ti.Filesystem.applicationDataDirectory + fileName;
				}else{
					$.secondNotIcon.image="/images/gameIcons/" + "C" + notificationArray[1].testID + ".png";
				}
				
			}
	
			for (var i = 0; i < notificationArray.length; i++) {
			notificationDataArray.push({
					testID : notificationArray[i].testID,
					testName : notificationArray[i].testName,
					type : notificationArray[i].type,
					version : notificationArray[i].version,
					batchID:notificationArray[i].batchID,
					createdDate : notificationArray[i].createdDate,
					isLocal : notificationArray[i].isLocal,
					ID:notificationArray[i].ID
				});
			}
			
			$.notificationLeftMenu.visible=true;
			$.notificationRightMenu.visible=true;
			$.notificationMainMenu.visible=false;
			$.notificationTapDisable.height="0dp";
				$.notificationTapDisable.width="0dp";
				$.notificationTapDisable.visible=false;
			
		} else if(notificationArray.length==1){
			
			notificationDataArray.push({
					testID : notificationArray[0].testID,
					testName : notificationArray[0].testName,
					type : notificationArray[0].type,
					version : notificationArray[0].version,
					batchID:notificationArray[0].batchID,
					createdDate : notificationArray[0].createdDate,
					isLocal : notificationArray[0].isLocal,
					ID:notificationArray[0].ID
				});
				
				$.notificationMainMenu.visible=true;
				$.notificationMainMenu.touchEnabled=true;
				$.notificationTapDisable.height="0dp";
				$.notificationTapDisable.width="0dp";
				$.notificationTapDisable.visible=false;
				$.notificationRightMenu.visible=false;
				$.notificationLeftMenu.visible=false;
				$.mainNotificationLbl.text=commonFunctions.trimText(notificationArray[0].testName,15);
				
				if(notificationArray[0].type=="survey"){
					
					var fileName = "S" + notificationArray[0].testID + ".png";
					var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
					
					if(file.exists() == true){
						
						$.mainNotIcon.image=Ti.Filesystem.applicationDataDirectory + fileName;
					}else{
						
						$.mainNotIcon.image="/images/gameIcons/surveyIcon.png";
					}
				
				}else if(notificationArray[0].type=="Batch"){
					$.mainNotIcon.image="/images/homeNotifications/no_image.png";
				}
				else
				{
					var fileName = "C" + notificationArray[0].TestID + ".png";
					var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
					if(file.exists() == true){
						$.mainNotIcon.image=Ti.Filesystem.applicationDataDirectory + fileName;
					}else{
						$.mainNotIcon.image="/images/gameIcons/" + "C" + notificationArray[0].testID + ".png";
					}
				}
		}
		else
		{
			
				$.notificationMainMenu.visible=true;
				$.notificationRightMenu.visible=false;
				$.notificationLeftMenu.visible=false;
				$.notificationMainMenu.touchEnabled=false;
				$.notificationTapDisable.height="150dp";
				$.notificationTapDisable.width="150dp";
				$.notificationTapDisable.visible=true;
				$.mainNotIcon.image="/images/newHome/complete.png";
				$.mainNotificationLbl.text="Complete";
		}
		
		

		
	} catch(ex) {
		commonFunctions.handleException("home", "loadingAlerts", ex);
	}

}
/**
 * on notification click
 */
function onNotificationClick(e){
	try{
	
	if(notificationDataArray[e.source.index].type=== "survey"){	
		
		commonDB.updateAlerts(notificationDataArray[e.source.index].ID);
		var isGuest = Ti.App.Properties.getString("isGuest", "");
		if (isGuest == 1 || isGuest == "1") {
			Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
				'surveyID' : notificationDataArray[e.source.index].testID,
				'surveyName' : notificationDataArray[e.source.index].testName.toUpperCase(),
				'fromNotification' : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else {
			Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
				'surveyID' : notificationDataArray[e.source.index].testID,
				'surveyName' : notificationDataArray[e.source.index].testName.toUpperCase(),
				'fromNotification' : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});

		}
		}
		else if(notificationDataArray[e.source.index].type=== "Batch"){
			
		commonDB.updateBatchAlerts(notificationDataArray[e.source.index].testID);
		var surveyName="";
		var batchId=notificationDataArray[e.source.index].batchID;
		batchId=batchId.split(",");
		
		var surveyId = batchId[0].trim().split(" ");
		if (surveyId[0] == "S") {
			surveyName = commonDB.getSurveyName(surveyId[1]);
		}
		commonFunctions.navigateToWindow(batchId[0],notificationDataArray[e.source.index].version,surveyName,surveyId[1],notificationDataArray[e.source.index].testID,notificationDataArray[e.source.index].createdDate);
		Alloy.Globals.BATCH_ARRAY=batchId;
		
	
	}else {
		
		commonDB.updateAlerts(notificationDataArray[e.source.index].ID);
		
		 if (notificationDataArray[e.source.index].testID == 2) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB', {
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 3) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
				"isForward" : true,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 4) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
				"isForward" : false,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 5) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask', {
				"reminderVersion" : notificationDataArray[e.source.index].version,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 6) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen', {
				"reminderVersion" : notificationDataArray[e.source.index].version,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		}  else if (notificationDataArray[e.source.index].testID == 8) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen', {
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 9) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation', {
				"reminderVersion" : notificationDataArray[e.source.index].version,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 10) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
				"isForward" : true,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 11) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew', {
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
				
			});
		} else if (notificationDataArray[e.source.index].testID == 12) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder', {
				"reminderVersion" : notificationDataArray[e.source.index].version,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 13) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
				"isForward" : false,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		}  
		else if (notificationDataArray[e.source.index].testID == 15) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap', {
				"reminderVersion" : notificationDataArray[e.source.index].version,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 16) {
			
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew', {
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 17) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntro', {
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 18) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntroB', {
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 19 || notificationDataArray[e.source.index].testID == 1) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
				"Level" : 1,
				"isBatch" : false,
				"testID" : 1,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 20) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
				"Level" : 2,
				"reminderVersion" : notificationDataArray[e.source.index].version,
				"isBatch" : false,
				"testID" : 1,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 21) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
				"Level" : 3,
				"reminderVersion" : notificationDataArray[e.source.index].version,
				"isBatch" : false,
				"testID" : 1,
				"fromNotification" : true,
				"createdDate" :notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 22 || notificationDataArray[e.source.index].testID == 14) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
				"Level" : 1,
				"isBatch" : false,
				"testID" : 14,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 23) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
				"Level" : 2,
				"isBatch" : false,
				"testID" : 14,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		} else if (notificationDataArray[e.source.index].testID == 24) {
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
				"Level" : 3,
				"isBatch" : false,
				"testID" : 14,
				"fromNotification" : true,
				"createdDate" : notificationDataArray[e.source.index].createdDate,
				"isLocal" : notificationDataArray[e.source.index].isLocal
			});
		}
		
	}
		
		
	} catch(ex) {
		commonFunctions.handleException("home", "onNotificationClick", ex);
	}
}


/**
 * function to initialise db
 */
function initDB() {
	try {
		Alloy.createCollection("Settings");
		if (OS_IOS) {
			var db = Ti.Database.open(Alloy.Globals.DATABASE);
			db.remoteBackup = false;
			db.close();
		}

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "initDB", ex);
	}
}


/**
 * Delete Alert messages
 */
function deleteAlerts(e) {
	try {
		dismissItemIndex = -1;
		var Id;
		if (OS_IOS) {
			Id = e.source.ID;
		} else {
			var item = e.section.getItemAt(e.itemIndex);
			Id = item.dismissView.ID;
		}
		commonDB.deleteAlerts(Id);
		reminderAlerts();
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "deleteAlerts", ex);
	}

}

/**
 * Settings menu click
 */
function settingsClick(e) {
	try {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('settings');

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "settingsClick", ex);
	}
}


/**
 * function for android back
 */
$.home.addEventListener('android:back', function() {
	commonFunctions.showConfirmation(L('exitApp'), ['Yes', 'No'], function() {
		try {
			Ti.App.fireEvent("app:exitApp");

		} catch(e) {
			commonFunctions.handleException("newhomescreen", "android:back", e);
		}
	});
});


/**
 * Function to update theme in Home.
 */
$.updateTheme = function(e) {
	try {
		$.footerView.setSelectedLabel(2);
		$.home.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
		setLabel();
		reminderAlerts();

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "updateTheme", ex);
	}
};
/**
 * Funstion to Refresh in Home.
 */
$.refreshHomeScreen = function(e) {
	try {
		
		$.footerView.setSelectedLabel(2);
		var LangCode = Ti.App.Properties.getString('languageCode');
		$.home.backgroundImage = Alloy.Globals.BACKGROUND_IMAGE;
		
		setLabel();
		menueClicked = false;
		Ti.App.fireEvent("getCurrentLocation");
		Ti.App.fireEvent("updateHealthData");
		var sleepValue = Ti.App.Properties.getString('SleepValue');
		var stepValue = Ti.App.Properties.getString('StepValue');
		
		if(stepValue!="" && stepValue!=null){
			stepValue=stepValue.split(" ");
			$.stepValueLabel.text=stepValue[0];
		}else{
			$.stepValueLabel.text ='NA';
		}
		if(sleepValue!=null && sleepValue!=""){
			sleepValue=sleepValue.split(":");
			$.sleepValueLabel.text =sleepValue[0];
		}else{
			$.sleepValueLabel.text ='NA';
		}
		
		
		reminderAlerts();

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "refreshHomeScreen", ex);
	}
};
/**
 * Function to set label on language change
 */
function setLabel() {
		var LangCode = Ti.App.Properties.getString('languageCode');
		$.menuLbl.text=commonFunctions.L('checkinLbl', LangCode);
		$.cognitionLbl.text=commonFunctions.L('braingameLbl', LangCode);
}
$.refreshLabelsHomeScreen = function(e) {
	setLabel();
}
function insertReminderToDB() {
	var resumeDateTime = new Date();
	var pauseTime = Ti.App.Properties.getObject('pausedTime');
	var sendTimeList = Ti.App.Properties.getObject('sendTime');
	console.log("sendTimeList");
	console.log(sendTimeList);
	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h * 60 * 60 * 1000));
		return this;
	};

	if (pauseTime != null) {//&& openFromNotificationClick == false
		var credentials = Alloy.Globals.getCredentials();
		if (sendTimeList != null && sendTimeList.length > 0) {
			commonFunctions.getLastReminderTime();
			for (var i = 0; i < sendTimeList.length; i++) {
				var time = sendTimeList[i].sendDateTime;

				if (sendTimeList[i].index === 0) {

					if (sendTimeList[i].isAdmin == 1) {
						var reminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.hourlySurvey;
							} else {
								var lastReminderTime = reminderValues.hourlyCog;

							}
						}

					} else {
						var reminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.hourlySurvey;
							} else {
								var lastReminderTime = reminderValues.hourlyCog;

							}
						}
					}

					if (lastReminderTime == "") {
						var setTime = sendTimeList[i].sendDateTime;
					} else {
						var setTime = lastReminderTime;
					}

					var numdays = commonFunctions.getHoursNumber(pauseTime, resumeDateTime, setTime, 0, sendTimeList[i].type, sendTimeList[i].isAdmin);
					
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {

							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}

				} else if (sendTimeList[i].index === 1) {

					if (sendTimeList[i].isAdmin == 1) {
						var reminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.threeHourSurvey;
							} else {
								var lastReminderTime = reminderValues.threeHourCog;

							}
						}

					} else {
						var reminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
						console.log("lastLocalReminderTime");
						console.log(reminderValues);
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.threeHourSurvey;
							} else {
								var lastReminderTime = reminderValues.threeHourCog;

							}
						}
					}
					if (lastReminderTime == "") {
						var setTime = sendTimeList[i].sendDateTime;
					} else {
						var setTime = lastReminderTime;
					}

					console.log("setTime 3 hours : " + setTime);

					var numdays = commonFunctions.getHoursNumber(pauseTime, resumeDateTime, setTime, 1, sendTimeList[i].type, sendTimeList[i].isAdmin);

					
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}
					}
				} else if (sendTimeList[i].index === 2) {

					if (sendTimeList[i].isAdmin == 1) {
						var reminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.sixHourSurvey;
							} else {
								var lastReminderTime = reminderValues.sixHourCog;

							}
						}

					} else {
						var reminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.sixHourSurvey;
							} else {
								var lastReminderTime = reminderValues.sixHourCog;

							}
						}
					}
					if (lastReminderTime == "") {
						var setTime = sendTimeList[i].sendDateTime;
					} else {
						var setTime = lastReminderTime;
					}

					var numdays = commonFunctions.getHoursNumber(pauseTime, resumeDateTime, setTime, 2, sendTimeList[i].type, sendTimeList[i].isAdmin);

					
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}
					}
				} else if (sendTimeList[i].index === 3) {

					if (sendTimeList[i].isAdmin == 1) {
						var reminderValues = Ti.App.Properties.getObject('lastAdminReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.twelveHourSurvey;
							} else {
								var lastReminderTime = reminderValues.twelveHourCog;

							}
						}

					} else {
						var reminderValues = Ti.App.Properties.getObject('lastLocalReminderTime');
						if (reminderValues != null) {
							if (sendTimeList[i].type == "survey") {
								var lastReminderTime = reminderValues.twelveHourSurvey;
							} else {
								var lastReminderTime = reminderValues.twelveHourCog;

							}
						}
					}
					if (lastReminderTime == "") {
						var setTime = sendTimeList[i].sendDateTime;
					} else {
						var setTime = lastReminderTime;
					}

					var numdays = commonFunctions.getHoursNumber(pauseTime, resumeDateTime, setTime, 3, sendTimeList[i].type, sendTimeList[i].isAdmin);

					
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}
					}
				} else if (sendTimeList[i].index === 4) {

					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);
             
					var numdays = commonFunctions.getDailyDays(pauseTime, resumeDateTime, dayName, setTime);
					
				
					if (numdays > 0) {
						for (var j = 0; j < numdays; j++) {						
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}
					}
				} else if (sendTimeList[i].index === 5) {
					var setTime = sendTimeList[i].sendDateTime;
					
					var dayName = commonFunctions.getDayName(setTime);
					var biWeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					
					
					if (biWeekCount > 0) {
						for (var j = 0; j < biWeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 6) {
					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);
					var triWeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					
					if (triWeekCount > 0) {
						for (var j = 0; j < triWeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 7) {
					var setTime = sendTimeList[i].sendDateTime;
					
					var dayName = commonFunctions.getDayName(setTime);
					var WeekCount = commonFunctions.getWeekDays(pauseTime, resumeDateTime, dayName, setTime);
					
					if (WeekCount > 0) {
						for (var j = 0; j < WeekCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 8) {
					var setTime = sendTimeList[i].sendDateTime;
					var monthDayCount = commonFunctions.getMonthDays(pauseTime, resumeDateTime, setTime);
					
					if (monthDayCount > 0) {
						for (var j = 0; j < monthDayCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 9) {
					var setTime = sendTimeList[i].sendDateTime;
					
					var monthDayCount = commonFunctions.getMonthDaysNew(pauseTime, resumeDateTime, setTime);
					
					if (monthDayCount > 0) {
						for (var j = 0; j < monthDayCount; j++) {
							commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
						}

					}
				} else if (sendTimeList[i].index === 11) {

					var setTime = sendTimeList[i].sendDateTime;
					var dayName = commonFunctions.getDayName(setTime);

					var from = new Date(pauseTime);
					var to = new Date(resumeDateTime);
					var notTime = new Date(setTime);
					

					if (notTime > from && notTime < to)
						commonDB.insertAlerts(credentials.userId, sendTimeList[i].alertBody, sendTimeList[i].type, sendTimeList[i].version, sendTimeList[i].testId, sendTimeList[i].testName, sendTimeList[i].isAdmin,sendTimeList[i].batchID);
				}
			}
			commonFunctions.setLastReminderTime();
			reminderAlerts();

		}
	}
	var pausedDateTime = new Date();
	
	Ti.App.Properties.setObject('pausedTime', pausedDateTime);
}

/**
 * Function to list the value set in the properties.
 */
function reminderAlerts() {
	try {
		var arrayToList = commonDB.getNotificationAlerts();
		loadingAlerts(arrayToList);
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "reminderAlerts", ex);
	}
}

/**
 * Function to fire notification refresh
 */
Ti.App.addEventListener('notificationRefresh', onNotificationRefresh);
function onNotificationRefresh() {
	try {
		reminderAlerts();
	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "onNotificationRefresh", ex);
	}
}

if (!OS_IOS) {
	Ti.App.addEventListener('app:android_resume', onResume);
}
if (OS_IOS) {
	Ti.App.addEventListener('resumed', onResume);
} else {
	var activity = $.home.activity;
	activity.onRestart = function() {
		
		Ti.App.fireEvent("app:android_resume");
	};
	activity.onStop = function() {
		
		Ti.App.fireEvent("app:android_pause");
	};
	Ti.App.addEventListener('app:android_resume', onResume);
}
/**
 * Function to handle on resuming the app.
 */
function onResume() {
	try {
		if (Ti.Network.online) {
			serviceManager.getProtocolDate(onGetProtocolDateSuccess,onGetProtocolDateFailure);
		}
		Alloy.Globals.ISPAUSED = false;
		var credentials = Alloy.Globals.getCredentials();
		if (credentials.userId == null || credentials.userId == "" || credentials.userId == 0) {
			return;
		}
		var showPopUp = false;
		var MonthlyAlertTime = Ti.App.Properties.getString("monthlyPopUp", "");
		

		if (MonthlyAlertTime != "") {
			var curTime = new Date().toUTCString();
			var timeDiff = Math.abs(new Date(curTime).getTime() - new Date(MonthlyAlertTime).getTime());
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			if (diffDays >= 30) {
				showPopUp = true;
			}

		} else {
			showPopUp = true;
		}

		if (showPopUp == true) {
			
		}
		var proto=	Ti.App.Properties.getString('isProtocolActivated');
		if(proto==1 || proto=="1"){
			commonFunctions.protoTypeReminder();
		}
		if (OS_IOS)
			locationupdatemodule.stopUpdatingLocation();

		
		

		if (openFromNotificationClick == false) {
			insertReminderToDB();
		}

		var parentWindow = Alloy.Globals.NAVIGATION_CONTROLLER.getCurrentWindow();
		if (parentWindow.windowName == "healthDataScreen") {
			Ti.App.fireEvent("healthDataRefresh");
		} else if (parentWindow.windowName == "home") {
			Ti.App.fireEvent("notificationRefresh");
		} else if (parentWindow != null && parentWindow.windowName === "preventIntroScreen") {
			parentWindow.window.refreshPreventScreen();
		}

		
		openFromNotificationClick = false;
		checkAdminNotification();
		
		var currentDay = new Date().getDate();
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	 	if(spinInfo.spinDate != currentDay){
	 		var dayDiff = parseInt(currentDay) - parseInt(spinInfo.spinDate);
	 		if(dayDiff > 1) {
	 			spinInfo.dayStreaks = 0;
	 		}
	 		spinInfo.noOFSpins = 0;
	 		Ti.App.Properties.setObject('spinnerInfo', spinInfo);
	 	}

	} catch(ex) {
		commonFunctions.handleException("newHomeScreen", "onResume", ex);
	}
}
/**
 * Protocol date success
 */
function onGetProtocolDateSuccess(e) {
	try {
	
		var response = JSON.parse(e.data);
		
		var protoDate=new Date(response.ProtocolDate).toString();
		
		var previousValue=Ti.App.Properties.getString("initialTime");
		if(previousValue!=protoDate){
			Ti.App.Properties.setString("initialTime",protoDate);
		Ti.App.Properties.setString("memoryTime",protoDate);
		}
	} catch(ex) {
		commonFunctions.handleException("home", "getProtocolDate", ex);
	}
};
/**
 * Protocol date success error api call
 */
function onGetProtocolDateFailure(e) {
	
 };


function getSheduleSettingsSuccess(e) {
	try {

		var response = JSON.parse(e.data);

		if (response.ErrorCode == 0) {

			if (response.Data.SympSurveySlotTime != null) {
				var surveyTime = new Date(response.Data.SympSurveySlotTime).toString();

			}
			if (response.Data.CognTestSlotTime != null) {
				var cognitionTime = new Date(response.Data.CognTestSlotTime).toString();

			}

			var settingsData = {
				userId : response.Data.UserID,
				userSettingsId : response.Data.UserSettingID,
				sympSurveySlotID : response.Data.SympSurveySlotID,
				sympSurveySlotTime : surveyTime,
				sympSurveyRepeatID : response.Data.SympSurveyRepeatID,
				cognTestSlotID : response.Data.CognTestSlotID,
				cognTestSlotTime : cognitionTime,
				cognTestRepeatID : response.Data.CognTestRepeatID,

			};
			
			commonDB.updateShedules(settingsData);
			var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
			if (Ti.App.Properties.hasProperty("surveyReminder")) {
				var prfSurvey = response.Data.PrefferedSurveys;
				if (prfSurvey != "") {
					var preSurveyArray = prfSurvey.split(",");
					var preSurveyTextArray = [];

					var tempPrevSurveyId = [];
					for (var i = 0; i < preSurveyArray.length; i++) {
						if (preSurveyArray[i] != 0) {
							var tempText = commonDB.getSurveyName(preSurveyArray[i]);
							if (tempText != "") {
								tempPrevSurveyId.push(preSurveyArray[i]);
								preSurveyTextArray.push(tempText);
							}

						}
						

					};
					surveyReminder.surveyId = tempPrevSurveyId;
					surveyReminder.surveyText = preSurveyTextArray;
					surveyReminder.currentSurvey = 0;
					
					Ti.App.Properties.setObject("surveyReminder", surveyReminder);

				}

			}
			var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
			if (Ti.App.Properties.hasProperty("coginitionReminder")) {
				var prfCog = response.Data.PrefferedCognitions;
				if (prfCog != "") {
					var preCogArray = prfCog.split(",");
					var preCogTextArray = [];
					coginitionReminder.coginitionId = preCogArray;
					for (var i = 0; i < preCogArray.length; i++) {

						for (var j = 0; j < cognitionTestArray.length; j++) {
							if (cognitionTestArray[j].id == preCogArray[i]) {
								preCogTextArray.push(cognitionTestArray[j].name);
							}
						};

					};
					coginitionReminder.coginitionText = preCogTextArray;
					coginitionReminder.currentCoginition = 0;
					Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);

				}

			}
			if (OS_IOS) {
				Ti.App.iOS.cancelAllLocalNotifications();
				notify.cancelAllNotification();
			} else {
				
				Alloy.Globals.REQUEST_CODE_ARRAY = [];
				if (Ti.App.Properties.getObject('requestCode') != null) {
					cancelMultipleAlarm(Ti.App.Properties.getObject('requestCode'));
					Ti.App.Properties.setObject('requestCode', null);
					Alloy.Globals.REQUEST_CODE = 0;
				}
			}

			if (response.Data.SympSurveyRepeatID >= 0 && response.Data.PrefferedSurveys != "") {
				var formateTime = commonFunctions.getTwelveHrFormatTime(surveyTime);			
				
			}
			if (response.Data.CognTestRepeatID >= 0 && response.Data.PrefferedCognitions != "") {
				var formateTime = commonFunctions.getTwelveHrFormatTime(cognitionTime);
				

			}

		}

	} catch(ex) {
		commonFunctions.handleException("home", "getSheduleSettingsSuccess", ex);
	}

}

function cancelMultipleAlarm(requestcodeArray) {
	notificationManager.cancelAllAlarm();
	
}

function getSheduleSettingsFailure(e) {
	commonFunctions.closeActivityIndicator();

}
function sendLocalNotification(index, time, alertBody, type, seconds) {
	try {

		var repeatMode = "";
		var sendDateTime = "";
		var notificationArray = [];
		var userInfo = {
			"type" : type,
			"testId" : 0,
			"testName" : 0,
			"isAdmin" : 0
		};
		var timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(time);
		if (index === 0) {
			if (OS_IOS) {
				
				var userInfo1 = {
					'isTextMessage' : false,
					"type" : type,
					"testId" : 0,
					"testName" : 0,
					"isAdmin" : 0
				};
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				notify.sheduleNotification(60, alertBody, "default", userInfo1);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 1);
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, new Date(), seconds), 3600000, type, 0, 0, 0, 0);
			}
			setProperties(type, alertBody, new Date(), 0, 0, 0, 0, 0,0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 1) {
			var hoursArray = Alloy.Globals.threeHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setLocalNotifcationAlaram(timeForLocal, userInfo, index, hoursArray[i], alertBody, type, seconds, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds);
			}
		} else if (index === 2) {
			var hoursArray = Alloy.Globals.sixHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setLocalNotifcationAlaram(timeForLocal, userInfo, index, hoursArray[i], alertBody, type, seconds, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds);
			}
		} else if (index === 3) {
			var hoursArray = Alloy.Globals.tewelHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				timeForLocal = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setLocalNotifcationAlaram(timeForLocal, userInfo, index, hoursArray[i], alertBody, type, seconds, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds);
			}
		} else if (index === 4) {
			if (OS_IOS) {
				repeatMode = "daily";
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {

				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
				var currentDay=new Date();
				var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								
								currentDay.setDate(currentDay.getDate() + 1);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, currentDay, seconds);
								 setTime = commonFunctions.formatTimeForAndroidNot(time, currentDay, seconds);
							}
				

				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, currentDay, seconds),86400000, type, 0, 0, 0, 0);
			}
			setProperties(type, alertBody, sendDateTime, 4, 0, 0, 0, 0,0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 5) {
			var weekDay = commonFunctions.getDayName(new Date());
			
			var getFormattedDay = commonFunctions.getBiWeekDays(weekDay,new Date(), false);
			
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate =new Date(result[i]);
						if (OS_IOS) {
							repeatMode = "weekly";
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								notificationDate.setDate(notificationDate.getDate() + 7);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							}
							var setTime = commonFunctions.formatTimeForAndroidNot(time, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, notificationDate, seconds), 604800000, type, 0, 0, 0, 0);
						}
						setProperties(type, alertBody, sendDateTime, 5, 0, 0, 0, 0,0);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 6) {
			repeatMode = "weekly";
			var weekDay = commonFunctions.getDayName(new Date());
			
			var getFormattedDay = commonFunctions.getTriWeekDays(weekDay, new Date(), false);
			
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate =new Date(result[i]);						
						if (OS_IOS) {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								notificationDate.setDate(notificationDate.getDate() + 7);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							}
							var setTime = commonFunctions.formatTimeForAndroidNot(time, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, notificationDate, seconds), 604800000, type, 0, 0, 0, 0);
						}
						setProperties(type, alertBody, sendDateTime, 6, 0, 0, 0, 0,0);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 7) {
			if (OS_IOS) {
				repeatMode = "weekly";
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
				
				var currentDay=new Date();
				var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								
								currentDay.setDate(currentDay.getDate() + 7);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, currentDay, seconds);
								 setTime = commonFunctions.formatTimeForAndroidNot(time, currentDay, seconds);
							}
				
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, currentDay, seconds), 604800000, type, 0, 0, 0, 0);
			}
			setProperties(type, alertBody, sendDateTime, 7, 0, 0, 0, 0,0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 8) {
			repeatMode = "monthly";
			var monthDays = commonFunctions.getBiMonthDays(new Date(), false);
			
			var resultDays = monthDays.split('/');
			if (resultDays.length > 0) {
				for (var i = 0; i < resultDays.length; i++) {
					if (resultDays[i] != "") {
						var notificationDate = resultDays[i];
						if (OS_IOS) {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var setTime = commonFunctions.formatTimeForAndroidNot(time, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, notificationDate, seconds), 2592000000, type, 0, 0, 0, 0);
						}
					}
				}
				setProperties(type, alertBody, sendDateTime, 8, 0, 0, 0, 0,0);
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 9) {

			if (OS_IOS) {
				repeatMode = "monthly";
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
				var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
				var currentDay=new Date();
				var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								
								currentDay.setDate(currentDay.getDate() + 30);
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, currentDay, seconds);
								 setTime = commonFunctions.formatTimeForAndroidNot(time, currentDay, seconds);
							}
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, currentDay, seconds), 2592000000, type, 0, 0, 0, 0);
			}
			setProperties(type, alertBody, sendDateTime, 9, 0, 0, 0, 0,0);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		}
	} catch(ex) {
		commonFunctions.handleException("settings", "sendLocalNotification", ex);
	}
}

function setLocalNotifcationAlaram(timeForLocal, userInfo, index, time, alertBody, type, seconds, androidTimeIntervalInMilliSeconds) {

	if (OS_IOS) {
		var repeatMode = "daily";
		var sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
		
		notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
	} else {
		var sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), seconds);
		var setTime = commonFunctions.formatTimeForAndroidNot(time, new Date(), seconds);
		var curDayFormateTime = new Date(sendDateTime);
		var curTime = new Date();
		if (curDayFormateTime.getTime() < curTime.getTime()) {
			curDayFormateTime.setDate(curDayFormateTime.getDate() + 1);
			
			setTime = commonFunctions.formatTimeForAndroidNot(time, curDayFormateTime, seconds);
		}
		
		notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(time, curDayFormateTime, seconds), androidTimeIntervalInMilliSeconds, type, 0, 0, 0, 0);
	}
	setProperties(type, alertBody, sendDateTime, parseInt(4), 0, 0, 0, 0,0);
	Ti.App.Properties.setObject('sendTime', arrayItems);
}

function setAdminNotifications(index, time, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal,batchID) {
	try {
var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var repeatMode = "";
		var sendDateTime = "";
		var notificationArray = [];
		var userInfo = {
			"type" : type,
			"testId" : testId,
			"version" : version,
			"testId" : testId,
			"testName" : testName,
			"isAdmin" : 1,
			"repeatID" : index,
			"batchID":batchID
		};

		if (index === 0) {
			if (OS_IOS) {
				
				var userInfo1 = {
					'isTextMessage' : false,
					"type" : type,
					"testId" : testId,
					"version" : version,
					"testId" : testId,
					"testName" : testName,
					"isAdmin" : 1,
					"batchID":batchID
				};
				sendDateTime = time;

				notify.sheduleNotification(60, alertBody, "default", userInfo1);
			} else {
				sendDateTime = time;
				var setTime = commonFunctions.formatTimeForAndroidHours(new Date(), seconds, 1);
				notificationManager.scheduleAndroidNotification(alertBody, setTime, 3600000, type, version, testId, testName, 1);
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
			setProperties(type, alertBody, new Date(), 0, version, testId, testName, 1,batchID);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 1) {
			var hoursArray = Alloy.Globals.threeHoursRepeatTimeArray;
			
			for (var i = 0; i < hoursArray.length; i++) {
				var timeForServer = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				
				setServerNotificationAlaram(userInfo, index, timeForServer, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.threeHoursIntervalInMilliSeconds,batchID);
			
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 5;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		} else if (index === 2) {
			var hoursArray = Alloy.Globals.sixHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				var timeForServer = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setServerNotificationAlaram(userInfo, index, timeForServer, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.sixHoursIntervalInMilliSeconds,batchID);
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 3;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		} else if (index === 3) {
			var hoursArray = Alloy.Globals.tewelHoursRepeatTimeArray;
			for (var i = 0; i < hoursArray.length; i++) {
				var timeForServer = commonFunctions.ConvertTwentyFourHourForLocal(hoursArray[i]);
				setServerNotificationAlaram(userInfo, index, timeForServer, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.tewelHoursIntervalInMilliSeconds,batchID);
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 2;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
		} else if (index === 4) {
			if (OS_IOS) {
				repeatMode = "daily";
				sendDateTime = time;
				
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var curDayTime = curDayFormateTime.getTime();
				if (remindtime < curTime) {
					if (curDayTime < curTime) {
						curDayFormateTime.setDate(curDayFormateTime.getDate() + 1);
					}
					sendDateTime = curDayFormateTime;
				}
			
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = time;
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var curDayTime = curDayFormateTime.getTime();
			
				if (remindtime < curTime) {
					if (curDayTime < curTime) {
						curDayFormateTime.setDate(curDayFormateTime.getDate() + 1);
						
					}
					sendDateTime = curDayFormateTime;
				}
				var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, sendDateTime, seconds);
				
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, sendDateTime, seconds), 86400000, type, version, testId, testName, 1);
			}
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
			setProperties(type, alertBody, sendDateTime, 4, version, testId, testName, 1,batchID);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 5) {
			sendDateTime = time;
			
			var weekDay = commonFunctions.getDayName(sendDateTime);
			
			var getFormattedDay = commonFunctions.getBiWeekDays(weekDay,sendDateTime, true);
			
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate =new Date(result[i]);
						if (OS_IOS) {
							repeatMode = "weekly";
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							

							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							if(tempDateTime<tempCurrentDateTime){
								var diffrence=tempCurrentDateTime-tempDateTime;
								var differnceDays=parseInt(Math.floor(diffrence/(1000*60*60*24)));
								var noOfDays=parseInt((differnceDays/7)+1);
								
								var differenceMilisecnds=7*noOfDays*24*60*60*1000;
								notificationDate.setTime(notificationDate.getTime() + differenceMilisecnds);
								
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
								
							}
							var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, notificationDate, seconds), 604800000, type, version, testId, testName, 1);
						}

						setProperties(type, alertBody, sendDateTime, 5, version, testId, testName, 1,batchID);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 6) {
			sendDateTime = time;
			repeatMode = "weekly";
			var weekDay = commonFunctions.getDayName(sendDateTime);
			
			var getFormattedDay = commonFunctions.getTriWeekDays(weekDay,sendDateTime,true);
			
			var result = getFormattedDay.split('/');
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if (result[i] != "") {
						var notificationDate =new Date(result[i]);
						if (OS_IOS) {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							
							
							if(tempDateTime<tempCurrentDateTime){
								var diffrence=tempCurrentDateTime-tempDateTime;
								var differnceDays=parseInt(Math.floor(diffrence/(1000*60*60*24)));
								var noOfDays=parseInt((differnceDays/7)+1);
								var differenceMilisecnds=7*noOfDays*24*60*60*1000;
								notificationDate.setTime(notificationDate.getTime() + differenceMilisecnds);
								
								sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
								
							}
							
							var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, notificationDate, seconds),604800000, type, version, testId, testName, 1);
						}
						setProperties(type, alertBody, sendDateTime, 6, version, testId, testName, 1,batchID);
					}
				}
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 7) {
			if (OS_IOS) {
				repeatMode = "weekly";
				sendDateTime = time;

				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var weekDay = commonFunctions.getDayName(sendDateTime);
				var currentDayLabel = commonFunctions.getDayName(new Date());
				if(weekDay == currentDayLabel){
					spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
				}
				var curDayTime = curDayFormateTime.getTime();
				
				if (remindtime < curTime) {

					while (remindtime < curTime) {
						sendDateTime.setDate(sendDateTime.getDate() + 7);
						curTime = new Date().getTime();
						remindtime = sendDateTime.getTime();
					}

				}
				
				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = time;
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var curDayTime = curDayFormateTime.getTime();
				var weekDay = commonFunctions.getDayName(sendDateTime);
				var currentDayLabel = commonFunctions.getDayName(new Date());
				if(weekDay == currentDayLabel){
					spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
			Ti.App.Properties.setObject('spinnerInfo', spinInfo);
				}
				
				if (remindtime < curTime) {

					while (remindtime < curTime) {
						sendDateTime.setDate(sendDateTime.getDate() + 7);
						curTime = new Date().getTime();
						remindtime = sendDateTime.getTime();
					
					}

				}
				
				var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, sendDateTime, seconds);
				notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, sendDateTime, seconds), 604800000, type, version, testId, testName, 1);
			}
			setProperties(type, alertBody, sendDateTime, 7, version, testId, testName, 1,batchID);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 8) {
			sendDateTime = time;
			repeatMode = "monthly";
			var monthDays = commonFunctions.getBiMonthDays(sendDateTime, true);
			
			var resultDays = monthDays.split('/');
			if (resultDays.length > 0) {
				for (var i = 0; i < resultDays.length; i++) {
					if (resultDays[i] != "") {
						var notificationDate = resultDays[i];
						if (OS_IOS) {
							
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
						} else {
							
							sendDateTime = commonFunctions.formatTimeToDate(timeForLocal, notificationDate, seconds);
							var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, notificationDate, seconds);
							notificationManager.scheduleAndroidNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, notificationDate, seconds), 2592000000, type, version, testId, testName, 1);
						}
					}
				}
				setProperties(type, alertBody, sendDateTime, 8, version, testId, testName, 1,batchID);
				Ti.App.Properties.setObject('sendTime', arrayItems);
			}
		} else if (index === 9) {

			if (OS_IOS) {
				repeatMode = "monthly";
				sendDateTime = time;
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var sendDate = sendDateTime.getDate();
				var currentDate = new Date().getDate();
				if(sendDate == currentDate){
					spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
					Ti.App.Properties.setObject('spinnerInfo', spinInfo);
				}
		
				if (remindtime < curTime) {

					while (remindtime < curTime) {
						sendDateTime.setDate(sendDateTime.getDate() + 30);
						curTime = new Date().getTime();
						remindtime = sendDateTime.getTime();

					}

				}

				notificationManager.setNotification(alertBody, userInfo, sendDateTime, repeatMode);
			} else {
				sendDateTime = time;
				var curTime = new Date().getTime();
				var remindtime = sendDateTime.getTime();
				var sendDate = sendDateTime.getDate();
				var currentDate = new Date().getDate();
				if(sendDate == currentDate){
					spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
					Ti.App.Properties.setObject('spinnerInfo', spinInfo);
				}
				
				
				if (remindtime < curTime) {

					while (remindtime < curTime) {
						sendDateTime.setDate(sendDateTime.getDate() + 30);
						curTime = new Date().getTime();
						remindtime = sendDateTime.getTime();
						
					}

				}
				var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, sendDateTime, seconds);
				notificationManager.formatTimeForAndroidNotNewChanged(alertBody, commonFunctions.formatTimeForAndroidNotForNewModule(timeForLocal, sendDateTime, seconds), 2592000000, type, version, testId, testName, 1);
			}
			setProperties(type, alertBody, sendDateTime, 9, version, testId, testName, 1,batchID);
			Ti.App.Properties.setObject('sendTime', arrayItems);
		} else if (index === 10) {
			spinInfo.lampRecords = parseInt(spinInfo.lampRecords) + 1;
					Ti.App.Properties.setObject('spinnerInfo', spinInfo);
			setServerNotificationAlaram(userInfo, index, time, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds,batchID);
		} else if (index === 11) {
			setServerNotificationAlaram(userInfo, index, time, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, Alloy.Globals.twentyFourHoursIntervalInMilliSeconds,batchID);
		}
	} catch(ex) {
		commonFunctions.handleException("home", "setAdminNotifications", ex);
	}
}

function setServerNotificationAlaram(userInfo, index, time, alertBody, type, seconds, testId, version, curDayFormateTime, testName, timeForLocal, androidTimeIntervalInMilliSeconds,batchID) {
	var sendDateTime = time;
	
	var curTime = new Date().getTime();
	var remindtime = sendDateTime.getTime();
	var curDayTime = curDayFormateTime.getTime();
	

	if (OS_IOS) {
		if (index === 11) {
			notificationManager.setOneTimeNotification(alertBody, userInfo, sendDateTime);
		}

	} else {

		var setTime = commonFunctions.formatTimeForAndroidNotNew(timeForLocal, sendDateTime, seconds);
							var tempDateTime=new Date(sendDateTime).getTime();
							var tempCurrentDateTime=new Date().getTime();
							
							if(tempDateTime<tempCurrentDateTime){
								return;
							
							}
		if (index === 11)
			notificationManager.scheduleAndroidOneTimeNotification(alertBody, commonFunctions.formatTimeForAndroidNotNewChanged(timeForLocal, sendDateTime, seconds), androidTimeIntervalInMilliSeconds, type, version, testId, testName, 1);

	}
	setProperties(type, alertBody, sendDateTime, parseInt(index), version, testId, testName, 1,batchID);
	Ti.App.Properties.setObject('sendTime', arrayItems);
}

function setProperties(type, alertBody, sendDateTime, index, version, testId, testName, isAdmin,batchID) {
	try {
		var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
		var Items = {
			type : type,
			alertBody : alertBody,
			sendDateTime : sendDateTime,
			index : index,
			version : version,
			testId : testId,
			testName : testName,
			isAdmin : isAdmin,
			batchID:batchID
		};
		
		var myDate = new Date(Items.sendDateTime).getDate();
		var curDate=new Date().getDate();
		
		arrayItems.push(Items);
		
	} catch(ex) {
		commonFunctions.handleException("settings", "setProperties", ex);
	}
}

if (OS_IOS) {
Ti.App.iOS.addEventListener('localnotificationaction', function(e) {
		try {
			openFromNotificationClick = true;
			if (!Alloy.Globals.ISPAUSED) {
				
				var credentials = Alloy.Globals.getCredentials();

insertReminderToDB();
				if (e.userInfo.repeatID == 11)
					openFromNotificationClick = false;

				reminderAlerts();
				Ti.App.fireEvent("notificationRefresh");
			} else {
				
				var currentTime = new Date(e.date);
				
		var hours = currentTime.getHours();
		var minutes = currentTime.getMinutes();
		var seconds = currentTime.getSeconds();
		var milliSeconds = currentTime.getMilliseconds();
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();

		if (month.toString().length == 1) {
			month = "0" + month;
		}
		if (day.toString().length == 1) {
			day = "0" + day;
		}
		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		milliSeconds = milliSeconds < 10 ? '0' + milliSeconds : milliSeconds;
		var formatedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + ":" + milliSeconds;	
				var testID = 0;
				var testName = "";
				insertReminderToDB();
var isLocal = 1;
				if (e.userInfo.type === "survey") {

					if (e.userInfo.isAdmin == 1) {
isLocal = 0;
						testID = e.userInfo.testId;
						testName = e.userInfo.testName;
					} else {
						var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
						if (Ti.App.Properties.hasProperty("surveyReminder")) {
							var arrSurveyIDs = surveyReminder.surveyId;
							
							var arrSurveyTexts = surveyReminder.surveyText;
							if (arrSurveyIDs.length != 0) {
								if (arrSurveyIDs.length == 1) {
									testID = arrSurveyIDs[0];
									surveyReminder.currentSurvey = 0;
									testName = arrSurveyTexts[0];
								} else {
									if (surveyReminder.currentSurvey + 1 == arrSurveyIDs.length) {
										testID = arrSurveyIDs[0];
										surveyReminder.currentSurvey = 0;
										testName = arrSurveyTexts[0];
									} else {

										testID = arrSurveyIDs[surveyReminder.currentSurvey];
										testName = arrSurveyTexts[surveyReminder.currentSurvey];
										surveyReminder.currentSurvey = surveyReminder.currentSurvey + 1;
									}

								}
								Ti.App.Properties.setObject("surveyReminder", surveyReminder);
							}
						}
					}
					if (OS_IOS) {
						commonDB.updateAlerts(testID);
					}

					
					Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
						'surveyID' : testID,
						'surveyName' : testName,
						'fromNotification' : true,
			
				"createdDate" : formatedDate,
				"isLocal" : isLocal
					});
					
				}
				else if(e.userInfo.type === "Batch"){
					var surveyName = "";
		var batchId=e.userInfo.batchID;
		batchId=batchId.split(",");
		var surveyId = batchId[0].trim().split(" ");
		
		if (surveyId[0] == "S") {
			surveyName = commonDB.getSurveyName(surveyId[1]);
		}
		
		if (OS_IOS) {
						commonDB.updateBatchAlerts(e.userInfo.testId);
					}
		commonFunctions.navigateToWindow(batchId[0],e.userInfo.version,surveyName,surveyId[1],e.userInfo.testId, formatedDate );
		Alloy.Globals.BATCH_ARRAY=batchId;
		
		
	}
				 else {
				 	var isLocal = 1;
					
					if (e.userInfo.isAdmin == 1) {
						isLocal = 0;
						testID = e.userInfo.testId;
						testName = e.userInfo.testName;
					} else {
						var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
						if (Ti.App.Properties.hasProperty("coginitionReminder")) {
							var arrCogIDs = coginitionReminder.coginitionId;
							var arrCogTexts = coginitionReminder.coginitionText;
							if (arrCogIDs.length != 0) {
								if (arrCogIDs.length == 1) {
									testID = arrCogIDs[0];
									coginitionReminder.currentCoginition = 0;
									testName = arrCogTexts[0];
								} else {
									if (coginitionReminder.currentCoginition + 1 == arrCogIDs.length) {
										testID = arrCogIDs[0];
										coginitionReminder.currentCoginition = 0;
										testName = arrCogTexts[0];
									} else {

										testID = arrCogIDs[coginitionReminder.currentCoginition];
										testName = arrCogTexts[coginitionReminder.currentCoginition];
										coginitionReminder.currentCoginition = coginitionReminder.currentCoginition + 1;
									}

								}
								Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);
							}
						}
					}
					if (OS_IOS) {
						commonDB.updateAlerts(testID);
					}

					if (testID == 1) {
						
					} else if (testID == 2) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 3) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
							"isForward" : true,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 4) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
							"isForward" : false,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 5) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 6) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 7) {
						
					} else if (testID == 8) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 9) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 10) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
							"isForward" : true,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
						
					} else if (testID == 13) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
							"isForward" : false,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
						
					} else if (testID == 11) {
						
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 12) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} /*else if (testID == 14) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					}*/ else if (testID == 15) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 16) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew',{
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});				
					} else if (testID == 17) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntro', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 18) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntroB', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 19) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
								"Level" : 1,
								"isBatch" : false,
								"testID" : 1,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 20) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
								"Level" : 2,
								"isBatch" : false,
								"testID" : 1,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 21) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
								"Level" : 3,
								"isBatch" : false,
								"testID" : 1,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 22) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
								"Level" : 1,
								"isBatch" : false,
								"testID" : 14,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 23) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
								"Level" : 2,
								"isBatch" : false,
								"testID" : 14,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 24) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
								"Level" : 3,
								"isBatch" : false,
								"testID" : 14,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						}

				}

			}
		} catch(ex) {
			commonFunctions.handleException("newHomeScreen", "notification", ex);
		}	
  });
}

if (OS_IOS) {
	/**
	 * Listener for handling the incoming local notification when app is in foreground.
	 */
	Ti.App.iOS.addEventListener('notification', function(e) {
		try {
			openFromNotificationClick = true;

			if (!Alloy.Globals.ISPAUSED) {
				
				var credentials = Alloy.Globals.getCredentials();

				
insertReminderToDB();
				if (e.userInfo.repeatID == 11)
					openFromNotificationClick = false;

				reminderAlerts();
				Ti.App.fireEvent("notificationRefresh");
			} else {
				
				var currentTime = new Date(e.date);
				
		var hours = currentTime.getHours();
		var minutes = currentTime.getMinutes();
		var seconds = currentTime.getSeconds();
		var milliSeconds = currentTime.getMilliseconds();
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();

		if (month.toString().length == 1) {
			month = "0" + month;
		}
		if (day.toString().length == 1) {
			day = "0" + day;
		}
		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		milliSeconds = milliSeconds < 10 ? '0' + milliSeconds : milliSeconds;
		var formatedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + ":" + milliSeconds;
				
				var testID = 0;
				var testName = "";
				insertReminderToDB();
var isLocal = 1;
				if (e.userInfo.type === "survey") {

					if (e.userInfo.isAdmin == 1) {
isLocal = 0;
						testID = e.userInfo.testId;
						testName = e.userInfo.testName;
					} else {
						var surveyReminder = Ti.App.Properties.getObject("surveyReminder");
						if (Ti.App.Properties.hasProperty("surveyReminder")) {
							var arrSurveyIDs = surveyReminder.surveyId;
							
							var arrSurveyTexts = surveyReminder.surveyText;
							if (arrSurveyIDs.length != 0) {
								if (arrSurveyIDs.length == 1) {
									testID = arrSurveyIDs[0];
									surveyReminder.currentSurvey = 0;
									testName = arrSurveyTexts[0];
								} else {
									if (surveyReminder.currentSurvey + 1 == arrSurveyIDs.length) {
										testID = arrSurveyIDs[0];
										surveyReminder.currentSurvey = 0;
										testName = arrSurveyTexts[0];
									} else {

										testID = arrSurveyIDs[surveyReminder.currentSurvey];
										testName = arrSurveyTexts[surveyReminder.currentSurvey];
										surveyReminder.currentSurvey = surveyReminder.currentSurvey + 1;
									}

								}
								Ti.App.Properties.setObject("surveyReminder", surveyReminder);
							}
						}
					}
					if (OS_IOS) {
						commonDB.updateAlerts(testID);
					}

					
					Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
						'surveyID' : testID,
						'surveyName' : testName,
						'fromNotification' : true,
			
				"createdDate" : formatedDate,
				"isLocal" : isLocal
					});
					
				}
				else if(e.userInfo.type === "Batch"){
					var surveyName = "";
		var batchId=e.userInfo.batchID;
		batchId=batchId.split(",");
		
		var surveyId = batchId[0].trim().split(" ");
		
		if (surveyId[0] == "S") {
			surveyName = commonDB.getSurveyName(surveyId[1]);
		}
		
		if (OS_IOS) {
						commonDB.updateBatchAlerts(e.userInfo.testId);
					}
		commonFunctions.navigateToWindow(batchId[0],e.userInfo.version,surveyName,surveyId[1],e.userInfo.testId, formatedDate );
		Alloy.Globals.BATCH_ARRAY=batchId;
		
		
	}
				 else {
				 	var isLocal = 1;
					
					if (e.userInfo.isAdmin == 1) {
						isLocal = 0;
						testID = e.userInfo.testId;
						testName = e.userInfo.testName;
					} else {
						var coginitionReminder = Ti.App.Properties.getObject("coginitionReminder");
						if (Ti.App.Properties.hasProperty("coginitionReminder")) {
							var arrCogIDs = coginitionReminder.coginitionId;
							var arrCogTexts = coginitionReminder.coginitionText;
							if (arrCogIDs.length != 0) {
								if (arrCogIDs.length == 1) {
									testID = arrCogIDs[0];
									coginitionReminder.currentCoginition = 0;
									testName = arrCogTexts[0];
								} else {
									if (coginitionReminder.currentCoginition + 1 == arrCogIDs.length) {
										testID = arrCogIDs[0];
										coginitionReminder.currentCoginition = 0;
										testName = arrCogTexts[0];
									} else {

										testID = arrCogIDs[coginitionReminder.currentCoginition];
										testName = arrCogTexts[coginitionReminder.currentCoginition];
										coginitionReminder.currentCoginition = coginitionReminder.currentCoginition + 1;
									}

								}
								Ti.App.Properties.setObject("coginitionReminder", coginitionReminder);
							}
						}
					}
					if (OS_IOS) {
						commonDB.updateAlerts(testID);
					}

					
					if (testID == 1) {
						
					} else if (testID == 2) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 3) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
							"isForward" : true,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 4) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
							"isForward" : false,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 5) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 6) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 7) {
						
					} else if (testID == 8) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 9) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 10) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
							"isForward" : true,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
						
					} else if (testID == 13) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
							"isForward" : false,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
						
					} else if (testID == 11) {
						
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 12) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} /*else if (testID == 14) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					}*/ else if (testID == 15) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap', {
							"reminderVersion" : e.userInfo.version,
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 16) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew',{
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});				
					} else if (testID == 17) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntro', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 18) {
						Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsIntroB', {
							'fromNotification' : true,
							"createdDate" : formatedDate,
							"isLocal" : isLocal
						});
					} else if (testID == 19) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
								"Level" : 1,
								"isBatch" : false,
								"testID" : 1,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 20) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
								"Level" : 2,
								"isBatch" : false,
								"testID" : 1,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 21) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTest', {
								"Level" : 3,
								"isBatch" : false,
								"testID" : 1,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 22) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
								"Level" : 1,
								"isBatch" : false,
								"testID" : 14,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 23) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
								"Level" : 2,
								"isBatch" : false,
								"testID" : 14,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						} else if (testID == 24) {
							Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackTestNew', {
								"Level" : 3,
								"isBatch" : false,
								"testID" : 14,
								"fromNotification" : true,
								"createdDate" : formatedDate,
								"isLocal" : isLocal
							});
						}

				}

			}
		} catch(ex) {
			commonFunctions.handleException("newHomeScreen", "notification", ex);
		}
	});
}

/**
 * function for handling session expire
 */

Ti.App.addEventListener('sessionTokenExpired', onSessionExpire);
Ti.App.addEventListener('notificationHomeRefresh', notificationHomeRefresh);

function onSessionExpire() {
	try {
		
		commonFunctions.closeActivityIndicator();
		Alloy.Globals.logout();
		Alloy.Globals.HEADER_COLOR = "#359ffe";
		Alloy.Globals.BACKGROUND_IMAGE = "/images/common/blue-bg.png";
		Alloy.Globals.SYMPTOM_ACTIVE = "/images/surveys/icn-symptom-survey-active.png";
		Alloy.Globals.COGINITION_ACTIVE = "/images/surveys/icn-cognition-test-active.png";
		Alloy.Globals.ENVIRONMENT_ACTIVE = "/images/surveys/icn-environment-active.png";
		Alloy.Globals.HELP_ACTIVE = "/images/surveys/icn-help-active.png";
		Ti.App.Properties.setObject("SettingsInfo", null);
		Ti.App.Properties.setObject("SESSION_TOKEN", null);
		Alloy.Globals.removeCredentials();
		Ti.App.Properties.setObject("coginitionReminder", null);
		Ti.App.Properties.setObject("surveyReminder", null);
		Alloy.Globals.NAVIGATION_CONTROLLER.closeAllWindows();
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('signin');
		Alloy.Globals.NAVIGATION_CONTROLLER.closeWindow('home');
		if (OS_IOS) {
			Ti.App.iOS.cancelAllLocalNotifications();
			notify.cancelAllNotification();
		} else {
			Alloy.Globals.REQUEST_CODE_ARRAY = [];
			if (Ti.App.Properties.getObject('requestCode') != null) {
				cancelMultipleAlarm(Ti.App.Properties.getObject('requestCode'));
				Ti.App.Properties.setObject('requestCode', null);
			}
		}
		Ti.App.Properties.setObject('sendTime', null);
		
	} catch(ex) {
		commonFunctions.handleException("newhomescreen", "onSessionExpire", ex);
	}
}

/**
 * Function to refresh the alert wheen tapping on Home button in home page.
 */
function notificationHomeRefresh() {
	try {
		reminderAlerts();
	} catch(ex) {
		commonFunctions.handleException("newhomescreen", "notificationHomeRefresh", ex);
	}
}
$.footerView.on('clickLearn', function(e) {

	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('homeStaticPages');

});

$.footerView.on('clickAssess', function(e) {

	return;

});

$.footerView.on('clickManage', function(e) {
	if (OS_IOS) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
	} else {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchTestScreen');
		setTimeout(function() {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('scratchImageScreen');
		}, 5);
	}
});

$.footerView.on('clickPrevent', function(e) {

	
	Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('preventIntroScreen');

});

function touchSt(e) {

	var item = $.notificationList.sections[0].getItemAt(e.itemIndex);
	if (item != null && item.listOuterView.right == '0dp') {

		if (item != null && item.listOuterView.left != "-100dp") {
			if (dismissItemIndex != e.itemIndex && dismissItemIndex != -1) {
				var item1 = $.notificationList.sections[0].getItemAt(dismissItemIndex);
				item1.listOuterView.left = '0dp';
				item1.listOuterView.right = '0dp';
				item1.dismissView.visible = false;
				$.notificationList.sections[0].updateItemAt(dismissItemIndex, item1);
				dismissItemIndex = -1;
			}
			item.listOuterView.left = '-80dp';
			item.listOuterView.right = '80dp';
			item.dismissView.visible = true;
			$.notificationList.sections[0].updateItemAt(e.itemIndex, item);
			dismissItemIndex = e.itemIndex;
		}
	} else if (item != null && item.listOuterView.right == '80dp') {
		var item = $.notificationList.sections[0].getItemAt(e.itemIndex);
		if (item != null) {
			if (dismissItemIndex != -1 && dismissItemIndex == e.itemIndex) {
				item.listOuterView.left = '0dp';
				item.listOuterView.right = '0dp';
				item.dismissView.visible = false;
				$.notificationList.sections[0].updateItemAt(e.itemIndex, item);
				dismissItemIndex = -1;
			}

		}
	}

}

function checkUpdate() {
	var credentials = Alloy.Globals.getCredentials();
	serviceManager.getStatus(credentials.userId, getStatusSuccess, getStatusFailure);
}
function getStatusSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		

		if (response.ErrorCode == 0) {
			Ti.App.Properties.setString('BlogsUpdate', response.BlogsUpdate);
			Ti.App.Properties.setString('TipsUpdate', response.TipsUpdate);
			var BlogsUpdate = Ti.App.Properties.getString("BlogsUpdate", "");
			var TipsUpdate = Ti.App.Properties.getString("TipsUpdate", "");
			if (BlogsUpdate == true || BlogsUpdate == "true" || TipsUpdate == true || TipsUpdate == "true") {
				$.footerView.setInfoIndicatorON();
			} else {
				$.footerView.setInfoIndicatorOFF();
			}

		}

	} catch(ex) {
		commonFunctions.handleException("home", "getStatusSuccess", ex);
	}
}

function getStatusFailure(e) {
	
}
function checkAdminNotification() {
	
	var credentials = Alloy.Globals.getCredentials();

	if (Ti.App.Properties.hasProperty("appVersion")) {
		if (Ti.App.Properties.getString("appVersion") != Titanium.App.version) {
			Ti.App.Properties.setString('appVersion', Titanium.App.version);
			reSettingObjects();
		}
	} else {
		Ti.App.Properties.setString('appVersion', Titanium.App.version);
		reSettingObjects();
	}
	if (Ti.App.Properties.hasProperty("lastSyncDate") == true) {
		var lastSyncDate = Ti.App.Properties.getObject('lastSyncDate');
		var lastUpdateSurveyDate = lastSyncDate.LastUpdatedSurveyDate;
		var lastUpdateGameDate = lastSyncDate.LastUpdatedGameDate;

	} else {
		var lastSyncDate = {
			LastUpdatedSurveyDate : "",
			LastUpdatedGameDate : "",
		};
		Ti.App.Properties.setObject('lastSyncDate', lastSyncDate);
		var lastUpdateSurveyDate = "";
		var lastUpdateGameDate = "";
	}

	serviceManager.getSurveyAndGameShedule(credentials.userId, lastUpdateGameDate, lastUpdateSurveyDate, SurveyAndGameSheduleSuccess, SurveyAndGameSheduleFailure);

}

function reSettingObjects() {
	if (Ti.App.Properties.hasProperty("lastSyncDate"))
		Ti.App.Properties.removeProperty("lastSyncDate");

	var versionInfo = Ti.App.Properties.getObject('GameVersionNumber');
	if (versionInfo.Jewel == null) {
		var versionsInfo1 = {
			SimpleMemory : versionInfo.SimpleMemory,
			TemporalOrder : versionInfo.TemporalOrder,
			VisualAssociation : versionInfo.VisualAssociation,
			Serial7s : versionInfo.Serial7s,
			nBack : versionInfo.nBack,
			Jewel : 1
		};
		Ti.App.Properties.setObject('GameVersionNumber', versionsInfo1);
	}
	var credentials = Alloy.Globals.getCredentials();
	var jewelInfo = Ti.App.Properties.getObject(credentials.userId.toString());
	if (jewelInfo.jewelsTrailACurrentLevel == null) {
		var jewelInfo1 = {
			totalgamesTrailsA : jewelInfo.totalgamesTrailsA,
			totalgamesTrailsB : jewelInfo.totalgamesTrailsB,
			jewelsTrailACurrentLevel : 1,
			jewelsTrailBCurrentLevel : 1,
			jewelsTrailATotalDiamonds : 0,
			jewelsTrailBTotalDiamonds : 0,
			jewelsTrailBTotalShapes : 0,
			jewelsTrailAServerDiamonds : 0,
			jewelsTrailBServerDiamonds : 0,
			jewelsTrailBServerShapes : 0

		};
		Ti.App.Properties.setObject(credentials.userId.toString(), jewelInfo1);
	}

}
function SurveyAndGameSheduleSuccess(e) {
	var response = JSON.parse(e.data);
	Ti.App.Properties.setInt("ReminderClearInterval",response.ReminderClearInterval);
	var credentials = Alloy.Globals.getCredentials();
	if (response.ErrorCode == 0) {
		var surveyList = response.ScheduleSurveyList;
		var cognitionList = response.ScheduleGameList;
		var batchList=response.BatchScheduleList;
		var cognitionImageList=response.CognitionIconList;
		var surveyImageList=response.SurveyIconList;
		
		
		for(var i=0;i<cognitionImageList.length;i++){
			if(cognitionImageList[i].IconBlob!=null){
		var imgStr = Ti.Utils.base64decode(cognitionImageList[i].IconBlob);
		var fileName="C" + cognitionImageList[i].CTestID +".png";
		var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
		file.write(imgStr);
		}
		}
		
		
		for(var i=0;i<surveyImageList.length;i++){
		if(surveyImageList[i].IconBlobString!=null){
		var imgStr = Ti.Utils.base64decode(surveyImageList[i].IconBlobString);
		var fileName="S" + surveyImageList[i].SurveyID +".png";
		var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
		file.write(imgStr);
		}
		}

		
		
		
		var settingsInfo = Ti.App.Properties.getObject('SettingsInfo');
			var settingsData = {
				userSettingsId : settingsInfo.userSettingsId,
				userId : settingsInfo.userId,
				appColor : settingsInfo.appColor,
				appBackground : settingsInfo.appBackground,
				sympSurveySlotID : settingsInfo.sympSurveySlotID,
				sympSurveySlotTime : settingsInfo.sympSurveySlotTime,
				sympSurveyRepeatID : settingsInfo.sympSurveyRepeatID,
				cognTestSlotID : settingsInfo.cognTestSlotID,
				cognTestSlotTime : settingsInfo.cognTestSlotTime,
				cognTestRepeatID : settingsInfo.cognTestRepeatID,
				contactNo : response.ContactNo,
				personalHelpline : response.PersonalHelpline,
				Protocol : settingsInfo.Protocol
			};
		
		commonDB.insertSettingsData(settingsData);
		Ti.App.Properties.setObject("SettingsInfo", settingsData);
		var currentDate = new Date();
		var currentMonth = currentDate.getMonth() + 1;
		if (currentMonth < 10)
			currentMonth = "0" + currentMonth;
		var scheduleDateFormat = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDate.getDate() + "T00:00:00";
		if (surveyList.length != 0) {
			for (var i = 0; i < surveyList.length; i++) {
				var slotsArray = surveyList[i].SlotTimeOptions;
				var dataValues = {
					"userID" : credentials.userId,
					"testID" : surveyList[i].SurveyId,
					"testName" : surveyList[i].SurveyName,
					"versionNumber" : 0,
					"startDate" : surveyList[i].ScheduleDate,
					"startTime" : (surveyList[i].RepeatID === 11) ? slotsArray.toString() : surveyList[i].SlotTime,
					"repeateID" : surveyList[i].RepeatID,
					"IsDeleted" : (surveyList[i].IsDeleted == null) ? 0 : surveyList[i].IsDeleted,
					"IsSurvey" : 1,
					"scheduleID" : surveyList[i].SurveyScheduleID,
					"batchID":""
				};
				console.log("else array");
				console.log(dataValues);
				commonDB.insertAdminShedule(dataValues);
			}
		}
		if (cognitionList.length != 0) {
			for (var i = 0; i < cognitionList.length; i++) {
				var slotsArray = cognitionList[i].SlotTimeOptions;
				var nBackGameType = cognitionList[i].GameType;
				var nBackTestID = cognitionList[i].CTestId;
				if(nBackTestID == 1){
					if(nBackGameType == 1) {
						nBackTestID = 19;
					} else if(nBackGameType == 2) {
						nBackTestID = 20;
					} else if(nBackGameType == 3) {
						nBackTestID = 21;
					}
				} else if(nBackTestID == 14){
					if(nBackGameType == 1) {
						nBackTestID = 22;
					} else if(nBackGameType == 2) {
						nBackTestID = 23;
					} else if(nBackGameType == 3) {
						nBackTestID = 24;
					}
				}
				
				var dataValues = {
					"userID" : credentials.userId,
					"testID" : nBackTestID,
					"testName" : cognitionList[i].CTestName,
					"versionNumber" : (cognitionList[i].Version == null) ? 0 : cognitionList[i].Version,
					"startDate" : cognitionList[i].ScheduleDate,
					"startTime" : (cognitionList[i].RepeatID === 11) ? slotsArray.toString() : cognitionList[i].SlotTime,
					"repeateID" : cognitionList[i].RepeatID,
					"IsDeleted" : cognitionList[i].IsDeleted,
					"IsSurvey" : 0,
					"scheduleID" : cognitionList[i].GameScheduleID,
					"batchID":""
				};
				commonDB.insertAdminShedule(dataValues);

			}
		}
		
		if (batchList.length != 0) {
			var batchOptions="";
			for (var i = 0; i < batchList.length; i++) {
				batchOptions="";
				var slotsArray =[];
				
				if(batchList[i].RepeatId === 11){
				
				for(var k=0;k< batchList[i].BatchScheduleCustomTime.length;k++){
					
					slotsArray.push(batchList[i].BatchScheduleCustomTime[k].Time);
				}
				}
				
				if(batchList[i].BatchScheduleSurvey_CTest != null){
					for(var j = 0; j< batchList[i].BatchScheduleSurvey_CTest.length; j++){
					var option=batchList[i].BatchScheduleSurvey_CTest[j].Type==1 ? "S" :"C";
					var nBackGameType = batchList[i].BatchScheduleSurvey_CTest[j].GameType;
					var BatchGameID = batchList[i].BatchScheduleSurvey_CTest[j].ID;
					if(BatchGameID == 1){
						if(nBackGameType == 1){
							BatchGameID = 19;
						} else if(nBackGameType == 2) {
							BatchGameID = 20;
						} else if(nBackGameType == 3) {
							BatchGameID = 21;
						}
					} else if(BatchGameID == 14) {
						if(nBackGameType == 1){
							BatchGameID = 22;
						} else if(nBackGameType == 2) {
							BatchGameID = 23;
						} else if(nBackGameType == 3) {
							BatchGameID = 24;
						}
					}
					var batchID=option+" "+BatchGameID;
					if (batchOptions == "") {
					batchOptions = batchID;
				} else {
					batchOptions = batchOptions + ", " + batchID;
				}
				}
				}
				
			
				
				var dataValues = {
					"userID" : credentials.userId,
					"testID" : batchList[i].BatchScheduleId,
					"testName" : "BatchSchedule",
					"versionNumber" : 0,
					"startDate" : batchList[i].ScheduleDate,
					"startTime" : (batchList[i].RepeatId === 11) ? slotsArray.toString() : batchList[i].SlotTime,
					"repeateID" : batchList[i].RepeatId,
					"IsDeleted" : batchList[i].IsDeleted,
					"IsSurvey" : 2,
					"scheduleID" : batchList[i].BatchScheduleId,
					"batchID":batchOptions
				};
commonDB.insertAdminShedule(dataValues);

}
}

		if (surveyList.length != 0 || cognitionList.length != 0 || batchList!=0) {
			resetAllNotifications();
		}
		setJewelGameParam(response);
		var lastSyncDate = Ti.App.Properties.getObject('lastSyncDate');
		lastSyncDate.LastUpdatedSurveyDate = response.LastUpdatedSurveyDate;
		lastSyncDate.LastUpdatedGameDate = response.LastUpdatedGameDate;
		Ti.App.Properties.setObject('lastSyncDate', lastSyncDate);

	}

}

function SurveyAndGameSheduleFailure(e) {

}

Ti.App.addEventListener('resetAllNotifications', resetAllNotifications);
function resetAllNotifications() {
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
	var spinInfo = Ti.App.Properties.getObject('spinnerInfo');
	spinInfo.lampRecords = 0;
	Ti.App.Properties.setObject('spinnerInfo', spinInfo);
	Ti.App.Properties.setObject('lastAdminReminderTime', reminderValues);
	Ti.App.Properties.setObject('lastLocalReminderTime', reminderValues);
	if (OS_IOS) {
		Ti.App.iOS.cancelAllLocalNotifications();
		notify.cancelAllNotification();
	} else {
		Alloy.Globals.REQUEST_CODE_ARRAY = [];
		if (Ti.App.Properties.getObject('requestCode') != null) {
			cancelMultipleAlarm(Ti.App.Properties.getObject('requestCode'));
			Ti.App.Properties.setObject('requestCode', null);
			Alloy.Globals.REQUEST_CODE = 0;
		}
	}
	arrayItems = [];
	var notificationArray = commonDB.getAdminShedules();
	var j = 3;

	for (var i = 0; i < notificationArray.length; i++) {
		var testType = "survey";
		var alertText = "Survey : " + notificationArray[i].testName;
		
		var secondTest = j;
		j += 1;
		if (notificationArray[i].isSurvey == 0) {
			testType = "cognition";
			var alertText = "Cognition : " + notificationArray[i].testName;
		}else if(notificationArray[i].isSurvey == 1){
			var testType = "survey";
		var alertText = "Survey : " + notificationArray[i].testName;
		}else{
			var testType = "Batch";
		var alertText = "You have a new Batched survey.";
		}
		
		
		if (notificationArray[i].startTime != null && notificationArray[i].startTime != "" && notificationArray[i].startDate != null && notificationArray[i].startDate != "") {

			var stTime = notificationArray[i].startTime;
			var stDate = notificationArray[i].startDate;
			var dateArray = stTime.split(" ");
			var datePartArray = stDate.split("T");
			var utcDateTime = datePartArray[0] + "T" + dateArray[1] + ".000Z";
			
			
			var convLocalTime = new Date(utcDateTime);
			
			if (dateArray.length >= 2) {

				
				if(OS_IOS){
					var minutes = convLocalTime.getMinutes();
				}else{
					var minutes = convLocalTime.getMinutes();
					
				}
				
				minutes = minutes < 10 ? '0' + minutes : minutes;
				
				if(OS_IOS){
					var hours = convLocalTime.getHours();
				}else{
					var hours = convLocalTime.getHours();
					
				}
				hours = hours < 10 ? '0' + hours : hours;
				
					if(OS_IOS){
					var seconds = convLocalTime.getSeconds();
				}else{
					var seconds = convLocalTime.getSeconds();
					
				}
				seconds = seconds < 10 ? '0' + seconds : seconds;
				var timeForLocal = hours + ":" + minutes + ":" + seconds;
				
				var month = convLocalTime.getUTCMonth() + 1;
				month = month < 10 ? '0' + month : month;
				var dateValue = convLocalTime.getUTCDate();
				dateValue = dateValue < 10 ? '0' + dateValue : dateValue;

				var dateText = convLocalTime.getUTCFullYear() + "-" + month + "-" + dateValue;
				
				var formateTime = commonFunctions.formatTimeToDate(timeForLocal, dateText, secondTest);
				var curDayFormateTime = commonFunctions.formatTimeToDate(timeForLocal, new Date(), secondTest);
				
				setAdminNotifications(notificationArray[i].repeateID - 1, formateTime, alertText, testType, secondTest, notificationArray[i].testID, notificationArray[i].versionNumber, curDayFormateTime, notificationArray[i].testName, timeForLocal,notificationArray[i].batchID);
			}

		}
	

	};

	var localNotificationArray = commonDB.getLocalShedules();
	
	for (var k = 0; k < localNotificationArray.length; k++) {
		if (localNotificationArray[k].isSurvey == 1) {
			if (Ti.App.Properties.hasProperty("surveyReminder")) {
				sendLocalNotification(localNotificationArray[k].repeateID, localNotificationArray[k].setDate, L('symptomTimeReminder'), 'survey', 1);
			}
		} else {
			if (Ti.App.Properties.hasProperty("coginitionReminder")) {

			
				sendLocalNotification(localNotificationArray[k].repeateID, localNotificationArray[k].setDate, L('cognitionTimeReminder'), 'cognition', 2);
				
			}
		}

	}

}

function setJewelGameParam(responseData) {
	var credentials = Alloy.Globals.getCredentials();
	Ti.App.Properties.setString('JewelsTrailsASettings', JSON.stringify(responseData.JewelsTrailsASettings));
	Ti.App.Properties.setString('JewelsTrailsBSettings', JSON.stringify(responseData.JewelsTrailsBSettings));
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~START~~~~~~~~~~~~~~~~~~~~~~~~");
	var retrievedJSON = Ti.App.Properties.getString('JewelsTrailsASettings', 'JewelsTrailsASettings not found');
	console.log("The JewelsTrailsASettings property contains: " + retrievedJSON);
	var retrievedJSON1 = Ti.App.Properties.getString('JewelsTrailsBSettings', 'JewelsTrailsBSettings not found');
	console.log("The JewelsTrailsBSettings property contains: " + retrievedJSON1);
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~~~~~");
	var jewelTrail = Ti.App.Properties.getObject(credentials.userId.toString());
	console.log("local jewl a diamonds");
	console.log(parseInt(jewelTrail.jewelsTrailAServerDiamonds));
	console.log("server jewl a diamonds");
	console.log(parseInt(responseData.JewelsTrailsASettings.NoOfDiamonds));

	console.log("local jewl b diamonds");
	console.log(parseInt(jewelTrail.jewelsTrailBServerDiamonds));
	console.log("server jewl b diamonds");
	console.log(parseInt(responseData.JewelsTrailsBSettings.NoOfDiamonds));

	console.log("local jewl b shape");
	console.log(parseInt(jewelTrail.jewelsTrailBServerShapes));
	console.log("server jewl b shape");
	console.log(parseInt(responseData.JewelsTrailsBSettings.NoOfShapes));

	if (parseInt(jewelTrail.jewelsTrailAServerDiamonds) != parseInt(responseData.JewelsTrailsASettings.NoOfDiamonds)) {
		console.log("changed jewess a game settings");
		jewelTrail.jewelsTrailACurrentLevel = 1;
		jewelTrail.jewelsTrailATotalDiamonds = 0;
		jewelTrail.jewelsTrailAServerDiamonds = responseData.JewelsTrailsASettings.NoOfDiamonds;
		Ti.App.Properties.setObject(credentials.userId.toString(), jewelTrail);
	}

	if (parseInt(jewelTrail.jewelsTrailBServerDiamonds) != parseInt(responseData.JewelsTrailsBSettings.NoOfDiamonds)) {
		console.log("changed jewess b game settings diamonds");
		jewelTrail.jewelsTrailBCurrentLevel = 1;
		jewelTrail.jewelsTrailBTotalDiamonds = 0;
		jewelTrail.jewelsTrailBTotalShapes = 0;
		jewelTrail.jewelsTrailBServerDiamonds = responseData.JewelsTrailsBSettings.NoOfDiamonds;
		jewelTrail.jewelsTrailBServerShapes = responseData.JewelsTrailsBSettings.NoOfShapes;
		Ti.App.Properties.setObject(credentials.userId.toString(), jewelTrail);
		console.log("end jewel b diamond change");
	}

	if (parseInt(jewelTrail.jewelsTrailBServerShapes) != parseInt(responseData.JewelsTrailsBSettings.NoOfShapes)) {
		console.log("changed jewess b game settings shapes");
		jewelTrail.jewelsTrailBCurrentLevel = 1;
		jewelTrail.jewelsTrailBTotalDiamonds = 0;
		jewelTrail.jewelsTrailBTotalShapes = 0;
		jewelTrail.jewelsTrailBServerDiamonds = responseData.JewelsTrailsBSettings.NoOfDiamonds;
		jewelTrail.jewelsTrailBServerShapes = responseData.JewelsTrailsBSettings.NoOfShapes;
		Ti.App.Properties.setObject(credentials.userId.toString(), jewelTrail);
	}
	
}

/**
 * Function for favoruite click
 */
function onFavouriteClick(e) {
	try {
		var LangCode = Ti.App.Properties.getString('languageCode');
		var selectedText = "";
		var FavType="";
		var Type="";
		var gameName;
		
		if (e.source.id=="startFirstView" || e.source.id=="firstFavIcn") {
			selectedText = $.favOneLbl.text;
			FavType=1;
		} 
		 if (e.source.id=="startSecondView" || e.source.id=="secondFavIcn") {
			selectedText = $.favTwoLbl.text;
			FavType=2;
			
		}
		
		if ($.firstFavIcn.image!="/images/newHome/add.png" && FavType==1) {
			
			onGameStart(e.source.id);
		}
		if ($.secondFavIcn.image!="/images/newHome/add.png" && FavType==2) {
			
			onGameStart(e.source.id);
		}
		
		
		
		
	if ($.firstFavIcn.image=="/images/newHome/add.png") {
		
		if(FavType==1){
		ShowPicker(getGameSlot(), selectedText, "Select Favorites", function(val, index,type) {
			if(e.source.id=="firstFavIcn" || e.source.id=="startFirstView" ){
				$.favOneLbl.text = val;
				$.favOneLbl.index = index;
				if(type=="C"){
					Type=2;
					firstGameID=commonFunctions.getGameID($.favOneLbl.text);
					$.firstFavIcn.image="/images/newHome/"+"C" + firstGameID + ".png";
					
					Ti.App.Properties.setString('firstFavouriteId', firstGameID);
					Ti.App.Properties.setString('firstSurveyFavouriteId', "");
					
				} else if(type=="S"){
					Type=1;
					for(var i=0;i<surveyList.length;i++){
						if(surveyList[i].questions==$.favOneLbl.text){
							firstGameID=surveyList[i].surveyID;
						}
					}
					var fileName = "S" + firstGameID + ".png";
					var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
					if(file.exists() == true){
						$.firstFavIcn.image = Ti.Filesystem.applicationDataDirectory + fileName;
					}else{
						$.firstFavIcn.image="/images/gameIcons/surveyIcon.png";
					}
					
					Ti.App.Properties.setString('firstSurveyFavouriteId', firstGameID);
					Ti.App.Properties.setString('firstFavouriteId', "");
				}
				
				$.startFirstView.visible=true;


			} 

			if (Ti.Network.online) {
			 var favoriteParam = {
				 "GameID" :  firstGameID,
				 "FavType":FavType,
				 "Type":Type
			 };
			 
			 serviceManager.updateFavorite(favoriteParam, onGetFavoriteSuccess, onGetFavoriteError);
			 } else {
			 commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			 }

		});
		}
		
		}
		
		if($.secondFavIcn.image=="/images/newHome/add.png"){
			if(FavType==2){
		ShowPicker(getGameSlot(), selectedText, "Select Favorites", function(val, index,type) {
			 if (e.source.id=="secondFavIcn" || e.source.id=="startSecondView") {
				$.favTwoLbl.text = val;
				$.favTwoLbl.index = index;
				if(type=="C"){
					Type=2;
					secondGameID=commonFunctions.getGameID($.favTwoLbl.text);
					$.secondFavIcn.image="/images/newHome/"+"C" + secondGameID + ".png";
					Ti.App.Properties.setString('secondFavouriteId', secondGameID);
					Ti.App.Properties.setString('secondSurveyFavouriteId', "");
				}else if(type=="S"){
					Type=1;
					for(var i=0;i<surveyList.length;i++){
						if(surveyList[i].questions==$.favTwoLbl.text){
							secondGameID=surveyList[i].surveyID;
						}
					}
					var fileName = "S" + secondGameID + ".png";
					var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
				
					if(file.exists() == true){
						$.secondFavIcn.image = Ti.Filesystem.applicationDataDirectory + fileName;
					}else{
						$.secondFavIcn.image="/images/gameIcons/surveyIcon.png";
					}
					Ti.App.Properties.setString('secondSurveyFavouriteId', secondGameID);
					Ti.App.Properties.setString('secondFavouriteId', "");

				}	
				$.startSecondView.visible=true;

			}

			if (Ti.Network.online) {
			 var favoriteParam = {
				 "GameID" : secondGameID,
				 "FavType":FavType,
				 "Type":Type
			 };
			 
			 serviceManager.updateFavorite(favoriteParam, onGetFavoriteSuccess, onGetFavoriteError);
			 } else {
			 commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			 }

		});
		}
			
		}
		

	} catch(ex) {
		commonFunctions.handleException("newhomescreen", "onFirstFavouriteClick", ex);
	}

}

/*
 * On change game
 */
function onGameChange(e){
	try{
		var LangCode = Ti.App.Properties.getString('languageCode');
		var selectedText = "";
		var FavType="";
		var Type="";
		var gameName;
		
		if (e.source.id=="startFirstView") {
			selectedText = $.favOneLbl.text;
			FavType=1;
			
		}
		 if (e.source.id=="startSecondView") {
			selectedText = $.favTwoLbl.text;
			FavType=2;
			
		}
		if(FavType==1 || FavType==2)
		{
			ShowPicker(getGameSlot(), selectedText, "Select Favorites", function(val, index,type) {
			
			
			
			if(e.source.id=="startFirstView" ){
				$.favOneLbl.text = val;
				$.favOneLbl.index = index;
				if(type=="C"){
					Type=2;
					firstGameID=commonFunctions.getGameID($.favOneLbl.text);
					$.firstFavIcn.image="/images/newHome/"+"C" + firstGameID + ".png";
					Ti.App.Properties.setString('firstFavouriteId', firstGameID);
					Ti.App.Properties.setString('firstSurveyFavouriteId', "");
				} else if(type=="S"){
					Type=1;
					for(var i=0;i<surveyList.length;i++){
						if(surveyList[i].questions==$.favOneLbl.text){
							firstGameID=surveyList[i].surveyID;
						}
					}
					var fileName = "S" + firstGameID + ".png";
					var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
					if(file.exists() == true){
						$.firstFavIcn.image = Ti.Filesystem.applicationDataDirectory + fileName;
					}else{
						$.firstFavIcn.image="/images/gameIcons/surveyIcon.png";
					}
					Ti.App.Properties.setString('firstSurveyFavouriteId', firstGameID);
					Ti.App.Properties.setString('firstFavouriteId', "");
				}
				
				$.startFirstView.visible=true;


			} 
			else if (e.source.id=="startSecondView") {
				$.favTwoLbl.text = val;
				$.favTwoLbl.index = index;
				if(type=="C"){
					Type=2;
					secondGameID=commonFunctions.getGameID($.favTwoLbl.text);
					$.secondFavIcn.image="/images/newHome/"+"C" + secondGameID + ".png";
					Ti.App.Properties.setString('secondFavouriteId', secondGameID);
					Ti.App.Properties.setString('secondSurveyFavouriteId', "");
				}else if(type=="S"){
					Type=1;
					for(var i=0;i<surveyList.length;i++){
						if(surveyList[i].questions==$.favTwoLbl.text){
							secondGameID=surveyList[i].surveyID;
						}
					}
					var fileName = "S" + secondGameID + ".png";
					var file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
				
					if(file.exists() == true){
						$.secondFavIcn.image = Ti.Filesystem.applicationDataDirectory + fileName;
					}else{
						$.secondFavIcn.image="/images/gameIcons/surveyIcon.png";
					}
					Ti.App.Properties.setString('secondSurveyFavouriteId', secondGameID);
					Ti.App.Properties.setString('secondFavouriteId', "");

				}	
				$.startSecondView.visible=true;

			}

			if (Ti.Network.online) {
				var gameId;
				if(e.source.id == "firstFavIcn" || e.source.id == "startFirstView"){
					gameId=firstGameID;
				}else{
					gameId=secondGameID;
				}
			 var favoriteParam = {
				 "GameID" : gameId,
				 "FavType":FavType,
				 "Type":Type
			 };
			 serviceManager.updateFavorite(favoriteParam, onGetFavoriteSuccess, onGetFavoriteError);
			 } else {
			 commonFunctions.showAlert(commonFunctions.L('noNetwork', LangCode));
			 }

		});
		}
		
	}catch(ex) {
		commonFunctions.handleException("newhomescreen", "onGameChange", ex);
	}
}
/**
 * Api success of favorite
 */
function onGetFavoriteSuccess(e) {
	try {
		var response = JSON.parse(e.data);
		
		
	} catch(ex) {
		commonFunctions.handleException("newhomescreen", "onGetFavoriteSuccess", ex);
	}
}

/**
 * Api error of favorite
 */
function onGetFavoriteError(e) {
	try {

	} catch(ex) {
		commonFunctions.handleException("newhomescreen", "onGetFavoriteError", ex);
	}
}

/**
 * Shows the picker
 */
function ShowPicker(options, defaultText, headerText, doneCallBack, itemChangeCallback) {
	try {
		var listPicker = null;
		var defaultVal = 0;
		
		for ( index = 0; index < options.length; index++) {
			if (options[index].title == defaultText) {
				defaultVal = index;
				break;
			}
		}

		listPicker = new Picker(options, defaultVal, headerText, 'plain', null);
		listPicker.addToWindow($.home);

		listPicker.show();

		listPicker.addEventListener("done", function(e) {

			if (listPicker.selectedValue == null || listPicker.selectedValue < 0) {
				if (OS_ANDROID) {
					if (listPicker != null)
						listPicker.hide();

				}
				return;
			}
			if (listPicker != null)
				listPicker.hide();

			if (listPicker.selectedText) {
				doneCallBack(listPicker.selectedText, listPicker.selectedValue,listPicker.selectedType);
			}
			listPicker = null;

		});

		listPicker.addEventListener("cancel", function(e) {
			if (listPicker != null)
				listPicker.hide();
			listPicker = null;
		});

		listPicker.addEventListener("change", function(e) {
			if (itemChangeCallback != null || itemChangeCallback != undefined)
				itemChangeCallback(listPicker.selectedText);
		});
	} catch(ex) {
		commonFunctions.handleException("home", "ShowPicker", ex);
	}
}

/**
 * Survey menu click
 */
function surveyClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;

			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('surveysList');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);

		}

	} catch(ex) {
		commonFunctions.handleException("home", "surveyClick", ex);
	}
}

/**
 * on start game on favorite click
 */
function onGameStart(source){
	try{
	
		if(source=="firstFavIcn" || source=="firstFavouriteView" || source=="startFirstView"){
			var gameID=Ti.App.Properties.getString('firstFavouriteId');
			var surveyID=Ti.App.Properties.getString('firstSurveyFavouriteId');
			
			if(gameID!= null && gameID!=""){
				
			if (gameID==1) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel');
	} else if (gameID==3) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : true
		});
	} else if (gameID==4) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : false
		});
	} else if (gameID==5) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask');
	} else if (gameID==6) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen');
	} else if (gameID==9) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation');
	} else if (gameID==10) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : true
		});
	} else if (gameID==13) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : false
		});
	} else if (gameID==11) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew');
	} else if (gameID==12) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder');
	} else if (gameID==14) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew');
	} else if (gameID==15) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap');
	} else if (gameID==16) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew');
	} else if (gameID==17) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
			'type' : 1,
			"isBatch" : "",
			"testID" : "",
			"fromNotification" : "",
			"createdDate" : "",
			"isLocal" : ""
		});
	} else if (gameID==18) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
			'type' : 2,
			"isBatch" : "",
			"testID" : "",
			"fromNotification" : "",
			"createdDate" : "",
			"isLocal" : ""
		});
	} else if (gameID==2) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB');
	} else if (gameID==8) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen');
	}
	}
	else if(surveyID!=null && surveyID!=""){
		Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
				'surveyID' :surveyID,
				'surveyName' : "",
				'fromNotification' : false,
				"createdDate" : "",
				"isLocal" : ""
			});
	}
		}
		else if(source=="secondFavIcn" || source=="secondFavouriteView" || source=="startSecondView"){
			var gameID=Ti.App.Properties.getString('secondFavouriteId');
			var surveyID=Ti.App.Properties.getString('secondSurveyFavouriteId');
			if(gameID!=null && gameID!=""){
			if (gameID==1) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevel');
	} else if (gameID==3) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : true
		});
	} else if (gameID==4) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('spatialSpan', {
			"isForward" : false
		});
	} else if (gameID==5) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('simpleMemoryTask');
	} else if (gameID==6) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('serial7STestScreen');
	} else if (gameID==9) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('visualAssociation');
	} else if (gameID==10) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : true
		});
	} else if (gameID==13) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('digitSpanTest', {
			"isForward" : false
		});
	} else if (gameID==11) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('catAndDogGameNew');
	} else if (gameID==12) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('temporalOrder');
	} else if (gameID==14) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('nBackLevelNew');
	} else if (gameID==15) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsbNonOverlap');
	} else if (gameID==16) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsBNew');
	} else if (gameID==17) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
			'type' : 1,
			"isBatch" : "",
			"testID" : "",
			"fromNotification" : "",
			"createdDate" : "",
			"isLocal" : ""
		});
	} else if (gameID==18) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('jewelsTrailsA', {
			'type' : 2,
			"isBatch" : "",
			"testID" : "",
			"fromNotification" : "",
			"createdDate" : "",
			"isLocal" : ""
		});
	} else if (gameID==2) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('trailsB');
	} else if (gameID==8) {
		Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('figureCopyScreen');
	}
	}

	else if(surveyID!=null){
		Alloy.Globals.NAVIGATION_CONTROLLER.openFullScreenWindow('syptomSurveyNew', {
				'surveyID' :surveyID,
				'surveyName' : "",
				'fromNotification' : false,
				"createdDate" : "",
				"isLocal" : ""
			});
	}
	
		}
		
	}catch(ex) {
		commonFunctions.handleException("home", "onGameStart", ex);
	}
}

/**
 * Coginition test menu click
 */
function cognitionClick(e) {
	try {
		if (menueClicked == false) {
			menueClicked = true;
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('cognitionTestScreen');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);
		}

	} catch(ex) {
		commonFunctions.handleException("home", "environmentClick", ex);
	}
}

/**
 * function for health click
 */
function onHealthDataClick(){
	try{
		if (menueClicked == false) {
			menueClicked = true;
			Alloy.Globals.NAVIGATION_CONTROLLER.openWindow('newHeathScreen');
			setTimeout(function() {
				menueClicked = false;
			}, 1000);
		}
	}catch(ex) {
		commonFunctions.handleException("home", "onHealthDataClick", ex);
	}
}
