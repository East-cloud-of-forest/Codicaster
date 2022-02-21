export class SubPageCloth {
  constructor() {
    this.clothes = document.getElementById('clothes')
  }

  mainPageHtml(data) {
    let curtemp = Math.round(data.main.temp)

    // curtemp =28

    let clothImg = []
    let clothTag = []
    let clothText = ``
    let boxColor = ``

    if(curtemp >= 28) {
      clothTag = ["민소매", "반팔", "짧은 하의"]
      clothText = `너무 더워요. 얇게 입어 열사병에 주의하고 실내에 있기로 해요.`
      boxColor = `#e43d2b`
    } else if (23 <= curtemp && curtemp <= 27) {
      clothTag = ["반팔", "얇은 셔츠", "반바지", "면바지"]
      clothText = `더운 날씨예요. 실내에 오래 있다면 외투를 챙기도록 해요. 에어컨이 추울 수 있어요.`
      boxColor = `#e9602c`
    } else if (20 <= curtemp && curtemp <= 22) {
      clothTag = ["블라우스", "긴팔 티", "면바지", "슬랙스"]
      clothText = `따뜻하기도 시원하기도 한 날씨예요. 일교차에 주의해야 겠어요.`
      boxColor = `#ee8d1c`
    } else if (17 <= curtemp && curtemp <= 19) {
      clothTag = ["맨투맨", "후드", "슬랙스", "청바지"]
      clothText = `선선하고 좋은 날씨예요. 밤에는 추울 수도 있으니 외투를 챙기도록 해요.`
      boxColor = `#cfac2d`
    } else if (12 <= curtemp && curtemp <= 16) {
      clothTag = ["자켓", "가디건", "청자켓", "니트", "청바지"]
      clothText = `조금 쌀쌀할 수 있어요. 멋도 좋지만 따스한 외투를 하나씩 챙겨요.`
      boxColor = `#b7ae32`
    } else if (9 <= curtemp && curtemp <= 11) {
      clothTag = ["코트", "야상", "점퍼", "목티"]
      clothText = `쌀쌀한 날씨예요. 센치한 멋을 부릴 수 있는 날씨!`
      boxColor = `#8bae5b`
    } else if (5 <= curtemp && curtemp <= 8) {
      clothTag = ["두꺼운 코트", "히트텍", "기모", "플리스"]
      clothText = `조금 추운 날씨예요. 내의를 챙겨 입고 따뜻하게 다녀요.`
      boxColor = `#4998b6`
    } else if (4 >= curtemp) {
      clothTag = ["패딩", "두꺼운 코트", "기모", "목도리"]
      clothText = `날씨가 아주 추워요. 꽁꽁 싸매고 둘러야 해요. 두툼하게 입도록 해요.`
      boxColor = `#2d82c3`
    }

    for (let i in clothTag) {
      clothTag[i] = `<span value="${i}"># ${clothTag[i]}</span>`
      
      clothImg[i] = `<div class="clothImges" value="${i}">${clothTag[i]}</div>`
    }

    this.clothes.innerHTML = `
      <div class="clothTag">${clothTag.join('')}</div>
      <div class="clothImg">${clothImg.join('')}</div>
      <div class="clothText"><p>${clothText}</p></div>
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

    // 이미지 애니메이션
    let clothinterval, clothtimeout
    
    function clothAnimation() {
        clothtimeout = setTimeout(() => {
          movecloth(5)
          clothinterval = setInterval(() => {
            movecloth(5)
          }, 7000)
        }, 3000)
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

    // 텍스트 애니메이션
    let clothTextBox = document.getElementsByClassName('clothText')[0]
    let clothesText = clothTextBox.getElementsByTagName('p')[0]
    let offWidth = clothesText.offsetWidth
    let scrWidth = clothesText.scrollWidth
    let textTimeset

    clothTextBox.style.backgroundColor = boxColor

    textMove()
    
    function textMove() {
      if (offWidth - scrWidth != 0) {
        textTimeset = setTimeout(() => {
          clothesText.style.textIndent = `${(offWidth - scrWidth)* 2}px`
        }, 3000)
      }
    }

    function textFadeout(text) {
      text.style.transition = `top 0.7s, text-indent 1s linear`
      text.style.top = `-130%`
      setTimeout(() => {
        text.style.transition = `text-indent 1s linear`
        text.style.opacity = `0`
        text.style.top = `100%`
        clothesText.style.textIndent = ``
      }, 700)
    }

    function textFadein(text) {
      setTimeout(() => {
        clearTimeout(textTimeset)
        text.style.transition = `top 0.7s, text-indent 1s linear`
        text.style.top = `0`
        text.style.opacity = `1`
        textTimeset = setTimeout(() => {
          text.style.transition = `text-indent 1s linear`
          textMove()
        }, 3000)
      },2000)
    }

    setTimeout(() => {
      textFadeout(clothesText)
      textFadein(clothesText)
      setInterval(() => {
        textFadeout(clothesText)
        textFadein(clothesText)
      }, 12000)
    }, 6000)
  }
}