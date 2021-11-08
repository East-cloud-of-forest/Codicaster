class App {
  constructor() {
    this.W = document.createElement('div')
    document.body.appendChild(this.W)
    this.W.style.width = '100%'
    this.W.style.maxWidth = '1000px'
    this.W.style.height = '500px'
    this.W.style.background = 'pink'
    this.W.style.margin = 'auto'

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

        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let date = today.getDate()
        let day = today.getDay()
        if (day == 0) {
          day = '일요일'
        } else if (day == 1) {
          day = '월요일'
        } else if (day == 2) {
          day = '화요일'
        } else if (day == 3) {
          day = '수요일'
        } else if (day == 4) {
          day = '목요일'
        } else if (day == 5) {
          day = '금요일'
        } else if (day == 6) {
          day = '토요일'
        }
        let time = today.getHours()

        this.icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        this.weatherIcon.appendChild(this.icon)

        this.temp.innerHTML = `${Math.round(data.main.temp)}`
        this.tempIcon.style.display = 'block'

        this.location.innerText = `${
          this.city.options[this.city.options.selectedIndex].text
        }`

        this.lon = data.coord.lon
        this.lat = data.coord.lat

        this.W.innerText = ''
        this.W.innerText += `${data.name}
        온도 : ${data.main.temp}
        최고온도 : ${data.main.temp_max}
        최저온도 : ${data.main.temp_min}

        ${year}년 ${month + 1}월 ${date}일 ${day}
        ${time}시
        `

        // 시간별 날씨
        this.timeTemp(this.lat, this.lon)
      })
      .catch((error) => console.log(('error', error)))
  }

  timeTemp(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=b905f0c03119f5162e6063c34f4e9e05`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.morn = document.getElementsByClassName('morn')[0]
        this.eve = document.getElementsByClassName('eve')[0]
        this.day = document.getElementsByClassName('day')[0]
        this.night = document.getElementsByClassName('night')[0]

        this.morn.innerText = Math.round(data.daily[0].temp.morn)
        this.eve.innerText = Math.round(data.daily[0].temp.eve)
        this.day.innerText = Math.round(data.daily[0].temp.day)
        this.night.innerText = Math.round(data.daily[0].temp.night)
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

    let aaa = document.createElement('p')
    aaa.innerText = `lat = ${position.coords.latitude} , lon = ${position.coords.longitude}`
    document.getElementById('location').appendChild(aaa)
  }

  showErrorMsg() {
    this.location.innerText = '위치 정보를 가져올 수 없습니다.'
  }
}

window.onload = () => {
  new App()
}
