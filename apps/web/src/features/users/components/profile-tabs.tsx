import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

export function ProfileTabs({ userId }: { userId: string }) {
  return (
    <Tabs defaultValue="listings" className="w-100">
      <TabsList variant="line">
        <TabsTrigger value="listings">Listings</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="listings">
        <div>Listings of {userId}</div>
      </TabsContent>
      <TabsContent value="reviews">
        <div>Reviews of {userId}</div>
      </TabsContent>
    </Tabs>
  );
}
