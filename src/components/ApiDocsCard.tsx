import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ApiDocsCard = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  const examples = [
    {
      title: "Run Evaluation (Python)",
      language: "python",
      code: `import requests

url = "${baseUrl}/evaluate"
payload = {
    "name": "My RAG Evaluation",
    "dataset": [{
        "question": "What is AI?",
        "answer": "AI is artificial intelligence...",
        "contexts": ["AI refers to..."],
        "ground_truth": "Artificial intelligence"
    }]
}
response = requests.post(url, json=payload)
print(response.json())`,
    },
    {
      title: "Get Results (Python)",
      language: "python",
      code: `import requests

eval_id = "your-evaluation-id"
url = "${baseUrl}/get-evaluation?id={eval_id}"
response = requests.get(url)
data = response.json()
print(f"Faithfulness: {data['evaluation']['metrics']['faithfulness']}")`,
    },
    {
      title: "List Evaluations (cURL)",
      language: "bash",
      code: `curl "${baseUrl}/list-evaluations?limit=10"`,
    },
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="border-border shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code className="w-5 h-5 text-primary" />
          </div>
          <span>API Documentation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">Base URL</h4>
          <code className="block bg-muted p-3 rounded text-xs break-all">
            {baseUrl}
          </code>
        </div>

        {examples.map((example, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground">
                {example.title}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(example.code, index)}
                className="h-8"
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-metric-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <pre className="bg-gradient-to-br from-muted to-muted/80 p-4 rounded-lg text-xs overflow-x-auto border border-border/50">
              <code className="font-mono">{example.code}</code>
            </pre>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            📚 Full documentation available in{" "}
            <code className="bg-muted px-1 py-0.5 rounded">
              PYTHON_API_GUIDE.md
            </code>
          </p>
          <p className="text-xs text-muted-foreground">
            Follows RAGAS framework standards for RAG evaluation metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiDocsCard;
