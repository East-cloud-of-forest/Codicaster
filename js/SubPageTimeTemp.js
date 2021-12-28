import { AnimationAndDesign } from './animationAndDesign.js'

export class SubPageTimeTemp {
  constructor(data) {
    this.subPageTimeTemp = document.getElementById('subPageTimeTemp')
    this.timeTemp = document.getElementById('timeTemp')
    this.CloseBtn = document.getElementById('CloseBtn')
    this.hourTemp = document.getElementById('hourTemp')
    this.hourTempNext = document.getElementById('hourTempNext')
    this.hourTempPrev = document.getElementById('hourTempPrev')
    
    this.weekTemp = document.getElementById('weekTemp')
    this.mainPage = document.getElementById('mainPage')
    this.AnimationAndDesign = new AnimationAndDesign()
    this.move = 0
    this.body = document.getElementById('body')

    // 서브페이지로 전환
    this.timeTemp.addEventListener('click', () => {
      this.AnimationAndDesign.SlideEnlargePadeOut(this.mainPage)
      this.AnimationAndDesign.SlideEnlargePadeIn(this.subPageTimeTemp)

      // 한페이지에 보일 시간 수
      let timeTempDivCount = 8
      this.timeTempChartSizing(timeTempDivCount)
      
      // 페이지 삽입
      this.htmlInAPI(data)
    })
    // 서브페이지 닫기
    this.CloseBtn.addEventListener('click', () => {
      this.AnimationAndDesign.SlideEnlargePadeOut(this.subPageTimeTemp)
      this.AnimationAndDesign.SlideEnlargePadeIn(this.mainPage)

      // 차트 위치 및 버튼 상태 리셋
      setTimeout(() => {
        this.move = 0
        this.hourTemp.style.right = `${this.move}px`
        this.hourTempPrev.style.display = 'none'
        this.hourTempNext.style.display = 'flex'
      },400)
    })

    document.addEventListener('click', this.clickPrevNext.bind(this))
    let backGroundColorPick = this.body.style.background.split('(')[4].split(')')[0]
    document.documentElement.style.setProperty('--btn-color', `rgba(${backGroundColorPick},1)`)
  }

  timeTempChartSizing(timeTempDivCount) {
    this.hourTempDivWidth = (this.body.getBoundingClientRect().width - (this.body.getBoundingClientRect().width * 0.06)) / (timeTempDivCount + 1)
    this.oneMove = this.hourTempDivWidth * timeTempDivCount
    this.maxMove = this.oneMove * ((48 - timeTempDivCount) / timeTempDivCount)
    this.stageWidth = this.hourTempDivWidth * 48
    this.stageHeight = 40
    this.hourTemp.style.width = `calc(100% * ${48 / (timeTempDivCount + 1)})`
    this.hourTemp.style.marginLeft = `${this.hourTempDivWidth / 2}px`
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
          this.hourTempPrev.style.display = 'flex'
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
          this.hourTempNext.style.display = 'flex'
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
    this.canvas.style.width = this.stageWidth
    this.canvas.style.height = this.stageHeight
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1
    this.canvas.width = this.stageWidth * this.pixelRatio
    this.canvas.height = this.stageHeight * this.pixelRatio
    this.ctx.scale(this.pixelRatio, this.pixelRatio)
    document.documentElement.style.setProperty('--canvas-with', `${this.stageWidth}px`)
    document.documentElement.style.setProperty('--canvas-height', `${this.stageHeight}px`)
    

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
          <div class="point"><span>${temp}˚</span></div>
        </article>
        <div>
          <img src="images/${this.AnimationAndDesign.icon(data.hourly[i].weather[0].icon)[0]}" alt="icon ${i}">
        </div>
        ${hour}
      `
      this.hourTemp.appendChild(div)

      this.timeicon = this.hourTemp.getElementsByTagName('img')[i]
      this.timeicon.style.width = this.AnimationAndDesign.icon(data.hourly[i].weather[0].icon)[1]

      this.tempPersent = 10 + (Math.round(data.hourly[i].temp) - min) / range * 70
      this.chartPoint[i].style.bottom = `${this.tempPersent}%`

      let pointX = (this.hourTempDivWidth * (i + 1) - this.hourTempDivWidth / 2) + 1
      let pointY = 38 - (40 * (this.tempPersent / 100))
      let presentX = pointX
      let presentY = pointY

      if (i - 1 >= 0) {
        let tP = 10 + (Math.round(data.hourly[i - 1].temp) - min) / range * 70
        presentX = (this.hourTempDivWidth * i - this.hourTempDivWidth / 2) + 1
        presentY = 38 - (40 * (tP / 100))
      }

      this.ctx.beginPath()
      this.ctx.arc(pointX, pointY, 3, 0, Math.PI*2, false)
      this.ctx.moveTo(presentX, presentY)
      this.ctx.lineTo(pointX, pointY)
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      this.ctx.lineWidth = 6
      this.ctx.stroke()
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
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
            <div>
              <p>${day}</p>
              <p>${date}</p>
            </div>
            <div>
              <p>${maxtemp}˚</p>
              <p>/</p>
              <p>${mintemp}˚</p>
            </div>
            <div>
              <i class="fas fa-umbrella"></i>
              <p>${pop}%</p>
            </div>
          </div>
          <div>
            <img src="images/${this.AnimationAndDesign.icon(data.daily[i].weather[0].icon)[0]}" alt="icon ${i}">
          </div>
        </article>
      `

      this.weekIcon = this.weekTemp.getElementsByTagName('img')[i]
      this.weekIcon.style.width = this.AnimationAndDesign.icon(data.daily[i].weather[0].icon)[1]
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
