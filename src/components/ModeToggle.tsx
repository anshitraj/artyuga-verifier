import { Badge } from './ui/badge';
import { Sparkles, Link2 } from 'lucide-react';

interface ModeToggleProps {
  mode: 'mock' | 'onchain';
}

export const ModeToggle = ({ mode }: ModeToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-card/30 border border-border/50">
      <Badge
        variant={mode === 'mock' ? 'default' : 'secondary'}
        className="gap-1"
      >
        <Sparkles className="w-3 h-3" />
        Demo Mode
      </Badge>
      <div className="w-px h-4 bg-border" />
      <Badge
        variant={mode === 'onchain' ? 'default' : 'secondary'}
        className="gap-1"
      >
        <Link2 className="w-3 h-3" />
        Onchain
      </Badge>
    </div>
  );
};
