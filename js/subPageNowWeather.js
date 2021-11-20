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
      this.subPageNowWeather.style.display = 'flex'

      let timeTemp = document.getElementById('timeTemp').cloneNode(true)
      this.nowTimeTemp.appendChild(timeTemp)
    })
    this.close.addEventListener('click', () => {
      this.subPageNowWeather.style.display = 'none'

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

    this.optionInfo.innerHTML = this.asdasd()

    let sunrise = new Date(data.daily[0].sunrise * 1000)
    let sunset = new Date(data.daily[0].sunset * 1000)
    this.sunTime.innerHTML = `
      <div>
        <p>${('00' + sunrise.getHours()).slice(-2)} : ${('00' + sunrise.getMonth()).slice(-2)}</P>
      </div>
      <div>
        <p>${('00' + sunset.getHours()).slice(-2)} : ${('00' + sunset.getMonth()).slice(-2)}</P>
      </div>
    `
  }

  asdasd() {
    return `
    
    `
  }
}
