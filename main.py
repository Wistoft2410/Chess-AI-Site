import os
from flask import Flask, render_template, send_from_directory, request, redirect, url_for

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
        black_or_white = request.form.get('blackOrWhite') != "on"
        difficulty = request.form.get('difficulty')

        print(black_or_white)
        print(difficulty)

        return redirect(url_for('game'))
    return render_template('game_setup.html')


@app.route('/game', methods=('GET',))
def game():
    return render_template('game.html')


# This function makes sure to return a mandatory favicon for the website
@app.route('/favicon.ico', methods=('GET',))
def favicon():
    return send_from_directory(os.path.join(app.root_path, './static/images'), 'favicon.ico', mimetype='image/x-icon')
