

const API_KEYS = {
    openWeatherMap: 'Use_YOUR_WEATHERAPI_KEY', // OpenWeatherMap
    weatherApi: 'Use_YOUR_WEATHERAPI_KEY', // WeatherAPI.com
    tomorrowIo: 'Use_YOUR_TOMORROW_IO_KEY' // Tomorrow.io
};

// For this demo, we'll use OpenWeatherMap
const apiKey = API_KEYS.openWeatherMap;
let weatherDataDiv, locationInput, searchBtn, errorMessage, loading, body, cityButtons;


document.addEventListener('DOMContentLoaded', function() {
    
    weatherDataDiv = document.getElementById('weatherData');
    locationInput = document.getElementById('locationInput');
    searchBtn = document.getElementById('searchBtn');
    errorMessage = document.getElementById('errorMessage');
    loading = document.getElementById('loading');
    body = document.body;
    cityButtons = document.querySelectorAll('.city-btn');

    // Weather icons mapping
    const weatherIcons = {
        'clear': 'fas fa-sun',
        'clouds': 'fas fa-cloud',
        'rain': 'fas fa-cloud-rain',
        'drizzle': 'fas fa-cloud-sun-rain',
        'thunderstorm': 'fas fa-bolt',
        'snow': 'fas fa-snowflake',
        'mist': 'fas fa-smog',
        'haze': 'fas fa-smog',
        'fog': 'fas fa-smog'
    };

    // Weather themes mapping
    const weatherThemes = {
        'clear': 'sunny',
        'clouds': 'cloudy',
        'rain': 'rainy',
        'drizzle': 'rainy',
        'thunderstorm': 'stormy',
        'snow': 'snowy',
        'mist': 'misty',
        'haze': 'misty',
        'fog': 'misty'
    };

    // Initialize with default weather
    updateWeatherDisplay({
        name: "New York",
        sys: { country: "US" },
        main: { temp: 24, humidity: 65, pressure: 1013 },
        weather: [{ main: "Clear", description: "Sunny" }],
        wind: { speed: 12 }
    });

    // Event listeners
    searchBtn.addEventListener('click', getWeather);
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getWeather();
    });

    cityButtons.forEach(button => {
        button.addEventListener('click', () => {
            locationInput.value = button.dataset.city;
            getWeather();
        });
    });

    // Fetch weather data
    async function getWeather() {
        const location = locationInput.value.trim();
        
        if (!location) {
            showError("Please enter a city name");
            return;
        }
        
        showLoading();
        
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            
            const data = await response.json();
            hideError();
            updateWeatherDisplay(data);
        } catch (error) {
            showError("City not found. Please try another location.");
            console.error('Error fetching weather data:', error);
        } finally {
            hideLoading();
        }
    }

    // Update weather display
    function updateWeatherDisplay(data) {
        const { name, sys, main, weather, wind } = data;
        const weatherMain = weather[0].main.toLowerCase();
        const weatherDesc = weather[0].description;
        
        // Update weather data
        document.querySelector('.temperature').textContent = `${Math.round(main.temp)}°C`;
        document.querySelector('.location').textContent = `${name}, ${sys.country}`;
        document.querySelector('.description').textContent = weatherDesc;
        document.querySelector('.humidity').textContent = `${main.humidity}%`;
        document.querySelector('.wind').textContent = `${wind.speed} km/h`;
        document.querySelector('.pressure').textContent = `${main.pressure} hPa`;
        
        // Update weather icon
        const iconClass = weatherIcons[weatherMain] || 'fas fa-cloud';
        document.querySelector('.weather-icon i').className = iconClass;
        
        // Apply theme based on weather
        const themeClass = weatherThemes[weatherMain] || 'sunny';
        body.className = themeClass;
        
        
        weatherDataDiv.style.transform = 'scale(0.95)';
        setTimeout(() => {
            weatherDataDiv.style.transform = 'scale(1)';
        }, 300);
    }

    // Show/hide loading
    function showLoading() {
        loading.style.display = 'block';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }

    // Show/hide error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }
});
