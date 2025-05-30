import { 
  Contact, 
  Event, 
  Gift, 
  Conversation, 
  GiftSuggestion,
  ContactFormData,
  EventFormData,
  GiftFormData,
  ConversationFormData
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getContacts = async (): Promise<Contact[]> => {
  const response = await fetch(`${API_URL}/contacts/`);
  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }
  return response.json();
};

export const getContact = async (id: number): Promise<Contact> => {
  const response = await fetch(`${API_URL}/contacts/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch contact with id ${id}`);
  }
  return response.json();
};

export const createContact = async (data: ContactFormData): Promise<Contact> => {
  const response = await fetch(`${API_URL}/contacts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create contact');
  }
  return response.json();
};

export const updateContact = async (id: number, data: Partial<ContactFormData>): Promise<Contact> => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update contact with id ${id}`);
  }
  return response.json();
};

export const deleteContact = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete contact with id ${id}`);
  }
  return response.json();
};

export const getEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_URL}/events/`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
};

export const getUpcomingEvents = async (days: number = 7): Promise<Event[]> => {
  const response = await fetch(`${API_URL}/events/upcoming/?days=${days}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch upcoming events for next ${days} days`);
  }
  return response.json();
};

export const createEvent = async (data: EventFormData): Promise<Event> => {
  const response = await fetch(`${API_URL}/events/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create event');
  }
  return response.json();
};

export const getGiftsByContact = async (contactId: number): Promise<Gift[]> => {
  const response = await fetch(`${API_URL}/gifts/contact/${contactId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch gifts for contact with id ${contactId}`);
  }
  return response.json();
};

export const createGift = async (data: GiftFormData): Promise<Gift> => {
  const response = await fetch(`${API_URL}/gifts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create gift');
  }
  return response.json();
};

export const getGiftSuggestions = async (contactId: number, occasion?: string): Promise<GiftSuggestion[]> => {
  const url = occasion 
    ? `${API_URL}/gifts/suggestions/${contactId}?occasion=${encodeURIComponent(occasion)}`
    : `${API_URL}/gifts/suggestions/${contactId}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch gift suggestions for contact with id ${contactId}`);
  }
  return response.json();
};

export const getConversationsByContact = async (contactId: number): Promise<Conversation[]> => {
  const response = await fetch(`${API_URL}/conversations/contact/${contactId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch conversations for contact with id ${contactId}`);
  }
  return response.json();
};

export const createConversation = async (data: ConversationFormData): Promise<Conversation> => {
  const response = await fetch(`${API_URL}/conversations/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }
  return response.json();
};
