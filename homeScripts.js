let lat, lon;

if('geolocation' in navigator){
    console.log('Geo location is available')
    console.log(`${document.location.pathname}`);
    navigator.geolocation.getCurrentPosition(async (position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log(position);
      document.getElementById('latitude').textContent = position.coords.latitude;
      document.getElementById('longitude').textContent = position.coords.longitude;
    })
}else{
  console.log('Geo location is available')
}

async function getBrowser(){
  let userAgentString =  navigator.userAgent; 
  // Detect Chrome 
  if(userAgentString.indexOf("Chrome") > -1){
      return 'chrome';
  }else if (userAgentString.indexOf("Firefox") > -1){
      return 'firefox';
  }else if (userAgentString.indexOf("Firefox") > -1){
      return 'safari';
  }
}

async function btnOnClick(){
  const data = {
      lat :  document.getElementById('latitude').textContent,
      long :  document.getElementById('longitude').textContent,
      browser :  await getBrowser()
  }

 const options = {
      method : 'POST',
      body : JSON.stringify(data),
      headers : {
          'Content-Type' : 'application/json'
      }
  };
  const response = await fetch('/api', options);
  const json = await response.json();
  console.log(json);
}

async function getWeather(){
  console.log(`${lat}, ${lon}`);
  const options = {
    method : 'GET',
    headers : {
        'Content-Type' : 'application/json'
    }
  };
  const api_url = `/weather/${lat},${lon}`;
  const fetch_response = await fetch(api_url, options);
  const json = await fetch_response.json();
  console.log(json);
  const city = json.city;
  const state = json.state;
  const timezone = json.timeZone;
  const forecasts = json.weather_forecast.properties.periods;
  const parent = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = `Weather forecast for ${city} ${state} ${timezone}`;
  label.textContent.bold = true;
  const root = document.createElement('div');
  forecasts.forEach(forecast => {
    const paragraph = document.createElement('p');
    const detailedForecast = document.createElement('div');
    const endTime = document.createElement('div');
    const image = document.createElement('img');
    const isDaytime = document.createElement('div');
    const name = document.createElement('div');
    const shortForecast = document.createElement('div');
    const startTime = document.createElement('div');
    const temperature = document.createElement('div');
    const temperatureTrend = document.createElement('div');
    const temperatureUnit = document.createElement('div');
    const windDirection = document.createElement('div');
    const windSpeed = document.createElement('div');

    detailedForecast.textContent = `Detailed ForeCast : `+ forecast.detailedForecast;
    image.src = forecast.icon;
    isDaytime.textContent = `Is Day Time : `+ forecast.isDaytime;
    name.textContent = `Name : `+ forecast.name;
    shortForecast.textContent = `Short Forecast : `+ forecast.shortForecast;
    startTime.textContent = `Short Forecast : `+ forecast.startTime;
    endTime.textContent = `End Time : `+ forecast.endTime;
    temperature.textContent = `Temperature Forecast : `+ forecast.temperature;
    temperatureTrend.textContent = `Temperature Trend Forecast : `+ forecast.temperatureTrend;
    temperatureUnit.textContent = `Temperature Unit  : `+ forecast.temperatureUnit;
    windDirection.textContent = `Wind Direction Unit  : `+ forecast.windDirection;
    windSpeed.textContent = `Wind Speed Unit  : `+ forecast.windSpeed;

    paragraph.append(detailedForecast, image, isDaytime, name, shortForecast, 
      startTime, endTime, temperature, temperatureTrend, temperatureUnit, windDirection, windSpeed);
    root.append(paragraph);
});
parent.append(label, root);
document.body.append(parent);
}
