
const apiBtn = document.getElementById('api-test');
apiBtn.addEventListener('click', apiCall);
const apiKey = 'ef20bc3f8fc3da07cc17e6cea84240e1';
var city = '';
var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

function apiCall() {


    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then (function (data){
        console.log(data);
        console.log('function');
        console.log(data.city);
    })
}




apiBtn.addEventListener('click', apiCall);
