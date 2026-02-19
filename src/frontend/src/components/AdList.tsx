import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type Ad } from '../backend';
import { Pencil, Trash2, Power, ExternalLink } from 'lucide-react';

interface AdListProps {
  ads: Ad[];
  onEdit?: (ad: Ad) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  isLoading?: boolean;
}

export default function AdList({ ads, onEdit, onDelete, onToggleActive, isLoading }: AdListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setAdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (adToDelete && onDelete) {
      onDelete(adToDelete);
    }
    setDeleteDialogOpen(false);
    setAdToDelete(null);
  };

  if (ads.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No advertisements yet. Create your first ad to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {ads.map((ad) => (
          <Card key={ad.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {ad.image && (
                  <div className="w-full md:w-48 h-32 flex-shrink-0">
                    <img
                      src={ad.image.getDirectURL()}
                      alt={ad.title}
                      className="w-full h-full object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{ad.title}</h3>
                        <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{ad.description}</p>
                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {ad.targetUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(ad)}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    {onToggleActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleActive(ad.id)}
                        disabled={isLoading || !ad.isActive}
                      >
                        <Power className="h-4 w-4 mr-2" />
                        Deactivate
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(ad.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the advertisement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
