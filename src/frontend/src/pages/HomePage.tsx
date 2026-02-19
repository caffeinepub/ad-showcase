import { useGetAllAds } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: ads, isLoading, error } = useGetAllAds();

  const activeAds = ads?.filter((ad) => ad.isActive) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-border/40">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Discover Amazing{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Offers
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore curated advertisements from trusted brands and discover products that matter to you.
            </p>
          </div>
        </div>
      </section>

      {/* Ads Grid Section */}
      <section className="container py-12 md:py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load advertisements. Please try again later.</p>
          </div>
        ) : activeAds.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold">No Ads Available</h2>
              <p className="text-muted-foreground">
                There are currently no active advertisements to display. Check back soon!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAds.map((ad) => (
              <a
                key={ad.id}
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] hover:border-amber-500/50">
                  {ad.image && (
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={ad.image.getDirectURL()}
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg leading-tight group-hover:text-amber-600 transition-colors">
                        {ad.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{ad.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
