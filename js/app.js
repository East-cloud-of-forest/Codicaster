import { SubPageTimeTemp } from './subPageTimeTemp.js'
import { SubPageNowWeather } from './subPageNowWeather.js'

class App {
  constructor() {
    // 임시
    this.W = document.createElement('div')
    document.body.appendChild(this.W)
    this.W.style.width = '300px'
    this.W.style.height = '300px'
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

    this.maxminTemp = document.getElementById('maxminTemp')
    this.windHumidity = document.getElementById('windHumidity')
    this.optionInfo = document.getElementById('optionInfo')
    this.sunTime = document.getElementById('sunTime')

    this.location = document
      .getElementById('location')
      .getElementsByTagName('p')[0]

    this.city = document.getElementById('city')
    this.city.addEventListener('change', this.clickCity.bind(this))

    this.loaction = document.getElementsByTagName('location')
    this.location.addEventListener('click', this.gps.bind(this))
    this.gps()

    new SubPageTimeTemp()
    new SubPageNowWeather()
  }

  clickCity() {
    if (this.city.value == 'select') {
      return
    } else {
      // 현재 날씨
      this.nowWeather()
    }
  }

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
        let day = this.getDay(today.getDay())
        let time = today.getHours()

        this.W.innerText = ''
        this.W.innerText += `${data.name}
        온도 : ${data.main.temp}
        최고온도 : ${data.main.temp_max}
        최저온도 : ${data.main.temp_min}

        ${year}년 ${month + 1}월 ${date}일 ${day}
        ${time}시
        `
        // ----------
        this.maxtemp = data.main.temp_max
        this.mintemp = data.main.temp_min

        // 메인페이지
        this.icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        this.weatherIcon.appendChild(this.icon)

        this.temp.innerHTML = `${Math.round(data.main.temp)}`
        this.tempIcon.style.display = 'block'

        this.location.innerText = `${
          this.city.options[this.city.options.selectedIndex].text
        }`

        // 시간별 날씨
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

        // 시간별 온도 서브 페이지, 시간별 온도
        this.hourTemp = document.getElementById('hourTemp')
        this.hourTemp.innerHTML = ``
        for (let i = 0; i < data.hourly.length; ++i) {
          let dt = data.hourly[i].dt * 1000
          let time = new Date(dt)
          let hour = `<p>${time.getHours()}</p>`
          let temp = Math.round(data.hourly[i].temp)

          if (time.getHours() == 0) {
            if (time.getDate() == new Date().getDate()) {
              hour = `<p class="box">오늘</P>`
            }
            if (time.getDate() == new Date().getDate() + 1) {
              hour = `<p class="box">내일</P>`
            }
            if (time.getDate() == new Date().getDate() + 2) {
              hour = `<p class="box">모레</P>`
            }
          }

          this.hourTemp.innerHTML += `<div>
            <p>${temp}˚</p>
            <img src="http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png" alt="icon ${i}">
            ${hour}
          </div>`

          this.weekTemp = document.getElementById('weekTemp')
          this.weekTemp.innerHTML = ''
          for (let i = 0; i < data.daily.length; ++i) {
            let dt = data.daily[i].dt * 1000
            let today = new Date(dt)
            let day = this.getDay(today.getDay())
            let date = `${today.getMonth() + 1}.${today.getDate()}`
            if (today.getDate() == new Date().getDate()) {
              day = '오늘'
            }
            if (today.getDate() == new Date().getDate() + 1) {
              day = '내일'
            }

            let maxtemp = Math.round(data.daily[i].temp.max)
            let mintemp = Math.round(data.daily[i].temp.min)
            let pop = Math.round(data.daily[i].pop * 100)

            this.weekTemp.innerHTML += `
            <article>
              <div>
                <p>${day}</p>
                <p>${date}</p>
              </div>
              <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="icon ${i}">
              <div>
                <i class="fas fa-umbrella"></i>
                <p>${pop} %</p>
              </div>
              <div>
                <p>${maxtemp}</p>
                <p>${mintemp}</p>
              </div>
            </article>
            `
          }

          // 서브 페이지 현재 날씨
          this.maxminTemp.innerHTML = `<div>
            <h1>${Math.round(Math.max(data.daily[0].temp.max, curMaxtemp))}</h1>
             <i class="fas fa-temperature-high"></i>
          </div>
          <div>
            <h1>${Math.round(Math.min(data.daily[0].temp.min, curMintemp))}</h1>
            <i class="fas fa-temperature-high"></i>
          </div>`

          this.windHumidity.innerHTML = `<div>
            <i class="fas fa-umbrella"></i>
            <p>${Math.round(data.daily[0].pop)} %</p>
          </div>
          <div>
            <i class="fas fa-tint"></i>
            <p>${Math.round(data.daily[0].humidity)} %</p>
          </div>
          <div>
            <i class="fas fa-wind"></i>
            <p>${Math.round(data.daily[0].wind_speed)} m/s</p>
          </div>`

          let sunrise = new Date(data.daily[0].sunrise * 1000)
          let sunset = new Date(data.daily[0].sunset * 1000)
          this.sunTime.innerHTML = `<div>
            <p>${("00" + sunrise.getHours()).slice(-2)} : ${("00" + sunrise.getMonth()).slice(-2)}</P>
          </div>
          <div>
            <p>${("00" + sunset.getHours()).slice(-2)} : ${("00" + sunset.getMonth()).slice(-2)}</P>
          </div>
          `
        }
      })
  }

  //요일
  getDay(a) {
    if (a == 0) {
      a = '일요일'
    } else if (a == 1) {
      a = '월요일'
    } else if (a == 2) {
      a = '화요일'
    } else if (a == 3) {
      a = '수요일'
    } else if (a == 4) {
      a = '목요일'
    } else if (a == 5) {
      a = '금요일'
    } else if (a == 6) {
      a = '토요일'
    }
    return a
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
