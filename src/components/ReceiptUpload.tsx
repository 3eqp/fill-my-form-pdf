import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileImage } from "lucide-react";
import { toast } from "sonner";

interface ReceiptUploadProps {
  receipts: File[];
  onChange: (receipts: File[]) => void;
}

export const ReceiptUpload = ({ receipts, onChange }: ReceiptUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith("image/") || file.type === "application/pdf";
      if (!isValid) {
        toast.error(`Файл ${file.name} має невірний формат. Дозволені тільки зображення та PDF.`);
      }
      return isValid;
    });
    
    if (validFiles.length > 0) {
      onChange([...receipts, ...validFiles]);
      toast.success(`Додано файлів: ${validFiles.length}`);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeReceipt = (index: number) => {
    onChange(receipts.filter((_, i) => i !== index));
    toast.info("Файл видалено");
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">Чеки (зображення або PDF)</Label>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Додати чек
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {receipts.length > 0 && (
        <div className="space-y-2">
          {receipts.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-card border border-border rounded-md"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeReceipt(index)}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
