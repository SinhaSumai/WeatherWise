window.onload = () => {
    const permission = window.confirm("Allow this website to access your location to show accurate weather information?");
    if (permission) {
        getLocationWeather();
    }
};

function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser. Please enter a city manually.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherByCoordinates(latitude, longitude);
        },
        error => {
            console.error("Error getting user location:", error);
            alert("Error getting user location. Please enter a city manually.");
        }
    );
}

function getWeatherByCoordinates(latitude, longitude) {
    const apiKey = 'd3f08c9342eb4100b83152142242604';
    const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=yes`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            getHourlyForecast(latitude, longitude, data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
}

function getWeather() {
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const apiKey = 'd3f08c9342eb4100b83152142242604';
    const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            getHourlyForecast(data.location.lat, data.location.lon, data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
}

function getHourlyForecast(latitude, longitude, currentWeatherData) {
    const apiKey = 'd3f08c9342eb4100b83152142242604';
    const forecastApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(currentWeatherData, data);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(currentWeatherData, forecastData) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherIconDiv = document.getElementById('weather-icon');
    const additionalInfoDiv = document.getElementById('additional-info');
    const cityDiv = document.getElementById('city-name');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    
    tempDivInfo.innerHTML = '';
    weatherIconDiv.innerHTML = '';
    additionalInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';

    if (currentWeatherData.error || forecastData.error) {
        alert(currentWeatherData.error.message || forecastData.error.message);
    } else {
        const temperature = currentWeatherData.current.temp_c;
        const description = currentWeatherData.current.condition.text;
        const iconUrl = `https:${currentWeatherData.current.condition.icon}`;
        const city = currentWeatherData.location.name;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherConditionHTML = `<p>${description}</p>`;
        const iconHTML = `<img src="${iconUrl}" alt="Weather Icon"><p>${description}</p>`;
        const cityHTML = `<p>${city}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherIconDiv.innerHTML = iconHTML;
        cityDiv.innerHTML = cityHTML;

        
        const additionalInfo = [
            `Wind: ${currentWeatherData.current.wind_kph} km/h ${currentWeatherData.current.wind_dir}`,
            `Pressure: ${currentWeatherData.current.pressure_mb} mb`,
            `Precipitation: ${currentWeatherData.current.precip_mm} mm`,
            `Humidity: ${currentWeatherData.current.humidity}%`,
            `Cloud Cover: ${currentWeatherData.current.cloud}%`,
            `Feels Like: ${currentWeatherData.current.feelslike_c}°C`,
            `Visibility: ${currentWeatherData.current.vis_km} km`,
            `UV Index: ${currentWeatherData.current.uv}`
        ];

        additionalInfo.forEach(info => {
            const infoElement = document.createElement('p');
            infoElement.textContent = info;
            additionalInfoDiv.appendChild(infoElement);
        });

        setBackground(description, currentWeatherData.current.is_day);

        
        if (forecastData.forecast && forecastData.forecast.forecastday.length > 0) {
            const hourlyData = forecastData.forecast.forecastday[0].hour;

            hourlyData.forEach(hour => {
                const hourElement = document.createElement('div');
                hourElement.classList.add('hourly-item');

                const time = new Date(hour.time_epoch * 1000);
                const hourTime = time.getHours();
                const temperatureC = hour.temp_c;
                const weatherIconUrl = `https:${hour.condition.icon}`;

                const hourHTML = `
                    <p>${hourTime}:00</p>
                    <img src="${weatherIconUrl}" alt="Hourly Weather Icon">
                    <p>${temperatureC}°C</p>
                `;

                hourElement.innerHTML = hourHTML;
                hourlyForecastDiv.appendChild(hourElement);
            });
        }
    }
}

function toggleAdditionalInfo() {
    const additionalInfoDiv = document.getElementById('additional-info');
    const toggleButton = document.getElementById('additional-info-toggle');

    if (additionalInfoDiv.style.display === 'none') {
        additionalInfoDiv.style.display = 'block';
        toggleButton.textContent = 'Hide Additional Info';
    } else {
        additionalInfoDiv.style.display = 'none';
        toggleButton.textContent = 'Show Additional Info';
    }
}

function setBackground(weatherDescription, isDay) {
    const body = document.querySelector('body');
    let imageUrl;

    if (isDay === 0) {
        imageUrl = 'night.jpg';
    } else {
        if (weatherDescription.includes('Rain')) {
            imageUrl = 'rain.jpg';
        } else if (weatherDescription.includes('cloudy')) {
            imageUrl = 'cloud.jpg';
        } else if (weatherDescription.includes('Sunny')) {
            imageUrl = 'sunny.jpg';
        } else {
            imageUrl = 'default.jpg'; 
        }
    }

    body.style.backgroundImage = `url('${imageUrl}')`;
}
