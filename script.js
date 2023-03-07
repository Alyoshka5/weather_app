const mainInfoDiv = document.querySelector('.main-info');
const temperatureDiv = document.querySelector('.temperature');
const locationDiv = document.querySelector('.location');
const looksDiv = document.querySelector('.looks .look-main');
const looksImage = document.querySelector('.looks-image');
const sideBar = document.querySelector('.side-bar');
const weatherForm = document.querySelector('.weather-form');
const locationInput = document.querySelector('input[name="location-input"]');
const looksDescriptionDiv = document.querySelector('.looks-description .data');
const feelsLikeDiv = document.querySelector('.feels-like .data');
const highestTempDiv = document.querySelector('.highest-temperature .data');
const lowestTempDiv = document.querySelector('.lowest-temperature .data');
const windDiv = document.querySelector('.wind .data');
const cloundsDiv = document.querySelector('.clouds .data');
const humidityDiv = document.querySelector('.humidity .data');
const tempToggle = document.querySelector('.temp-toggle');

const weatherIconCodes = {
    "Thunderstorm": "11d",
    "Drizzle": "09d",
    "Rain": "09d",
    "Snow": "13d",
    "Mist": "50d",
    "Smoke": "50d",
    "Haze": "50d",
    "Dust": "50d",
    "Fog": "50d",
    "Sand": "50d",
    "Ash": "50d",
    "Squall": "50d",
    "Tornado": "50d",
    "Clear": "01d",
    "Clouds": "03d"
}

const kelvinToCelcius = (k) => { return k - 273.15 }
const kelvinToFahrenheit = (k) => { return (k - 273.15) * 1.8 + 32 }
const fahrenheitToCelcius = (f) => { return (f - 32) * 5/9 }
const celciusToFehrenheit = (c) => { return (c * 9/5) + 32 }

async function accessWeather() {
    let location = locationInput.value ? locationInput.value : await getCurrentLocation();
    console.log(location);
    locationInput.value = '';

    try {
        let weatherInfo = await getData(location);
        let weatherData = weatherInfo.main;
        let weatherDescription = weatherInfo.weather[0];
        let weatherWind = weatherInfo.wind;
        let weatherClouds = weatherInfo.clouds;
        await displayImage(location);
        displayWeatherInfo(location, weatherData, weatherDescription, weatherWind, weatherClouds);
    } catch(err) {
        console.log("Unable to access weather");
        console.log(err);
    }

}

async function getData(location) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=a097c5f0bc5a49d93fc7a4332da0473b`);
        let weatherData = await response.json()
        return weatherData;
    } catch(err) {
        console.log(err);
    }
}

async function getCurrentLocation() {
    let response = await fetch("https://ipinfo.io/json?token=031324daa1c557");
    let data = await response.json();
    return data.city;
}

async function displayImage(location) {
    try {
        let pageNumber = Math.floor(Math.random() * 99) + 1;
        let response = await fetch(`https://api.unsplash.com/search/photos/?query=${location}&orientation=landscape&page=${pageNumber}&per_page=1&client_id=fUTTEnwwKbmJ8TaYgAbZzOnPBwq48KAsEyLpZ_eXctM`);
        let data = await response.json();
        document.body.style.backgroundImage = `url('${data.results[0].urls.regular}')`;
    } catch(err) {
        console.log("Unable to display background image");
    }
}

function displayWeatherInfo(location, data, description, wind, clouds) {
    locationDiv.textContent = location.charAt(0).toUpperCase() + location.slice(1);
    looksDiv.textContent = description.main;
    looksImage.src = `http://openweathermap.org/img/wn/${weatherIconCodes[description.main]}@2x.png`;
    
    looksDescriptionDiv.textContent = description.description;
    if (tempToggle.classList.contains('temp-toggle-selected')) {
        temperatureDiv.textContent = `${Math.round(kelvinToCelcius(data.temp))}°`;
        feelsLikeDiv.textContent = `${Math.round(kelvinToCelcius(data.feels_like))}°C`;
        highestTempDiv.textContent = `${Math.round(kelvinToCelcius(data.temp_max))}°C`;
        lowestTempDiv.textContent = `${Math.round(kelvinToCelcius(data.temp_min))}°C`;
    } else {
        temperatureDiv.textContent = `${Math.round(kelvinToFahrenheit(data.temp))}°`;
        feelsLikeDiv.textContent = `${Math.round(kelvinToFahrenheit(data.feels_like))}°F`;
        highestTempDiv.textContent = `${Math.round(kelvinToFahrenheit(data.temp_max))}°F`;
        lowestTempDiv.textContent = `${Math.round(kelvinToFahrenheit(data.temp_min))}°F`;
    }

    windDiv.textContent = `${Math.round(wind.speed)}km/h`;
    cloundsDiv.textContent = `${clouds.all}%`;
    humidityDiv.textContent = `${data.humidity}%`;
}

function convertTemperature() {
    tempToggle.classList.toggle('temp-toggle-selected');

    if (tempToggle.classList.contains('temp-toggle-selected')) {
        temperatureDiv.textContent = `${Math.round(fahrenheitToCelcius(parseInt(temperatureDiv.textContent)))}°`;
        feelsLikeDiv.textContent = `${Math.round(fahrenheitToCelcius(parseInt(feelsLikeDiv.textContent)))}°C`;
        highestTempDiv.textContent = `${Math.round(fahrenheitToCelcius(parseInt(highestTempDiv.textContent)))}°C`;
        lowestTempDiv.textContent = `${Math.round(fahrenheitToCelcius(parseInt(lowestTempDiv.textContent)))}°C`;
    } else {
        temperatureDiv.textContent = `${Math.round(celciusToFehrenheit(parseInt(temperatureDiv.textContent)))}°`;
        feelsLikeDiv.textContent = `${Math.round(celciusToFehrenheit(parseInt(feelsLikeDiv.textContent)))}°F`;
        highestTempDiv.textContent = `${Math.round(celciusToFehrenheit(parseInt(highestTempDiv.textContent)))}°F`;
        lowestTempDiv.textContent = `${Math.round(celciusToFehrenheit(parseInt(lowestTempDiv.textContent)))}°F`;
    }
}

tempToggle.addEventListener('click', convertTemperature);
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    accessWeather();
});

accessWeather();
