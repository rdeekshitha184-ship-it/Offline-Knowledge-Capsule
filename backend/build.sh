#!/usr/bin/env bash
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata capsules/fixtures/sample_data.json