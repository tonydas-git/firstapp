const { response } = require('express');
const express = require('express');
const app = express();
const axios = require('axios');
const WEATHER_URL = 'https://api.weather.gov/points/';

let requestCounter = 0;
const PORT = process.env.PORT || 4444;

app.use(express.static('scripts'));
app.use(express.static('css'));
app.use(logger);
app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
    res.render('weather.ejs');
});

function logger(request, response, next){
    requestCounter = requestCounter + 1;
    request.requestCounter = requestCounter;
    console.log (`${requestCounter} Starting request for .....`);
    next();
    console.log(`${requestCounter} End of Request.`);
}

app.get('/weather/:latlon', async (request, response) => {
    console.log(`Recieved a view weather request for the location ${request.params.latlon}`);
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    let weather_points_response = await axios.get(WEATHER_URL+`${lat},${lon}`);
    const json_response = JSON.parse(JSON.stringify(weather_points_response.data));
    const city = json_response.properties.relativeLocation.properties.city;
    const state = json_response.properties.relativeLocation.properties.state;
    const timeZone = json_response.properties.timeZone;
    const weather_forecast_url = json_response.properties.forecast;
    let weather_forecast_response = await axios.get(weather_forecast_url);
    console.log(JSON.stringify(weather_forecast_response.data));
    response.json({
        city : city,
        state : state,
        timeZone : timeZone,
        weather_forecast : weather_forecast_response.data,
    });
});

app.listen(PORT, () => console.log(`Started listening on port ${PORT}`));
