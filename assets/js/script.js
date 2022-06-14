let APIkey = '2ceedd3549f0cc1f23a76b3f55d50640';
let latitude = '';
let longitude = '';
let cityEl = $("#cur-city");
let dateEl = $("#date");
let curIconEl = $("#icon");
let curTempEl = $("#cur-temp");
let curWindEl = $("#cur-wind");
let curHumidityEl = $("#cur-humidity");
let curUVEl = $("#cur-uv");
let searchBtnEl = $("#search-btn");
let searchInputEl = $("#city");

let infoSection = $("#info");


let date = moment().format("MM/DD/YYYY");
// dateEl.text(`(${date})`);
// console.log(date);

function getcoordinates(searchInputCity) {
  var coordinatesUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInputCity}&limit=1&appid=${APIkey}`;

  return fetch(coordinatesUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      latitude = data[0].lat;
      longitude = data[0].lon;
      cityName = data[0].name;
      cityEl.text(cityName)
      console.log(cityName);
      // console.log(data[0].lat, data[0].lon,cityName);  
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
      // console.log(data);
      let curTemp = data.current.temp;
      let curWindSpeed = data.current.wind_speed;
      let curHumidity = data.current.humidity;
      let curUVIndex = data.current.uvi
      let curWeatherIcon = data.current.weather[0].icon;
      
      let iconImageEl = $("<img>");
      iconImageEl.attr('src', `./assets/css/icons/${curWeatherIcon}.png`);
      iconImageEl.appendTo(curIconEl);

      curTempEl.text(`Temperature: ${curTemp} °C`)
      curWindEl.text(`Wind Speed: ${curWindSpeed} m/s`)
      curHumidityEl.text(`Humidity: ${curHumidity} %`)
      curUVEl.text(`UV Index: ${curUVIndex}`)

      // console.log(data.current.temp); // celsius
      // console.log(data.current.wind_speed); // metre/sec
      // console.log(data.current.humidity); // %
      // console.log(data.current.weather[0].icon); // img source
      // console.log(data.current.uvi);

      getFiveDayWeather(data);
           
    });
}

function getFiveDayWeather(data) {

  console.log(data);

  for (let i = 0; i < 5; i++) {

    // date = moment(date).add(1, 'd').format("MM/DD/YYYY");
    // console.log(date);

    // let icon = data.daily[i].weather[0].icon;
    // let temperature = data.daily[i].temp.day;    
    // let wind = data.daily[i].wind_speed;
    // let humidity = data.daily[i].humidity;    
    // console.log(temperature, wind, humidity, icon);
    
  }

  

}



searchBtnEl.click(function(){
  console.log("clicked");
  let searchInputCity = searchInputEl.val();
  console.log(searchInputCity);

  dateEl.text(`(${date})`);  
  infoSection.removeClass("d-none");
  infoSection.addClass("d-block");
  
  getcoordinates(searchInputCity)
    .then(() => getweather(latitude,longitude));
})
