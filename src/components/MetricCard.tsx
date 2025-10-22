import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: string;
  description: string;
  color: "blue" | "magenta" | "green" | "orange" | "teal" | "purple";
}

const MetricCard = ({ title, subtitle, value, description, color }: MetricCardProps) => {
  const colorClasses = {
    blue: "bg-gradient-to-br from-metric-blue to-metric-blue/80",
    magenta: "bg-gradient-to-br from-metric-magenta to-metric-magenta/80",
    green: "bg-gradient-to-br from-metric-green to-metric-green/80",
    orange: "bg-gradient-to-br from-metric-orange to-metric-orange/80",
    teal: "bg-gradient-to-br from-metric-teal to-metric-teal/80",
    purple: "bg-gradient-to-br from-metric-purple to-metric-purple/80",
  };

  return (
    <Card className={cn("border-0 text-white overflow-hidden", colorClasses[color])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
            <p className="text-white/60 text-xs">{subtitle}</p>
          </div>
          <TrendingUp className="w-5 h-5 text-white/60" />
        </div>
        <div className="mb-3">
          <p className="text-5xl font-bold">{value}</p>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
