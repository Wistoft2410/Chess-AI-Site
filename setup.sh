#!/usr/bin/env bash

python3 -m venv env
echo "export FLASK_ENV=development" >> ./env/bin/activate
echo "export FLASK_APP=main.py" >> ./env/bin/activate
source ./env/bin/activate
pip install -r requirements.txt
deactivate
