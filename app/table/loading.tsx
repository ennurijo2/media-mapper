import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Media Locations - Table View
          </h1>
          <p className="text-muted-foreground">
            Explore all media locations in a tabular format. Click on any row to
            view detailed information.
          </p>
        </div>

        <div className="space-y-4">
          {/* Search and Export Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Skeleton className="h-12 w-full max-w-md" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Results Count */}
          <Skeleton className="h-5 w-48" />

          {/* Table */}
          <div className="rounded-md border">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b">
              <div className="flex gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="flex gap-4 items-center py-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <Skeleton className="h-5 w-24" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
