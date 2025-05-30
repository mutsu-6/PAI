from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import List, Optional
from ..models import Contact, Event, Gift, Conversation, Base
from ..schemas import (
    ContactCreate, ContactUpdate,
    EventCreate, EventUpdate,
    GiftCreate, GiftUpdate, GiftSuggestion,
    ConversationCreate, ConversationUpdate
)

def create_contact(db: Session, contact: ContactCreate):
    db_contact = Contact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_contact(db: Session, contact_id: int):
    return db.query(Contact).filter(Contact.id == contact_id).first()

def get_contacts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Contact).offset(skip).limit(limit).all()

def update_contact(db: Session, contact_id: int, contact: ContactUpdate):
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if db_contact:
        update_data = contact.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_contact, key, value)
        db_contact.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_contact)
    return db_contact

def delete_contact(db: Session, contact_id: int):
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if db_contact:
        db.delete(db_contact)
        db.commit()
        return True
    return False

def create_event(db: Session, event: EventCreate):
    db_event = Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_event(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()

def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Event).offset(skip).limit(limit).all()

def get_upcoming_events(db: Session, days: int = 7):
    today = date.today()
    end_date = today + timedelta(days=days)
    return db.query(Event).filter(
        Event.date >= today,
        Event.date <= end_date
    ).all()

def update_event(db: Session, event_id: int, event: EventUpdate):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event:
        update_data = event.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False

def create_gift(db: Session, gift: GiftCreate):
    db_gift = Gift(**gift.model_dump())
    db.add(db_gift)
    db.commit()
    db.refresh(db_gift)
    return db_gift

def get_gift(db: Session, gift_id: int):
    return db.query(Gift).filter(Gift.id == gift_id).first()

def get_gifts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Gift).filter(Gift.gift_type == "received").offset(skip).limit(limit).all()

def get_gifts_by_contact(db: Session, contact_id: int):
    return db.query(Gift).filter(Gift.contact_id == contact_id).all()

def update_gift(db: Session, gift_id: int, gift: GiftUpdate):
    db_gift = db.query(Gift).filter(Gift.id == gift_id).first()
    if db_gift:
        update_data = gift.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_gift, key, value)
        db.commit()
        db.refresh(db_gift)
    return db_gift

def delete_gift(db: Session, gift_id: int):
    db_gift = db.query(Gift).filter(Gift.id == gift_id).first()
    if db_gift:
        db.delete(db_gift)
        db.commit()
        return True
    return False

def create_conversation(db: Session, conversation: ConversationCreate):
    db_conversation = Conversation(**conversation.model_dump())
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

def get_conversation(db: Session, conversation_id: int):
    return db.query(Conversation).filter(Conversation.id == conversation_id).first()

def get_conversations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Conversation).offset(skip).limit(limit).all()

def get_conversations_by_contact(db: Session, contact_id: int):
    return db.query(Conversation).filter(Conversation.contact_id == contact_id).all()

def update_conversation(db: Session, conversation_id: int, conversation: ConversationUpdate):
    db_conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if db_conversation:
        update_data = conversation.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_conversation, key, value)
        db.commit()
        db.refresh(db_conversation)
    return db_conversation

def delete_conversation(db: Session, conversation_id: int):
    db_conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if db_conversation:
        db.delete(db_conversation)
        db.commit()
        return True
    return False

def suggest_gifts(db: Session, contact_id: int, occasion: str = None):
    contact = get_contact(db, contact_id)
    if not contact:
        return []
    
    previous_gifts = get_gifts_by_contact(db, contact_id)
    
    conversations = get_conversations_by_contact(db, contact_id)
    
    suggestions = []
    
    if contact.hobbies:
        hobbies = contact.hobbies.lower().split(',')
        
        if any(h.strip() in ["読書", "本", "読む", "book", "reading"] for h in hobbies):
            suggestions.append(GiftSuggestion(
                item_name="図書カード",
                description="読書好きな方へのギフトとして最適です",
                estimated_value=3000,
                reason="趣味に合わせたギフト"
            ))
            
        if any(h.strip() in ["お酒", "酒", "飲む", "drink", "alcohol"] for h in hobbies):
            suggestions.append(GiftSuggestion(
                item_name="高級焼酎",
                description="お酒好きな方へのギフトとして最適です",
                estimated_value=5000,
                reason="趣味に合わせたギフト"
            ))
            
        if any(h.strip() in ["コーヒー", "珈琲", "coffee"] for h in hobbies):
            suggestions.append(GiftSuggestion(
                item_name="スペシャルティコーヒー詰め合わせ",
                description="コーヒー好きな方へのギフトとして最適です",
                estimated_value=4000,
                reason="趣味に合わせたギフト"
            ))
    
    if len(suggestions) < 3:
        generic_suggestions = [
            GiftSuggestion(
                item_name="高級ハンドタオルセット",
                description="どなたにも喜ばれる実用的なギフトです",
                estimated_value=3000,
                reason="汎用的なギフト"
            ),
            GiftSuggestion(
                item_name="お菓子の詰め合わせ",
                description="季節のお菓子の詰め合わせ",
                estimated_value=2500,
                reason="汎用的なギフト"
            ),
            GiftSuggestion(
                item_name="カタログギフト",
                description="相手に選んでもらえるギフト",
                estimated_value=5000,
                reason="相手の好みが不明な場合"
            )
        ]
        
        for suggestion in generic_suggestions:
            if len(suggestions) < 3:
                suggestions.append(suggestion)
    
    return suggestions
