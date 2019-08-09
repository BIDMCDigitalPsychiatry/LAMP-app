if(OS_ANDROID){
	var zcoAlarmManager = require('bencoding.alarmmanager').createAlarmManager();
}
/**
 * Schedule iOS Notifcations
 */
exports.setNotification = function(alertBody, userInfo, Notifcationdate, repeatMode) {
	Ti.API.info('alertBody:: ',alertBody," userInfo:: ",userInfo," Notifcationdate:: ",Notifcationdate," repeatMode:: ",repeatMode);
	Notifcationdate=new Date(Notifcationdate);
	Ti.API.info('New Date1:: ',Notifcationdate);
		  Ti.App.iOS.registerUserNotificationSettings({    
                types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]    
            });
            Ti.App.iOS.scheduleLocalNotification({
                alertBody: alertBody,
                alertAction: Alloy.Globals.AppName,
                userInfo:userInfo,
                date: Notifcationdate,
                sound: "default",
                repeat : repeatMode
            });
};

/**
 * Schedule iOS Notifcations
 */
exports.setOneTimeNotification = function(alertBody, userInfo, Notifcationdate) {
	Ti.API.info('alertBody:: ',alertBody," userInfo:: ",userInfo," Notifcationdate:: ",Notifcationdate);
	Notifcationdate=new Date(Notifcationdate);
	Ti.API.info('New Date1:: ',Notifcationdate);
		  Ti.App.iOS.registerUserNotificationSettings({    
                types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]    
            });
            Ti.App.iOS.scheduleLocalNotification({
                alertBody: alertBody,
                alertAction: Alloy.Globals.AppName,
                userInfo:userInfo,
                date: Notifcationdate,
                sound: "default"
            });
};



/**
 * Schedule Android notification
 */
// exports.scheduleAndroidNotification=function(alertBody, date, interval, type) {
	// try {
		// Ti.API.info('ALERTBODY: ', alertBody, " DATE:: ", date, " INTERVAL:: ", interval, " TYPE:: ", type);
		// var zcoAlarmManager = require('ti.zco.alaram.manager');
		// var launchActivity = "com.lp.lamp.LampActivity";
		// Alloy.Globals.REQUEST_CODE_ARRAY.push(Alloy.Globals.REQUEST_CODE);
		// Ti.App.Properties.setObject('requestCode', Alloy.Globals.REQUEST_CODE_ARRAY);
		// zcoAlarmManager.setRepeatAlarm({
			// requestCode : Alloy.Globals.REQUEST_CODE,
			// appname : Alloy.Globals.AppName,
			// appid : Ti.App.id,
			// launching_activity : launchActivity,
			// message : alertBody,
			// backup : type,
			// alaramtime : date,
			// mute : false,
			// controlvolume : true,
			// bgcolor : "#5aaddc",
			// icon : Ti.App.Android.R.drawable.appicon,
			// lollipop : Ti.App.Android.R.drawable.appicon,
			// interval : interval,
			// callback : notificationCallBack
		// });
		// zcoAlarmManager.setNotifyListener({
// 
			// callback : notificationCallBack
// 
		// });
		// Alloy.Globals.REQUEST_CODE=Alloy.Globals.REQUEST_CODE+1;
	// } catch(ex) {
// 		
	// }
// };


exports.scheduleAndroidNotification=function(alertBody, date, interval, type) {
	try {
		Ti.API.info('ALERTBODY: ', alertBody, " DATE:: ", date, " INTERVAL:: ", interval, " TYPE:: ", type);
		
		//var launchActivity = "com.lp.lamp.LampActivity";
		Alloy.Globals.REQUEST_CODE_ARRAY.push(Alloy.Globals.REQUEST_CODE);
		Ti.App.Properties.setObject('requestCode', Alloy.Globals.REQUEST_CODE_ARRAY);
		var now = new Date(date);
		Ti.API.info('Set android Date : ', now);

zcoAlarmManager.addAlarmNotification({
	requestCode : Alloy.Globals.REQUEST_CODE,
	year : now.getFullYear(),
	month : now.getMonth(),
	day : now.getDate(),
	hour : now.getHours(),
	minute : now.getMinutes(), //Set the number of minutes until the alarm should go off
	contentTitle : "LAMP", //Set the title of the Notification that will appear
	contentText : alertBody, //Set the body of the notification that will apear
	icon : Ti.App.Android.R.drawable.appicon,
	playSound : true,
	repeat : interval

});


		Alloy.Globals.REQUEST_CODE=Alloy.Globals.REQUEST_CODE+1;
	} catch(ex) {
		
	}
};
/**
 * Schedule Android One Time notification
 */
exports.scheduleAndroidOneTimeNotification=function(alertBody, date, interval, type) {
	try {
		Ti.API.info('ALERTBODY: ', alertBody, " DATE:: ", date, " INTERVAL:: ", interval, " TYPE:: ", type);
		// var zcoAlarmManager = require('ti.zco.alaram.manager');
		// var launchActivity = "com.lp.lamp.LampActivity";
		// Alloy.Globals.REQUEST_CODE_ARRAY.push(Alloy.Globals.REQUEST_CODE);
		// Ti.App.Properties.setObject('requestCode', Alloy.Globals.REQUEST_CODE_ARRAY);
		// zcoAlarmManager.setOneTimeAlarm({
			// requestCode : Alloy.Globals.REQUEST_CODE,
			// appname : Alloy.Globals.AppName,
			// appid : Ti.App.id,
			// launching_activity : launchActivity,
			// message : alertBody,
			// backup : type,
			// alaramtime : date,
			// mute : false,
			// controlvolume : true,
			// bgcolor : "#5aaddc",
			// icon : Ti.App.Android.R.drawable.appicon,
			// lollipop : Ti.App.Android.R.drawable.appicon,
			// interval : interval,
			// callback : notificationCallBack
		// });
		// zcoAlarmManager.setNotifyListener({
// 
			// callback : notificationCallBack
// 
		// });
		Alloy.Globals.REQUEST_CODE_ARRAY.push(Alloy.Globals.REQUEST_CODE);
		Ti.App.Properties.setObject('requestCode', Alloy.Globals.REQUEST_CODE_ARRAY);
		var now = new Date(date);
		Ti.API.info('Set android Date : ', now);
		zcoAlarmManager.addAlarmNotification({	
			requestCode:Alloy.Globals.REQUEST_CODE,	
			year: now.getFullYear(),
			month: now.getMonth(),
			day: now.getDate(),
			hour: now.getHours(),
			minute: now.getMinutes(), //Set the number of minutes until the alarm should go off
			contentTitle:"LAMP", //Set the title of the Notification that will appear
			contentText:alertBody, //Set the body of the notification that will apear
			icon : Ti.App.Android.R.drawable.appicon,
			playSound:true,
			//repeat:interval 
				
		});	
			
		Alloy.Globals.REQUEST_CODE=Alloy.Globals.REQUEST_CODE+1;
		
	} catch(ex) {
		
	}
};

function callbackfunction1 (e) {
  Ti.API.info('ANDROID callbackfunction1 : ', JSON.stringify(e));
 
}
exports.cancelAllAlarm = function() {
	Ti.API.info('Calcel Alram');
	
    zcoAlarmManager.cancelAlarmService();
       
};
/**
 * Function for hnadling the received android notifications.
 */
function notificationCallBack(e) {
	try {
		Ti.API.info('ANDROID RECIVED NOT:: ', JSON.stringify(e));
		Ti.API.info('****PAUSED ANDROID**** ',Alloy.Globals.ISPAUSED);
		if (!Alloy.Globals.ISPAUSED) {
			Ti.API.info('e.msgcode : ',e.msgcode);
			if(e.msgcode===0){
				var commonDB = require('commonDB');
				var credentials = Alloy.Globals.getCredentials();
				Ti.API.info('insertAlerts');
				//commonDB.insertAlerts(credentials.userId, e.msg, e.backup,0);
				Ti.App.fireEvent("notificationHomeRefresh");
			}
		}else{
			Ti.API.info('Android Navigation');
			
		}
	} catch(ex) {
		
	}
}


/**
 * This function return Date format like mm/dd/yyyy hh:mm:ss
 * @param {Object} dateArg
 */
function FormatDate(dateArg) {

	var notificationFireDateTime = String.formatDate(new Date(dateArg)) + " " + String.formatTime(new Date(dateArg));

	try {
		var dateStr = notificationFireDateTime.split(' ');

		if (Ti.Platform.is24HourTimeFormat() == true) {

			var date = new Date(dateArg);

			var year = date.getFullYear();
			var month = (date.getMonth() + 1);
			if (month.length == 1) {
				month = "0" + month;
			}
			var day = date.getDate();
			if (day.length == 1) {
				day = "0" + day;
			}

			notificationFireDateTime = month + '/' + day + '/' + year + " " + dateStr[1].toString();

		} else {

			var formatedTime;

			if (dateStr.length > 0) {

				var timeStr = dateStr[1].toString().split(':');

				// Converting into 24 hour time format
				if (dateStr[2].toUpperCase() == 'PM') {

					timeStr[0] = parseInt(timeStr[0]) == 12 ? 0 : timeStr[0];
					formatedTime = 12 + parseInt(timeStr[0]);
				} else {
					formatedTime = parseInt(timeStr[0]) == 12 ? 0 : timeStr[0];
				}

				var date = new Date(dateArg);

				var year = date.getFullYear();
				var month = (date.getMonth() + 1);
				if (month.length == 1) {
					month = "0" + month;
				}
				var day = date.getDate();
				if (day.length == 1) {
					day = "0" + day;
				}

				notificationFireDateTime = month + '/' + day + '/' + year + " " + formatedTime + ":" + timeStr[1] + ":00";
			}
		}


	} catch(e) {
		throw (e);
	}

	return notificationFireDateTime;
}
