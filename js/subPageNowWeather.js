export class SubPageNowWeather {
  constructor() {
    this.subPageNowWeather = document.getElementById('subPageNowWeather')
    this.weatherInfo = document.getElementById('weatherInfo')
    this.close = document.getElementsByClassName('testX')[0]
    this.nowTimeTemp = document.getElementById('nowTimeTemp')

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
}
