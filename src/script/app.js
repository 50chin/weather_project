const formNode = document.querySelector('.form');
const btnNode = document.querySelector('.btn');
const input = document.querySelector('.input');
const sectionNode = document.querySelector('.section');
// openweathermap
const API_URL = `https://api.openweathermap.org/data/2.5/`;
const API_KEY = '359b6976d089c50975f19aab60720a15';
//  geo.ipify
const API_GEO_KEY = 'at_xe84wfflLGDu4KgW6V63vdFE4M7Om';
const API_GEO_URL = 'https://geo.ipify.org/api/v2/country,city?apiKey=';
// запрос на геолокацию
navigator.geolocation.getCurrentPosition(showPosition, showNearPosition);
// если геолокация неопределенна
async function showNearPosition() {
  try {
    const res = await fetch(API_GEO_URL + API_GEO_KEY);
    const data = await res.json();
    const latitude = data.location.lat;
    const longitude = data.location.lng;

    const locationData = {
      latitude: latitude,
      longitude: longitude,
    };
    geoWeather(locationData);
  } catch (err) {
    wrongInput();
    renderWrong();
  }
}
// если есть разрешение на геолокациию
function showPosition(position) {
  try {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const locationData = {
      latitude: latitude,
      longitude: longitude,
    };

    geoWeather(locationData);
  } catch (err) {
    wrongInput();
    renderWrong();
  }
}

// запрос на город при вводе инпута
async function checkWeather(cityName) {
  try {
    const res = await fetch(
      API_URL + `weather?units=metric&q=${cityName}&lang=ru&appid=${API_KEY}`
    );
    const data = await res.json();
    createCard(data);
    renderCards(data);
  } catch (err) {
    wrongInput();
    renderWrong();
  }
}
//  запрос по геолокации
async function geoWeather(locationData) {
  try {
    const res = await fetch(
      API_URL +
        `weather?units=metric&lat=${locationData.latitude}&lon=${locationData.longitude}&lang=ru&appid=${API_KEY}`
    );
    const data = await res.json();
    createCard(data);
    renderCards(data);
  } catch (err) {
    wrongInput();
    renderWrong();
  }
}

//  создаю карту по инпуту
const createCard = (data) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = ` <div class="container">
  <h3 class = "temp">${Math.round(data.main.temp)}°C</h3>
    <p class = "subtitle">${data.weather[0].description} в
    ${data.name}</p>
    <btn class = "btn__change">Выбрать другой город</btn>
    </div>`;
  const btnChange = card.querySelector('.btn__change');
  btnChange.addEventListener('click', () => {
    renderInput();
  });
  return card;
};

//  меняю инпут по кнопке change
const changeCity = () => {
  const container = document.createElement('div');
  container.className = 'container';
  container.innerHTML = `<form class="form">
              <input
                type="text"
                class="input"
                placeholder="Напиши город"
              />
              <button class="btn">Поиск</button>
            </form>`;
  const formNode = container.querySelector('.form');
  const input = container.querySelector('.input');
  formNode.addEventListener('submit', (evt) => {
    evt.preventDefault();
    checkWeather(input.value);
  });
  return container;
};
// // если пойма catch, то записывается карта с ошибкой
const wrongInput = () => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = ` <div class="container">
  <h3 class = "temp">Ошибка</h3>
    <p class = "subtitle">обновите страницу</p>
    <btn class = "btn__change">Попробовать снова</btn>
    </div>`;
  const btnChange = card.querySelector('.btn__change');
  btnChange.addEventListener('click', () => {
    renderInput();
  });
  return card;
};
// // рендер карты ошибки
const renderWrong = (data) => {
  sectionNode.innerHTML = '';
  const card = wrongInput(data);
  sectionNode.append(card);
};
// рендер карты инпута
const renderInput = () => {
  sectionNode.innerHTML = '';
  const container = changeCity();
  sectionNode.append(container);
};
// рендер обычной карты
const renderCards = (data) => {
  sectionNode.innerHTML = '';
  const card = createCard(data);
  sectionNode.append(card);
};
// ввод в инпуте
formNode.addEventListener('submit', (evt) => {
  evt.preventDefault();
  checkWeather(input.value);
});
// по кнопке поиск
btnNode.addEventListener('click', () => {
  checkWeather(input.value);
});
