import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FileUploadCardProps {
  title: string;
  description: string;
  status?: "uploaded" | "required" | "optional";
  icon?: React.ReactNode;
}

const FileUploadCard = ({ title, description, status = "optional", icon }: FileUploadCardProps) => {
  const statusColors = {
    uploaded: "bg-metric-green/10 text-metric-green border-metric-green/20",
    required: "bg-destructive/10 text-destructive border-destructive/20",
    optional: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-card-foreground">{title}</h3>
          </div>
          <Badge variant="outline" className={cn("capitalize", statusColors[status])}>
            {status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 group-hover:border-primary/50 transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
