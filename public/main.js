// (function (exports) {
//   'use strict';

//   function initMap() {
//     exports.map = new google.maps.Map(document.getElementById('coord'), {
//       center: {
//         lat: function lat(latt) {
//           return latt;
//         },
//         lng: function lon(lonn) {
//           return lonn;
//         },
//       },
//       zoom: 8,
//     });
//   }

//   exports.initMap = initMap;
// })((this.window = this.window || {}));

////////////////////////////////////////////////////////////////
// https://api.openweathermap.org/data/2.5/weather?q=london&appid=c1226c86603b57d7b426182adeeeb43c&unit=metrics

function getWeather(unit) {
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const apiKey = 'c1226c86603b57d7b426182adeeeb43c';
  const cityToSearch = $('#cityToSearch').val();

  $.ajax(`${baseUrl}?q=${cityToSearch}&appid=${apiKey}&units=${unit}`)

    .then(function (response) {
      if (response.weather[0].main === 'Rain') {
        $('body').css('background-image', `url(../images/rain.gif)`);
      }
      if (response.weather[0].main === 'Clear') {
        $('body').css('background-image', 'url(../images/clear.jpg)');
      }
      if (response.weather[0].main === 'Clouds') {
        $('body').css('background-image', 'url(../images/clouds.jpeg)');
      }
      const modal = $('.modal-body');
      if (response.weather[0].main === 'Rain') {
        modal.css('background-image', 'url(../images/rain.gif)');
        modal.css('color', 'white');
      }
      $('p').empty();
      $('a').empty();

      //////////////////////////////////////////////////////////////////////////////////////
      //   $('#coord').append(
      //     `<a href="https://www.google.com/maps?q=${response.coord.lat},${response.coord.lon}" target="_blank">google maps</a>`
      //   );
      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      for (const property in response.main) {
        $('#main').append(
          //`<p>${property}: ${response.main[property].toFixed(0)}</p>`
          `<p>${property
            .split('_')
            .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
            .join(' ')}:
            ${response.main[property].toFixed(0)}
          </p>`
        );
      }
      for (const property in response.weather[0]) {
        $('#weather').append(
          `<p>${property}: ${response.weather[0][property]}</p>`
        );
      }
      $('#sys').append(
        `<p>Sunrise: ${new Date(
          response.sys.sunrise * 1000
        ).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(
          response.sys.sunset * 1000
        ).toLocaleTimeString()}</p>`
      );
      for (const property in response.clouds) {
        $('#clouds').append(`<p>${property}: ${response.clouds[property]}</p>`);
      }
      for (const property in response.wind) {
        $('#wind').append(`<p>${property}: ${response.wind[property]}</p>`);
      }
      for (const property in response.rain) {
        $('#rain').append(`<p>${property}: ${response.rain[property]}</p>`);
      }

      $('#timezone').append(`<p>${response.timezone}</p>`);

      $('#id').append(`<p>${response.id}</p>`);

      $('#name').append(`<p>${response.name}</p>`);

      $('#cod').append(`<p>${response.cod}</p>`);
      $('#base').append(`<p>${response.base}</p>`);
    })

    .catch(console.error);
}

/////////////////////////////////////////////////
// ///map map map map map map map map map map map map map map map//////////
function initMap() {
  var map = new google.maps.Map(document.getElementById('coord'), {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
  });
  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function () {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('cityToSearch').value;
  geocoder.geocode({ address: address }, function (results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// ////////////////////////////////////////////////////////////////////
$('#submit').on('click', function (event) {
  event.preventDefault();

  $('.gallery').show();

  getWeather('metric');
});

// switch to units to F°
$('#fh').on('click', function (event) {
  event.preventDefault();
  $('p').empty();
  getWeather('imperial');
});
//switch back to C°
$('#cl').on('click', function (event) {
  $('gif').empty();
  event.preventDefault();
  $('p').empty();
  getWeather('metric');
});

// modal

$('.gallery').on('click', 'div', function () {
  const title = $(this).find('h2').text();
  const element = $(this).html();
  $('.modal-title').text(title);
  $('.modal-body').html(` <div>${element}</div >`).find('h2').remove();

  $('#exampleModal').modal('show').find('#coord').hide();
});
