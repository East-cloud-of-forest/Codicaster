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
    this.dobbleBtn = document.getElementById('dobbleBtn')
    this.rainChart = document.getElementById('rainChart')
    this.mist = document.getElementById('mist')
    this.snowChart = document.getElementById('snowChart')
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
      } else if (this.weatherState == 'snow') {
        this.snowChart.style.display = 'flex'
        this.mist.style.display = 'none'
      } else if (this.weatherState == 'rain') {
        this.rainChart.style.display = 'flex'
        this.mist.style.display = 'none'
      }
    },400)
  }

  htmlInAPI(data, curMintemp, curMaxtemp) {
    let dt = new Date()
    let maxTemp = Math.round(Math.max(data.daily[0].temp.max, curMaxtemp))
    let minTemp = Math.round(Math.min(data.daily[0].temp.min, curMintemp))
    this.maxminTemp.innerHTML = `
      <p>${maxTemp}??</P>
      <p>/</P>
      <p>${minTemp}??</P>
      <div id="updateTime">
        <span>${dt.getFullYear()}??? ${dt.getMonth() + 1}??? ${dt.getDate()}???</span>
        <span class="currentTime">?????????</span>
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
        Time = `${i}??? ???`
      } else if (59 < i && i < 61) {
        Time = `1?????? ???`
      } else if (60 < i && i < 120) {
        Time = `??? 1?????? ???`
      } else {
        Time = `?????? ???`
        clearInterval(this.intervalTime)
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

    // ?????? ?????? ???
    let skyState = data.current.weather[0].icon.slice(2)
    let weatherState = data.current.weather[0].icon.slice(0,2)
    // let skyState = 'd'
    // let weatherState = '09'
    let visibility = data.current.visibility

    // ?????????
    function getCloudText(i) {
      if (i == 0) {
        return `
        ?????? ??? ??? ?????? ?????? ????????????.</br>
        <span>?????? ????????? ?????? ??? ????????? ?????????</br>
        ????????? ???????????? ?????? ???????????? ??? ????????? ????????????.</span>
        `
      } else if (i >= 1 && i <= 20) {
        return `
        ?????????????????? ???????????? ???????????? ?????? ????????? ??? ??? ?????????.
        `
      } else if (i >= 21 && i <= 60) {
        return `
        ????????? ???????????? ????????????. ?????? ??? ?????? ?????? ???????????????.
        `
      } else if (i >= 61 && i <= 90) {
        return `
        ????????? ?????????. ????????? ??? ?????? ?????? ????????????.
        `
      } else if (i >= 91 && i <= 100) {
        return `
        ????????? ?????? ??? ?????? ????????????. ????????? ??? ??? ?????? ????????????.</br>
        <span>??? ????????? ??? ?????? ?????? ???????????? ?????? ??????..</span>
        `
      }
    }

    this.clouds.innerHTML = `
      <div>
        <p>?????? ????????? <span>?????????</span></br>
        <span>${data.current.clouds}</span> <span>%</span></p>
        <p>${getCloudText(data.current.clouds)}</p>
      </div>
    `

    // ????????? ??????
    function getUviLevelInfo(i) {
      if (2.99 >= i) {
        return ['??????', 'rgba(62, 168, 46, 0.4)', '????????? ??? ????????? ???????????? ?????? ???????????? ????????? ????????? ?????????.']
      } else if (i >= 3 && i <= 5.99) {
        return ['??????', 'rgba(255, 245, 0, 0.4)', '????????? ???????????? ????????? ???????????????. ????????? ??????????????? ????????? ?????????.']
      } else if (i >= 6 && i <= 7.99) {
        return ['??????', 'rgba(240, 140, 0, 0.4)', '?????? ????????????! ????????? ???????????? ?????? ??????????????? ???????????????.']
      } else if (i >= 8 && i <= 10.99) {
        return ['????????????', 'rgba(228, 51, 15, 0.4)', '?????? ??????????????? ! ????????? ???????????? ?????? ??????????????? ????????? ?????? ????????? ??????.']
      } else if (i >= 11) {
        return ['??????', 'rgba(180, 103, 161, 0.4)', '?????? ????????? ! ????????? ????????? ????????? ??????. ????????? ???????????? ?????? !']
      }
    }

    this.uvi.innerHTML = `
      <div>
        <p>??????</br>????????? ??????</p>
        <span>${data.current.uvi}<span>${getUviLevelInfo(data.current.uvi)[0]}</span></span>
      </div>
      <div>
        <p>?????? ??????</br>????????? ??????</p>
        <span>${data.daily[0].uvi}<span>${getUviLevelInfo(data.daily[0].uvi)[0]}</span></span>
      </div>
      <h4>${getUviLevelInfo(data.daily[0].uvi)[2]}</h4>
    `

    let uviNum = this.uvi.getElementsByTagName('div')[0].getElementsByTagName('span')[1]
    let uviNum2 = this.uvi.getElementsByTagName('div')[1].getElementsByTagName('span')[1]
    uviNum.style.background = getUviLevelInfo(data.current.uvi)[1]
    uviNum2.style.background = getUviLevelInfo(data.daily[0].uvi)[1]

    // ?????? ????????? ??????
    this.tomorrowUvi.innerHTML = `
      <div>
        <p>?????? ??????</br>????????? ??????</p>
        <span>${data.daily[1].uvi}<span>${getUviLevelInfo(data.daily[1].uvi)[0]}</span></span>
      </div>
      <h4>${getUviLevelInfo(data.daily[1].uvi)[2]}</h4>
    `
    let tomorrowUviNum = this.tomorrowUvi.getElementsByTagName('div')[0].getElementsByTagName('span')[1]
    tomorrowUviNum.style.background = getUviLevelInfo(data.daily[1].uvi)[1]

    // ?????????
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
      let hour = `${(`00` + time.getHours()).slice(-2)} ???`

      if (time.getHours() == 0) {
        function getDateFromToday(j) {
          let date = new Date().valueOf() + ((24*60*60*1000) * j)
          return new Date(date).getDate()
        }
        if (time.getDate() == getDateFromToday(0)) {
          hour = `<p class="box">??????</P>`
        }
        if (time.getDate() == getDateFromToday(1)) {
          hour = `<p class="box">??????</P>`
        }
      }

      if (data.hourly[i].rain) {
        timeRain = Object.values(data.hourly[i].rain)[0]
      } else {
        timeRain = 0
      }

      if (timeRain > 0) {
        if (0 < timeRain <= 1) {
          timeRain = '~1'
        }
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
      <p>1???????????? <span>${currentRain}</span> mm</p>
      <div>${timeRainDiv.join('')}</div>
      <i class="misticon"></i>
    `

    // ????????????
    let visibilityNum = ''
    let visibilityText = ''
    if (visibility == 10000) {
      visibilityNum = `<span>${visibility / 1000}</span><span> km</span>`
    } else if (9999 >= visibility && visibility >= 1000) {
      visibilityNum = `<span>${Math.round((visibility / 1000 + Number.EPSILON) * 10) / 10}</span><span> km</span>`
    } else if (999 >= visibility) {
      visibilityNum = `<span>${visibility}</span><span> m</span>`
      visibilityText = `<h4>??????????????? ?????????. ?????? ????????? ???????????????.</h4>`
      if (200 >= visibility && visibility >= 151) {
        visibilityText = `<h4>????????? ?????? ?????????. ?????? ???????????? ????????? ????????????.</h4>`
      } else if (150 >= visibility && visibility >= 121) {
        visibilityText = `<h4>????????? ????????? ! ????????? ???????????? ????????? ????????? ????????????.</h4>`
      } else if (120 >= visibility && visibility >= 61) {
        visibilityText = `<h4>?????? ????????? ??? ????????? ! ???????????? ????????? ???????????? ?????? ????????? ????????????.</h4>`
      } else if (60 >= visibility) {
        visibilityText = `<h4>?????? ?????? ????????? ????????? ????????? ! ????????? ????????? ????????? ?????????????</h4>`
      }
    }

    this.mist.innerHTML = `
      <div>
        <p>?????? ???????????? ${visibilityNum}</p>
        ${visibilityText}
      </div>
      <i class="backicon"></i>
    `

    // ?????????
    let currentSnow = 0
    let timeSnow = 0
    let timeSnowDiv = []

    if (data.current.snow) {
      currentSnow = Object.values(data.current.snow)[0]
      if (currentSnow <= 1) {
        currentSnow = '0 ~ 1'
      }
    }

    for (let i = 0; i < 8; ++i) {
      let time = new Date(data.hourly[i].dt * 1000)
      let hour = `${(`00` + time.getHours()).slice(-2)} ???`

      if (time.getHours() == 0) {
        function getDateFromToday(j) {
          let date = new Date().valueOf() + ((24*60*60*1000) * j)
          return new Date(date).getDate()
        }
        if (time.getDate() == getDateFromToday(0)) {
          hour = `<p class="box">??????</P>`
        }
        if (time.getDate() == getDateFromToday(1)) {
          hour = `<p class="box">??????</P>`
        }
      }

      if (data.hourly[i].snow) {
        timeSnow = Object.values(data.hourly[i].snow)[0]
      } else {
        timeSnow = 0
      }

      if (timeSnow > 0) {
        if (0 < timeSnow <= 1) {
          timeSnow = '~1'
        }
        timeSnowDiv.push(`
          <div>
            <div class="timeSnow snow_full">${timeSnow}</div>
            <p>${hour}</p>
          </div>`)
      } else {
        timeSnowDiv.push(`
        <div>
          <div class="timeSnow">${timeSnow}</div>
          <p>${hour}</p>
        </div>`)
      }
    }

    this.snowChart.innerHTML = `
      <p>1???????????? <span>${currentSnow}</span> mm</p>
      <div>${timeSnowDiv.join('')}</div>
      <i class="misticon"></i>
    `

    // ????????? ?????? ????????? ????????? ??????
    this.optionInfoHtml(skyState, weatherState, visibility)

    // ?????? ??????
    let sunrise = data.daily[0].sunrise * 1000
    let sunset = data.daily[0].sunset * 1000
    let sunriseTo = data.daily[1].sunrise * 1000
    let now = new Date().getTime()
    let suntime = 0
    let sunback = ``
    let suntext = ``
    if (now < sunrise) {
      suntime = new Date(sunrise)
      sunback = `url('../images/sunrise.svg')`
      suntext = `?????? <span>??????</span>`
    } else if (now > sunset) {
      suntime = new Date(sunriseTo)
      sunback = `url('../images/sunrise.svg')`
      suntext = `?????? <span>??????</span>`
    } else if (now > sunrise) {
      suntime = new Date(sunset)
      sunback = `url('../images/sunset.svg')`
      suntext = `?????? <span>??????</span>`
    }

    this.sunTime.innerHTML = `
      <p>${suntext}</p>
      <span>${('00' + suntime.getHours()).slice(-2)} : ${('00' + suntime.getMinutes()).slice(-2)}</span>
    `
    
    document.documentElement.style.setProperty('--sunback', `${sunback}`)
  }

  optionInfoHtml(skyState, weatherState, visibility) {
    let backicon = mist.getElementsByClassName('backicon')[0]

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

    function rainSnowMistOption(main, mist, backicon) {
      let misticon = main.getElementsByClassName('misticon')[0]
      misticon.style.display = 'block'
      backicon.style.display = 'block'
      misticon.addEventListener('click', () => {
        main.style.display = 'none'
        mist.style.display = 'flex'
      })

      backicon.addEventListener('click', () => {
        mist.style.display = 'none'
        main.style.display = 'flex'
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
        if (999 >= visibility) {
          backicon.style.background = `url('../images/umbrella.svg') no-repeat 50%`
          rainSnowMistOption(this.rainChart, this.mist, backicon)
        }
        break
      case '13' :
        this.weatherState = 'snow'
        this.snowChart.style.display = 'flex'
        if (999 >= visibility) {
          backicon.style.background = `url('../images/snow.svg') no-repeat 50%`
          rainSnowMistOption(this.snowChart, this.mist, backicon)
        }
        break
      case '50' :
        this.weatherState = 'mist'
        this.mist.style.display = 'flex'
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
        break
      case this.clouds :
        main.getElementsByTagName('p')[1].style.display = 'block'
        break
    }
  }
}
