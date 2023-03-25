
const searchBtn = document.getElementById('search');
searchBtn.addEventListener('click', apiCall);
const apiKey = 'ef20bc3f8fc3da07cc17e6cea84240e1';
var city = '';
var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

function apiCall() {
    //trim search, make sure it's a valid search then continue to promise
    //else error signal

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then (function (weatherData){
        console.log(weatherData);
        console.log('function');
        console.log(weatherData);
    })


}




apiBtn.addEventListener('click', apiCall);
