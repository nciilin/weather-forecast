(function(){
	const HOST = 'http://weixin.jirengu.com'
	const DAYTIME_SEPERATOP = 12;
	const ENTER_KEY =13;
	const DAY_MAPS = {
		"周一": "Mon",
		"周二": "Tue",
		"周三": "Wed",
		"周四": "Sur",
		"周五": "Fri",
		"周六": "Sat",
		"周日": "Sun",
	};

	var myLocation;

	function formatTime(date) {
		var currentHours = date.getHours();
		var currentMinutes = date.getMinutes(); 
		if(currentMinutes < 10 ) {
			currentMinutes = '0' + currentMinutes;
		}
		var suffix = currentHours > DAYTIME_SEPERATOP ? 'pm' : 'am';
		return `${currentHours}:${currentMinutes} ${suffix}`;
	}

	function getImgUrl(code) {
		return `//weixin.jirengu.com/images/weather/code/${code}.png`;
	}


	function setupTime() {
		var currentTime = new Date();
		var timeNode = document.getElementById('time');
		timeNode.textContent = formatTime(currentTime);
		setTimeout(setupTime, 60 * 1000);
	}
	setupTime();


	function showWeather(weather){
		var todayInfo = weather.now;
		var tTempNode = document.getElementById('t-temp');
		tTempNode.textContent = todayInfo.temperature + '°';
		var todayDay = weather.last_update;
		var tDayNode = document.getElementById('t-day');
		tDayNode.textContent = todayDay;

		var tImg = document.getElementById('t-img');
		tImg.src = getImgUrl(todayInfo.code);

		var tWind = document.getElementById('t-wind');
		tWind.textContent = parseInt(todayInfo['wind_speed']) + 'mph';

		var futures = weather.future;
		var fdates = document.querySelectorAll('#future .f-date');
		var fimgs = document.querySelectorAll('#future .f-img');
		var ftemps = document.querySelectorAll('#future .f-temp');

		fdates.forEach((fdate, index) => {
			var perDay = futures[index];
			fdate.textContent = DAY_MAPS[perDay.day];
			var fimg = fimgs[index];
			fimg.src = getImgUrl(perDay.code1);
			var ftemp = ftemps[index];
			ftemp.textContent = perDay.high + '°';


		});

	}	

	$.ajax(`${HOST}/weather/`)
		.done((info) => {
			console.log(info);
			var weather = info.weather[0];
			myLocation = weather['city_name'];
			var localNode = document.getElementById('location');
			localNode.textContent = myLocation;
			showWeather(weather);
		});

	document.addEventListener('keydown', (event) => {
		if(event.keyCode === ENTER_KEY) {
			var inputNode = document.getElementById('u-inp-city');
			var userInput = inputNode.value;
			$.ajax(`${HOST}/weather/cityid?location=${userInput}`)
				.done((res) => {
					var matchedCity = res.results[0];
					var cityId = matchedCity.id;
					$.ajax(`${HOST}/weather/now?cityid=${cityId}`)
						.done((weatherInfo) => {
							var weather = weatherInfo.weather[0];
							showWeather(weather);
						})
				})
		}
	})

})();