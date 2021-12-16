import { Animation } from './animation.js'

export class SubPageTimeTemp {
  constructor(data) {
    this.subPageTimeTemp = document.getElementById('subPageTimeTemp')
    this.timeTemp = document.getElementById('timeTemp')
    this.testBtn = document
      .getElementById('subPageTimeTemp')
      .getElementsByTagName('button')[0]
    this.hourTemp = document.getElementById('hourTemp')
    this.hourTempNext = document.getElementById('hourTempNext')
    this.hourTempPrev = document.getElementById('hourTempPrev')
    
    this.weekTemp = document.getElementById('weekTemp')
    this.mainPage = document.getElementById('mainPage')
    this.Animation = new Animation()
    this.move = 0

    this.timeTemp.addEventListener('click', () => {
      this.Animation.SlideEnlargePadeOut(this.mainPage)
      this.Animation.SlideEnlargePadeIn(this.subPageTimeTemp)

      this.hourTempDivWidth = this.hourTemp.getBoundingClientRect().width / 48
      this.oneMove = this.hourTempDivWidth * 12
      this.maxMove = this.hourTempDivWidth * 36
      this.stageWidth = this.hourTempDivWidth * 48
      this.stageHeight = 40

      this.htmlInAPI(data)
    })
    this.testBtn.addEventListener('click', () => {
      this.Animation.SlideEnlargePadeOut(this.subPageTimeTemp)
      this.Animation.SlideEnlargePadeIn(this.mainPage)

      setTimeout(() => {
        this.move = 0
        this.hourTemp.style.right = `${this.move}px`
        this.hourTempPrev.style.display = 'none'
        this.hourTempNext.style.display = 'block'
      },400)
    })

    document.addEventListener('click', this.clickPrevNext.bind(this))
  }

  clickPrevNext(event) {
    switch (event.target.id) {
      case 'hourTempNext':
        this.move += this.oneMove
        if (this.move >= this.maxMove) {
          this.move = this.maxMove
          this.hourTempNext.style.display = 'none'
        }
        if (this.move > 0) {
          this.hourTempPrev.style.display = 'block'
        }
        this.hourTemp.style.right = `${this.move}px`
        break
      case 'hourTempPrev':
        this.move -= this.oneMove
        if (this.move <= 0) {
          this.move = 0
          this.hourTempPrev.style.display = 'none'
        }
        if (this.move < this.maxMove) {
          this.hourTempNext.style.display = 'block'
        }
        this.hourTemp.style.right = `${this.move}px`
        break
    }
  }

  htmlInAPI(data) {
    this.resetChart()
    this.hourTemp.innerHTML = `<canvas id="hourTempChart"></canvas>`
    this.chartPoint = this.hourTemp.getElementsByClassName('point')
    this.canvas = document.getElementById('hourTempChart')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.stageWidth
    this.canvas.height = this.stageHeight

    let max = Math.round(Math.max.apply(Math, data.hourly.map((o) => {return o.temp})))
    let min = Math.round(Math.min.apply(Math, data.hourly.map((o) => {return o.temp})))
    let range = max - min

    for (let i = 0; i < data.hourly.length; ++i) {
      let time = new Date(data.hourly[i].dt * 1000)
      let hour = `<p>${(`00` + time.getHours()).slice(-2)} 시</p>`
      let temp = Math.round(data.hourly[i].temp)
      if (time.getHours() == 0) {
        if (time.getDate() == new Date().getDate()) {
          hour = `<p class="box">오늘</P>`
        }
        if (time.getDate() == new Date().getDate() + 1) {
          hour = `<p class="box">내일</P>`
        }
        if (time.getDate() == new Date().getDate() + 2) {
          hour = `<p class="box">모레</P>`
        }
      }
      let div = document.createElement('div')
      div.innerHTML = `
        <article>
          <div class="point"><p>${temp}˚</p></div>
        </article>
        <img src="http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png" alt="icon ${i}">
        ${hour}
      `
      this.hourTemp.appendChild(div)

      this.tempPersent = 10 + (Math.round(data.hourly[i].temp) - min) / range * 70
      this.chartPoint[i].style.bottom = `${this.tempPersent}%`

      let pointX = (this.hourTempDivWidth * (i + 1) - this.hourTempDivWidth / 2) + 1
      let pointY = 38 - (40 * (this.tempPersent / 100))
      let presentX = pointX
      let presentY = pointY

      if (i - 1 >= 0) {
        let tP = 10 + (Math.round(data.hourly[i - 1].temp) - min) / range * 70
        presentY = 38 - (40 * (tP / 100))
        presentX = (this.hourTempDivWidth * i - this.hourTempDivWidth / 2) + 1
      }

      this.ctx.beginPath()
      this.ctx.arc(pointX, pointY, 3, 0, Math.PI*2, false)
      this.ctx.moveTo(presentX, presentY)
      this.ctx.lineTo(pointX, pointY)
      this.ctx.stroke()
      this.ctx.fillstyle = "green"
      this.ctx.fill()
      this.ctx.closePath()
    }

    this.weekTemp.innerHTML = ''
    for (let i = 0; i < data.daily.length; ++i) {
      let today = new Date(data.daily[i].dt * 1000)
      let date = `${today.getMonth() + 1}.${today.getDate()}`
      let day = this.getDay(today.getDay())
      if (today.getDate() == new Date().getDate()) {
        day = '오늘'
      }
      if (today.getDate() == new Date().getDate() + 1) {
        day = '내일'
      }
      let maxtemp = Math.round(data.daily[i].temp.max)
      let mintemp = Math.round(data.daily[i].temp.min)
      let pop = Math.round(data.daily[i].pop * 100)

      this.weekTemp.innerHTML += `
        <article>
          <div>
            <p>${day}</p>
            <p>${date}</p>
          </div>
          <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="icon ${i}">
          <div>
            <i class="fas fa-umbrella"></i>
            <p>${pop} %</p>
          </div>
          <div>
            <p>${maxtemp}</p>
            <p>${mintemp}</p>
          </div>
        </article>
      `
    }
  }

  getDay(a) {
    if (a == 0) {
      a = '일요일'
    } else if (a == 1) {
      a = '월요일'
    } else if (a == 2) {
      a = '화요일'
    } else if (a == 3) {
      a = '수요일'
    } else if (a == 4) {
      a = '목요일'
    } else if (a == 5) {
      a = '금요일'
    } else if (a == 6) {
      a = '토요일'
    }
    return a
  }

  resetChart() {
    while (this.hourTemp.hasChildNodes()) {
      this.hourTemp.removeChild(this.hourTemp.firstChild)
    }
  }
}
