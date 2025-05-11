"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UserFooter } from '@/components/dashboard/user-footer';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface MessageVariant {
  id: string;
  content: string;
  _id: string;
}

interface Campaign {
  _id: string;
  name: string;
  objective: string;
  segment: string;
  status: string;
  createdAt: string;
  messageVariants: MessageVariant[];
  audienceRules: any[];
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaign/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch campaign');
        }

        setCampaign(data.campaign);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaign');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCampaign();
    }
  }, [params.id]);

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
              <Button onClick={() => router.push('/campaigns')}>
                Back to Campaigns
              </Button>
            </div>
          </main>
          <UserFooter />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {campaign.name}
            </h1>
            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
              {campaign.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>Basic information about the campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Objective</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{campaign.objective}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Segment</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{campaign.segment}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Variants</CardTitle>
                <CardDescription>Generated message variations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {campaign.messageVariants.map((variant) => (
                    <li key={variant.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {variant.content}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
        <UserFooter />
      </div>
    </div>
  );
} 