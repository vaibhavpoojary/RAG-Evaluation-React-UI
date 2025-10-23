import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { useState } from "react";

interface EvaluationSettingsProps {
  onRunEvaluation?: (settings: {
    topK: number;
    modelProvider: string;
    modelName: string;
    apiKey: string;
    seed: number;
  }) => void;
  isRunning?: boolean;
}

const EvaluationSettings = ({ onRunEvaluation, isRunning = false }: EvaluationSettingsProps) => {
  const [topK, setTopK] = useState(5);
  const [modelProvider, setModelProvider] = useState("openai");
  const [modelName, setModelName] = useState("gpt-4o-mini");
  const [apiKey, setApiKey] = useState("OPENAI_API_KEY");
  const [seed, setSeed] = useState(42);

  const handleRunEvaluation = () => {
    onRunEvaluation?.({
      topK,
      modelProvider,
      modelName,
      apiKey,
      seed,
    });
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Evaluation Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-k">Top K</Label>
          <Input 
            id="test-k" 
            type="number" 
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="bg-background" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model-provider">Model Provider</Label>
          <Select value={modelProvider} onValueChange={setModelProvider}>
            <SelectTrigger id="model-provider" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="cohere">Cohere</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model-name">Model Name</Label>
          <Select value={modelName} onValueChange={setModelName}>
            <SelectTrigger id="model-name" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key Environment Variable</Label>
          <Input 
            id="api-key" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-background" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seed">Seed</Label>
          <Input 
            id="seed" 
            type="number" 
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value))}
            className="bg-background" 
          />
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleRunEvaluation}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            "Run Evaluation"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EvaluationSettings;
