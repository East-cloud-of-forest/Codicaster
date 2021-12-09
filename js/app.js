import { SubPageTimeTemp } from './subPageTimeTemp.js'
import { SubPageNowWeather } from './subPageNowWeather.js'

class App {
  constructor() {
    this.weatherIcon = document.getElementById('weatherIcon')
    this.icon = new Image()

    this.temp = document.getElementById('temp').getElementsByTagName('h1')[0]
    this.tempIcon = document.getElementById('temp').getElementsByTagName('i')[0]
    this.tempIcon.style.display = 'none'

    this.lon = ''
    this.lat = ''

    this.location = document
      .getElementById('location')
      .getElementsByTagName('p')[0]

    this.city = ''
    this.testclick()

    this.loaction = document.getElementsByTagName('location')
    this.location.addEventListener('click', this.gps.bind(this))
    this.gps()

    this.SubPageTimeTemp = new SubPageTimeTemp()
    this.SubPageNowWeather = new SubPageNowWeather()
  }

  testclick() {
    let ltest = document.getElementById('Ltest').querySelectorAll('button')
    let asdd = this.clickCity.bind(this)
    function btn(i) {
        ltest[i].onclick = function(){
          let city = this
          asdd(city)
      }
    }
    for(let i = 0; i < ltest.length; i++) {
      btn(i)
    }
  }

  clickCity(city) {
    this.city = city.value
    this.cityname = city.innerText
    this.location.innerText = `${
      this.cityname
    }`
    if (this.city == 'select') {
      return
    } else {
      // 현재 날씨
      console.log(this.city)
      this.nowWeather()
    }
  }

  // Weather API
  nowWeather() {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=b905f0c03119f5162e6063c34f4e9e05&units=metric&lang=kr`,
    )
      .then((response) => response.json())
      .then((data) => {
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
      })
      .catch((error) => console.log(('error', error)))
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
  }

  // gps API
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
    // 임시
    this.city = 'busan'
    this.location.innerText = `부산광역시`
    this.nowWeather()
  }

  showErrorMsg() {
    this.location.innerText =
      '위치 정보를 가져올 수 없습니다. 지역을 선택해주세요.'
  }
}

window.onload = () => {
  new App()
}