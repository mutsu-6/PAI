from datetime import date, datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

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

class EventType(str, Enum):
    BIRTHDAY = "birthday"
    ANNIVERSARY = "anniversary"
    CHILDBIRTH = "childbirth"
    FUNERAL = "funeral"
    MEETING = "meeting"
    OTHER = "other"

class GiftType(str, Enum):
    RECEIVED = "received"
    GIVEN = "given"

class ContactBase(BaseModel):
    name: str
    furigana: Optional[str] = None
    birthday: Optional[date] = None
    gender: Optional[Gender] = None
    relationship_type: Optional[RelationshipType] = None
    hobbies: Optional[str] = None
    notes: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(ContactBase):
    name: Optional[str] = None

class ContactResponse(ContactBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EventBase(BaseModel):
    contact_id: int
    event_type: EventType
    title: str
    date: date
    description: Optional[str] = None
    is_recurring: bool = False

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    event_type: Optional[EventType] = None
    title: Optional[str] = None
    date: Optional[date] = None
    description: Optional[str] = None
    is_recurring: Optional[bool] = None

class EventResponse(EventBase):
    id: int
    is_notified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class GiftBase(BaseModel):
    contact_id: int
    gift_type: GiftType
    item_name: str
    occasion: Optional[str] = None
    date: date
    value: Optional[int] = None
    notes: Optional[str] = None

class GiftCreate(GiftBase):
    pass

class GiftUpdate(BaseModel):
    gift_type: Optional[GiftType] = None
    item_name: Optional[str] = None
    occasion: Optional[str] = None
    date: Optional[date] = None
    value: Optional[int] = None
    notes: Optional[str] = None

class GiftResponse(GiftBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    contact_id: int
    date: date
    topics: Optional[str] = None
    notes: Optional[str] = None
    follow_up_needed: bool = False

class ConversationCreate(ConversationBase):
    pass

class ConversationUpdate(BaseModel):
    date: Optional[date] = None
    topics: Optional[str] = None
    notes: Optional[str] = None
    follow_up_needed: Optional[bool] = None

class ConversationResponse(ConversationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GiftSuggestion(BaseModel):
    item_name: str
    description: Optional[str] = None
    estimated_value: Optional[int] = None
    reason: Optional[str] = None
