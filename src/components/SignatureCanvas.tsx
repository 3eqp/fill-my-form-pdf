import { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eraser } from "lucide-react";

interface SignatureCanvasComponentProps {
  label: string;
  onChange: (signature: string) => void;
}

export const SignatureCanvasComponent = ({ label, onChange }: SignatureCanvasComponentProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    onChange("");
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      const signature = sigCanvas.current.toDataURL();
      onChange(signature);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clear}
          className="h-8 px-2"
        >
          <Eraser className="h-4 w-4 mr-1" />
          Очистить
        </Button>
      </div>
      <div className="border-2 border-signature-border rounded-md bg-card overflow-hidden">
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={handleEnd}
          canvasProps={{
            className: "w-full h-32 cursor-crosshair",
            style: { touchAction: "none" }
          }}
          backgroundColor="hsl(var(--card))"
          penColor="hsl(var(--foreground))"
        />
      </div>
    </div>
  );
};
