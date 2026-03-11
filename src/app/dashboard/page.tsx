'use client';

import { Card } from '@/components/ui/card';
import { Users, DollarSign, Gamepad2, Heart } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Total Users', value: '1,204', change: '+12%', icon: Users },
    { title: 'Revenue', value: '$12,430', change: '+8%', icon: DollarSign },
    { title: 'Games Played', value: '3,247', change: '+23%', icon: Gamepad2 },
    { title: 'Active Sessions', value: '89', change: '-2%', icon: Heart },
  ];

  const recentActivity = [
    { user: 'Alice', action: 'Completed Find the Cats', time: '2 minutes ago' },
    { user: 'Bob', action: 'Created new artwork', time: '5 minutes ago' },
    { user: 'Charlie', action: 'Won Catch My Heart', time: '10 minutes ago' },
    { user: 'Diana', action: 'Shared photobooth photo', time: '15 minutes ago' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back! Here's a clean overview.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">{stat.title}</div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </div>
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {stat.change} from last month
              </div>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
