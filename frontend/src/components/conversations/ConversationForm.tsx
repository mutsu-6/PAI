import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { getContact, createConversation } from "../../lib/api";
import { Contact, ConversationFormData } from "../../types";

export function ConversationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contactId = searchParams.get("contact_id");
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ConversationFormData>({
    contact_id: contactId ? parseInt(contactId) : 0,
    date: new Date().toISOString().split('T')[0],
    topics: "",
    notes: "",
    follow_up_needed: false
  });

  useEffect(() => {
    const fetchContact = async () => {
      if (!contactId) {
        setError("連絡先IDが指定されていません");
        setLoading(false);
        return;
      }

      try {
        const data = await getContact(parseInt(contactId));
        setContact(data);
        setLoading(false);
      } catch (err) {
        setError("連絡先の取得に失敗しました");
        setLoading(false);
        console.error("Failed to fetch contact:", err);
      }
    };

    fetchContact();
  }, [contactId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, follow_up_needed: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createConversation(formData);
      navigate(`/contacts/${contactId}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!contact) {
    return <div className="text-center py-8 text-red-500">連絡先が見つかりません</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          {contact.name}さんとの会話を記録
        </CardTitle>
        <CardDescription>会話の内容や次回の話題などを記録しておきましょう</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">日付</Label>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics">話題</Label>
            <Input
              id="topics"
              name="topics"
              value={formData.topics || ""}
              onChange={handleChange}
              placeholder="例：子供の学校、趣味のゴルフ、新しい取引先など"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">メモ</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="会話の内容や次回の話題にできそうなことなど"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="follow_up_needed"
              checked={formData.follow_up_needed}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="follow_up_needed">フォローアップが必要</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/contacts/${contactId}`)}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存する"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
