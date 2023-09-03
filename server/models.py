from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ("-properties.user", "-_password_hash")
    # serialize_rules = ("properties",)
    # serialize_only = ("username", "first_name", "last_name", "email", "properties", "-properties.user")

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(), nullable=False)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    properties = db.relationship("Property", back_populates="user", cascade="delete") 

    def __repr__ (self):
        return f'User: {self.username} {self.first_name} {self.last_name}'
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError("password hashes may not be viewed")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        # return bcrypt.check_password_hash(password.encode("utf-8"),self._password_hash)
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

class Property(db.Model, SerializerMixin):
    __tablename__ = "properties"
    serialize_rules = ("-user.properties", "-user._password_hash",)
    # serialize_rules = ("user",)


    id = db.Column(db.Integer(), primary_key=True)
    address = db.Column(db.String())
    
    user = db.relationship("User", back_populates="properties")
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"))

    def __repr__(self):
        return f'Property: {self.address}'    

class Tenant(db.Model, SerializerMixin):
    __tablename__ = 'tenants'

    id = db.Column(db.Integer(), primary_key=True)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False)
    phone_number = db.Column(db.Integer(), nullable=False)
    active = db.Column(db.Boolean(), nullable=False)

    def __repr__ (self):
        return f'Tenant: {self.first_name} {self.last_name}'

class Lease(db.Model, SerializerMixin):
    __tablename__ = "leases"

    id = db.Column(db.Integer(), primary_key=True)
    rent_amount = db.Column(db.String())    

class Bill(db.Model, SerializerMixin):
    __tablename__ = "bills"

    id = db.Column(db.Integer(), primary_key=True)
    date = db.Column(db.DateTime())

    def __repr__(self):
        return f'Bill: {self.date}'
    
class Payment(db.Model, SerializerMixin):
    __tablename__ = "payments"

    id = db.Column(db.Integer(), primary_key=True)
    date_paid = db.Column(db.DateTime())
    type_of_payment = db.Column(db.String(),nullable=False)
    paid_for = db.Column(db.String(),nullable=False)


    def __repr__(self):
        return f'Payment: {self.type_of_payment} {self.paid_for}'
    
class Charge(db.Model, SerializerMixin):
    __tablename__ = "charges"

    id = db.Column(db.Integer(), primary_key=True)
    type_of_charge = db.Column(db.String(),nullable=False)
    amount = db.Column(db.Integer(),nullable=False)


    def __repr__(self):
        return f'Charge: {self.type_of_charge} {self.amount}'