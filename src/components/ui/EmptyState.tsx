import React, { ReactNode } from 'react';
import { Link } from '@/src/lib/router';
import { Button } from '@/src/components/ui/Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto space-y-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
          {icon}
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{title}</h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{description}</p>
      </div>

      {actionText && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="md" variant="primary">
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button size="md" variant="primary" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
