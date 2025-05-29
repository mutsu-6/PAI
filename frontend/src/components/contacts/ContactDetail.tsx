import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Gift as GiftIcon, MessageSquare, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { getContact, getGiftsByContact, getConversationsByContact } from "../../lib/api";
import { Contact, Gift, Conversation } from "../../types";

export function ContactDetail() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
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
        const [contactData, giftsData, conversationsData] = await Promise.all([
          getContact(parseInt(contactId)),
          getGiftsByContact(parseInt(contactId)),
          getConversationsByContact(parseInt(contactId))
        ]);
        
        setContact(contactData);
        setGifts(giftsData);
        setConversations(conversationsData);
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate("/contacts")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
          <h2 className="text-2xl font-bold">{contact.name}</h2>
          {contact.furigana && (
            <span className="ml-2 text-gray-500">（{contact.furigana}）</span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={() => navigate(`/contacts/${contactId}/edit`)}
          >
            <Edit className="mr-1 h-4 w-4" />
            編集
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact.birthday && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">誕生日:</span>
                <span className="ml-2">
                  {new Date(contact.birthday).toLocaleDateString("ja-JP")}
                </span>
              </div>
            )}
            
            {contact.gender && (
              <div>
                <span className="font-medium">性別:</span>
                <span className="ml-2">
                  {contact.gender === "male" ? "男性" :
                   contact.gender === "female" ? "女性" :
                   contact.gender === "other" ? "その他" : "未指定"}
                </span>
              </div>
            )}
            
            {contact.relationship_type && (
              <div>
                <span className="font-medium">関係性:</span>
                <span className="ml-2">
                  {contact.relationship_type === "business" ? "ビジネス" :
                   contact.relationship_type === "personal" ? "個人" :
                   contact.relationship_type === "family" ? "家族" : "その他"}
                </span>
              </div>
            )}
            
            {contact.hobbies && (
              <div>
                <span className="font-medium">趣味・好み:</span>
                <span className="ml-2">{contact.hobbies}</span>
              </div>
            )}
            
            {contact.notes && (
              <div>
                <span className="font-medium">メモ:</span>
                <p className="mt-1 text-sm whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}

            <div className="pt-4 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={() => navigate(`/gifts/suggestions/${contactId}`)}
              >
                <GiftIcon className="mr-1 h-4 w-4" />
                ギフト提案
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={() => navigate(`/conversations/new?contact_id=${contactId}`)}
              >
                <MessageSquare className="mr-1 h-4 w-4" />
                会話記録
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="conversations">
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="conversations">会話履歴</TabsTrigger>
                <TabsTrigger value="gifts">贈答履歴</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-4">
              <TabsContent value="conversations" className="space-y-4">
                {conversations.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">会話履歴がありません</p>
                ) : (
                  conversations.map((conversation) => (
                    <div key={conversation.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {new Date(conversation.date).toLocaleDateString("ja-JP")}
                            </span>
                          </div>
                          {conversation.topics && (
                            <p className="font-medium mt-1">{conversation.topics}</p>
                          )}
                          {conversation.notes && (
                            <p className="text-sm mt-1 whitespace-pre-wrap">{conversation.notes}</p>
                          )}
                        </div>
                        {conversation.follow_up_needed && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                            フォローアップ必要
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="gifts" className="space-y-4">
                {gifts.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">贈答履歴がありません</p>
                ) : (
                  gifts.map((gift) => (
                    <div key={gift.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {new Date(gift.date).toLocaleDateString("ja-JP")}
                            </span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                              gift.gift_type === "given" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-green-100 text-green-800"
                            }`}>
                              {gift.gift_type === "given" ? "贈った" : "もらった"}
                            </span>
                          </div>
                          <p className="font-medium mt-1">{gift.item_name}</p>
                          {gift.occasion && (
                            <p className="text-sm">機会: {gift.occasion}</p>
                          )}
                          {gift.value && (
                            <p className="text-sm">金額: {gift.value.toLocaleString()}円</p>
                          )}
                          {gift.notes && (
                            <p className="text-sm mt-1">{gift.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
