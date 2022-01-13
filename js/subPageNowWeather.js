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
    this.clouds = document.getElementById('clouds')
    this.uvi = document.getElementById('uvi')
    this.tomorrowUvi = document.getElementById('tomorrowUvi')
    this.rainChart = document.getElementById('rainChart')
    this.dobbleBtn = document.getElementById('dobbleBtn')
    this.sunTime = document.getElementById('sunTime')
    this.mainPage = document.getElementById('mainPage')
    this.mainOption = ''
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
      if (this.weatherState == 'clear') {
        this.optionReset(this.mainOption)
      }
    },400)
  }

  htmlInAPI(data, curMintemp, curMaxtemp) {
    let dt = new Date()
    let maxTemp = Math.round(Math.max(data.daily[0].temp.max, curMaxtemp))
    let minTemp = Math.round(Math.min(data.daily[0].temp.min, curMintemp))
    this.maxminTemp.innerHTML = `
      <p>${maxTemp}˚</P>
      <p>/</P>
      <p>${minTemp}˚</P>
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
        <p>${Math.round(data.current.wind_speed)} <span>m/s</span></p>
      </div>
      <div>
        <i><img src="images/umbrella.svg" alt="umbrellaicon"></img></i>
        <p>${data.daily[0].pop * 100} <span>%</span></p>
      </div>
      <div>
        <i><img src="images/hum.svg" alt="humidityicon"></img></i>
        <p>${Math.round(data.daily[0].humidity)} <span>%</span></p>
      </div>
    `

    // 옵션 정보 창
    // 날씨에 따라 옵션 변경 로직
    let skyState = data.current.weather[0].icon.slice(2)
    // let skyState = 'd'
    let weatherState = data.current.weather[0].icon.slice(0,2)
    this.optionInfoHtml(skyState, weatherState)

    // 구름양
    function getCloudText(i) {
      if (i == 0) {
        return `
        구름 한 점 없는 맑은 날이에요.</br>
        <span>만약 하늘을 봤을 때 구름이 있다면</br>
        날씨를 관측해준 회사 잘못이지 제 잘못이 아니에요.</span>
        `
      } else if (i >= 1 && i <= 20) {
        return `
        조각구름들이 둥실둥실 떠다니는 맑은 하늘을 볼 수 있어요.
        `
      } else if (i >= 21 && i <= 60) {
        return `
        하늘에 구름들이 떠다녀요. 구름 반 하늘 반을 즐겨보세요.
        `
      } else if (i >= 61 && i <= 90) {
        return `
        구름이 많아요. 맑다고 볼 수는 없는 날씨네요.
        `
      } else if (i >= 91 && i <= 100) {
        return `
        구름이 가득 찬 흐린 날씨에요. 하늘을 볼 수 없을 정도에요.</br>
        <span>이 정도면 저 속에 정말 라퓨타가 있을 수도..</span>
        `
      }
    }

    this.clouds.innerHTML = `
      <div>
        <p>현재 하늘의 <span>구름양</span></br>
        <span>${data.current.clouds}</span> <span>%</span></p>
        <p>${getCloudText(data.current.clouds)}</p>
      </div>
    `

    // 자외선 지수
    function getUviLevelInfo(i) {
      if (2.99 >= i) {
        return ['낮음', 'rgba(62, 168, 46, 0.4)', '외출할 때 자외선 차단제를 얇게 발라주면 피부가 좋아할 거예요.']
      } else if (i >= 3 && i <= 5.99) {
        return ['보통', 'rgba(255, 245, 0, 0.4)', '자외선 차단제를 꼼꼼히 발라주세요. 모자와 선글라스를 쓰셔도 좋아요.']
      } else if (i >= 6 && i <= 7.99) {
        return ['높음', 'rgba(240, 140, 0, 0.4)', '해가 뜨거워요! 자외선 차단제를 챙겨 정기적으로 발라주세요.']
      } else if (i >= 8 && i <= 10.99) {
        return ['매우높음', 'rgba(228, 51, 15, 0.4)', '완전 내리쬐어요 ! 자외선 차단제를 챙겨 정기적으로 바르고 해를 피해야 해요.']
      } else if (i >= 11) {
        return ['위험', 'rgba(180, 103, 161, 0.4)', '밖은 위험해 ! 가능한 실내에 있어야 해요. 자외선 차단제는 필수 !']
      }
    }

    this.uvi.innerHTML = `
      <div>
        <p>현재</br>자외선 지수</p>
        <span>${data.current.uvi}<span></span></span>
      </div>
      <div>
        <p>오늘 최대</br>자외선 지수</p>
        <span>${data.daily[0].uvi}<span></span></span>
      </div>
      <h4></h4>
    `

    let uviNum = this.uvi.getElementsByTagName('div')[0].getElementsByTagName('span')[1]
    let uviNum2 = this.uvi.getElementsByTagName('div')[1].getElementsByTagName('span')[1]
    let uviText = this.uvi.getElementsByTagName('h4')[0]
    uviNum.innerHTML = getUviLevelInfo(data.current.uvi)[0]
    uviNum2.innerHTML = getUviLevelInfo(data.daily[0].uvi)[0]
    uviNum.style.background = getUviLevelInfo(data.current.uvi)[1]
    uviNum2.style.background = getUviLevelInfo(data.daily[0].uvi)[1]
    uviText.innerHTML = getUviLevelInfo(data.daily[0].uvi)[2]

    // 내일 자외선 지수
    this.tomorrowUvi.innerHTML = `
      <div>
        <p>내일 최대</br>자외선 지수</p>
        <span>${data.daily[1].uvi}<span></span></span>
      </div>
      <h4></h4>
    `
    let tomorrowUviNum = this.tomorrowUvi.getElementsByTagName('div')[0].getElementsByTagName('span')[1]
    let tomorrowUviText = this.tomorrowUvi.getElementsByTagName('h4')[0]
    tomorrowUviNum.innerHTML = getUviLevelInfo(data.daily[1].uvi)[0]
    tomorrowUviNum.style.background = getUviLevelInfo(data.daily[1].uvi)[1]
    tomorrowUviText.innerHTML = getUviLevelInfo(data.daily[1].uvi)[2]

    // 비
    let currentRain = 0
    let timeRain = 0
    let timeRainDiv = []

    if (data.current.rain) {
      currentRain = Object.values(data.current.rain)[0]
      if (currentRain <= 1) {
        currentRain = '0 ~ 1'
      }
    }

    for (let i = 0; i < 8; ++i) {
      let time = new Date(data.hourly[i].dt * 1000)
      let hour = `${(`00` + time.getHours()).slice(-2)} 시`

      if (time.getHours() == 0) {
        function getDateFromToday(j) {
          let date = new Date().valueOf() + ((24*60*60*1000) * j)
          return new Date(date).getDate()
        }
        if (time.getDate() == getDateFromToday(0)) {
          hour = `<p class="box">오늘</P>`
        }
        if (time.getDate() == getDateFromToday(1)) {
          hour = `<p class="box">내일</P>`
        }
      }

      if (data.hourly[i].rain) {
        timeRain = Object.values(data.hourly[i].rain)[0]
        if (0 < timeRain <= 1) {
          timeRain = '~1'
        }
      } else {
        timeRain = 0
      }

      if (timeRain > 0) {
        timeRainDiv.push(`
          <div>
            <div class="timeRain rain_full">${timeRain}</div>
            <p>${hour}</p>
          </div>`)
      } else {
        timeRainDiv.push(`
        <div>
          <div class="timeRain">${timeRain}</div>
          <p>${hour}</p>
        </div>`)
      }
    }

    this.rainChart.innerHTML = `
      <p>1시간동안 <span>${currentRain}</span> mm</p>
      <div>${timeRainDiv.join('')}</div>
    `

    // 일출 일몰
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

  optionInfoHtml(skyState, weatherState) {
    function clearTowShowOption(uvi, cloud, dobbleBtn) {
      dobbleBtn.addEventListener('click', () => {
        uvi.style.display = 'flex'
        uvi.style.width = '48.5%'
        cloud.style.display = 'flex'
        cloud.style.width = '48.5%'
        dobbleBtn.style.display = 'none'
        cloud.getElementsByTagName('p')[1].style.display = 'none'
        uvi.getElementsByTagName('h4')[0].style.display = 'none'
      })

      uvi.addEventListener('click',() => {
        if (dobbleBtn.style.display == 'none') {
          uvi.style.width = '100%'
          cloud.style.display = 'none'
          dobbleBtn.style.display = 'flex'
          uvi.getElementsByTagName('h4')[0].style.display = 'block'
        }
      })

      cloud.addEventListener('click',() => {
        if (dobbleBtn.style.display == 'none') {
          cloud.style.width = '100%'
          uvi.style.display = 'none'
          dobbleBtn.style.display = 'flex'
          cloud.getElementsByTagName('p')[1].style.display = 'block'
        }
      })
    }

    switch (weatherState) {
      case '01' :
      case '02' :
      case '03' :
      case '04' :
        this.weatherState = 'clear'
        this.dobbleBtn.style.display = 'flex'
        if (skyState == 'd') {
          this.mainOption = this.uvi
          this.uvi.style.display = 'flex'
          clearTowShowOption(this.uvi, this.clouds, this.dobbleBtn)
        } else if (skyState == 'n') {
          this.mainOption = this.clouds
          this.clouds.style.display = 'flex'
          clearTowShowOption(this.tomorrowUvi, this.clouds, this.dobbleBtn)
        }
        break
      case '09' :
      case '10' :
      case '11' :
        this.weatherState = 'rain'
        this.rainChart.style.display = 'flex'
        break
      case '13' :
        break
      case '50' :
        break
    }
  }

  optionReset(main) {
    this.dobbleBtn.style.display = 'flex'
    for (let i = 0; i < this.optionInfo.childNodes.length; i++) {
      if(this.optionInfo.childNodes[i].tagName == 'ARTICLE') {
        this.optionInfo.childNodes[i].style.display = 'none'
      }
    }
    main.style.display = 'flex'
    main.style.width = '100%'
    switch (main) {
      case this.uvi :
        main.getElementsByTagName('h4')[0].style.display = 'block'
      case this.clouds :
        main.getElementsByTagName('p')[1].style.display = 'block'
    }
  }

  currentWeather(data) {
    // 가시성 100 밑으로 내려가면 미터로 표시
    let mist = `
      <div>
        <p>${data.current.visibility / 1000} km</p>
      </div>
    `
    this.aaa = [rainSnow, mist]
    if (1 == 1) {
      return this.aaa.join('')
    }
  }
}
