import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function StatsCard({ label, value, icon: Icon, iconColor, iconBg }: StatsCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
