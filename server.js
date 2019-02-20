'use strict'

//Load environdment Vars from .env
require('dotenv').config();

// App Dependancies
const express = require ('express');
const cors = require('cors');

//App Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

//API routes

//locations
app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});
//weather
app.get('/weather', (request, response) => {
  const weatherData = getWeather(request.query.data);
  response.send(weatherData);
})
app.use('*', handleError);

// Make sure server is listening for requests
app.listen(PORT, () => console.log(`App is up on ${PORT}`))

// Helper Functions

// Err Handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went terribly wrong. Toodles!');
}

//creates a new object with our API data
function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(query, geoData);
  return location;

}

function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.results[0].formatted_address;
  this.latitude = res.results[0].geometry.location.lat;
  this.longitude = res.results[0].geometry.location.lng;
}

// creates array of objects with our API data
function getWeather(location) {
  const darkskyData = require('./data/darksky.json');
  //return array filled with weather objects
  return darkskyData.daily.data.map( day=> new Weather(day));
}

//This is the constructor you need for the function getWeather()
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time *1000).toString().slice(0,15);
}
