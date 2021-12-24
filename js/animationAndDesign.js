export class AnimationAndDesign {
  constructor() {}

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
    }, 250)
  }

  SlideEnlargePadeOut(pageName) {
    pageName.className = 'padeOut'
    setTimeout(() => {
      pageName.className = 'standby'
    }, 400)
  }

  icon(data) {
    switch (data) {
      case '01d':
        return ['sun.svg', '45%']
      case '01n':
        return ['moon.svg', '45%']
      case '02d':
        return ['fewc.svg', '70%']
      case '02n':
        return ['fewcn.svg', '52%']
      case '03d':
        return ['middlec.svg', '60%']
      case '03n':
        return ['middlecn.svg', '62%']
      case '04d':
      case '04n':
        return ['maxc.svg', '53%']
      case '09d':
      case '10d':
        return ['rain.svg', '55%']
      case '09n':
      case '10n':
        return ['rainn.svg', '55%']
      case '11d':
        return ['light.svg', '55%']
      case '11n':
        return ['lightn.svg', '55%']
      case '13d':
      case '13n':
        return ['snow.svg', '45%']
      case '50d':
      case '50n':
        return ['mist.svg', '45%']
    }
  }

  backgroundcolor(data) {
    switch (data) {
      case '01d':
      case '02d':
        return`
        background: rgb(60,134,255);
        background: linear-gradient(0deg, rgba(60,134,255,1) 40%, rgba(87,182,255,1) 80%, rgba(132,191,255,1) 100%);
        `
      case '03d':
        return`
        background: rgb(77,141,245);
        background: linear-gradient(0deg, rgba(77,141,245,1) 30%, rgba(114,186,241,1) 70%, rgba(153,192,236,1) 100%);
        `
      case '04d':
        return`
        background: rgb(89,144,235);
        background: linear-gradient(0deg, rgba(89,144,235,1) 20%, rgba(111,180,233,1) 50%, rgba(155,190,228,1) 80%);
        `
      case '09d':
      case '10d':
      case '11d':
        return`
        background: rgb(51,86,144);
        background: linear-gradient(0deg, rgba(51,86,144,1) 40%, rgba(88,129,159,1) 80%, rgba(129,156,185,1) 100%);
        `
      case '13d':
        return`
        background: rgb(99,122,161);
        background: linear-gradient(0deg, rgba(99,122,161,1) 40%, rgba(117,146,167,1) 80%, rgba(166,186,207,1) 100%);
        `
      case '50d':
        return`
        background: rgb(118,124,134);
background: linear-gradient(0deg, rgba(118,124,134,1) 30%, rgba(142,157,167,1) 60%, rgba(126,134,143,1) 90%);
        `

      case '01n':
      case '02n':
      case '03n':
      case '04n':
        return `
        background: rgb(7,7,9);
        background: linear-gradient(0deg, rgba(7,7,9,1) 0%, rgba(21,21,42,1) 40%, rgba(44,51,92,1) 80%, rgba(69,69,110,1) 100%);
        `
      case '09n':
      case '10n':
      case '11n':
        return `
        background: rgb(7,7,9);
        background: linear-gradient(0deg, rgba(7,7,9,1) 0%, rgba(23,23,36,1) 40%, rgba(34,37,56,1) 80%, rgba(48,48,68,1) 100%);
        `
      case '13n':
      case '50n':
        return `
        background: rgb(7,7,9);
        background: linear-gradient(0deg, rgba(7,7,9,1) 0%, rgba(21,21,42,1) 40%, rgba(44,51,92,1) 80%, rgba(69,69,110,1) 100%);
        `
    }
  }
}
