#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, abort
from flask_restful import Resource
from models import *
from werkzeug.exceptions import Unauthorized
import re

# Local imports
from config import app, db, api
# Add your model imports


# Views go here!
class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)


api.add_resource(Users, "/users")

class Properties(Resource):
    def get(self):
        properties = [property.to_dict() for property in Property.query.all()]
        return make_response(properties, 200)


api.add_resource(Properties, "/properties")



@app.route('/')
def index():
    return '<h1>Phase 4 Project Server</h1>'



if __name__ == '__main__':
    app.run(port=5555, debug=True)

