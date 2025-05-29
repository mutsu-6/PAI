import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, UserCircle, Calendar, Gift, MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getContacts } from "../../lib/api";
import { Contact } from "../../types";

export function ContactList() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
        setFilteredContacts(data);
        setLoading(false);
      } catch (err) {
        setError("連絡先の取得に失敗しました");
        setLoading(false);
        console.error("Failed to fetch contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredContacts(contacts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        (contact.furigana && contact.furigana.toLowerCase().includes(query)) ||
        (contact.hobbies && contact.hobbies.toLowerCase().includes(query))
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">カルテ一覧</h2>
        <Button onClick={() => navigate("/contacts/new")} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10"
          placeholder="名前、ふりがな、趣味などで検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {contacts.length === 0
              ? "連絡先がまだ登録されていません"
              : "検索条件に一致する連絡先がありません"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => navigate(`/contacts/${contact.id}`)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <UserCircle className="mr-2 h-5 w-5 text-slate-500" />
                  {contact.name}
                </CardTitle>
                {contact.furigana && (
                  <p className="text-sm text-gray-500">{contact.furigana}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contact.relationship_type && (
                    <div className="text-sm">
                      <span className="font-medium">関係性:</span>{" "}
                      {contact.relationship_type === "business"
                        ? "ビジネス"
                        : contact.relationship_type === "personal"
                        ? "個人"
                        : contact.relationship_type === "family"
                        ? "家族"
                        : "その他"}
                    </div>
                  )}
                  {contact.birthday && (
                    <div className="text-sm flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-slate-500" />
                      {new Date(contact.birthday).toLocaleDateString("ja-JP")}
                    </div>
                  )}
                  {contact.hobbies && (
                    <div className="text-sm">
                      <span className="font-medium">趣味:</span> {contact.hobbies}
                    </div>
                  )}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/gifts/suggestions/${contact.id}`);
                            }}>
                      <Gift className="mr-1 h-4 w-4" />
                      ギフト
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/conversations/new?contact_id=${contact.id}`);
                            }}>
                      <MessageSquare className="mr-1 h-4 w-4" />
                      会話
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
