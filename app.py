from flask import Flask, session, flash, jsonify, render_template
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'pwab'
boggle_game = Boggle()
found_words = set()

@app.route('/')
def show_board():
    """Creates and shows the game board
    also clears set that ensures duplicate words can't be used"""

    found_words.clear()
    session['board'] = boggle_game.make_board()
    return render_template('index.html', board=session['board'])

@app.route('/check-word/<guess>')
def check_word_validity(guess):
    """uses Boggle class's check_valid_word and returns result"""

    res = boggle_game.check_valid_word(session['board'], guess)
    # prevents duplicate words with set found_words
    if guess in found_words:
        res = "already-guessed"
    else:
        found_words.add(guess)

    return {'result': res}

@app.route('/end-game/<score>')
def end_game(score):
    """instatiates times-played and highscore in session if first time playing
    updates them if otherwise (and if highscore beats previous)"""

    if not session.get('times-played'):
        session['times-played'] = 1
        session['highscore'] = score
    else:
        session['times-played'] += 1
        if int(score) > int(session['highscore']):
            session['highscore'] = score

    return session['highscore']

@app.route('/get-highscore')
def return_saved_highscore():
    return session['highscore']