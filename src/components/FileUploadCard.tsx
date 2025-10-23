import { Upload, CheckCircle2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface FileUploadCardProps {
  title: string;
  description: string;
  status?: "uploaded" | "required" | "optional";
  icon?: React.ReactNode;
  onFileSelect?: (file: File) => void;
  accept?: string;
}

const FileUploadCard = ({ 
  title, 
  description, 
  status = "optional", 
  icon,
  onFileSelect,
  accept = ".jsonl,.json"
}: FileUploadCardProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const statusColors = {
    uploaded: "bg-metric-green/10 text-metric-green border-metric-green/20",
    required: "bg-destructive/10 text-destructive border-destructive/20",
    optional: "bg-muted text-muted-foreground border-border",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      onFileSelect?.(file);
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Card className="border-border hover:border-primary/50 transition-all cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-card-foreground">{title}</h3>
          </div>
          <Badge variant="outline" className={cn("capitalize", statusColors[uploadedFile ? "uploaded" : status])}>
            {uploadedFile ? "uploaded" : status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div 
          onClick={handleClick}
          className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 group-hover:border-primary/50 transition-all hover:bg-accent/50"
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          {uploadedFile ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-metric-green mb-2" />
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {uploadedFile.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">JSONL format</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
