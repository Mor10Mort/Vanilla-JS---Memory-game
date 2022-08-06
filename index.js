'use strict';

const boardMechanics = {
  tiles: 24,
  amountToBeMatched: 12,
  emojiCharacters: ['\uD83D\uDC7B', '\uD83D\uDC7D', '\uD83D\uDCA9', '\uD83E\uDD21', '\uD83D\uDC12', '\uD83D\uDC7E', '\uD83D\uDC76', '\u2605', '\u2694', '\u26F1', '\uD83D\uDC3B', '\uD83D\uDDA4', '\uD83D\uDC26','\uD83D\uDEBD','\uD83D\uDC07','\uD83D\uDE83','\uD83D\uDC53','\uD83C\uDF84','\uD83C\uDF4C','\u23F0'],
  theTilesRandom:[],
  theMatchedTiles: [],
  theSelectedCards: [],
  tempCheckCard: [],
  keepTheDivs:[],
  playWrongSound:[],
  playCorrectSound:[],
  comepleGameSound:[],
  flipCardSound:[],
  soundWrong: function(src){
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "none");
      this.sound.style.display = "none";
      document.body.appendChild(this.sound);
      this.play = function(){
        this.sound.play();
      }
      this.stop = function(){
        this.sound.pause();
      }
  },
  randoNumber: function () {
    return Math.floor(Math.random() * this.amountToBeMatched);
  },
  createTheBoard: function () {
    //preload lyder
    this.playWrongSound = new boardMechanics.soundWrong ("wrongCard3.wav");
    this.playCorrectSound = new boardMechanics.soundWrong ("correctCard.wav");
    this.comepleGameSound = new boardMechanics.soundWrong ("completeGame.wav");
    this.flipCardSound = new boardMechanics.soundWrong ("flipCard.wav");
    /*this.playWrongSound.preload;
    this.playCorrectSound.preload;
    this.comepleGameSound.preload;
    this.flipCardSound.preload;*/

    //Henter ut random emojis, duplisere de og legger de i matchesTilesArray
    for (let rep = 0; rep < this.amountToBeMatched; rep++) {
      let random = Math.floor(Math.random() * boardMechanics.emojiCharacters.length);
      this.theTilesRandom.push(boardMechanics.emojiCharacters.splice(random, 1)[0]);
      for (let match = 0; match < 2; match++) {
        this.theMatchedTiles.push(this.theTilesRandom[rep]);
      }
    }
    console.log(this.theMatchedTiles);

    //Sprer emojis random på brettet
    let number = 0;
    while (this.theMatchedTiles.length) {
      const random = Math.floor(Math.random() * boardMechanics.theMatchedTiles.length);
      const el = boardMechanics.theMatchedTiles.splice(random, 1)[0];
      let theBoardDiv = document.getElementById('theBoard');
      let flipCard = document.createElement('div');
      flipCard.classList.add('squareNumber' + el, 'flipCard');
      flipCard.setAttribute('id', 'cardNr'+number);
      theBoardDiv.append(flipCard);

      let flipCardInner = document.createElement('div');
      flipCardInner.className = "flipCardInner";
      flipCard.append(flipCardInner);

      let flipCardBack = document.createElement('div');
      flipCardBack.className = "flipCardBack";
      flipCardBack.innerHTML = el;
      flipCardInner.append(flipCardBack);

      let flipCardFront= document.createElement('div');
      flipCardFront.className = "flipCardFront";
      flipCardFront.innerHTML = "\u2754";
      flipCardInner.append(flipCardFront);

      flipCard.addEventListener("click", this.checkIfMatch);
      number++;
    }
  },
  checkIfMatch: function () {
    boardMechanics.flipCardSound.play();
    
    let divFlipCardInner = this.childNodes[0];
    let divFlipParent = this;
    const captureHtml = this.innerHTML;
    boardMechanics.theSelectedCards.push(captureHtml);
   
    //Stop spiller fra å flippe flere enn 2stk kort
    if (boardMechanics.theSelectedCards.length<=2){
      divFlipCardInner.classList.add("flipCardInnerHover"); 
      boardMechanics.keepTheDivs.push(this.childNodes[0]);
    }

    //denne til sjekke om klikker på samme kortet, for unngå match ved klikke på samme kort
    boardMechanics.tempCheckCard.push(divFlipParent);
    let checkIfClickedSameCard = (boardMechanics.tempCheckCard[0]==boardMechanics.tempCheckCard[1]);
    //console.log(checkIfClickedSameCard);
    
    //dersom spiller har klikket på to kort og de er like OG det er ikke SAMME kort,
    if ((boardMechanics.theSelectedCards.length==2) && (boardMechanics.theSelectedCards[0]==boardMechanics.theSelectedCards[1]) && !(checkIfClickedSameCard)){
      console.log("match");
      boardMechanics.clearCard();

      //legger på klasse slik at ikke kortet flipper tilbake
      boardMechanics.keepTheDivs.forEach((item, i) => {
        item.classList.add("flipCardInnerHoverMatch"); 
      });
      setTimeout(function () {
        boardMechanics.playCorrectSound.play();
      }, 100);
      
      //sjekker om spiller greid alle kortene. Lagt på timer slik at siste kort rekker snu seg.
      setTimeout(function () {
      boardMechanics.theMatchedTiles.push(divFlipCardInner); 
        if (boardMechanics.theMatchedTiles.length == boardMechanics.amountToBeMatched){
          //alert("WINNER!");
          setTimeout(function () {    
            boardMechanics.comepleGameSound.play();
          }, 120);
        }
      }, 1000);
    } else if ((boardMechanics.theSelectedCards.length==2) && (boardMechanics.theSelectedCards[0]!==boardMechanics.theSelectedCards[1])){
      console.log("NOT match");
     
      boardMechanics.clearCard("yes");
      setTimeout(function () {    
        boardMechanics.playWrongSound.play();
      }, 800);
    }  
    
  },
  clearCard: function(flipBack){
  setTimeout(function () {
    if (flipBack==="yes"){
    const alleInnerCards = document.querySelectorAll('.flipCardInner');
    alleInnerCards.forEach(alleInnerCards => {
      alleInnerCards.classList.remove("flipCardInnerHover");
    });
    }
    boardMechanics.theSelectedCards = [];
    boardMechanics.tempCheckCard = [];
    boardMechanics.keepTheDivs = [];
  }, 1550);
},
};

boardMechanics.createTheBoard();
