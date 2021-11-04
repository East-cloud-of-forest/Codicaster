class App {
  constructor() {
    this.W = document.createElement('div')
    document.body.appendChild(this.W)
    this.W.style.width = '500px'
    this.W.style.height = '500px'
    this.W.style.background = 'pink'

    this.city = document.getElementById('city')
    this.city.addEventListener('change', this.clickCity.bind(this))
    this.clickCity()
  }

  clickCity() {
    if (this.city.value == 'select') {
      return
    } else {
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

          this.W.innerText = `${data.name}
          온도 : ${data.main.temp}
          최고온도 : ${data.main.temp_max}
          최저온도 : ${data.main.temp_min}
          
          ${icon}

          ${year}년 ${month + 1}월 ${date}일 ${day}
          ${time}시
          `
        })
        .catch((error) => console.log(('error', error)))
    }
  }
}

window.onload = () => {
  new App()
}
