
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Resource } from '@/types';
import MarkdownView from 'react-showdown';

interface ResourceModalProps {
  resource: Resource;
  onClose: () => void;
}

export function ResourceModal({ resource, onClose }: ResourceModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
          <DialogDescription>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bhai-soft text-bhai-tertiary">
              {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
            </span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4 pr-4">
          <div className="prose prose-sm prose-p:leading-relaxed prose-headings:text-bhai-tertiary">
            <MarkdownView markdown={resource.content} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
