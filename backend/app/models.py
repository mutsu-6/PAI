from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    UNKNOWN = "unknown"

class RelationshipType(str, Enum):
    BUSINESS = "business"
    PERSONAL = "personal"
    FAMILY = "family"
    OTHER = "other"

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    furigana = Column(String(100))
    birthday = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)
    relationship_type = Column(String(20), nullable=True)
    hobbies = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    events = relationship("Event", back_populates="contact")
    gifts = relationship("Gift", back_populates="contact")
    conversations = relationship("Conversation", back_populates="contact")

class EventType(str, Enum):
    BIRTHDAY = "birthday"
    ANNIVERSARY = "anniversary"
    CHILDBIRTH = "childbirth"
    FUNERAL = "funeral"
    MEETING = "meeting"
    OTHER = "other"

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    event_type = Column(String(20), nullable=False)
    title = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(Text, nullable=True)
    is_recurring = Column(Boolean, default=False)
    is_notified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    contact = relationship("Contact", back_populates="events")

class GiftType(str, Enum):
    RECEIVED = "received"
    GIVEN = "given"

class Gift(Base):
    __tablename__ = "gifts"
    
    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    gift_type = Column(String(20), nullable=False)
    item_name = Column(String(100), nullable=False)
    occasion = Column(String(100), nullable=True)
    date = Column(Date, nullable=False)
    value = Column(Integer, nullable=True)  # Approximate value in yen
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    contact = relationship("Contact", back_populates="gifts")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    date = Column(Date, nullable=False)
    topics = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    follow_up_needed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    contact = relationship("Contact", back_populates="conversations")
