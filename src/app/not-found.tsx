import React from 'react';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <EmptyState
        icon={<Compass className="w-8 h-8 text-amber-600" />}
        title="404 — Page Not Found"
        description="The page or route you requested does not exist on Addis Eats."
        actionText="Return to Menu"
        actionHref="/menu"
      />
    </div>
  );
}
