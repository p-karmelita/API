from sqlalchemy import Column, String, Boolean, Integer, Float, Text, create_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.types import JSON

class Base(DeclarativeBase):
    pass

class Profile(Base):
    __tablename__ = "profiles"

    full_name = Column(String, primary_key=True)
    email_address = Column(String)
    wallet_address = Column(String)
    notifications = Column(MutableList.as_mutable(JSON), default=['Yes', 'No'])
    language = Column(MutableList.as_mutable(JSON), default=['English', 'French', 'German'])
    disconnect = Column(MutableList.as_mutable(JSON), default=['Yes'])

class Dashboard(Base):
    __tablename__ = "send_payments"

    recipient_address = Column(String, primary_key=True)
    amount = Column(Integer)
    note = Column(String)
    status = Column(MutableList.as_mutable(JSON), default=['Send', 'Cancel'])
    transactions = Column(MutableList.as_mutable(JSON), default=['all', 'completed', 'pending', 'failed'])
    type = Column(MutableList.as_mutable(JSON), default=['rent', 'purchase', 'deposit', 'insurance', 'transfer'])

class Wallet(Base):
    __tablename__ = "wallets"

    wallet_id = Column(String, primary_key=True)
    user_email = Column(String, nullable=False, unique=True)
    wallet_address = Column(String, nullable=False)
    balance = Column(Float, default=0.0)
    blockchains = Column(MutableList.as_mutable(JSON), default=['ARC-TESTNET'])
    transaction_types = Column(MutableList.as_mutable(JSON), default=['rent', 'purchase', 'deposit', 'insurance', 'transfer'])
    status = Column(String, default='active')  # active, inactive, suspended

# --- Create SQLite database and tables ---
engine = create_engine("sqlite:///paymind.db")  # creates db.db file in current folder
Base.metadata.create_all(engine)
