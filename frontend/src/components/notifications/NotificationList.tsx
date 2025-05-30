import { useState, useEffect } from "react";
import { Calendar, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { getUpcomingEvents } from "../../lib/api";
import { Event } from "../../types";

export function NotificationList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getUpcomingEvents(14); // 2週間分の通知を取得
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError("通知の取得に失敗しました");
        setLoading(false);
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">今後2週間の通知はありません</p>
      </div>
    );
  }

  const groupedEvents: Record<string, Event[]> = {};
  events.forEach(event => {
    const dateKey = event.date.split('T')[0]; // ISO形式の日付から時間部分を除去
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">今後の通知</h2>
      
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <Card key={date} className="overflow-hidden">
          <CardHeader className="bg-slate-100 pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {new Date(date).toLocaleDateString('ja-JP', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {dateEvents.map(event => (
                <div key={event.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {event.event_type === 'birthday' ? '誕生日' : 
                         event.event_type === 'anniversary' ? '記念日' : 
                         event.event_type === 'childbirth' ? '出産' : 
                         event.event_type === 'funeral' ? '法事' : 
                         event.event_type === 'meeting' ? '会議' : 'その他'}
                      </p>
                      {event.description && (
                        <p className="text-sm mt-1">{event.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center"
                        onClick={() => window.location.href = `/gifts/suggestions/${event.contact_id}`}
                      >
                        <Gift className="mr-1 h-4 w-4" />
                        ギフト提案
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
