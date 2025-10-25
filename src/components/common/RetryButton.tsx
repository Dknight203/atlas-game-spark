import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RetryButtonProps {
  onRetry: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function RetryButton({ onRetry, isLoading = false, children }: RetryButtonProps) {
  return (
    <Button
      onClick={onRetry}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
      {children || (isLoading ? 'Retrying' : 'Try Again')}
    </Button>
  );
}
