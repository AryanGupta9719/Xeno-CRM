"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UserFooter } from '@/components/dashboard/user-footer';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';

interface Campaign {
  _id: string;
  name: string;
  objective: string;
  segment: string;
  status: string;
  createdAt: string;
  totalAudienceCount: number;
  deliveryStats: {
    sent: number;
    failed: number;
  };
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch campaigns');
        }

        if (data.campaigns && Array.isArray(data.campaigns)) {
          const sortedCampaigns = data.campaigns.sort((a: Campaign, b: Campaign) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setCampaigns(sortedCampaigns);
        } else {
          setCampaigns([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </main>
          <UserFooter />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 container mx-auto px-4 py-6">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </main>
          <UserFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
            <Button onClick={() => router.push('/campaigns/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No campaigns yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first campaign to get started</p>
              <Button onClick={() => router.push('/campaigns/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Card 
                  key={campaign._id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/campaigns/${campaign._id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardDescription>{campaign.objective}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Segment</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{campaign.segment}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Audience Size</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {campaign.totalAudienceCount?.toLocaleString() || 0}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Stats</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          Sent: {campaign.deliveryStats?.sent || 0} | Failed: {campaign.deliveryStats?.failed || 0}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
        <UserFooter />
      </div>
    </div>
  );
} 