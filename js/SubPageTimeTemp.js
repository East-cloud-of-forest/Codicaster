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

    this.clickHendler = this.clickPrevNext.bind(this)

    this.timeTemp.addEventListener('click', () => {
      this.subPageTimeTemp.style.display = 'flex'
      this.hourTempDivWidth = document.getElementById('hourTemp').getElementsByTagName('div')[0].getBoundingClientRect().width
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
}
