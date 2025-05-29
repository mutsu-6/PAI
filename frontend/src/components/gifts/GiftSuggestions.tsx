import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { getContact, getGiftSuggestions } from "../../lib/api";
import { Contact, GiftSuggestion } from "../../types";

export function GiftSuggestions() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!contactId) {
        setError("連絡先IDが指定されていません");
        setLoading(false);
        return;
      }

      try {
        const [contactData, suggestionsData] = await Promise.all([
          getContact(parseInt(contactId)),
          getGiftSuggestions(parseInt(contactId))
        ]);
        
        setContact(contactData);
        setSuggestions(suggestionsData);
        setLoading(false);
      } catch (err) {
        setError("データの取得に失敗しました");
        setLoading(false);
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [contactId]);

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
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
        <h2 className="text-2xl font-bold">{contact.name}さんへのギフト提案</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">ギフトの提案がありません</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-slate-50 pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Gift className="mr-2 h-5 w-5 text-slate-500" />
                  {suggestion.item_name}
                </CardTitle>
                {suggestion.estimated_value && (
                  <CardDescription>
                    目安: {suggestion.estimated_value.toLocaleString()}円
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                {suggestion.description && (
                  <p className="text-sm mb-2">{suggestion.description}</p>
                )}
                {suggestion.reason && (
                  <p className="text-sm text-gray-500">理由: {suggestion.reason}</p>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 border-t">
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                  <ShoppingBag className="mr-1 h-4 w-4" />
                  購入する
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-8">
        <h3 className="font-medium text-blue-800 mb-2">AIによる提案について</h3>
        <p className="text-sm text-blue-700">
          これらの提案は{contact.name}さんの趣味や好み、過去の贈答履歴などから自動生成されています。
          実際の購入前に、関係性や状況に合わせて適切かどうか再確認することをお勧めします。
        </p>
      </div>
    </div>
  );
}
