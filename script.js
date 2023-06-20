var $ = jQuery.noConflict();

$(document).ready(function() {
  SiteManager.init();
});

var SiteManager = {
  API: 'bf59e8f0af9f627994fc61400829d111', // Replace with your OpenWeatherMap API key
  BASE_URL: 'https://api.openweathermap.org/data/2.5/weather?units=metric',
  
  myFormButton: $('.js-submit-input'),
  myInputField: $('.js-input'),

  init: function() {
    this.myFormButton.on('click', this.onSearchClicked.bind(this));
  },

  onSearchClicked: function() {
    var input = this.myInputField.val();
    this.searchOnCity(input);
  },

  searchOnCity: function(_city) {
    var self = this; // Save the reference to "this" for use inside the AJAX success callback
    $.ajax({
      url: `${this.BASE_URL}&q=${_city}&appid=${this.API}&lang=nl`, // Include lang=nl for Dutch language
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        self.onWeatherLoaded(data); // Use "self" instead of "this" to call the function
        self.setBackgroundImage(data.name); // Call setBackgroundImage with the city name
      },
    });
  },

  formatTime: function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    return hours + ':' + minutes;
  },

  onWeatherLoaded: function(data) {
    console.log(data);
    $('.js-output').html(`&#127777; Temperatuur: ${data.main.temp}. De temperatuur voelt als: ${data.main.feels_like}`);

    var sunriseDate = new Date(data.sys.sunrise * 1000);
    var sunriseTime = this.formatTime(sunriseDate);
    $('.js-output-sunrise').html(`&#127780; De zon komt op om: ${sunriseTime} uur.`);

    $('.js-output-weather').html(`&#127781; Bedekking: ${data.weather[0].description}. &#127786; Windsnelheid: ${Math.round(data.wind.speed * 3.6)} km/h.`);
  },

  setBackgroundImage: function(city) {
    var unsplashApiKey = 'j4UjwoGLbGDO0x1dR7OrC2HDkdOd0TAxvEqPiq_JbC8'; // Replace with your Unsplash API key
    var unsplashApiUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}`;

    $.ajax({
      url: unsplashApiUrl,
      dataType: 'json',
      type: 'GET',
      success: function(response) {
        if (response.results.length > 0) {
          var randomIndex = Math.floor(Math.random() * response.results.length);
          var imageUrl = response.results[randomIndex].urls.regular;
          console.log(imageUrl);
          $('.unsplash').css('background-image', `url(${imageUrl})`);
        }
      },
    });
  },
};
