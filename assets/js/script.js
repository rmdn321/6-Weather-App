let APIkey = '2ceedd3549f0cc1f23a76b3f55d50640';
let latitude = '';
let longitude = '';
let cityEl = $("#cur-city");
let dateEl = $("#date");
let curIconEl = $("#icon");



let date = moment().format("MM/DD/YYYY");
dateEl.text(`(${date})`);
console.log(date);

function getcoordinates() {
  var coordinatesUrl = `http://api.openweathermap.org/geo/1.0/direct?q=london&limit=1&appid=${APIkey}`;

  return fetch(coordinatesUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      latitude = data[0].lat;
      longitude = data[0].lon;
      cityName = data[0].name;
      cityEl.text(cityName)
      console.log(data);
      console.log(data[0].lat, data[0].lon,cityName);  
      return (latitude,longitude,cityName);    
    });
}

function getweather(lat,lon) {

  var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {      
      console.log(data);
      let curTemp = data.current.temp;
      let curWindSpeed = data.current.wind_speed;
      let curHumidity = data.current.humidity;
      let curUVIndex = data.current.uvi
      let curWeatherIcon = data.current.weather[0].icon;
      
      let iconImageEl = $("<img>");
      iconImageEl.attr('src', `./assets/css/icons/${curWeatherIcon}.png`);
      iconImageEl.appendTo(curIconEl);

      console.log(data.current.temp); // celsius
      console.log(data.current.wind_speed); // metre/sec
      console.log(data.current.humidity); // %
      console.log(data.current.weather[0].icon); // img source
      console.log(data.current.uvi);

    
           
    });
}


getcoordinates().then(() => getweather(latitude,longitude));