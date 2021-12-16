export class Animation {
  constructor() {
  }

  UpDownPadeIn(pageName) {
    pageName.className = 'padeIn'
  }

  UpDownPadeOut(pageName) {
    pageName.className = 'padeOut'
  }

  SlideEnlargePadeIn(pageName) {
    pageName.className = 'wait'
    setTimeout(() => {
      pageName.className = 'padeIn'
    },250)
  }

  SlideEnlargePadeOut(pageName) {
    pageName.className = 'padeOut'
    setTimeout(() => {
      pageName.className = 'standby'
    },400)
  }
}