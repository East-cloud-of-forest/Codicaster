export class SubPageCloth {
  constructor() {
    this.clothes = document.getElementById('clothes')
  }

  mainPageHtml(data) {
    let curtemp = Math.round(data.main.temp)

    // curtemp = 13

    let clothImg = []
    let clothTag = []
    let clothText = ``

    if(curtemp >= 28) {
      clothTag = ["민소매", "반팔", "짧은 하의"]
    } else if (23 <= curtemp && curtemp <= 27) {
      clothTag = ["반팔", "얇은 셔츠", "반바지", "면바지"]
    } else if (20 <= curtemp && curtemp <= 22) {
      clothTag = ["블라우스", "긴팔 티", "면바지", "슬랙스"]
    } else if (17 <= curtemp && curtemp <= 19) {
      clothTag = ["맨투맨", "후드", "슬랙스", "청바지"]
    } else if (12 <= curtemp && curtemp <= 16) {
      clothTag = ["자켓", "가디건", "청자켓", "니트", "청바지"]
    } else if (9 <= curtemp && curtemp <= 11) {
      clothTag = ["코트", "야상", "점퍼", "목티"]
    } else if (5 <= curtemp && curtemp <= 8) {
      clothTag = ["두꺼운 코트", "히트텍", "기모", "플리스"]
    } else if (4 >= curtemp) {
      clothTag = ["패딩", "두꺼운 코트", "기모", "목도리"]
    }

    for (let i in clothTag) {
      clothTag[i] = `<span value="${i}">#${clothTag[i]}</span>`
      
      clothImg[i] = `<div class="clothImges" value="${i}">${clothTag[i]}</div>`
    }

    this.clothes.innerHTML = `
      <div class="clothTag">${clothTag.join('')}</div>
      <div class="clothImg">${clothImg.join('')}</div>
      <div class="clothText"></div>
      <input type="button" id="test_button" value="dd">
    `

    let clothDiv = document.getElementsByClassName('clothImg')[0]
    let clothImges = document.getElementsByClassName("clothImges")
    let clothMain = clothImges[2]

    clothDiv.style.width = `${clothTag.length * 100}%`
    if (clothTag.length % 2 != 0) {
      clothDiv.style.left = `-${(clothTag.length * 100 / 2) - 50}%`
    } else {
      clothDiv.style.left = `-${clothTag.length * 100 / 2}%`
    }

    function clothImgesLeft(i) {
      clothImges[i].style.left = `${100 / clothTag.length * i}%`
    }

    for (let i in clothTag) {
      clothImges[i].style.width = `${100 / clothTag.length}%`
      clothImgesLeft(i)
    }

    // 애니메이션
    let clothinterval, clothtimeout
    
    function clothAnimation() {
        clothtimeout = setTimeout(() => {
          movecloth(5)
          clothinterval = setInterval(() => {
            movecloth(5)
          }, 7000)
        }, 2000)
    }

    clothAnimation()

    function movecloth(time) {
      clothDiv.appendChild(clothDiv.firstChild)
        for (let i in clothTag) {
          clothImges[i].style.transition = ``
          clothImges[i].style.transition = `left ${time}s`
          clothImgesLeft(i)
        }
      clothMain = clothImges[2]
    }

    let clothTagBtnS = document.getElementsByClassName('clothTag')[0].getElementsByTagName('span')
    let clothTagBtn = []

    for (let i = 0; i < clothTagBtnS.length; ++i) {
      clothTagBtn[i] = clothTagBtnS[i]

      clothTagBtn[i].addEventListener('click', () => {
        clearInterval(clothinterval)
        clearTimeout(clothtimeout)
        clothAnimation()
        let tegnum = clothTagBtn[i].attributes[0].value
        let imgnum = clothMain.attributes[1].value
        let count = 0

        if (tegnum > imgnum) {
          count = tegnum - imgnum
        } else if (tegnum < imgnum) {
          count = (tegnum - imgnum) + clothTagBtnS.length
        }

        let timer = ms => new Promise(res => setTimeout(res, ms))
        
        async function multimovecloth() {
          for (let i = 0; i < count; ++i) {
            movecloth(0.7)
            await timer(200)
          }
        }

        multimovecloth()
      })
    }


  }
}