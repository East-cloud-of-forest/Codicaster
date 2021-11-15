export class SubPageTimeTemp {
  constructor() {
    this.subPage = document.getElementById('subPage')
    this.timeTemp = document.getElementById('timeTemp')
    this.testBtn = document
      .getElementById('subPage')
      .getElementsByTagName('button')[0]
    this.hourTemp = document.getElementById('hourTemp')
    this.hourTempNext = document.getElementById('hourTempNext')
    this.hourTempPrev = document.getElementById('hourTempPrev')
    this.move = 0

    this.clickHendler = this.clickPrevNext.bind(this)

    this.timeTemp.addEventListener('click', () => {
      this.subPage.style.display = 'flex'
      this.hourTempDivWidth = document
        .getElementById('hourTemp')
        .getElementsByTagName('div')[0].offsetWidth
      this.oneMove = this.hourTempDivWidth * 12
      this.maxMove = this.hourTempDivWidth * 36

      this.hourTempNext.addEventListener('click', this.clickHendler)
      this.hourTempPrev.addEventListener('click', this.clickHendler)
    })

    this.testBtn.addEventListener('click', () => {
      this.subPage.style.display = 'none'

      this.move = 0
      this.hourTemp.style.right = `${this.move}px`
      this.hourTempPrev.style.display = 'none'
      this.hourTempNext.style.display = 'block'

      this.hourTempNext.removeEventListener('click', this.clickHendler)
      this.hourTempPrev.removeEventListener('click', this.clickHendler)
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
}
