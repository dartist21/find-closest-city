const API_KEY = 'AIzaSyDWg8lbhZTAze4eMTw8c0nT3HY0HQRcyv8';
const cities = [
  'Kolomiya',
  'Otynia',
  'Horodenka',
  'Sniatyn',
  'Palianucya',
  'Yasina',
  'Nadvirna',
  'Deliatyn',
];

async function fetchLatLng(cities) {
  return cities.reduce(async (savedResult, city) => {
    const result = await savedResult;
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&address=${city}`
    ).then(r => r.json());

    if (res.results.length) {
      const r = {
        name: city,
        ...res.results[0].geometry.location,
      };

      return [...result, r];
    } else {
      console.log(`City(village) ${city} can't be geododed with googleapis :(`);
      return result;
    }
  }, []);
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject('Geolocation is not supported by this browser.');
    }
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

async function findClosestCity() {
  const citiesWithLatLng = await fetchLatLng(cities);
  const position = await getPosition();
  const { latitude: lat, longitude: lng } = position.coords;

  const closestCity = citiesWithLatLng
    .map(city => ({
      ...city,
      ditance: calculateDistance(lat, lng, city.lat, city.lng),
    }))
    .reduce((prev, curr) => (prev.ditance < curr.ditance && prev) || curr);

  console.log(`Your location: ${lat} ${lng}`);
  console.log(`Closest City(village): ${closestCity.name}`);
}

findClosestCity();
