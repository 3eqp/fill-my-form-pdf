import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/FormField";
import { SignatureCanvasComponent } from "@/components/SignatureCanvas";
import { ReceiptUpload } from "@/components/ReceiptUpload";
import { generatePDF, FormData } from "@/utils/pdfGenerator";
import { FileDown, FileText } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    amount: "",
    issuedTo: "",
    accountInfo: "",
    departmentName: "",
    basedOn: "",
    amountInWords: "",
    cashier: "",
    cashierSignature: "",
  });

  const [receipts, setReceipts] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateField = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGeneratePDF = async () => {
    // Validation
    if (!formData.date || !formData.amount || !formData.issuedTo) {
      toast.error("Пожалуйста, заполните обязательные поля: Дата, Сумма, Выдано");
      return;
    }

    setIsGenerating(true);
    try {
      await generatePDF(formData, receipts);
      toast.success("PDF успешно сгенерирован!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Ошибка при генерации PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText className="h-8 w-8 text-document-header" />
          </div>
          <h1 className="text-3xl font-bold text-document-header">
            Generator Dowód wypłaty
          </h1>
          <p className="text-muted-foreground">
            ZBÓR CHRZEŚCIJAN BAPTYSTÓW «BOŻA ŁASKA» W WARSZAWIE
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="p-6 space-y-6 shadow-lg">
          {/* Date and Amount Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              label="Data *"
              value={formData.date}
              onChange={updateField("date")}
              type="date"
            />
            <FormField
              label="Kwota *"
              value={formData.amount}
              onChange={updateField("amount")}
            />
          </div>

          {/* Issued To */}
          <FormField
            label="Wydano (imię nazwisko) *"
            value={formData.issuedTo}
            onChange={updateField("issuedTo")}
          />

          {/* Account Info */}
          <FormField
            label="Konto dla.pszeliewa (numer telefonu, lub konto bankowe)"
            value={formData.accountInfo}
            onChange={updateField("accountInfo")}
          />

          {/* Department Name */}
          <FormField
            label="Nazwa działu"
            value={formData.departmentName}
            onChange={updateField("departmentName")}
          />

          {/* Based On */}
          <FormField
            label="Na podstawie"
            value={formData.basedOn}
            onChange={updateField("basedOn")}
            multiline
            rows={3}
          />

          {/* Amount in Words */}
          <FormField
            label="Kwota słownie"
            value={formData.amountInWords}
            onChange={updateField("amountInWords")}
            multiline
            rows={3}
          />

          {/* Cashier */}
          <FormField
            label="Kasjer"
            value={formData.cashier}
            onChange={updateField("cashier")}
          />

          {/* Signature */}
          <div className="pt-4">
            <SignatureCanvasComponent
              label="Podpis kasjera"
              onChange={updateField("cashierSignature")}
            />
          </div>

          {/* Receipt Upload */}
          <div className="pt-4 border-t border-border">
            <ReceiptUpload receipts={receipts} onChange={setReceipts} />
          </div>

          {/* Generate Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              size="lg"
              className="gap-2"
            >
              <FileDown className="h-5 w-5" />
              {isGenerating ? "Генерация..." : "Сгенерировать PDF"}
            </Button>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>* Обязательные поля для заполнения</p>
          <p className="mt-1">Сгенерированный PDF будет содержать заполненную форму и все добавленные чеки</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
