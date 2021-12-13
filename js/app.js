import { SubPageTimeTemp } from './subPageTimeTemp.js'
import { SubPageNowWeather } from './subPageNowWeather.js'

// 도시 이름 데이터
import CityInfo from './cityInfo.js'

class App {
  constructor() {
    this.weatherIcon = document.getElementById('weatherIcon')
    this.icon = new Image()

    this.temp = document.getElementById('temp').getElementsByTagName('h1')[0]
    this.tempIcon = document.getElementById('temp').getElementsByTagName('i')[0]
    this.tempIcon.style.display = 'none'

    this.lon = ''
    this.lat = ''

    this.locationIcon = document.getElementById('top').getElementsByTagName('i')[0]
    this.cityChoice = document.getElementById('cityChoiceHidden')
    this.locationIcon.addEventListener('click', () => {
      this.cityChoice.style.display = 'block'
      this.cityChoice.scrollTop = 0
    })

    this.location = document.getElementById('location').getElementsByTagName('p')[0]
    this.city = ''
    this.locationChoice()

    this.loaction = document.getElementsByTagName('location')
    this.location.addEventListener('click', this.gps.bind(this))
    this.gps()

    this.SubPageTimeTemp = new SubPageTimeTemp()
    this.SubPageNowWeather = new SubPageNowWeather()

    window.addEventListener('resize', this.resize.bind(this))
    this.resize()
  }

  resize() {
    let vh = window.innerHeight * 0.01

    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  // Weather API
  nowWeather(data) {
    console.log(data)
     // 메인페이지
    this.icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    this.weatherIcon.appendChild(this.icon)

    this.temp.innerHTML = `${Math.round(data.main.temp)}`
    this.tempIcon.style.display = 'block'

    // 시간별 날씨
    this.maxtemp = data.main.temp_max
    this.mintemp = data.main.temp_min
    this.lon = data.coord.lon
    this.lat = data.coord.lat
    this.timeTemp(this.lat, this.lon, this.mintemp, this.maxtemp)
  }

  timeTemp(lat, lon, curMintemp, curMaxtemp) {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=b905f0c03119f5162e6063c34f4e9e05`,
    )
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      // 메인페이지 시간별 온도
      this.morn = document.getElementsByClassName('morn')[0]
      this.eve = document.getElementsByClassName('eve')[0]
      this.day = document.getElementsByClassName('day')[0]
      this.night = document.getElementsByClassName('night')[0]

      this.morn.innerText = Math.round(data.daily[0].temp.morn)
      this.eve.innerText = Math.round(data.daily[0].temp.eve)
      this.day.innerText = Math.round(data.daily[0].temp.day)
      this.night.innerText = Math.round(data.daily[0].temp.night)

      // 서브페이지
      this.SubPageTimeTemp.htmlInAPI(data)
      this.SubPageNowWeather.htmlInAPI(data, curMintemp, curMaxtemp)
      })
      .catch((error) => console.log(('error', error)))
  }

  // 지역 선택을 이용한 API 호출
  locationChoice() {
    let cityChoice = document.getElementById('cityChoice').querySelectorAll('button')
    let clickCity = this.clickCity.bind(this)
    function btn(i) {
      cityChoice[i].onclick = function(){
        let city = this
        clickCity(city)
      }
    }
    for(let i = 0; i < cityChoice.length; i++) {
      btn(i)
    }
  }

  clickCity(city) {
    this.cityChoice.style.display = 'none'
    this.city = city.value
    if (this.city == 'select') {
      return
    } else {
      this.location.innerText = `${city.innerText}`
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=b905f0c03119f5162e6063c34f4e9e05&units=metric&lang=kr`,
      )
      .then((response) => response.json())
      .then((data) => {this.nowWeather(data)})
      .catch((error) => console.log(('error', error)))
    }
  }

  // GPS를 이용한 API 호출
  gps() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.showLocation.bind(this),
        this.showErrorMsg.bind(this),
      )
    } else {
      this.location.innerText = '위치 정보를 지원하지 않는 브라우저 입니다.'
    }
  }

  showLocation(position) {
    console.log(position)
    let lat = position.coords.latitude
    let lon = position.coords.longitude
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b905f0c03119f5162e6063c34f4e9e05&units=metric&lang=kr`,)
    .then((response) => response.json())
    .then((data) => {
      let cityName = data.name
      console.log(CityInfo[data.id])
      if (CityInfo[data.id] !== 'undefined') {
        if (CityInfo[data.id][1] == CityInfo[data.id][2]) {
          cityName = `${CityInfo[data.id][1]}`
        } else {
          cityName = `${CityInfo[data.id][1]} ${CityInfo[data.id][2]}`
        }
      }
      this.location.innerText = `${cityName}`
      this.nowWeather(data)
    })
    .catch((error) => console.log(('error', error)))
  }

  showErrorMsg() {
    this.location.innerText =
      '위치 정보를 가져올 수 없습니다. 지역을 선택해주세요.'
  }
}

window.onload = () => {
  new App()
}