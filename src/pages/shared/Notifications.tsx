import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Bell, Calendar, CheckCircle2, XCircle, Info, Check, Trash2 } from 'lucide-react';
import { NotifType } from '../../types';
import { useStore } from '../../store';
import { useAuth } from '../../context/AuthContext';

const iconMap: Record<NotifType, React.ElementType> = {
  booking: Calendar,
  confirmed: CheckCircle2,
  cancelled: XCircle,
  info: Info,
};

const colorMap: Record<NotifType, string> = {
  booking: 'bg-blue-50 text-blue-600',
  confirmed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-600',
  info: 'bg-amber-50 text-amber-600',
};

export function Notifications() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, deleteNotification } = useStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const myNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = myNotifications.filter(n => !n.read).length;
  const displayed = filter === 'unread' ? myNotifications.filter(n => !n.read) : myNotifications;

  const markAllRead = () => {
    myNotifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
              <Check className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-lg w-fit">
        {(['all', 'unread'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
              filter === tab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'all' ? 'All' : 'Unread'}
            {tab === 'unread' && unreadCount > 0 && (
              <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Bell className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">No notifications here</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {displayed.map(notif => {
                const Icon = iconMap[notif.type];
                return (
                  <li
                    key={notif.id}
                    className={`flex items-start gap-4 p-4 transition-colors ${!notif.read ? 'bg-emerald-50/40' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[notif.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notif.title}
                          {!notif.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" />}
                        </p>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
