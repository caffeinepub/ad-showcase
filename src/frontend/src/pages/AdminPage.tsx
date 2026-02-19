import { useState } from 'react';
import { useGetCallerUserRole, useGetAllAds, useCreateAd, useDeactivateAd } from '../hooks/useQueries';
import { UserRole, type Ad, ExternalBlob } from '../backend';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import AdForm from '../components/AdForm';
import AdList from '../components/AdList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function AdminPage() {
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: ads, isLoading: adsLoading } = useGetAllAds();
  const createAdMutation = useCreateAd();
  const deactivateAdMutation = useDeactivateAd();
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  const isAdmin = userRole === UserRole.admin;

  if (roleLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleCreateAd = async (data: {
    id: string;
    title: string;
    description: string;
    image: ExternalBlob | null;
    targetUrl: string;
    isActive: boolean;
  }) => {
    try {
      await createAdMutation.mutateAsync(data);
      toast.success('Advertisement created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create advertisement');
      throw error;
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateAdMutation.mutateAsync(id);
      toast.success('Advertisement deactivated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to deactivate advertisement');
    }
  };

  return (
    <>
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your advertisements</p>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="create">Create Ad</TabsTrigger>
            <TabsTrigger value="manage">Manage Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <AdForm
              onSubmit={handleCreateAd}
              isSubmitting={createAdMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {adsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AdList
                ads={ads || []}
                onToggleActive={handleDeactivate}
                isLoading={deactivateAdMutation.isPending}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  );
}
