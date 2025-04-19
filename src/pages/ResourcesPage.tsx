
import { ResourceList } from '@/components/resources/ResourceList';

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Mental Health Resources</h1>
      <p className="text-muted-foreground mb-8">
        Browse our library of educational resources about various mental health topics. These resources are designed to help you better understand mental health conditions and develop coping strategies.
      </p>
      <ResourceList />
    </div>
  );
}
