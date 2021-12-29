import { AnimationAndDesign } from './animationAndDesign.js'

export class SubPageNowWeather {
  constructor() {
    this.subPageNowWeather = document.getElementById('subPageNowWeather')
    this.weatherInfo = document.getElementById('weatherInfo')
    this.CloseBtn = this.subPageNowWeather.getElementsByClassName('CloseBtn')[0]
    this.nowTimeTemp = document.getElementById('nowTimeTemp')
    this.maxminTemp = document.getElementById('maxminTemp')
    this.windHumidity = document.getElementById('windHumidity')
    this.optionInfo = document.getElementById('optionInfo')
    this.sunTime = document.getElementById('sunTime')
    this.mainPage = document.getElementById('mainPage')
    this.AnimationAndDesign = new AnimationAndDesign()

    this.weatherInfo.addEventListener('click', () => {
      let timeTemp = document.getElementById('timeTemp').cloneNode(true)
      this.nowTimeTemp.appendChild(timeTemp)
      this.AnimationAndDesign.SlideEnlargePadeOut(this.mainPage)
      this.AnimationAndDesign.SlideEnlargePadeIn(this.subPageNowWeather)
    })
    this.CloseBtn.addEventListener('click', () => {
      this.AnimationAndDesign.SlideEnlargePadeOut(this.subPageNowWeather)
      this.AnimationAndDesign.SlideEnlargePadeIn(this.mainPage)
      this.resetPage()
    })
  }

  resetPage() {
    setTimeout(() => {
      this.nowTimeTemp.removeChild(this.nowTimeTemp.firstChild)
    },250)
  }

  htmlInAPI(data, curMintemp, curMaxtemp) {
    let dt = new Date()
    this.maxminTemp.innerHTML = `
      <p>${Math.round(Math.max(data.daily[0].temp.max, curMaxtemp))}˚</P>
      <p>/</P>
      <p>${Math.round(Math.min(data.daily[0].temp.min, curMintemp))}˚</P>
      <div id="updateTime">
        <span>${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일</span>
        <span class="currentTime">방금전</span>
        <i class="fas fa-sync-alt"></i>
      </div>
    `

    let i = 0
    this.currentTime = document.getElementsByClassName('currentTime')[0]
    clearInterval(this.intervalTime)
    this.intervalTime = setInterval(() => {
      i++
      let Time = ``
      if (i < 60) {
        Time = `${i}분 전`
      } else if (59 < i && i < 61) {
        Time = `1시간 전`
      } else if (60 < i && i < 120) {
        Time = `약 1시간 전`
      } else {
        Time = `한참 전`
      }
      this.currentTime.innerHTML = Time
    }, 60000)

    this.windHumidity.innerHTML = `
      <div>
        <i><img src="images/wind.svg" alt="windicon"></img></i>
        <p>${Math.round(data.daily[0].wind_speed)} <span>m/s</span></p>
      </div>
      <div>
        <i><img src="images/umbrella.svg" alt="umbrellaicon"></img></i>
        <p>${Math.round(data.daily[0].pop)} <span>%</span></p>
      </div>
      <div>
        <i><img src="images/hum.svg" alt="humidity"></img></i>
        <p>${Math.round(data.daily[0].humidity)} <span>%</span></p>
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
