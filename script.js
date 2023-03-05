const weatherForm = document.querySelector('.weather-form');
const locationInput = document.querySelector('input[name="location-input"]');


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
        displayWeatherInfo(weatherData, weatherDescription, weatherWind, weatherClouds);
    } catch {
        console.log("Unable to access weather");
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
        document.body.style.backgroundImage = `url('${data.results[0].urls.raw}')`;
    } catch(err) {
        console.log("Unable to display background image");
    }
}

function displayWeatherInfo(data, description, wind, clouds) {
    console.log(data);
    console.log(description);
    console.log(wind);
    console.log(clouds);
}


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    accessWeather();
});
accessWeather();
