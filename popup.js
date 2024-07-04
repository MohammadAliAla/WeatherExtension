document.addEventListener('DOMContentLoaded', function () {
	const weatherButton = document.getElementById('weather-button');
	const cityInput = document.getElementById('city-input');
	const getLocationWeatherBtn = document.getElementById('getLocationWeather');
	const apiKey = '7fedfb48eb1c334ace43d7fe44825f72'; // Replace with your OpenWeatherMap API key
	const weatherTableBody = document.getElementById('weather-table-body');
	
	weatherButton.addEventListener('click', getWeather);
	cityInput.addEventListener('keypress', function (event) {
	  if (event.key === 'Enter') {
		getWeather();
	  }
	});
	
	getLocationWeatherBtn.addEventListener('click', getLocationWeather);
	
	function getWeather() {
	  const city = cityInput.value.trim();
	  if (!city) {
		alert('Please enter a city name');
		return;
	  }
	
	  fetchWeatherDataByCity(city);
	}
	
	function fetchWeatherDataByCity(city) {
	  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
	  fetchWeather(apiUrl);
	}
	
	function getLocationWeather() {
	  if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(position => {
		  const lat = position.coords.latitude;
		  const lon = position.coords.longitude;
		  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
		  fetchWeather(apiUrl);
		}, error => {
		  console.error('Error getting location:', error);
		  alert('Error getting your location. Please try again.');
		});
	  } else {
		alert('Geolocation is not supported by your browser.');
	  }
	}
	
	function fetchWeather(apiUrl) {
	  fetch(apiUrl)
		.then(response => {
		  if (!response.ok) {
			throw new Error('Network response was not ok');
		  }
		  return response.json();
		})
		.then(data => {
		  // Handle weather data response
		  handleWeatherData(data);
		})
		.catch(error => {
		  console.error('Error fetching weather data:', error);
		  alert('Error fetching weather data. Please try again.');
		});
	}
	
	function handleWeatherData(data) {
	  weatherTableBody.innerHTML = ''; // Clear previous rows
	
	  const weatherEmojis = {
		'clear sky': '☀️',
		'few clouds': '🌤️',
		'scattered clouds': '🌥️',
		'broken clouds': '⛅',
		'shower rain': '🌧️',
		'rain': '🌧️',
		'light rain': '🌧️',
		'thunderstorm': '⛈️',
		'snow': '❄️',
		'light snow': '🌨️',
		'mist': '🌫️',
		'overcast clouds': '☁️',
		'moderate rain': '🌧️'
		// Add more as needed
	  };
	
	  const forecast = data.list.slice(0, 14); // Get the first 14 entries
	  forecast.forEach(entry => {
		const date = new Date(entry.dt * 1000); // Convert timestamp to date
		const dateStr = date.toDateString();
		const timeStr = date.toLocaleTimeString();
		const temp = entry.main.temp;
		const desc = entry.weather[0].description;
		const emoji = weatherEmojis[desc.toLowerCase()] || ''; // Get emoji for weather description
	
		// Create table row and cells for each weather entry
		const row = weatherTableBody.insertRow();
		const dateCell = row.insertCell();
		const timeCell = row.insertCell();
		const tempCell = row.insertCell();
		const descCell = row.insertCell();
	
		// Populate cell data with emoji
		dateCell.textContent = dateStr;
		timeCell.textContent = timeStr;
		tempCell.textContent = `${temp}°C`;
		descCell.textContent = `${emoji} ${desc}`; // Add emoji before description
	  });
	}
  });
  