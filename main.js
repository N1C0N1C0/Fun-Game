'use strict'

const carrotSize=80;
const carrotCount=10;
const bugCount=5;
const GameDurationSec=5;

const field = document.querySelector('.game_field');
const fieldRect=field.getBoundingClientRect();
const gameBtn=document.querySelector('.game_button');
const gameTimer=document.querySelector('.game_timer');
const gameCount=document.querySelector('.game_count');

const popUp=document.querySelector('.pop-up')
const popRefresh=document.querySelector('.pop-up_refresh')
const popMessage=document.querySelector('.pop-up_message')

const carrotSound=new Audio('./sound/carrot_pull.mp3')
const alertSound=new Audio('./sound/alert.mp3')
const bgSound=new Audio('./sound/bg.mp3')
const bugSound=new Audio('./sound/bug_pull.mp3')
const gameWinSound=new Audio('./sound/game_win.mp3')

let started=false;
let score=0;
let timer=undefined;

field.addEventListener('click',(event)=> onFieldClick(event))
gameBtn.addEventListener('click',()=>{
    if(started){
        stopGame();
    }else{
        startGame();
    }
})

popRefresh.addEventListener('click',()=>{
    startGame();
    hidePopUp();
})
function startGame() {
    started=true;
    initGame();
    showStopBtn();
    showTimerAndScore();
    stratGameTimer();
    playSound(bgSound);
}
function stopGame() {
    started=false;
    stopGameTimer();
    hideGameBtn();
    showPopup('REPLAY?');
    playSound(alertSound);
    stopSound(bgSound);
}


function finishGame(win) {
    started=false;
    hideGameBtn();
    if(win) {
        playSound(gameWinSound);
    }else {
        playSound(bugSound);
    }
    stopGameTimer();
    showPopup(win? 'YOU WON!!' : 'YOU LOST..')
}
function showStopBtn() {
    const icon=gameBtn.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility='visible'
}

function hideGameBtn() {
    gameBtn.style.visibility='hidden'
}

function showTimerAndScore() {
    gameTimer.style.visibility='visible'
    gameCount.style.visibility='visible'
}
function stratGameTimer() {
    let remainingTimeSec=GameDurationSec;
    updateTimerSec(remainingTimeSec);
    timer= setInterval(()=>{
        if (remainingTimeSec <= 0) {
            clearInterval(timer);
            finishGame(carrotCount===score);
            return;
        }
        updateTimerSec(--remainingTimeSec);
    },1000)
    };

function stopGameTimer() {
    clearInterval(timer);
}

    function updateTimerSec(time) {
        const minutes=Math.floor(time/60);
        const seconds=time%60;
        gameTimer.innerText=`${minutes}:${seconds}`;
    }

    function showPopup(text) {
        popMessage.innerText=text;
        popUp.classList.remove('pop-up--hide');
    }

    function hidePopUp() {
        popUp.classList.add('pop-up--hide');
    }


function initGame() {
    score=0;
    field.innerHTML='';
    gameCount.innerText=carrotCount;
    // 벌레와 당근을 생선한뒤 field에 추가해줌
    addItem('carrot',carrotCount,'img/carrot.png')
    addItem('bug',bugCount,'img/bug.png')
}
function onFieldClick(event) {
    if (!started) {
        return;
    }
    const target=event.target;
    if(target.matches('.carrot')){
        // 당근!!
        target.remove();
        score++
        playSound(carrotSound);
        updateScoreBoard();
        if (score===carrotCount) {
            finishGame(true);
        }
    }else if(target.matches('.bug')){
        // 벌레!!
        
        finishGame(false);
    }
}

function playSound(sound){
    sound.currentTime=0;
    sound.play();
}
function stopSound(sound) {
    
    sound.pause();
}

function updateScoreBoard(){
    gameCount.innerText=carrotCount-score;
}

function addItem(className, count, imgPath) {
    const x1=0;
    const y1=0;
    const x2=fieldRect.width-carrotSize;
    const y2=fieldRect.height-carrotSize;
    for(let i=0; i< count ; i++){
    const item=document.createElement('img');
    item.setAttribute('class',className);
    item.setAttribute('src',imgPath);
    item.style.position='absolute';
    const x = randomNumber(x1,x2);
    const y= randomNumber(y1,y2);
    item.style.left=`${x}px`;
    item.style.top=`${y}px`;
    field.appendChild(item);
    }
}

function randomNumber(min,max){
    return Math.random()*(max-min)+min;
}

