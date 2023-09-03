#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

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

        yoni = User(username = "jpr94", first_name = "Yoni", last_name = "Reuven", email = "y@y")
        yoni.password_hash = "password"
        debbie = User(username = "jpr94", first_name = "debbie", last_name = "Reuven", email = "y@y")
        debbie.password_hash = "password"

        db.session.add(yoni)
        db.session.add(debbie)

        bluebell = Property(address = "Bluebell", user_id = "1")
        db.session.add(bluebell)

        db.session.commit()
        # Seed code goes here!
