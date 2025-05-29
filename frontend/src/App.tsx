import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Header } from './components/layout/Header'
import { ContactForm } from './components/contacts/ContactForm'
import { ContactList } from './components/contacts/ContactList'
import { ContactDetail } from './components/contacts/ContactDetail'
import { NotificationList } from './components/notifications/NotificationList'
import { GiftSuggestions } from './components/gifts/GiftSuggestions'
import { ConversationForm } from './components/conversations/ConversationForm'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/notifications" replace />} />
            <Route path="/contacts" element={<ContactList />} />
            <Route path="/contacts/:contactId" element={<ContactDetail />} />
            <Route path="/contacts/new" element={<ContactForm />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/gifts/suggestions/:contactId" element={<GiftSuggestions />} />
            <Route path="/conversations/new" element={<ConversationForm />} />
            {/* 他のルートは今後実装 */}
          </Routes>
        </main>
        <footer className="bg-slate-800 text-white p-4 text-center">
          <p>@PAI マメナカタ - 接待補佐パーソナルアシスタント</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
