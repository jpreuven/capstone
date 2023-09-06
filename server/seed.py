#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import *

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        User.query.delete()
        Property.query.delete()
        Tenant.query.delete()
        Lease.query.delete()
        Bill.query.delete()
        Charge.query.delete()
        Payment.query.delete()

        yoni = User(username = "jpr94", first_name = "Yoni", last_name = "Reuven", email = "y@y")
        yoni.password_hash = "password"
        debbie = User(username = "debbie123", first_name = "debbie", last_name = "Bala", email = "d@d")
        debbie.password_hash = "password"

        db.session.add(yoni)
        db.session.add(debbie)

        bluebell = Property(address = "Bluebell", user_id = "1", purchase_date = datetime(2020, 1, 1))
        db.session.add(bluebell)

        bob = Tenant(first_name = "Bob", last_name = "smith", email ="b@b", user_id = "1", active = True, phone_number = "5555555555")
        chris = Tenant(first_name = "Chris", last_name = "johnson", email ="c@c", user_id = "1", active = False, phone_number = "4444444444")

        db.session.add(bob)
        db.session.add(chris)

        lease1 = Lease(rent_amount = 1000, property_id = "1", tenant_id = "1", start_date=datetime(2023, 1, 1), end_date=datetime(2023, 12, 31))
        lease2 = Lease(rent_amount = 900, property_id = "1", tenant_id = "2", start_date=datetime(2022, 1, 1), end_date=datetime(2022, 12, 31))
        db.session.add(lease1)
        db.session.add(lease2)

        bill1 = Bill(date=datetime(2023, 2, 1), lease_id = "1")
        bill2 = Bill(date=datetime(2023, 3, 1), lease_id = "1")
        bill3 = Bill(date=datetime(2023, 4, 1), lease_id = "1")


        db.session.add(bill1)
        db.session.add(bill2)
        db.session.add(bill3)

        lease3 = Lease(rent_amount = 1050, property_id = "1", tenant_id = "2", start_date=datetime(2024, 1, 1), end_date=datetime(2024, 12, 31))
        db.session.add(lease3)

        bill4 = Bill(date=datetime(2024, 2, 1), lease_id = "3")
        db.session.add(bill4)

        payment1 = Payment(amount=1000, date_paid = datetime(2023,1,31), type_of_payment ='check', paid_for = "rent", bill_id = 1)
        db.session.add(payment1)

        charge1 = Charge(type_of_charge = "Rent", amount = 1000, bill_id = 1)
        db.session.add(charge1)


        db.session.commit()
        # Seed code goes here!
