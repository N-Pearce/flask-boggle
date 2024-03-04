const $form = $('.guess-form');
const $guessBox = $form.children('#guess')[0];
const $msg = $('#user-message');
const $highscore = $('#highscore');
const $score = $("#score");
const $time = $("#timer");
let score = 0
seconds = 60

// retains highscore when reloading the page
retainHighscore()
// starts the countdown
setTimeout(endGame, 60000)

const timer = setInterval(function(){
    /** simple timer */
    seconds -= 1
    $time.html(seconds)
}, 1000)

async function endGame(){
    //stops at 1 otherwise
    seconds = 0
    $time.html(seconds)

    // Ends timer
    clearInterval(timer)

    // Blocks user input
    $form[0].reset()
    $guessBox.setAttribute('placeholder', "Game Ended")
    $guessBox.setAttribute('class', 'end')
    $guessBox.setAttribute('readonly', 'readonly')

    // updates highscore (if applicable)
    let highscore = await axios.get(`/end-game/${score}`)
    $highscore.html(highscore.data);
}

$form.on('click', 'button', async function(e){
    /** submits guess */
    e.preventDefault();
    guess = $form.children('#guess').val();
    await addGuess(guess)
})

async function addGuess(guess){
    /** Recieves result on guess, adding to score if new word found on board,
     * giving user specialized message if otherwise.
     * Clears input
     */

    const response = await axios.get(`/check-word/${guess}`)

    result = response.data['result']
    if (result == 'ok') {
        $msg.html('Word Found!')
        score += guess.length;
        $score.html(score)
    }
    else if (result == 'already-guessed')
        $msg.html("Word Already Guessed")
    else if (result == 'not-on-board')
        $msg.html('Word Not Found')
    else
        $msg.html('Not a Word')
    
    
    $form[0].reset()
}

async function retainHighscore(){
    /** updates html with highsore from session */
    let highscore = await axios.get('/get-highscore');
    $highscore.html(highscore.data)
}