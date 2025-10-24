import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface FileUploadCardProps {
  title: string;
  description: string;
  status: "required" | "optional";
  icon: React.ReactNode;
  onFileSelect: (file: File) => void;
}

const FileUploadCard = ({
  title,
  description,
  status,
  icon,
  onFileSelect,
}: FileUploadCardProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/json" || file.name.endsWith('.jsonl')) {
        setUploadedFile(file);
        onFileSelect(file);
        toast.success(`${file.name} uploaded successfully`);
      } else {
        toast.error("Please upload a JSON or JSONL file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type === "application/json" || file.name.endsWith('.jsonl')) {
        setUploadedFile(file);
        onFileSelect(file);
        toast.success(`${file.name} uploaded successfully`);
      } else {
        toast.error("Please upload a JSON or JSONL file");
      }
    }
  };

  const handleClick = () => {
    document.getElementById(`file-input-${title}`)?.click();
  };

  return (
    <Card 
      className="group border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-card to-card/50"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
          <Badge
            variant={status === "required" ? "destructive" : "secondary"}
            className="text-xs font-medium shrink-0"
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <input
          id={`file-input-${title}`}
          type="file"
          accept=".json,.jsonl"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploadedFile ? (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-metric-green/10 to-metric-green/5 border border-metric-green/30 rounded-xl">
            <div className="p-2 rounded-lg bg-metric-green/20">
              <Check className="w-4 h-4 text-metric-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        ) : (
          <div 
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all ${
              isDragging 
                ? 'border-primary bg-primary/5 scale-[0.98]' 
                : 'border-border group-hover:border-primary/30 group-hover:bg-muted/30'
            }`}
          >
            <div className="p-3 rounded-full bg-muted mb-3 group-hover:bg-primary/10 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">JSONL format</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
