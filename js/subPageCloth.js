export class SubPageCloth {
  constructor() {
    this.clothes = document.getElementById('clothes')
  }

  mainPageHtml(data) {
    let curtemp = Math.round(data.main.temp)
    curtemp = 4
    let clothText = ``
    if(curtemp >= 28) {
      clothText = `<div>민소매, 반팔, 짧은 하의</div>`
    } else if (23 <= curtemp && curtemp <= 27) {
      clothText = `<div>반팔, 얇은 셔츠, 반바지, 면바지</div>`
    } else if (20 <= curtemp && curtemp <= 22) {
      clothText = `<div>블라우스, 긴팔 티, 면바지, 슬랙스</div>`
    } else if (17 <= curtemp && curtemp <= 19) {
      clothText = `<div>맨투맨, 후드, 슬랙스, 청바지</div>`
    } else if (12 <= curtemp && curtemp <= 16) {
      clothText = `<div>자켓, 가디건, 청자켓, 니트, 청바지</div>`
    } else if (9 <= curtemp && curtemp <= 11) {
      clothText = `<div>코트, 야상, 점퍼, 목티</div>`
    } else if (5 <= curtemp && curtemp <= 8) {
      clothText = `<div>두꺼운 코트, 히트텍, 기모, 플리스</div>`
    } else if (4 >= curtemp) {
      clothText = `<div>패딩, 두꺼운 코트, 기모, 목도리</div>`
    }

    this.clothes.innerHTML = `
        ${clothText}
      `
  }
}