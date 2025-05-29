export interface Contact {
  id: number;
  name: string;
  furigana?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  relationship_type?: 'business' | 'personal' | 'family' | 'other';
  hobbies?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  contact_id: number;
  event_type: 'birthday' | 'anniversary' | 'childbirth' | 'funeral' | 'meeting' | 'other';
  title: string;
  date: string;
  description?: string;
  is_recurring: boolean;
  is_notified: boolean;
  created_at: string;
}

export interface Gift {
  id: number;
  contact_id: number;
  gift_type: 'received' | 'given';
  item_name: string;
  occasion?: string;
  date: string;
  value?: number;
  notes?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  contact_id: number;
  date: string;
  topics?: string;
  notes?: string;
  follow_up_needed: boolean;
  created_at: string;
}

export interface GiftSuggestion {
  item_name: string;
  description?: string;
  estimated_value?: number;
  reason?: string;
}

export interface ContactFormData {
  name: string;
  furigana?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  relationship_type?: 'business' | 'personal' | 'family' | 'other';
  hobbies?: string;
  notes?: string;
}

export interface EventFormData {
  contact_id: number;
  event_type: 'birthday' | 'anniversary' | 'childbirth' | 'funeral' | 'meeting' | 'other';
  title: string;
  date: string;
  description?: string;
  is_recurring: boolean;
}

export interface GiftFormData {
  contact_id: number;
  gift_type: 'received' | 'given';
  item_name: string;
  occasion?: string;
  date: string;
  value?: number;
  notes?: string;
}

export interface ConversationFormData {
  contact_id: number;
  date: string;
  topics?: string;
  notes?: string;
  follow_up_needed: boolean;
}
