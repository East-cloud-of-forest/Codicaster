import { SubPageTimeTemp } from './subPageTimeTemp.js'
import { SubPageNowWeather } from './subPageNowWeather.js'
import { AnimationAndDesign } from './animationAndDesign.js'
import { SubPageCloth } from './subPageCloth.js'

// 도시 이름 데이터
import CityInfo from './cityInfo.js'

class App {
  constructor() {
    this.weatherIcon = document.getElementById('weatherIcon')
    this.icon = this.weatherIcon.getElementsByTagName('img')[0]

    this.temp = document.getElementById('temp').getElementsByTagName('h1')[0]
    this.fillsLike = document.getElementById('temp').getElementsByTagName('span')[0]

    this.mainPage = document.getElementById('mainPage')
    this.background = document.getElementById('body')

    this.lon = ''
    this.lat = ''

    this.locationIcon = document.getElementById('top').getElementsByTagName('i')[0]
    this.cityChoice = document.getElementById('cityChoiceSection')
    this.cityChoiceBox = document.getElementById('cityChoiceBox')
    this.locationIcon.addEventListener('click', () => {
      this.cityChoice.style.display = 'block'
      this.cityChoiceBox.scrollTop = 0
    })

    this.top = document.getElementById('top')
    this.topi = document.getElementById('top').querySelector('i')
    this.weatherInfo = document.getElementById('weatherInfo')
    this.clothes = document.getElementById('clothes')
    this.tempinfo = document.getElementById('tempinfo')

    this.errorImg = new Image()
    this.errorImg.src = "./images/error_w.png"
    this.errorImg.setAttribute("width", "85%")
    this.errorImg.setAttribute("style", "display : none")
    this.top.prepend(this.errorImg)

    this.location = document.getElementById('location').getElementsByTagName('p')[0]
    this.city = ''
    this.locationChoice()

    this.AnimationAndDesign = new AnimationAndDesign()

    this.loaction = document.getElementsByTagName('location')
    this.location.addEventListener('click', this.gps.bind(this))
    this.gps()

    this.SubPageCloth = new SubPageCloth()
    this.SubPageNowWeather = new SubPageNowWeather()

    // vh 변수화
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    let timer
    window.addEventListener('resize', function(){
      clearTimeout(timer);
      timer = setTimeout(function(){
        location.reload()
      }, 200);
    });
  }

  // Weather API
  nowWeather(data) {
    console.log(data)
    this.resetErrorPage()
    //  메인페이지
    
    let iconsorce = this.AnimationAndDesign.icon(data.weather[0].icon)
    this.icon.src = `images/${iconsorce[0]}`
    this.icon.style.width = iconsorce[1]
    this.icon.style.height = iconsorce[1]
    this.background.style = this.AnimationAndDesign.backgroundcolor(data.weather[0].icon)




    // 아이콘 및 배경 테스트

    // let test = '09d'
    // let iconsorce = this.AnimationAndDesign.icon(test)
    // this.icon.src = `images/${iconsorce[0]}`
    // this.icon.style.width = iconsorce[1]
    // this.icon.style.height = iconsorce[1]
    // this.background.style = this.AnimationAndDesign.backgroundcolor(test)


    


    this.temp.innerHTML = `${Math.round(data.main.temp)}˚`
    this.fillsLike.innerHTML = `체감온도 ${Math.round(data.main.feels_like)}˚`

    // 날씨별 옷
    this.SubPageCloth.mainPageHtml(data)

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

      this.morn.innerText = `${Math.round(data.daily[0].temp.morn)}˚`
      this.eve.innerText = `${Math.round(data.daily[0].temp.eve)}˚`
      this.day.innerText = `${Math.round(data.daily[0].temp.day)}˚`
      this.night.innerText = `${Math.round(data.daily[0].temp.night)}˚`

      // 서브페이지
      this.SubPageTimeTemp = new SubPageTimeTemp(data)
      this.SubPageNowWeather.htmlInAPI(data, curMintemp, curMaxtemp)

      this.updateTime = document.getElementById('updateTime')
      this.updateTime.addEventListener('click', this.resetAPI.bind(this))
      this.subPageNowWeatherHTML = document.getElementById('subPageNowWeather')
      })
    .then(this.padeIn())
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
    this.city = city
    this.cityname = city.value
    if (this.cityname == 'select') {
      return
    } else {
      this.padeOut()
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.cityname}&appid=b905f0c03119f5162e6063c34f4e9e05&units=metric&lang=kr`,
      )
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          this.location.innerText = `${city.innerText}`
          this.SubPageCloth.distroid()
          this.SubPageNowWeather.distroid()
          this.SubPageTimeTemp && this.SubPageTimeTemp.distroid()
          this.nowWeather(data)
        },400)
      })
      .catch((error) => console.log(('error', error)))
    }
  }

  // GPS를 이용한 API 호출
  gps() {
    this.city = ''
    this.padeOut()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.showLocation.bind(this),
        this.showErrorMsg.bind(this),
      )
    } else {
      this.location.innerText = '위치 정보를 지원하지 않는 브라우저 입니다.'
      this.errorPage()
      this.padeIn()
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
      if (CityInfo[data.id] !== undefined) {
        if (CityInfo[data.id][1] == CityInfo[data.id][2]) {
          cityName = `${CityInfo[data.id][1]}`
        } else {
          cityName = `${CityInfo[data.id][1]} ${CityInfo[data.id][2]}`
        }
        setTimeout(() => {
          this.location.innerText = `${cityName}`
          this.nowWeather(data)
          this.SubPageCloth.distroid()
          this.SubPageNowWeather.distroid()
          if (this.SubPageTimeTemp !== undefined) {
            this.SubPageTimeTemp.distroid()
          }
        },400)
      } else {
        this.showErrorMsg()
      }
    })
    .catch((error) => console.log(('error', error)))
  }

  showErrorMsg() {
    this.location.innerText =
      `위치 정보를 가져올 수 없습니다.
      위치 아이콘을 눌러 지역을 선택해주세요.`
    this.errorPage()

    // gps 안될때 테스트
    // let a = {1 : 'busan'}
    // a.value = 'busan'
    // this.clickCity(a)

    this.padeIn()
  }

  // GPS 에러시 메인 페이지 구성
  errorPage() {
    this.errorImg.setAttribute("style", "display : block")
    this.weatherInfo.style.display = 'none'
    this.clothes.style.display = 'none'
    this.tempinfo.style.display = 'none'
    this.top.style.backgroundColor = 'rgba(0,0,0,0.5)'
    this.top.style.height = '100%'
    this.top.style.flexDirection = 'column'
    this.top.style.justifyContent = 'space-evenly'
    this.topi.style.width = '5vh'
    this.topi.classList.add("topiAnimation")
    this.mainPage.style.padding = '0'
    this.mainPage.style.transition = '0s'
  }

  resetErrorPage() {
    this.errorImg.setAttribute("style", "display : none")
    this.topi.classList.remove("topiAnimation")
    this.weatherInfo.style = ''
    this.clothes.style = ''
    this.tempinfo.style = ''
    this.top.style = ''
    this.topi.style = ''
    this.mainPage.style = ''
  }

  // 애니메이션
  padeIn() {
    this.AnimationAndDesign.UpDownPadeIn(this.mainPage)
  }

  padeOut() {
    this.AnimationAndDesign.UpDownPadeOut(this.mainPage)
  }

  // 새로고침
  resetAPI() {
    if (this.city == '') {
      this.gps()
    } else {
      this.clickCity(this.city)
    }
    this.AnimationAndDesign.SlideEnlargePadeOut(this.subPageNowWeatherHTML)
    this.SubPageNowWeather.resetPage()
  }
}

window.onload = () => {
  new App()
}