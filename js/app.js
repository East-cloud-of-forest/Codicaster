import { SubPageTimeTemp } from './subPageTimeTemp.js'
import { SubPageNowWeather } from './subPageNowWeather.js'

class App {
  constructor() {
    // 임시
    this.W = document.createElement('div')
    document.body.appendChild(this.W)
    this.W.style.width = '200px'
    this.W.style.height = '200px'
    this.W.style.background = 'pink'
    this.W.style.margin = 'auto'
    this.W.style.position = 'absolute'
    this.W.style.top = '50px'
    this.W.style.left = '50px'
    //

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

    this.city = document.getElementById('city')
    this.city.addEventListener('change', this.clickCity.bind(this))

    this.loaction = document.getElementsByTagName('location')
    this.location.addEventListener('click', this.gps.bind(this))
    this.gps()

    this.SubPageTimeTemp = new SubPageTimeTemp()
    this.SubPageNowWeather = new SubPageNowWeather()
  }

  clickCity() {
    if (this.city.value == 'select') {
      return
    } else {
      // 현재 날씨
      this.nowWeather()
    }
  }

  // Weather API
  nowWeather() {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.city.value}&appid=b905f0c03119f5162e6063c34f4e9e05&units=metric&lang=kr`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        // 임시
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let date = today.getDate()
        let day = this.SubPageTimeTemp.getDay(today.getDay())
        let time = today.getHours()

        this.W.innerText = ''
        this.W.innerText += `${data.name}
        온도 : ${data.main.temp}
        최고온도 : ${data.main.temp_max}
        최저온도 : ${data.main.temp_min}

        ${year}년 ${month + 1}월 ${date}일 ${day}
        ${time}시
        `

        // 메인페이지
        this.icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        this.weatherIcon.appendChild(this.icon)

        this.temp.innerHTML = `${Math.round(data.main.temp)}`
        this.tempIcon.style.display = 'block'

        this.location.innerText = `${
          this.city.options[this.city.options.selectedIndex].text
        }`

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

    this.city.value = 'busan'
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
