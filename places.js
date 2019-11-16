const loadPlaces = function (coords) {
  const PLACES = [{
      name: "Black Sheep Coffee",
      location: {
        lat: 51.547239,
        lng: -0.055501,
      },
      type: "cafe"
    },
    {
      name: "Brew for Two",
      location: {
        lat: 51.547030,
        lng: -0.051352,
      },
      type: "cafe"
    },
    {
      name: "Mare Street Cafe Bar",
      location: {
        lat: 51.543518,
        lng: -0.055170,
      },
      type: "cafe"
    },
    {
      name: "Take 5 Coffee",
      location: {
        lat: 51.547179,
        lng: -0.056289,
      },
      type: "cafe"
    },
    {
      name: "The Grand Howl",
      location: {
        lat: 51.544341,
        lng: -0.046641,
      },
      type: "cafe"
    },
    {
      name: "Pidgin",
      location: {
        lat: 51.545576,
        lng: -0.061183,
      },
      type: "bar"
    },
    {
      name: "MOTH Club",
      location: {
        lat: 51.545751,
        lng: -0.054668,
      },
      type: "bar"
    },
    {
      name: "Heart Of Hackney",
      location: {
        lat: 51.542868,
        lng: -0.055431,
      },
      type: "bar"
    },
    {
      name: "Pub On The Park",
      location: {
        lat: 51.542051,
        lng: -0.058156,
      },
      type: "bar"
    },
    {
      name: "The Spurstowe Arms",
      location: {
        lat: 51.545364,
        lng: -0.063287,
      },
      type: "bar"
    },
    {
      name: "Old Ship Inn",
      location: {
        lat: 51.545854,
        lng: -0.055398,
      },
      type: "restaurant"
    },
    {
      name: "Sutton and Sons Vegan Chip Shop",
      location: {
        lat: 51.546549,
        lng: -0.056436,
      },
      type: "restaurant"
    },
    {
      name: "Silver Lining",
      location: {
        lat: 51.546177,
        lng: -0.054436,
      },
      type: "restaurant"
    },
    {
      name: "LARDO",
      location: {
        lat: 51.543479,
        lng: -0.057273,
      },
      type: "restaurant"
    },
    {
      name: "Hai Ha",
      location: {
        lat: 51.543234,
        lng: -0.055137,
      },
      type: "restaurant"
    },
  ];

  return Promise.resolve(PLACES);
};

window.onload = () => {
  const scene = document.querySelector('a-scene');
  let showCafe = true;
  let showRestaurant = false;
  let showBar = false;

  // first get current user location
  return navigator.geolocation.getCurrentPosition(function (position) {

    $(document).on('click', '.form-check', function() {
       //detect what the user is toggling
      var cafeFormValue = $("#cafeCheckbox").val();
      console.log({cafeFormValue});
      var restaurantFormValue = $("#restaurantCheckbox").val();
      console.log({restaurantFormValue});
      var barFormValue = $("#barCheckbox").val();
      console.log({barFormValue});
    }); 

      // then use it to load from remote APIs some places nearby
      loadPlaces(position.coords)
        .then((places) => {
          places.forEach((place) => {
            const latitude = place.location.lat;
            const longitude = place.location.lng;
            const type = place.type;

            // add place icon
            const icon = document.createElement('a-image');
            icon.setAttribute('visible', false); // set default visibility off
            icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
            icon.setAttribute('name', place.name);
            if (type == 'cafe') {
              icon.setAttribute('src', './assets/coffee-cup.png');
              if (!cafeFormValue) {
                icon.setAttribute('visible', false);
              }
              else {
                icon.setAttribute('visible', true);
              }
            } else if (type == 'restaurant') {
              icon.setAttribute('src', './assets/dish.png');
              if (!restaurantFormValue) {
                icon.setAttribute('visible', false);
              }
              else {
                icon.setAttribute('visible', true);
              }
            } else if (type == 'bar') {
              icon.setAttribute('src', './assets/beer.png');
              if (!barFormValue) {
                icon.setAttribute('visible', false);
              }
              else {
                icon.setAttribute('visible', true);
              }
            }

            // write function here to detect types to show. Is this right?
            if (showCafe && type == 'cafe') {
              icon.setAttribute('visible', true); 
            } else if (showRestaurant && type == 'restaurant') {
              icon.setAttribute('visible', true); 
            } else if (showBar && type == 'bar') {
              icon.setAttribute('visible', true); 
            }

            // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
            icon.setAttribute('scale', '20, 20');

            icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

            const clickListener = function (ev) {
              ev.stopPropagation();
              ev.preventDefault();

              const name = ev.target.getAttribute('name');

              const el = ev.detail.intersection && ev.detail.intersection.object.el;

              if (el && el === ev.target) {
                const label = document.createElement('span');
                const container = document.createElement('div');
                container.setAttribute('id', 'place-label');
                label.innerText = name;
                container.appendChild(label);
                document.body.appendChild(container);

                setTimeout(() => {
                  container.parentElement.removeChild(container);
                }, 1500);
              }
            };

            icon.addEventListener('click', clickListener);

            scene.appendChild(icon);
          });
        });
    },
    (err) => console.error('Error in retrieving position', err), {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000,
    }
  );
};