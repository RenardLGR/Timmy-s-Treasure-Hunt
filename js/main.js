const hi='HELLO'

//Declare global variables to track game board size
const LINE_PIXEL_COUNT = 5
const TOTAL_PIXEL_COUNT = LINE_PIXEL_COUNT**2



//Shorten reference to game board
const gameContainer = document.getElementById('game-container')


createGameBoardPixels()


const gameBoardPixels = document.getElementsByClassName("game-board-pixel")
//Array-like collection of all pixels with indexes like so :
// 0 1 2 3 4
// 5 6 7 8 9
// ...
// 20 21 22 23 24

generate2T()
generateObstacles()


//GENERATING ENVIRONMENT FUNCTIONS
//=======================================================================

//Generate the game board
function createGameBoardPixels() {
    for(let i=0 ; i< TOTAL_PIXEL_COUNT ;i++) {
        gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="game-board-pixel" id="pixel${i}"></div>`
    }
}



//Generate Tim and Target
function generate2T() {
    //tim needs to be on a side but not on a corner
    let timSide=Math.floor(Math.random()*4) + 1 //[1 ; 4]

    let timIndex=Math.floor(Math.random()*(LINE_PIXEL_COUNT-2)) + 2 //[2 ; line_count-1] => no corner allowed



    let targetSide=timSide, targetIndex
    //I want the target to be on a side tim is not. I still don't want the target to be in a corner
    while(targetSide===timSide) {
        targetSide=Math.floor(Math.random()*4) + 1
    }
    targetIndex=Math.floor(Math.random()*(LINE_PIXEL_COUNT-2)) + 2

    placeItem('tim', timSide, timIndex)
    placeItem('target', targetSide, targetIndex)


    //Place tim and target on the board
    function placeItem(item, side, index) {
        //item = 'tim' OR 'target'
        let pos
        switch (side) {
            case 1: //top
                pos = index-1
                gameBoardPixels[pos].classList.add(item)
                break;
            case 2: //right
                pos = index*(LINE_PIXEL_COUNT)-1
                gameBoardPixels[pos].classList.add(item)
                break;
            case 3: //bottom
                pos = LINE_PIXEL_COUNT*LINE_PIXEL_COUNT-index
                gameBoardPixels[pos].classList.add(item)
                break;
            case 4: //left
                pos = LINE_PIXEL_COUNT*(index-1)
                gameBoardPixels[pos].classList.add(item)
                break;
    
            default:
                break;
        }
    }
}


//Generate obstacles
function generateObstacles() {
    let maxObst = 9
    let numObst = 0

    while(numObst < maxObst) {
        let rand = Math.floor(Math.random()*LINE_PIXEL_COUNT*LINE_PIXEL_COUNT)

        if( !(gameBoardPixels[rand].classList.contains('tim') ||gameBoardPixels[rand].classList.contains('target')) ){
            gameBoardPixels[rand].classList.add('obstacle')
            numObst++
        }
    }
}