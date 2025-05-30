from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, timedelta

from . import crud
from .models import Base
from .database import engine, get_db
from .schemas import (
    ContactResponse, ContactCreate, ContactUpdate,
    EventResponse, EventCreate, EventUpdate,
    GiftResponse, GiftCreate, GiftUpdate, GiftSuggestion,
    ConversationResponse, ConversationCreate, ConversationUpdate
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="マメナカタ API",
    description="接待補佐パーソナルアシスタントのAPI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/contacts/", response_model=ContactResponse)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    return crud.create_contact(db=db, contact=contact)

@app.get("/contacts/", response_model=List[ContactResponse])
def read_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    contacts = crud.get_contacts(db, skip=skip, limit=limit)
    return contacts

@app.get("/contacts/{contact_id}", response_model=ContactResponse)
def read_contact(contact_id: int, db: Session = Depends(get_db)):
    db_contact = crud.get_contact(db, contact_id=contact_id)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    return db_contact

@app.put("/contacts/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: int, contact: ContactUpdate, db: Session = Depends(get_db)):
    db_contact = crud.update_contact(db, contact_id=contact_id, contact=contact)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    return db_contact

@app.delete("/contacts/{contact_id}", response_model=bool)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    result = crud.delete_contact(db, contact_id=contact_id)
    if not result:
        raise HTTPException(status_code=404, detail="Contact not found")
    return result

@app.post("/events/", response_model=schemas.EventResponse)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db=db, event=event)

@app.get("/events/", response_model=List[schemas.EventResponse])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = crud.get_events(db, skip=skip, limit=limit)
    return events

@app.get("/events/upcoming/", response_model=List[schemas.EventResponse])
def read_upcoming_events(days: int = Query(7, ge=1, le=365), db: Session = Depends(get_db)):
    events = crud.get_upcoming_events(db, days=days)
    return events

@app.get("/events/{event_id}", response_model=schemas.EventResponse)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@app.put("/events/{event_id}", response_model=schemas.EventResponse)
def update_event(event_id: int, event: schemas.EventUpdate, db: Session = Depends(get_db)):
    db_event = crud.update_event(db, event_id=event_id, event=event)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@app.delete("/events/{event_id}", response_model=bool)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    result = crud.delete_event(db, event_id=event_id)
    if not result:
        raise HTTPException(status_code=404, detail="Event not found")
    return result

@app.post("/gifts/", response_model=schemas.GiftResponse)
def create_gift(gift: GiftCreate, db: Session = Depends(get_db)):
    return crud.create_gift(db=db, gift=gift)

@app.get("/gifts/", response_model=List[schemas.GiftResponse])
def read_gifts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    gifts = crud.get_gifts(db, skip=skip, limit=limit)
    return gifts

@app.get("/gifts/contact/{contact_id}", response_model=List[schemas.GiftResponse])
def read_gifts_by_contact(contact_id: int, db: Session = Depends(get_db)):
    gifts = crud.get_gifts_by_contact(db, contact_id=contact_id)
    return gifts

@app.get("/gifts/{gift_id}", response_model=schemas.GiftResponse)
def read_gift(gift_id: int, db: Session = Depends(get_db)):
    db_gift = crud.get_gift(db, gift_id=gift_id)
    if db_gift is None:
        raise HTTPException(status_code=404, detail="Gift not found")
    return db_gift

@app.put("/gifts/{gift_id}", response_model=schemas.GiftResponse)
def update_gift(gift_id: int, gift: GiftUpdate, db: Session = Depends(get_db)):
    db_gift = crud.update_gift(db, gift_id=gift_id, gift=gift)
    if db_gift is None:
        raise HTTPException(status_code=404, detail="Gift not found")
    return db_gift

@app.delete("/gifts/{gift_id}", response_model=bool)
def delete_gift(gift_id: int, db: Session = Depends(get_db)):
    result = crud.delete_gift(db, gift_id=gift_id)
    if not result:
        raise HTTPException(status_code=404, detail="Gift not found")
    return result

@app.get("/gifts/suggestions/{contact_id}", response_model=List[schemas.GiftSuggestion])
def get_gift_suggestions(
    contact_id: int, 
    occasion: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    contact = crud.get_contact(db, contact_id=contact_id)
    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    suggestions = crud.suggest_gifts(db, contact_id=contact_id, occasion=occasion)
    return suggestions

@app.post("/conversations/", response_model=schemas.ConversationResponse)
def create_conversation(conversation: schemas.ConversationCreate, db: Session = Depends(get_db)):
    return crud.create_conversation(db=db, conversation=conversation)

@app.get("/conversations/", response_model=List[schemas.ConversationResponse])
def read_conversations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    conversations = crud.get_conversations(db, skip=skip, limit=limit)
    return conversations

@app.get("/conversations/contact/{contact_id}", response_model=List[schemas.ConversationResponse])
def read_conversations_by_contact(contact_id: int, db: Session = Depends(get_db)):
    conversations = crud.get_conversations_by_contact(db, contact_id=contact_id)
    return conversations

@app.get("/conversations/{conversation_id}", response_model=schemas.ConversationResponse)
def read_conversation(conversation_id: int, db: Session = Depends(get_db)):
    db_conversation = crud.get_conversation(db, conversation_id=conversation_id)
    if db_conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return db_conversation

@app.put("/conversations/{conversation_id}", response_model=schemas.ConversationResponse)
def update_conversation(conversation_id: int, conversation: schemas.ConversationUpdate, db: Session = Depends(get_db)):
    db_conversation = crud.update_conversation(db, conversation_id=conversation_id, conversation=conversation)
    if db_conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return db_conversation

@app.delete("/conversations/{conversation_id}", response_model=bool)
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    result = crud.delete_conversation(db, conversation_id=conversation_id)
    if not result:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return result
