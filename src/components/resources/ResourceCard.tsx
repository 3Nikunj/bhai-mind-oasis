
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
  onViewDetails: (resource: Resource) => void;
}

export function ResourceCard({ resource, onViewDetails }: ResourceCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{resource.title}</CardTitle>
        <CardDescription>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bhai-soft text-bhai-tertiary">
            {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm">{resource.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onViewDetails(resource)}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
