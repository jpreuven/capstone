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
from sqlalchemy.orm import joinedload
from sqlalchemy import desc

# Local imports
from config import app, db, api
# Add your model imports


# Views go here!
# @app.before_request
# def check_if_logged_in ():
#     open_access = ["login", "signup", "logout"]
#     if request.endpoint not in open_access and not session.get("user_id"):
#         print(request.endpoint)
#         print("Checking if")
#         raise Unauthorized
#         return {'error': 'Unauthorized'}, 401

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

        user_list = []
        ordered_bills = [bill.to_dict() for bill in new_user.get_ordered_bills()]
        ordered_leases = [lease.to_dict() for lease in new_user.get_ordered_leases()]
        user_dict = new_user.to_dict(rules=("-bills",))
        user_dict['ordered_bills'] = ordered_bills
        user_dict['ordered_leases'] = ordered_leases
        user_list.append(user_dict)

        return make_response(user_list, 200)


api.add_resource(Signup, "/signup", endpoint="signup")


class Login(Resource):
    def post(self):
        username = request.get_json()["username"]
        user = User.query.filter(User.username == username).first()

        password = request.get_json()["password"]
        if user.authenticate(password):
            session["user_id"] = user.id
        
            user_list = []
            ordered_bills = [bill.to_dict() for bill in user.get_ordered_bills()]
            ordered_leases = [lease.to_dict() for lease in user.get_ordered_leases()]
            user_dict = user.to_dict(rules=("-bills",))
            user_dict['ordered_bills'] = ordered_bills
            user_dict['ordered_leases'] = ordered_leases
            user_list.append(user_dict)
            return make_response(user_list, 200)

        return {"error": "Invalid username or password"}, 401

api.add_resource(Login, "/login", endpoint="login")

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get("user_id")).first()
        if user:
            user_list = []
            ordered_bills = [bill.to_dict() for bill in user.get_ordered_bills()]
            ordered_leases = [lease.to_dict() for lease in user.get_ordered_leases()]
            user_dict = user.to_dict(rules=("-bills",))
            user_dict['ordered_bills'] = ordered_bills
            user_dict['ordered_leases'] = ordered_leases
            user_list.append(user_dict)
            return make_response(user_list, 200)

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
        users = User.query.all()
        user_list = []
        for user in users:
            ordered_bills = [bill.to_dict() for bill in user.get_ordered_bills()]
            ordered_leases = [lease.to_dict() for lease in user.get_ordered_leases()]
            user_dict = user.to_dict(rules=("-bills",))
            user_dict['ordered_bills'] = ordered_bills
            user_dict['ordered_leases'] = ordered_leases
            user_list.append(user_dict)
        return make_response(user_list, 200)


api.add_resource(Users, "/users")

class UserByID(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        if user:
            user_list = []
            ordered_bills = [bill.to_dict() for bill in user.get_ordered_bills()]
            ordered_leases = [lease.to_dict() for lease in user.get_ordered_leases()]
            user_dict = user.to_dict(rules=("-bills",))
            user_dict['ordered_bills'] = ordered_bills
            user_dict['ordered_leases'] = ordered_leases
            user_list.append(user_dict)
            return make_response(user_list, 200)

        else:
            return {"message": "401: Not Authorized"}, 401
api.add_resource(UserByID, "/users/<int:id>")
        

class Properties(Resource):
    def get(self):    
        properties = Property.query.all()
        property_list = []
        for property in properties:
            ordered_leases = [lease.to_dict() for lease in property.get_ordered_leases()]
            property_dict = property.to_dict(rules=("-leases",))
            property_dict['ordered_leases'] = ordered_leases
            property_list.append(property_dict)
        return make_response(property_list, 200)
    def post(self):
        data = request.get_json()
        date = data["date"]
        year = int(date[0:4])
        month = int(date[5:7])
        day = int(date[8:10])
        purchase_date = datetime(year, month, day)
        try:
            new_property = Property(purchase_date=purchase_date, address = data["address"],user_id=session.get("user_id"))            
        except ValueError as e:
            abort(422, e.args[0])
        db.session.add(new_property)
        db.session.commit()
        return make_response(new_property.to_dict(), 201)


api.add_resource(Properties, "/properties")

class PropertiesByID(Resource):
    def get(self, id):
        property = Property.query.filter(Property.id == id).first()
        if not property:
            return make_response({"error": "Property not found"}, 404)
        if property:
            user_list = []
            property_list = []

            ordered_bills = [bill.to_dict() for bill in property.get_ordered_bills()]
            ordered_leases = [lease.to_dict() for lease in property.get_ordered_leases()]
            user_dict = property.to_dict(rules=("-leases", ))

            user_dict['ordered_bills'] = ordered_bills
            user_dict['ordered_leases'] = ordered_leases

            user_list.append(user_dict)
            
            # property_dict = property.to_dict(rules=("-leases",))
            # property_dict['ordered_leases'] = ordered_leases
            # property_list.append(property_dict)
            return make_response(user_list, 200)


api.add_resource(PropertiesByID, "/properties/<int:id>")

class Tenants(Resource):
    def get(self):
        tenants = [tenant.to_dict(rules=("-user.properties",)) for tenant in Tenant.query.all()]
        return make_response(tenants, 200)
    def post(self):
        data = request.get_json()
        active = False if data["active"] == "False" else True
        try:
            new_tenant = Tenant(first_name=data["firstName"], last_name = data["lastName"], email=data["email"], phone_number=data["phoneNumber"], active=active, user_id=session.get("user_id"))            
        except ValueError as e:
            abort(422, e.args[0])
        db.session.add(new_tenant)
        db.session.commit()
        return make_response(new_tenant.to_dict(), 201)



api.add_resource(Tenants, "/tenants")

class TenantByID(Resource):
    def get(self, id):
        tenant = Tenant.query.filter(Tenant.id == id).first()
        if not tenant:
            return make_response({"error": "Tenant not found"}, 404)
        return make_response(tenant.to_dict(), 200)
    
    def patch(self,id):
        data = request.get_json()
        tenant = Tenant.query.get(id)
        if not tenant:
            abort(404, "Cannot find tenant id") 
        for key in data:
            setattr(tenant, key, data[key])
        db.session.add(tenant)
        db.session.commit()
        return make_response(tenant.to_dict(), 202)


api.add_resource(TenantByID, "/tenants/<int:id>")

class Leases(Resource):
    def get(self):
        leases = [lease.to_dict() for lease in Lease.query.all()]
        return make_response(leases, 200)
    def post(self):
        data = request.get_json()
        start_date = data["startDate"]
        start_year = int(start_date[0:4])
        start_month = int(start_date[5:7])
        start_day = int(start_date[8:10])
        start_final_date = datetime(start_year, start_month, start_day)
        end_date = data["endDate"]
        end_year = int(end_date[0:4])
        end_month = int(end_date[5:7])
        end_day = int(end_date[8:10])
        end_final_date = datetime(end_year, end_month, end_day)

        try:
            new_lease = Lease(rent_amount = data["rent"], start_date=start_final_date, end_date=end_final_date, property_id=data["propertyID"], tenant_id=data["tenantID"])
        except ValueError as e:
            abort(422, e.args[0])
        db.session.add(new_lease)
        db.session.commit()

        return make_response(new_lease.to_dict(), 201)

api.add_resource(Leases, "/leases")

class Bills(Resource):
    def get(self):
        bills = [bill.to_dict() for bill in Bill.query.order_by(desc(Bill.date)).all()]

        return make_response(bills, 200)
    def post(self):
        data = request.get_json()
        date = data["date"]
        year = int(date[0:4])
        month = int(date[5:7])
        day = int(date[8:10])
        bill_date = datetime(year, month, day)

        try:
            new_bill = Bill(date=bill_date, lease_id = data["lease_id"])
        except ValueError as e:
            abort(422, e.args[0])
        db.session.add(new_bill)
        db.session.commit()

        return make_response(new_bill.to_dict(), 201)

api.add_resource(Bills, "/bills")

class BillByID(Resource):
    def delete(self, id):
        bill = Bill.query.filter(Bill.id == id).first()
        if not bill:
            abort(404, "Resource not found")
        db.session.delete(bill)
        db.session.commit()
        return make_response("", 204)


api.add_resource(BillByID, "/bills/<int:id>")


class Charges (Resource):
    def post(self):
        data = request.get_json()
        try:
            new_charge = Charge(**data)
        except ValueError as e:
            abort(422, e.args[0])
        db.session.add(new_charge)
        db.session.commit()

        return make_response(new_charge.to_dict(), 201)
        
       
api.add_resource(Charges, "/charges")

class ChargeByID(Resource):
    def get(self, id):
        charge = Charge.query.filter(Charge.id == id).first()
        if charge:
            return make_response(charge.to_dict(), 200)
        else:
            {"message": "401: Not Authorized"}, 401


api.add_resource(ChargeByID, "/charges/<int:id>")

class Payments (Resource):
    def post(self):
        data = request.get_json()
        date = data["date"]
        year = int(date[0:4])
        month = int(date[5:7])
        day = int(date[8:10])
        bill_date = datetime(year, month, day)
        try:
            new_payment = Payment(date_paid = bill_date, amount = data["amount"], paid_for = data["paidFor"], bill_id = data["billID"], type_of_payment=data["typeOfPayment"])
        except ValueError as e:
            abort(422, e.args[0])
        db.session.add(new_payment)
        db.session.commit()

        return make_response(new_payment.to_dict(), 201)
api.add_resource(Payments, "/payments")

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

if __name__ == '__main__':
    app.run(port=5555, debug=True)

