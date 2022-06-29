// Variable declarations
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
let fiveDaysInfoSection = $("#fiveDaysInfo");
let searchedEl = $("#searched");

// Using moment.js to get the current date
let date = moment().format("MM/DD/YYYY");

// Function to add the searched city to local storage 
function addCityHistory(city) {
  let storedCities = []
  if (localStorage.cities) {
    storedCities = JSON.parse(localStorage.cities);
  }
  
  if (storedCities.includes(city)) {
    return
  }
  storedCities.unshift(city);
  localStorage.cities = JSON.stringify(storedCities);
  displayCities();
}

// function to display search city history on the screen under the search button
function displayCities() {
  if (!localStorage.cities) {
    return
  }
  let storedCities = JSON.parse(localStorage.cities);
  searchedEl.empty()
  for (let i = 0; i < storedCities.length ; i++) {
    cityBtn = $("<button>").text(storedCities[i]).addClass("btn btn-city m-2 ");
    searchedEl.append(cityBtn);
  
  }
}

// Function that creates an API call to the open weather API to get the co-ordinates of the city searched
function getcoordinates(searchInputCity) {
  var coordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInputCity}&limit=1&appid=${APIkey}`;

  return fetch(coordinatesUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      latitude = data[0].lat;
      longitude = data[0].lon;
      cityName = data[0].name;
      cityEl.text(cityName)
      // console.log(cityName);
      addCityHistory(cityName);
      return (latitude,longitude,cityName);    
    })
    .catch(function(){
      alert("Please enter a valid city!")   
      return [];
    });
}

// Function to create an API call to the open weather API to get the weather data of a particular set of co-ordinates and to display them on the screen
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
      
      let UVSpan = $("<span>")
      let iconImageEl = $("<img id='cur-icon'>");
      iconImageEl.attr('src', `./assets/css/icons/${curWeatherIcon}.png`);
      iconImageEl.replaceWith(iconImageEl);
      iconImageEl.appendTo(curIconEl);

      curTempEl.text(`Temperature: ${curTemp} °C`)
      curWindEl.text(`Wind Speed: ${curWindSpeed} m/s`)
      curHumidityEl.text(`Humidity: ${curHumidity} %`)
      curUVEl.text(`UV Index: `)
      UVSpan.text(curUVIndex)
      UVSpan.appendTo(curUVEl)
      if (curUVIndex < 2) {
        UVSpan.addClass("badge bg-success")
      } else if (curUVIndex < 5) {
        UVSpan.addClass("badge bg-warning")
      } else {
        UVSpan.addClass("badge bg-danger")
      }      
      getFiveDayWeather(data);           
    });   
}

// Function that creates separate cards to display the 5 day weather forecast
function getFiveDayWeather(data) {
  
  fiveDaysInfoSection.empty();
  futureDates = date;
  for (let i = 0; i < 5; i++) {
    let forecastCard = $("<div class='card sm-card d-inline col-lg-4 m-5'>");
    let forecastCardHeader = $("<div class='card-header sm-header text-center'>");
    let forecastCardBody = $("<div class='card-body'>");
    
    futureDates = moment(futureDates).add(1, 'd').format("MM/DD/YYYY");
    forecastCardHeader.text(futureDates);
   
    let icon = data.daily[i].weather[0].icon;
    let temperature = data.daily[i].temp.day;    
    let wind = data.daily[i].wind_speed;
    let humidity = data.daily[i].humidity;    
       
    forecastCardBody.replaceWith(forecastCardBody);
    forecastCardBody.append(`<img src="./assets/css/icons/${icon}.png"> <br>`).css({"text-align":"center"});
    forecastCardBody.append(`Temperature: ${temperature} °C <br>`);
    forecastCardBody.append(`Wind Speed: ${wind} m/s <br>`);
    forecastCardBody.append(`Humidity: ${humidity} %`);

    fiveDaysInfoSection.append(forecastCard);
    forecastCard.append(forecastCardHeader);
    forecastCard.append(forecastCardBody);    
  }
}

// Event listener on the search button to get the weather data for the searched city
searchBtnEl.click(function(e){
  e.preventDefault();

  let searchInputCity = searchInputEl.val();
  searchInputEl.val('');
  
  if (searchInputCity){
    getcoordinates(searchInputCity)
    .then((data) => {
      if (data.length) {
        dateEl.text(`(${date})`); 
        $("#cur-icon").remove();
        infoSection.removeClass("d-none");
        infoSection.addClass("d-block");

        getweather(latitude,longitude);
      }
    });
  }  
})

// Event listener on the city buttons in the search history section to display the weather data for that particular city
searchedEl.click(function(e){
  e.preventDefault();
  if (e.target.classList.contains("btn-city")) {
    let searchCity = e.target.textContent;

    if (searchCity){
      getcoordinates(searchCity)
      .then((data) => {
        if (data.length) {
          dateEl.text(`(${date})`); 
          $("#cur-icon").remove();
          infoSection.removeClass("d-none");
          infoSection.addClass("d-block");
  
          getweather(latitude,longitude);
        }
      });
    }  
  }
})

// Calling this function to persist the search history section even if the page is refreshed
displayCities();