export class SubPageTimeTemp {
  constructor() {
    this.subPageTimeTemp = document.getElementById('subPageTimeTemp')
    this.timeTemp = document.getElementById('timeTemp')
    this.testBtn = document
      .getElementById('subPageTimeTemp')
      .getElementsByTagName('button')[0]
    this.hourTemp = document.getElementById('hourTemp')
    this.hourTempNext = document.getElementById('hourTempNext')
    this.hourTempPrev = document.getElementById('hourTempPrev')
    this.move = 0
    this.hourTemp = document.getElementById('hourTemp')
    this.weekTemp = document.getElementById('weekTemp')

    this.clickHendler = this.clickPrevNext.bind(this)

    this.timeTemp.addEventListener('click', () => {
      this.subPageTimeTemp.style.display = 'flex'
      this.hourTempDivWidth = document
        .getElementById('hourTemp')
        .getElementsByTagName('div')[0]
        .getBoundingClientRect().width
      this.oneMove = this.hourTempDivWidth * 12
      this.maxMove = this.hourTempDivWidth * 36

      document.addEventListener('click', this.clickHendler)
    })

    this.testBtn.addEventListener('click', () => {
      this.subPageTimeTemp.style.display = 'none'

      this.move = 0
      this.hourTemp.style.right = `${this.move}px`
      this.hourTempPrev.style.display = 'none'
      this.hourTempNext.style.display = 'block'

      document.removeEventListener('click', this.clickHendler)
    })
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
    this.hourTemp.innerHTML = ``
    for (let i = 0; i < data.hourly.length; ++i) {
      let dt = data.hourly[i].dt * 1000
      let time = new Date(dt)
      let hour = `<p>${time.getHours()}</p>`
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

      this.hourTemp.innerHTML += `
        <div>
          <p>${temp}˚</p>
          <img src="http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png" alt="icon ${i}">
          ${hour}
        </div>
      `
    }

    
    this.weekTemp.innerHTML = ''
    for (let i = 0; i < data.daily.length; ++i) {
      let dt = data.daily[i].dt * 1000
      let today = new Date(dt)
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
}
