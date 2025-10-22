import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const EvaluationSettings = () => {
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
          <Input id="test-k" type="number" defaultValue="5" className="bg-background" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model-provider">Model Provider</Label>
          <Select defaultValue="openai">
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
          <Select defaultValue="gpt-4o-mini">
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
          <Input id="api-key" defaultValue="OPENAI_API_KEY" className="bg-background" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seed">Seed</Label>
          <Input id="seed" type="number" defaultValue="42" className="bg-background" />
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90">
          Run Evaluation
        </Button>
      </CardContent>
    </Card>
  );
};

export default EvaluationSettings;
