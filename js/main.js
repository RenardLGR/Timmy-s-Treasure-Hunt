const hi='HELLO'

const TIMEOUT = 1500

//Declare global variables to track game board size
const LINE_PIXEL_COUNT = 5
const TOTAL_PIXEL_COUNT = LINE_PIXEL_COUNT**2



//Shorten reference to game board
const gameContainer = document.getElementById('game-container')



const gameBoardPixels = document.getElementsByClassName("game-board-pixel")
//Array-like collection of all pixels with indexes like so :
// 0 1 2 3 4
// 5 6 7 8 9
// ...
// 20 21 22 23 24


if(!localStorage.getItem('timmyHighestStreak')) {
    localStorage.setItem('timmyHighestStreak', 0);
}
if(!localStorage.getItem('timmyCurrentStreak')) {
    localStorage.setItem('timmyCurrentStreak', 0);
}


let currentStreak = Number(localStorage.getItem('timmyCurrentStreak'))
let highestStreak = Number(localStorage.getItem('timmyHighestStreak'))

startGame()



//START THE GAME
function startGame() {
    initializeEnv()
    allBlack()
    removeUnclickableCache()

    document.getElementById('highestStreak').innerHTML = highestStreak
    document.getElementById('currentStreak').innerHTML = currentStreak
}

//REPLAY GAME
function replayGame() {
    //It is just a F5
    location.reload()
}

//GENERATING ENVIRONMENT FUNCTIONS
//=======================================================================

//Generate what we see
function initializeEnv() {
    do {
        createGameBoardPixels()
        
        generate2T()
        generateObstacles()
    } while (!hasMazeSolution());
}

//Generate the game board
function createGameBoardPixels() {
    gameContainer.innerHTML = ''
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
    let maxObst = 10
    let numObst = 0

    while(numObst < maxObst) {
        let rand = Math.floor(Math.random()*LINE_PIXEL_COUNT*LINE_PIXEL_COUNT)

        if( !(gameBoardPixels[rand].classList.contains('tim') ||gameBoardPixels[rand].classList.contains('target')) ){
            gameBoardPixels[rand].classList.add('obstacle')
            numObst++
        }
    }
}


function allBlack(){
        setTimeout( () => {
            for (let index = 0; index < gameBoardPixels.length; index++) {
                gameBoardPixels[index].classList.add('blacked-out')
                
            }
    
            for(let i=0 ; i<gameBoardPixels.length ; i++){
                //tim & target should be visible
                if(gameBoardPixels[i].classList.contains('tim')) {
                    gameBoardPixels[i].classList.remove('blacked-out')
                }
                if(gameBoardPixels[i].classList.contains('target')) {
                    gameBoardPixels[i].classList.remove('blacked-out')
                }
            }

        }, TIMEOUT)
}

function removeUnclickableCache() {
    setTimeout(() => {
        document.getElementById('cache').remove()
    }, TIMEOUT)
}


//BRAINY PART
//===========================================================================

function hasMazeSolution(){
    //check if the maze with this tim and target and these obstacles has indeed a solution


    //STEP 1 check timmy's pos
    //STEP 2 all pixels (not obstacles) around timmy will trigger a valid pos, all pixels (not obstacles) around valid pos will trigger a valid pos, and so on...
    //STEP 3 check if target pos is a valid pos

    let timmy
    //setting up timmy's coord
    for(let i=0 ; i<gameBoardPixels.length ; i++) {
        if(gameBoardPixels[i].classList.contains('tim')) {
            gameBoardPixels[i].classList.add('valid')
            gameBoardPixels[i].classList.add('clicked')
            timmy=i
        }
    }



    //checks all valid positions
    let done=false
    while(!done) {

        done=true

        for (let i=0 ; i<gameBoardPixels.length ; i++) {
            //A valid pixel will set each of his neighbors (not obstacles) to a valid state
            //This algorithm is repeated while done is false wich is set to true if no action have been done (all potential valid pos are validated)

            if(gameBoardPixels[i].classList.contains('valid')) {

                //setting up values to make sure they are accessible in the array
                //setting to timmy if coord unaccessible bcs I gotta to set it to something right?
                //it worked like that so I didnt change, but I found later that gameBoardPixels[up]?.classList  works just fine
                let up
                i-LINE_PIXEL_COUNT>=0 ? up= i-LINE_PIXEL_COUNT : up=timmy

                let right
                i+1<=LINE_PIXEL_COUNT**2 ? right=i+1 : right=timmy


                let down
                i + LINE_PIXEL_COUNT<=LINE_PIXEL_COUNT**2  ? down=i + LINE_PIXEL_COUNT : down=timmy

                let left
                i-1>=0 ?  left=i-1 : left=timmy
        
        
                if(up>=0 && !gameBoardPixels[up].classList.contains('obstacle') && !gameBoardPixels[up].classList.contains('valid')) {
                    //check if coord is valid and if it is not an obstacle
                    gameBoardPixels[up].classList.add('valid')
                    done=false
                }
                
                if(right%LINE_PIXEL_COUNT!==0 && !gameBoardPixels[right].classList.contains('obstacle') && !gameBoardPixels[right].classList.contains('valid')) {
                    
                    gameBoardPixels[right].classList.add('valid')
                    done=false
                }
        
                if(down<=LINE_PIXEL_COUNT**2-1 && !gameBoardPixels[down].classList.contains('obstacle') && !gameBoardPixels[down].classList.contains('valid')) {
                
                    gameBoardPixels[down].classList.add('valid')
                    done=false
                }
        
                if(left%LINE_PIXEL_COUNT!==LINE_PIXEL_COUNT-1 && !gameBoardPixels[left].classList.contains('obstacle') && !gameBoardPixels[left].classList.contains('valid')) {
                
                    gameBoardPixels[left].classList.add('valid')
                    done=false
                }
            }
        }
    }


    //check if target pos is a valid pos
    let result=false
    for(let i=0 ; i<gameBoardPixels.length ; i++) {
        if(gameBoardPixels[i].classList.contains('target') && gameBoardPixels[i].classList.contains('valid')) {
            result=true
        }
    }
    return result 
    
}


//=============================================================================
//INTERACTION FUNCTIONS
// let button = document.getElementById('check-answer').addEventListener('click', checkAnswer)

for(let pixel of gameBoardPixels) {
    pixel.addEventListener('click', onClick)
}

function checkAnswer() {
    for(let px of gameBoardPixels) {
        if(px.classList.contains('target')) {
            if (px.classList.contains('clicked')) {
                //console.log('Congrats !');
                currentStreak++
                localStorage.setItem('timmyCurrentStreak', currentStreak);

                if (currentStreak>highestStreak) {
                    highestStreak=currentStreak

                    localStorage.setItem('timmyHighestStreak', currentStreak);
                    localStorage.setItem('timmyCurrentStreak', currentStreak);
                    
                }
                alert('You won !')
                replayGame()
            }else {
                //console.log('Not won yet!');
            }
        }
    }
}

function onClick(event) {
    //function click on pixel, checks validty if so turns green, if obstacle the game is lost
    let pixel = event.currentTarget //div element
    let i = +pixel.id.slice(5) //get coord of pixel
    
    if(pixel.classList.contains('valid')) {
        let up
        i-LINE_PIXEL_COUNT>=0 ? up= i-LINE_PIXEL_COUNT : up=null

        let right
        i+1<=LINE_PIXEL_COUNT**2 ? right=i+1 : right=null


        let down
        i + LINE_PIXEL_COUNT<=LINE_PIXEL_COUNT**2  ? down=i + LINE_PIXEL_COUNT : down=null

        let left
        i-1>=0 ?  left=i-1 : left=null
        //console.log(i, up, right, down, left);

        //check if any neighbour has a clicked pixel (timmy is clicked by default); if so set pixel to clicked
        if(gameBoardPixels[up]?.classList.contains('clicked') || gameBoardPixels[right]?.classList.contains('clicked') || gameBoardPixels[down]?.classList.contains('clicked') || gameBoardPixels[left]?.classList.contains('clicked')) {
            pixel.classList.add('clicked')
            pixel.classList.remove('blacked-out')
        }
        checkAnswer()

    }else {
        if(pixel.classList.contains('obstacle')){

            currentStreak=0
            localStorage.setItem('timmyCurrentStreak', currentStreak);

            alert('You lost !')
            replayGame()
        }
        //else is the case where there is no obstacle but the case is not reachable
    }
    
}
