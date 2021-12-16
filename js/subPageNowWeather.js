import { Animation } from './animation.js'

export class SubPageNowWeather {
  constructor() {
    this.subPageNowWeather = document.getElementById('subPageNowWeather')
    this.weatherInfo = document.getElementById('weatherInfo')
    this.close = document.getElementsByClassName('testX')[0]
    this.nowTimeTemp = document.getElementById('nowTimeTemp')
    this.maxminTemp = document.getElementById('maxminTemp')
    this.windHumidity = document.getElementById('windHumidity')
    this.optionInfo = document.getElementById('optionInfo')
    this.sunTime = document.getElementById('sunTime')
    this.mainPage = document.getElementById('mainPage')
    this.Animation = new Animation()

    this.weatherInfo.addEventListener('click', () => {
      let timeTemp = document.getElementById('timeTemp').cloneNode(true)
      this.nowTimeTemp.appendChild(timeTemp)
      this.Animation.SlideEnlargePadeOut(this.mainPage)
      this.Animation.SlideEnlargePadeIn(this.subPageNowWeather)
    })
    this.close.addEventListener('click', () => {
      this.Animation.SlideEnlargePadeOut(this.subPageNowWeather)
      this.Animation.SlideEnlargePadeIn(this.mainPage)
      setTimeout(() => {
        this.nowTimeTemp.removeChild(this.nowTimeTemp.firstChild)
      },250)
    })
  }

  htmlInAPI(data, curMintemp, curMaxtemp) {
    this.maxminTemp.innerHTML = `
      <div>
        <h1>${Math.round(Math.max(data.daily[0].temp.max, curMaxtemp))}</h1>
        <i class="fas fa-temperature-high"></i>
      </div>
      <div>
        <h1>${Math.round(Math.min(data.daily[0].temp.min, curMintemp))}</h1>
        <i class="fas fa-temperature-high"></i>
      </div>
    `

    this.windHumidity.innerHTML = `
      <div>
        <i class="fas fa-wind"></i>
        <p>${Math.round(data.daily[0].wind_speed)} m/s</p>
      </div>
      <div>
        <i class="fas fa-umbrella"></i>
        <p>${Math.round(data.daily[0].pop)} %</p>
      </div>
      <div>
        <i class="fas fa-tint"></i>
        <p>${Math.round(data.daily[0].humidity)} %</p>
      </div>
    `

    this.optionInfo.innerHTML = this.currentWeather(data)

    let sunrise = data.daily[0].sunrise * 1000
    let sunset = data.daily[0].sunset * 1000
    let sunriseTo = data.daily[1].sunrise * 1000
    let now = new Date().getTime()
    let suntime = 0
    if (now < sunrise) {
      suntime = new Date(sunrise)
    } else if (now > sunset) {
      suntime = new Date(sunriseTo)
    } else if (now > sunrise) {
      suntime = new Date(sunset)
    }
    this.sunTime.innerHTML = `
      <div>
        <p>${('00' + suntime.getHours()).slice(-2)} : ${('00' + suntime.getMinutes()).slice(-2)}</P>
      </div>
      `
  }

  currentWeather(data) {
    let clear = `
      <div>
        <p>${data.current.uvi}</p>
        <p>${data.current.clouds} %</p>
      </div>
    `
    let currentRain = 0
    let timeRain = 0
    let timeRainDiv = []
    if (data.current.rain) {
      currentRain = Object.values(data.current.rain)[0]
      if (currentRain <= 1) {
        currentRain = '0~1'
      }
    }
    for (let i = 0; i < 8; ++i) {
      let time = new Date(data.hourly[i].dt * 1000)
      let hour = (`00` + time.getHours()).slice(-2)
      if (data.hourly[i].rain) {
        timeRain = Object.values(data.hourly[i].rain)[0]
        if (0 < timeRain <= 1) {
          timeRain = '0~1'
        }
      } else {
        timeRain = 0
      }
      timeRainDiv.push(`
          <div>
            <p>${data.hourly[i].humidity}
            <p>${timeRain}</p>
            <p>${hour} 시</p>
          </div>
        `)
    }
    let rainSnow = `
      <div class="rainSnow">
        <p>${currentRain}</p>
        <div class="hourDrop">${timeRainDiv.join('')}</div>
      </div>
    `
    // 가시성 100 밑으로 내려가면 미터로 표시
    let mist = `
      <div>
        <p>${data.current.visibility / 1000} km</p>
      </div>
    `
    this.aaa = [clear, rainSnow, mist]
    if (1 == 1) {
      return this.aaa.join('')
    }
  }
}
