// access all the front-end element in back-end/
const userTab = document.querySelector("[data-userWeather]");
const serachTab = document.querySelector("[data-serachWeather]");
const userContainer = document.querySelector(".weather-container");

// intilized the all the container for visibility reason

const grantAccessCotainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const wrapper = document.querySelector(".wrapper");



// intitally vairable need???
let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
let cityName = ""

getfromSessionStorage();

function swicthTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
    }
    if (!searchForm.classList.contains("active")) {
        userInfoContainer.classList.remove("active");
        grantAccessCotainer.classList.remove("active");
        searchForm.classList.add("active");
    } else {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");

        getfromSessionStorage();
    }
}

userTab.addEventListener('click', () => {
    swicthTab(userTab)
})

serachTab.addEventListener('click', () => {
    swicthTab(serachTab);
})

// check if user cordinates are already presemt in session storage or not 
// if not present then show teh grant access screen and get user cordinates

function getfromSessionStorage() {
    const locationCoordinates = sessionStorage.getItem("user-coordinates");
    if (!locationCoordinates) {
        grantAccessCotainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(locationCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessCotainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API Call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (e) {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo) {
    // firstly , we have to fetch the elements
    // and then show on the UI

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");

    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudinees]");

    console.log(weatherInfo);
    // fetch values from weatherInfp0 object and put it Ui elements 

    cityName.innerText = weatherInfo.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo.weather[0].description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo.main.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo.main.humidity}%`
    cloudiness.innerText = `${weatherInfo.clouds.all}%`;

    console.log(`${weatherInfo.main.temp}`)
    console.log("chala ki ni")
    console.log(`${weatherInfo.main.humidity}%`)
    const weatherValue = weatherInfo.weather[0].description;
    console.log(weatherValue)
    if (weatherValue.includes('clouds')) {
        wrapper.style.backgroundColor = '#d0cccc'
    } else if (weatherValue.includes('clear')) {
        wrapper.style.backgroundColor = '#66C5DD'
    } else if (weatherValue.includes('rain')) {
        wrapper.style.backgroundColor = '#9099a1'
    } else if (weatherValue.includes('smoke')) {
        wrapper.style.backgroundColor = '#abaeb0'

    }


}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // HW show an alert for no geolocation shuport avalable
        alert("Not Ableto fetch this current position location")
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener('click', getLocation)

const serachInput = document.querySelector("[data-serachInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    cityName = serachInput.value;
    if (cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessCotainer.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (e) {

    }
}