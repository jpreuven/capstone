from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import desc

from config import db, bcrypt

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ("-properties.user", "-_password_hash", "-tenants.user")

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(), nullable=False)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    properties = db.relationship("Property", back_populates="user", cascade="delete") 
    tenants = db.relationship("Tenant", back_populates="user", cascade="delete") 

    def get_ordered_bills(self):
        ordered_bills = Bill.query.join(Lease).join(Property).filter(Property.user_id == self.id).order_by(desc(Bill.date)).all()
        return ordered_bills


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
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

class Property(db.Model, SerializerMixin):
    __tablename__ = "properties"
    serialize_rules = ("-user.properties", "-leases.property",)


    id = db.Column(db.Integer(), primary_key=True)
    address = db.Column(db.String())
    purchase_date = db.Column(db.DateTime())
    
    user = db.relationship("User", back_populates="properties")
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"))

    leases = db.relationship("Lease", back_populates="property", cascade = "delete")
    tenants = association_proxy("leases", "tenant")

    def getting_date(self, date):
        return date - self.purchase_date
    
    # def getting_total(self):
        # return [lease.bills for lease in self.leases]


    # @property
    # def tenants_full (self):
    #     return [tenant for tenant in self.tenants] 

    def get_ordered_bills(self):
        ordered_bills = Bill.query.join(Lease).join(Property).filter(Property.id == self.id).order_by(desc(Bill.date)).all()
        return ordered_bills
    
    def get_ordered_leases(self):
        ordered_leases = Lease.query.join(Property).filter(Property.id == self.id).order_by(desc(Lease.end_date)).all()
        return ordered_leases


    def __repr__(self):
        return f'Property: {self.address}'    

class Tenant(db.Model, SerializerMixin):
    __tablename__ = 'tenants'
    # serialize_rules = ("-user.tenants", "-user._password_hash",)
    serialize_rules = ("-user.tenants", "-leases.tenant",)


    id = db.Column(db.Integer(), primary_key=True)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False)
    phone_number = db.Column(db.Integer(), nullable=False)
    active = db.Column(db.Boolean(), nullable=False)

    user = db.relationship("User", back_populates="tenants")
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"))

    leases = db.relationship("Lease", back_populates="tenant", cascade = "delete")
    # properties = association_proxy("leases", "property")


    def __repr__ (self):
        return f'Tenant: {self.first_name} {self.last_name}'

class Lease(db.Model, SerializerMixin):
    __tablename__ = "leases"
    serialize_rules = ("-property.leases", "-tenant.leases", "-tenant.user", "-property.user", "-bills.lease")



    id = db.Column(db.Integer(), primary_key=True)
    rent_amount = db.Column(db.String())    
    start_date = db.Column(db.DateTime())
    end_date = db.Column(db.DateTime())
    
    property = db.relationship("Property", back_populates = "leases")
    property_id = db.Column(db.Integer(), db.ForeignKey("properties.id"))
    tenant = db.relationship("Tenant", back_populates = "leases")
    tenant_id = db.Column(db.Integer(), db.ForeignKey("tenants.id"))
    bills = db.relationship("Bill", back_populates = "lease", cascade = "delete")


class Bill(db.Model, SerializerMixin):
    __tablename__ = "bills"
    serialize_rules = ("-lease.bills", "-payments.bill", "-charges.bill")

    id = db.Column(db.Integer(), primary_key=True)
    date = db.Column(db.DateTime())
    lease = db.relationship("Lease", back_populates = "bills")
    lease_id = db.Column(db.Integer(), db.ForeignKey("leases.id"))
    payments = db.relationship("Payment", back_populates = "bill", cascade = "delete")
    charges = db.relationship("Charge", back_populates = "bill", cascade = "delete")



    def __repr__(self):
        return f'Bill: {self.date}'
    
class Payment(db.Model, SerializerMixin):
    __tablename__ = "payments"
    serialize_rules = ("-bill.payments",)

    id = db.Column(db.Integer(), primary_key=True)
    amount = db.Column(db.Integer())
    date_paid = db.Column(db.DateTime())
    type_of_payment = db.Column(db.String(),nullable=False)
    paid_for = db.Column(db.String(),nullable=False)
    bill = db.relationship("Bill", back_populates = "payments")
    bill_id = db.Column(db.Integer(), db.ForeignKey("bills.id"))
    


    def __repr__(self):
        return f'Payment: {self.type_of_payment} {self.paid_for}'
    
class Charge(db.Model, SerializerMixin):
    __tablename__ = "charges"
    serialize_rules = ("-bill.charges",)

    id = db.Column(db.Integer(), primary_key=True)
    type_of_charge = db.Column(db.String(),nullable=False)
    amount = db.Column(db.Integer(),nullable=False)

    bill = db.relationship("Bill", back_populates = "charges")
    bill_id = db.Column(db.Integer(), db.ForeignKey("bills.id"))


    def __repr__(self):
        return f'Charge: {self.type_of_charge} {self.amount}'