import { Construction } from 'lucide-react';

export default function FeedbacksPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Construction className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-lg font-semibold mb-2">Coming Soon</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        The feedback system is under development. You&apos;ll be able to submit
        and track feedback here soon.
      </p>
    </div>
  );
}
