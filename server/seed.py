#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime
from dateutil.relativedelta import relativedelta

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

        bluebell = Property(address = "Bluebell", user_id = "1", purchase_date = datetime(2021, 1, 1))
        oakhurt = Property(address = "Oakhurst", user_id = "1", purchase_date = datetime(2020, 1, 1))

        db.session.add(bluebell)
        db.session.add(oakhurt)

        
        yoni = Tenant(first_name = "Yoni", last_name = "Reuven", email ="y@y", user_id = "1", active = False, phone_number = "111111111")
        debbie = Tenant(first_name = "Debbie", last_name = "Bala", email ="d@d", user_id = "1", active = False, phone_number = "222222222")
        jason = Tenant(first_name = "Jason", last_name = "Taba", email ="j@j", user_id = "1", active = True, phone_number = "333333333")
        chris = Tenant(first_name = "Chris", last_name = "johnson", email ="c@c", user_id = "1", active = False, phone_number = "4444444444")
        bob = Tenant(first_name = "Bob", last_name = "smith", email ="b@b", user_id = "1", active = False, phone_number = "5555555555")
        dani = Tenant(first_name = "Dani", last_name = "Azizi", email ="d@d", user_id = "1", active = False, phone_number = "666666666")
        gavriel = Tenant(first_name = "Gabriel", last_name = "Stark", email ="g@g", user_id = "1", active = True, phone_number = "777777777")

        db.session.add(yoni)
        db.session.add(debbie)
        db.session.add(jason)
        db.session.add(chris)
        db.session.add(bob)
        db.session.add(dani)
        db.session.add(gavriel)

        # lease1 = Lease(rent_amount = 500, property_id = "1", tenant_id = "1", start_date=datetime(2021, 1, 1), end_date=datetime(2021, 12, 31))
        # lease2 = Lease(rent_amount = 600, property_id = "1", tenant_id = "2", start_date=datetime(2022, 1, 1), end_date=datetime(2022, 12, 31))
        # lease3 = Lease(rent_amount = 700, property_id = "1", tenant_id = "3", start_date=datetime(2023, 1, 1), end_date=datetime(2023, 12, 31))
        # lease4 = Lease(rent_amount = 1500, property_id = "2", tenant_id = "4", start_date=datetime(2020, 1, 1), end_date=datetime(2020, 12, 31))
        # lease5 = Lease(rent_amount = 1600, property_id = "2", tenant_id = "5", start_date=datetime(2021, 1, 1), end_date=datetime(2021, 12, 31))
        # lease6 = Lease(rent_amount = 1700, property_id = "2", tenant_id = "6", start_date=datetime(2022, 1, 1), end_date=datetime(2022, 12, 31))
        # lease7 = Lease(rent_amount = 1700, property_id = "2", tenant_id = "7", start_date=datetime(2023, 1, 1), end_date=datetime(2023, 12, 31))
        # db.session.add(lease1)
        # db.session.add(lease2)
        # db.session.add(lease3)
        # db.session.add(lease4)
        # db.session.add(lease5)
        # db.session.add(lease6)
        # db.session.add(lease7)

        leases = [Lease(rent_amount = 500, property_id = "1", tenant_id = "1", start_date=datetime(2021, 1, 1), end_date=datetime(2021, 12, 31)), Lease(rent_amount = 600, property_id = "1", tenant_id = "2", start_date=datetime(2022, 1, 1), end_date=datetime(2022, 12, 31)), Lease(rent_amount = 700, property_id = "1", tenant_id = "3", start_date=datetime(2023, 1, 1), end_date=datetime(2023, 12, 31)), Lease(rent_amount = 1500, property_id = "2", tenant_id = "4", start_date=datetime(2020, 1, 1), end_date=datetime(2020, 12, 31)), Lease(rent_amount = 1600, property_id = "2", tenant_id = "5", start_date=datetime(2021, 1, 1), end_date=datetime(2021, 12, 31)),Lease(rent_amount = 1700, property_id = "2", tenant_id = "6", start_date=datetime(2022, 1, 1), end_date=datetime(2022, 12, 31)),Lease(rent_amount = 1700, property_id = "2", tenant_id = "7", start_date=datetime(2023, 1, 1), end_date=datetime(2023, 12, 31))]

        for lease in leases:
            db.session.add(lease)

        lease_id = 0
        for lease in leases:
            #  start_date = lease.start_date
            # print(lease)
            year = lease.start_date.year
            month = lease.start_date.month
            lease_id += 1
            for _ in range(12):
                bill = Bill(date=datetime(year, month, 1), lease_id = lease_id)
                db.session.add(bill)
                month += 1

        bill_id = 0
        for lease in leases:
            year = lease.start_date.year
            month = lease.start_date.month
            for _ in range(12):
                bill_id += 1
                charge = Charge(type_of_charge="rent", amount = lease.rent_amount, bill_id = bill_id)
                payment = Payment(amount = lease.rent_amount, date_paid=datetime(year,month, 5), type_of_payment = 'check', paid_for = "rent", bill_id = bill_id)
                db.session.add(payment)
                db.session.add(charge)
                month += 1

        db.session.commit()
        # Seed code goes here!
