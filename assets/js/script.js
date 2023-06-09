
window.addEventListener("load", function () {
    //on load see if there's anything in localstorage for previous searches
    const cachedCityJSON = localStorage.getItem("pastCity");
    if (cachedCityJSON) {
        cachedCity = JSON.parse(cachedCityJSON);
        cachedCity.forEach(function (city) {
            addPast(city);
        });
    }
    if (cachedCity.length === 0) {
        pastSearches.hidden = true;
    }
});

const searchForm = document.getElementById("search-form");
const todayWeather = document.getElementById("weather-today");
const fiveDayForecast = document.getElementById("five-day-forecast");
const apiKey = "ef20bc3f8fc3da07cc17e6cea84240e1";
var units = "imperial";
var cachedCity = [];
const pastSearches = document.getElementById("past-searches");
const fiveDay = document.getElementById("five-day-text");

//optional units = imperial, metric, standard
//pass city to promise to get data - weatherData
function getWeather(city) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
    fetch(requestUrl)
        .then(function (response) {
            if (!response.ok) {
                todayWeather.innerHTML = `<p class="text-5xl font-black text-red-600 uppercase">PLEASE TRY YOUR SEARCH AGAIN!</p>`;
                fiveDay.classList.add('hidden');
                fiveDayForecast.classList.add('hidden');
                throw new Error(`HTTP ERROR WEEWOOWEEWOO! status ${response.status}`)

            }

            return response.json();
        })
        .then(function (weatherData) {
            todayWeatherPrint(weatherData);
            fiveDayForecastPrint(weatherData);
            fiveDay.classList.remove('hidden');
            fiveDayForecast.classList.remove('hidden');
        })
        .catch (function(error) {
            console.error('Error fetching weather data:', error);
        });
}

//search city functionality
searchForm.addEventListener("submit", function (searchCity) {
    searchCity.preventDefault();
    const searchInput = document.getElementById("simple-search");
    const city = searchInput.value.trim();
    //trim search, make sure it's a valid search then continue to promise
    //else error signal
    if (city) {
        getWeather(city);
        //pastSearchChecker(); v2.0 maybe
    } else {
        console.log("something unexpected so far?");
        //make 404 or anything other than 200 message!

    }
});

//let's start out with 12PM for each day. json returns an array with length 40
//each day in 3 hour increments, so 5 days

//convert immediate day at list[0]
function convertDate(weatherData, i) {
    if (weatherData.list.length <= i) return null;
    const dateData = weatherData.list[i].dt_txt;
    const inputDate = new Date(dateData);
    const timeZone = weatherData.city.timeZone;
    const options = {
        timeZone: timeZone,
        month: "numeric",
        day: "numeric",
        year: "numeric",
    };
    const newDate = inputDate.toLocaleDateString("en-US", options);
    return newDate;
}

function todayWeatherPrint(weatherData) {
    const todayIcon = weatherData.list[0].weather[0].icon;
    const weather = document.createElement("div");
    const currentDate = convertDate(weatherData, 0);
    const wind = weatherData.list[0].wind.speed;
    const temp = weatherData.list[0].main.temp;
    const location = weatherData.city.name;
    const humidity = weatherData.list[0].main.humidity;
    const iconURL = `https://openweathermap.org/img/wn/${todayIcon}.png`;
    const iconAltText = weatherData.list[0].weather[0].description;
    weather.innerHTML = `
        <div class="flex p-5">
            <div class="flex">
                <h2 class="text-xl">${location} (${currentDate})</h2> <img src="${iconURL}" alt="${iconAltText} class="self-start" />
            </div>
        </div>
        <div class="flex flex-col p-4">
            <p>Temp: ${temp}°F</p>
            <p>Wind: ${wind} MPH</p>
            <p>Humidity: ${humidity} %</p>
        </div>
    `;
    //clean this area when new search is performed
    todayWeather.innerHTML = "";
    todayWeather.classList.add("border-2");
    todayWeather.appendChild(weather);

    //set data to localstorage

    if (weatherData.cod == 200) {
        cachedCity.unshift(location.toUpperCase()); //put recent search into 1st spot
        if (cachedCity.length > 10) {
            // if prev search > 10, limit it to 10

            cachedCity.splice(10);
        }
        localStorage.setItem("pastCity", JSON.stringify(cachedCity));
        addPast(location);
    }
}

/*function pastSearchChecker() { v2.0 perhaps will compare current search vs existing and then do some sort of animation to move the past search up to the top.
    const searchInput = document.getElementById('simple-search');
    const citySearched = searchInput.value.trim();
    if (!citySearched) return;

}*/


function addPast(location) {
    const pastCity = location.toUpperCase();
    const pastCityList = document.getElementById("past-city-list");
    const pastCityEle = document.createElement("li");
    const pastCityButton = document.createElement("button");
    pastCityButton.textContent = pastCity;
    //event listener for past city buttons
    pastCityButton.addEventListener("click", function () {
        const cachedCityJSON = localStorage.getItem(pastCity);
        if (cachedCityJSON) {
            const weatherData = JSON.parse(cachedCityJSON);

            if (weatherData.length > 10) {
                weatherData.splice(10);
            }

            todayWeatherPrint(weatherData);
            fiveDayForecastPrint(weatherData);
        } else {
            getWeather(pastCity);
        }
    });

    if (pastCityList.childNodes.length === 10) {
        pastCityList.removeChild(pastCityList.lastChild);
    }

    pastCityEle.appendChild(pastCityButton);
    pastCityList.insertBefore(pastCityEle, pastCityList.firstChild);

    if (pastCityButton) {
        pastCityButton.classList =
            "ml-2 w-full text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900";
    }
}

function fiveDayForecastPrint(weatherData) {

    fiveDayForecast.innerHTML = "";

    for (i = 0; i < 5; i++) {
        const futureData = weatherData.list[(i + 1) * 8 - 1];
        const dayOfWeek = new Date(futureData.dt * 1000).toLocaleDateString(); //get last record for each day
        const futureIcon = futureData.weather[0].icon;
        const futureIconURL = `https://openweathermap.org/img/wn/${futureIcon}.png`;
        const futureTemp = futureData.main.temp; //last temperature of the future day
        const futureWind = futureData.wind.speed;
        const futureHumidity = futureData.main.humidity;


        fiveDayForecast.innerHTML += `
        <div class="future_day bg-purple-300 p-3 sm:mx-4 rounded my-2">
          <p class="text-center">${dayOfWeek}</p>
          <img src="${futureIconURL}" />
          <p>Temp: ${futureTemp}°F</p>
          <p>Wind: ${futureWind} MPH</p>
          <p>Humidity: ${futureHumidity} %</p>

        </div>
      `;
    }
}
