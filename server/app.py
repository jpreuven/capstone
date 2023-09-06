#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, abort
from flask_restful import Resource
from models import *
from werkzeug.exceptions import Unauthorized
import re
from datetime import datetime
from dateutil import relativedelta

# Local imports
from config import app, db, api
# Add your model imports


# Views go here!
@app.before_request
def check_if_logged_in ():
    open_access = ["login", "signup", "logout"]
    if request.endpoint not in open_access and not session.get("user_id"):
        print(request.endpoint)
        print("Checking if")
        raise Unauthorized
        return {'error': 'Unauthorized'}, 401

class Signup(Resource):
    def post(self):
        username = request.get_json()["username"]
        first_name = request.get_json()["firstName"]
        last_name = request.get_json()["lastName"]
        email = request.get_json()["email"]
        new_user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )

        password = request.get_json()["password"]
        new_user.password_hash = password
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id

        db.session.commit()

        # return new_user.to_dict()
        return new_user.to_dict()


api.add_resource(Signup, "/signup", endpoint="signup")


class Login(Resource):
    def post(self):
        username = request.get_json()["username"]
        user = User.query.filter(User.username == username).first()

        password = request.get_json()["password"]
        if user.authenticate(password):
            session["user_id"] = user.id
            return user.to_dict()

        return {"error": "Invalid username or password"}, 401

api.add_resource(Login, "/login", endpoint="login")

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get("user_id")).first()
        if user:
            return user.to_dict()

        else:
            return {"message": "401: Not Authorized"}, 401


api.add_resource(CheckSession, "/check_session")

class Logout(Resource):
    def delete(self):
        session["user_id"] = None
        return {"message": "204: No Content"}, 204


api.add_resource(Logout, "/logout")

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)


api.add_resource(Users, "/users")

class Properties(Resource):
    def get(self):
        properties = [property.to_dict(rules=("-user.tenants",)) for property in Property.query.all()]
        return make_response(properties, 200)


api.add_resource(Properties, "/properties")

class Tenants(Resource):
    def get(self):
        tenants = [tenant.to_dict(rules=("-user.properties",)) for tenant in Tenant.query.all()]
        return make_response(tenants, 200)

api.add_resource(Tenants, "/tenants")

class Leases(Resource):
    def get(self):
        leases = [lease.to_dict() for lease in Lease.query.all()]
        return make_response(leases, 200)

api.add_resource(Leases, "/leases")

class Bills(Resource):
    def get(self):
        bills = [bill.to_dict() for bill in Bill.query.all()]
        return make_response(bills, 200)

api.add_resource(Bills, "/bills")

class TEST(Resource):
    def get(self):
        pass
        # lease = [lease.to_dict() for lease in Lease.query.all()][0]
        # lease_date = lease["start_date"]
        # lease_property = lease["property"]['purchase_date']

        # now = datetime(2020, 1, 1)
        # later = datetime(2023,1,1)

        # lease_date_object = datetime.strptime(lease_date, '%Y-%m-%d %H:%M:%S' )
        # lease_property_object = datetime.strptime(lease_property, '%Y-%m-%d %H:%M:%S' )
        # delta = relativedelta.relativedelta(lease_property_object, lease_date_object)
        # res_months = delta.months + (delta.years * 12)

        # print("total months", res_months )



        # return make_response(lease, 200)

# Can't seem to get going
        # property = [property for property in Property.query.all()][0]
        # print(property.getting_total())
        # return make_response(property.to_dict(), 200)
        

api.add_resource(TEST, "/TEST")


# @app.route('/')
# def index():
#     return '<h1>Phase 4 Project Server</h1>'



if __name__ == '__main__':
    app.run(port=5555, debug=True)

