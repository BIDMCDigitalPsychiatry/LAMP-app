function loadChart(type, data, largest) {// data argument must be properly designed so it can work in different situations
	var templateURL;

	// pre-define different HTML files for different types of charts and different algorithms to interpret the data values
	switch (type) {
	case "PIE":
		templateURL = WPATH('/html/pie.html');
		break;
	case "LINE":
		templateURL = WPATH('/html/line.html');
		break;
	case "SCORE":
		templateURL = WPATH('/html/score.html');
		break;
	}

	$.chartWebView.url = templateURL;
	$.chartWebView.addEventListener('load', function() {
		Ti.API.info('chartWebView ready');
		if (type == "PIE") {
			Ti.API.info('load PIE graph ');
			var region = data.region;
			var s1 = data.s1;
			var s2 = data.s2;
			var s4 = data.t1;
			var s5 = data.t2;
			var s6 = data.t3;
			var s7 = data.t4;
			Ti.App.fireEvent('graphCareer',data);
			//$.chartWebView.evalJS('plotChart(' + JSON.stringify(region) + ',' + JSON.stringify(s1) + ',' + JSON.stringify(s2) + ',' + JSON.stringify(s4) + ',' + JSON.stringify(s5) + ',' + JSON.stringify(s6) + ',' + JSON.stringify(s7) + ')');
		} else if (type == "LINE") {
			Ti.API.info('load LINE graph ');
			var s1 = data.s1;
			var s2 = data.s2;
			var s3 = data.s3;
			var reg = data.reg;
			Ti.App.fireEvent('graphCareer',data);
			//Ti.API.info('data in load chart', data);
			//$.chartWebView.evalJS('plotChart(' + JSON.stringify(s1) + ',' + JSON.stringify(s2) + ',' + JSON.stringify(s3) + ',' + JSON.stringify(reg) + ')');
		} else {
			var region = data.region;
			var s1 = data.s1;
			var s2 = data.s2;
			//var s3 = data.s3;
			var s4 = data.titleY;
			var s5 = data.titleX;
			var s6 = data.titleTop;
			Ti.App.fireEvent('graphCareer',data);
			//Ti.API.info('largest in widget', data.largest);
			//$.chartWebView.evalJS('plotChart(' + JSON.stringify(region) + ',' + JSON.stringify(s1) + ',' + JSON.stringify(s2) + ',' + JSON.stringify(data.largest) + ',' + JSON.stringify(s4) + ',' + JSON.stringify(s5) + ',' + JSON.stringify(s6) + ')');
		}

	});
}

exports.loadChart = loadChart;
