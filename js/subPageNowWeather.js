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

    this.weatherInfo.addEventListener('click', () => {
      this.subPageNowWeather.style.top = '0'
      let timeTemp = document.getElementById('timeTemp').cloneNode(true)
      this.nowTimeTemp.appendChild(timeTemp)
    })
    this.close.addEventListener('click', () => {
      this.subPageNowWeather.style.top = '100vh'
      this.nowTimeTemp.removeChild(this.nowTimeTemp.firstChild)
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
    let rt = new Date().getTime()
    if (rt < sunrise) {
      let sunrise = new Date(data.daily[0].sunset * 1000)
      this.sunTime.innerHTML = `
      <div>
        <p>${('00' + sunrise.getHours()).slice(-2)} : ${('00' + sunrise.getMinutes()).slice(-2)}</P>
      </div>
      `
    } else if (rt < sunset) {
      let sunset = new Date(data.daily[0].sunset * 1000)
      this.sunTime.innerHTML = `
      <div>
        <p>${('00' + sunset.getHours()).slice(-2)} : ${('00' + sunset.getMinutes()).slice(-2)}</P>
      </div>
      `
    } else if (rt < sunriseTo) {
      let sunriseTo = new Date(data.daily[0].sunriseTo * 1000)
      this.sunTime.innerHTML = `
      <div>
        <p>${('00' + sunriseTo.getHours()).slice(-2)} : ${('00' + sunriseTo.getMinutes()).slice(-2)}</P>
      </div>
      `
    }
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
