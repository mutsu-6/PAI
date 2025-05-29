import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { ContactFormData } from "../../types";
import { createContact } from "../../lib/api";

export function ContactForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    furigana: "",
    birthday: "",
    gender: undefined,
    relationship_type: undefined,
    hobbies: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createContact(formData);
      navigate("/contacts");
    } catch (error) {
      console.error("Failed to create contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>カルテ登録</CardTitle>
        <CardDescription>新しい連絡先情報を登録してください</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前 <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="山田 太郎"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="furigana">ふりがな</Label>
              <Input
                id="furigana"
                name="furigana"
                value={formData.furigana || ""}
                onChange={handleChange}
                placeholder="やまだ たろう"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthday">生年月日</Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">性別</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                  <SelectItem value="unknown">未指定</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship_type">関係性</Label>
            <Select
              value={formData.relationship_type}
              onValueChange={(value) => handleSelectChange("relationship_type", value)}
            >
              <SelectTrigger id="relationship_type">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">ビジネス</SelectItem>
                <SelectItem value="personal">個人</SelectItem>
                <SelectItem value="family">家族</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hobbies">趣味・好み</Label>
            <Input
              id="hobbies"
              name="hobbies"
              value={formData.hobbies || ""}
              onChange={handleChange}
              placeholder="ゴルフ、読書、お酒"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">メモ</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              placeholder="会話の内容や特記事項など"
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/contacts")}
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
