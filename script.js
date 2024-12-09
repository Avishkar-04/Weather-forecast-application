const apiKey = '1758eddaa74529bb5033b72ba010b1d2';  // actual API key
const searchButton = document.getElementById('search-btn');
const cityInput = document.getElementById('city');
const errorMessage = document.getElementById('error-message');
const weatherDetails = document.getElementById('weather-details');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecast = document.getElementById('forecast');
const forecastCards = document.getElementById('forecast-cards');
const recentCitiesDropdown = document.getElementById('recent-cities');
const locationBtn = document.getElementById('location-btn');
const currentWeather = document.getElementById('current-weather');
const currentTemp = document.getElementById('current-temp');
const currentCondition = document.getElementById('current-condition');
const currentWindSpeed = document.getElementById('current-wind-speed');
const currentHumidity = document.getElementById('current-humidity');



// Weather icons URLs
const sunnyIcon = 'https://i.pinimg.com/originals/53/22/c2/5322c2cad533e12e552d0dfdc89b4c25.png';
const cloudyIcon = 'https://cdn-icons-png.flaticon.com/512/1163/1163736.png';
const windyIcon = 'https://cdn-icons-png.flaticon.com/512/1247/1247767.png';
const rainyIcon = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJO3TWD4x_e-qZmboIMfSUuS33n9DPeaqSnA&s';



// Event listener for current location button
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        // Fetch weather for the current location
        fetchWeatherByCoords(lat, lon);
      }, () => {
        alert("Unable to retrieve your location.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });
  
  // Fetch current weather using latitude and longitude
  function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        updateCurrentWeather(data);
        fetchForecastByCoords(lat, lon);  // Fetch the 5-day forecast based on coordinates
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
        alert("Unable to retrieve weather data.");
      });
  }
  // Update the current weather section
function updateCurrentWeather(data) {
    currentWeather.classList.remove('hidden');
    currentTemp.textContent = `${data.main.temp}°C`;
    
    // Fetch the correct weather icon
    const weatherCondition = data.weather[0].main;
    weatherIcon.src = getWeatherIcon(weatherCondition); // Update icon based on weather condition
    
    currentCondition.textContent = weatherCondition;
    currentWindSpeed.textContent = `Wind: ${data.wind.speed} m/s`;
    currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
  }
  // Get appropriate weather icon based on the condition
function getWeatherIcon(condition) {
    if (condition.toLowerCase().includes('clear')) {
      return sunnyIcon;
    } else if (condition.toLowerCase().includes('clouds')) {
      return cloudyIcon;
    } else if (condition.toLowerCase().includes('rain')) {
      return rainyIcon;
    } else if (condition.toLowerCase().includes('wind')) {
      return windyIcon;
    }
    return sunnyIcon; // Default to sunny icon if no match
  }
// Fetch 5-day weather forecast
function fetchForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      updateForecast(data);
    })
    .catch(error => {
      console.error('Error fetching forecast:', error);
    });
}

// Update the 5-day forecast
function updateForecast(data) {
  forecastCards.innerHTML = ''; // Clear existing forecast cards
  const forecastData = data.list;

  // Display forecast for every 8th entry (i.e., one forecast for each day)
  forecastData.forEach((forecast, index) => {
    if (index % 8 === 0) { // Get the forecast for every 8th entry (24 hours apart)
      const forecastCard = document.createElement('div');
      forecastCard.className = 'bg-blue-100 p-4 rounded-md shadow-lg text-center';

      const date = new Date(forecast.dt * 1000);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      // Determine the correct icon for the weather
      const weatherCondition = forecast.weather[0].main.toLowerCase();
      const weatherIconUrl = getWeatherIcon(weatherCondition);

      // Create the forecast card
      forecastCard.innerHTML = `
        <p class="font-semibold">${formattedDate}</p>
        <img src="${weatherIconUrl}" alt="${forecast.weather[0].main}" class="w-12 h-12 mx-auto">
        <p class="text-xl font-semibold">${forecast.main.temp}°C</p>
        <p>Wind: ${forecast.wind.speed} m/s</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
      `;
      
      forecastCards.appendChild(forecastCard);
    }
  });

  forecast.classList.remove('hidden');
}

// Determine appropriate weather icon based on weather condition
function getWeatherIcon(condition) {
  if (condition.includes('clear')) {
    return sunnyIcon;
  } else if (condition.includes('clouds')) {
    return cloudyIcon;
  } else if (condition.includes('rain')) {
    return rainyIcon;
  } else if (condition.includes('wind')) {
    return windyIcon;
  }
  return sunnyIcon; // Default to sunny icon
}


// Search button event listener
searchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) {
    errorMessage.textContent = 'Please enter a city.';
    return;
  }
  fetchWeather(city);
});

// Fetch weather for a specific city
function fetchWeather(city) {
  errorMessage.textContent = ''; // Clear any previous error message
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '404') {
        errorMessage.textContent = 'City not found. Please try again.';
      } else {
        updateWeatherDetails(data);
        storeRecentCity(city);
        fetchForecast(city);
      }
    })
    .catch(error => {
      errorMessage.textContent = 'An error occurred. Please try again later.';
    });
}

// Update current weather details on the UI
function updateWeatherDetails(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${data.main.temp}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  // Set the appropriate weather icon based on weather conditions
  const weatherCondition = data.weather[0].main.toLowerCase();
  if (weatherCondition.includes('clear')) {
    weatherIcon.src = sunnyIcon;
  } else if (weatherCondition.includes('clouds')) {
    weatherIcon.src = cloudyIcon;
  } else if (weatherCondition.includes('rain')) {
    weatherIcon.src = rainyIcon;
  } else if (weatherCondition.includes('wind')) {
    weatherIcon.src = windyIcon;
  } else {
    weatherIcon.src = sunnyIcon; // Default to sunny icon
  }

  weatherDetails.classList.remove('hidden');
}

// Store recent city searches in localStorage
function storeRecentCity(city) {
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    updateRecentCitiesDropdown();
  }
}

// Update the recent cities dropdown
function updateRecentCitiesDropdown() {
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  recentCitiesDropdown.innerHTML = '<option value="" disabled selected>Select a city</option>';
  recentCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    recentCitiesDropdown.appendChild(option);
  });
}
// Event listener for selecting a city from the dropdown
recentCitiesDropdown.addEventListener('change', (e) => {
  const city = e.target.value;
  if (city) {
    fetchWeather(city);
  }
});

// Initialize recent cities dropdown on page load
document.addEventListener('DOMContentLoaded', () => {
  updateRecentCitiesDropdown();
});
// Event listener for current location button
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        // Fetch current weather for the user's location
        fetchWeatherByCoords(lat, lon);
      }, (error) => {
        alert("Error getting location: " + error.message);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });
  
  // Fetch current weather for current location (latitude and longitude)
  function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        updateCurrentWeather(data);  // Update the current weather section with location data
        fetchForecastByCoords(lat, lon);  // Fetch the 5-day forecast for the location
      })
      .catch(error => {
        console.error('Error fetching current location weather:', error);
      });
  }
  
  
  // Fetch 5-day forecast using latitude and longitude
  function fetchForecastByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        updateForecast(data);  // Update the 5-day forecast section
      })
      .catch(error => {
        alert('Error fetching forecast.');
      });
  }
  