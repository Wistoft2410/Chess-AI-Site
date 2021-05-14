import os
import json
from flask import Flask, render_template, send_from_directory, \
    request, redirect, url_for, make_response

app = Flask(__name__)


@app.route('/', methods=('GET',))
@app.route('/home', methods=('GET',))
def home():
    return render_template('index.html')


@app.route('/science', methods=('GET',))
def science():
    return render_template('videnskaben.html')


@app.route('/game_setup', methods=('GET', 'POST'))
def game_setup():
    if request.method == "POST":
        # These cookies should expire in 2 years, so users
        # who just want to play right away doesn't have to go 
        # through the form again to submit the same data!
        # Doing that means that the user can just directly go to 
        # the "url_for('game')" url without configuring anything!
        max_age = 60*60*24*365*2

        black_or_white = json.dumps(request.form.get('blackOrWhite') != "on")
        difficulty = json.dumps(request.form.get('difficulty', default=1, type=int))

        respone = make_response(redirect(url_for('game')))

        respone.set_cookie("black_or_white", value=black_or_white, max_age=max_age, path=url_for('game'))
        respone.set_cookie("difficulty", value=difficulty, max_age=max_age, path=url_for('game'))

        # We have to set the cookies for the game_setup page aswell since we need it their too!
        respone.set_cookie("black_or_white", value=black_or_white, max_age=max_age, path=url_for('game_setup'))
        respone.set_cookie("difficulty", value=difficulty, max_age=max_age, path=url_for('game_setup'))

        return respone
    return render_template('game_setup.html')


@app.route('/game', methods=('GET',))
def game():
    return render_template('game.html')


# This function makes sure to return a mandatory favicon for the website
@app.route('/favicon.ico', methods=('GET',))
def favicon():
    return send_from_directory(os.path.join(app.root_path, './static/images'), 'favicon.ico', mimetype='image/x-icon')
