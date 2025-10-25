import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { RetryButton } from './RetryButton';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({ 
  title = 'Something Went Wrong',
  message, 
  onRetry,
  isRetrying = false 
}: ErrorStateProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <RetryButton onRetry={onRetry} isLoading={isRetrying} />
        </CardContent>
      )}
    </Card>
  );
}
