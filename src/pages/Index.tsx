import { useState } from "react";
import AppSidebar from "@/components/Sidebar";
import FileUploadCard from "@/components/FileUploadCard";
import MetricCard from "@/components/MetricCard";
import EvaluationSettings from "@/components/EvaluationSettings";
import ApiDocsCard from "@/components/ApiDocsCard";
import EvaluationHistory from "@/components/EvaluationHistory";
import { FileText, Search, Target, Database, Beaker, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [uploadedFiles, setUploadedFiles] = useState<{
    corpus?: File;
    queries?: File;
    qrels?: File;
    results?: File;
    judgeConfig?: File;
  }>({});
  const [isRunning, setIsRunning] = useState(false);

  // Fetch latest completed evaluation for metrics
  const { data: latestEvaluation } = useQuery({
    queryKey: ['latest-evaluation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  const handleFileSelect = (fileType: string) => (file: File) => {
    setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const handleRunEvaluation = async (settings: any) => {
    if (!uploadedFiles.queries || !uploadedFiles.results) {
      toast.error("Please upload at least Queries and Retrieved Results files");
      return;
    }

    setIsRunning(true);
    toast.info("Starting evaluation...");

    try {
      // Read and parse files
      const queriesText = await uploadedFiles.queries.text();
      const resultsText = await uploadedFiles.results.text();
      
      const queries = queriesText.trim().split('\n').map(line => JSON.parse(line));
      const results = resultsText.trim().split('\n').map(line => JSON.parse(line));

      // Prepare dataset in RAGAS format
      const dataset = queries.map((query: any, idx: number) => {
        const result = results.find((r: any) => r.qid === query.qid) || results[idx];
        return {
          question: query.question || query.text,
          answer: result?.answer || "",
          contexts: result?.contexts || result?.retrieved_docs || [],
          ground_truth: query.ground_truth || ""
        };
      });

      // Call the evaluation API
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Evaluation ${new Date().toISOString()}`,
            dataset,
            model_provider: settings.modelProvider,
            model_name: settings.modelName,
            top_k: settings.topK,
          })
        }
      );

      if (!response.ok) {
        throw new Error('Evaluation failed');
      }

      const result = await response.json();
      toast.success("Evaluation started successfully!");
      
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error("Failed to run evaluation");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 flex h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />
            <h2 className="ml-4 text-lg font-semibold">RAG Evaluation Suite</h2>
          </div>
          <div className="max-w-7xl mx-auto p-8">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-primary via-primary/95 to-accent rounded-3xl p-12 mb-10 text-center overflow-hidden shadow-primary">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-md rounded-3xl mb-6 shadow-xl border border-white/20">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                RAG Evaluation Suite
              </h1>
              <p className="text-white/95 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                Professional RAG performance analysis powered by RAGAS framework
              </p>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/60"></div>
                  <span>Real-time Evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/60"></div>
                  <span>Multi-Metric Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/60"></div>
                  <span>API Integration</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* File Upload Section */}
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-1">Upload Dataset Files</h2>
                    <p className="text-sm text-muted-foreground">Upload your evaluation data in RAGAS format</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-medium">
                    RAGAS Format
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadCard
                    title="Queries File"
                    description="Questions with qids and ground truth"
                    status="required"
                    icon={<Search className="w-5 h-5 text-primary" />}
                    onFileSelect={handleFileSelect('queries')}
                  />
                  <FileUploadCard
                    title="Retrieved Results"
                    description="Generated answers and context documents"
                    status="required"
                    icon={<Database className="w-5 h-5 text-primary" />}
                    onFileSelect={handleFileSelect('results')}
                  />
                  <FileUploadCard
                    title="Corpus File"
                    description="Reference document collection"
                    status="optional"
                    icon={<FileText className="w-5 h-5 text-primary" />}
                    onFileSelect={handleFileSelect('corpus')}
                  />
                  <FileUploadCard
                    title="Qrels File"
                    description="Document relevance judgments"
                    status="optional"
                    icon={<Target className="w-5 h-5 text-primary" />}
                    onFileSelect={handleFileSelect('qrels')}
                  />
                </div>
              </div>

              {/* Dashboard Section */}
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Evaluation Metrics</h2>
                  <p className="text-muted-foreground text-sm">
                    {latestEvaluation ? `Latest evaluation: ${latestEvaluation.name}` : 'Run your first evaluation to see metrics'}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Retrieval Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Retrieval Quality (No-LLM)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard
                        title="Context Precision"
                        subtitle="Relevance score"
                        value={latestEvaluation?.context_precision ? `${(latestEvaluation.context_precision * 100).toFixed(1)}%` : "—"}
                        description="Measures the relevance of retrieved contexts to the question. Higher scores indicate better retrieval quality."
                        color="blue"
                      />
                      <MetricCard
                        title="Context Recall"
                        subtitle="Coverage of relevant results"
                        value={latestEvaluation?.context_recall ? `${(latestEvaluation.context_recall * 100).toFixed(1)}%` : "—"}
                        description="What fraction of relevant information is retrieved. High recall means comprehensive retrieval."
                        color="magenta"
                      />
                      <MetricCard
                        title="Faithfulness"
                        subtitle="Answer grounding"
                        value={latestEvaluation?.faithfulness ? `${(latestEvaluation.faithfulness * 100).toFixed(1)}%` : "—"}
                        description="Evaluates whether answers are grounded in provided context without hallucinations."
                        color="green"
                      />
                    </div>
                  </div>

                  {/* LLM Judge Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Beaker className="w-5 h-5 text-primary" />
                      Answer Quality (LLM-Judged)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard
                        title="Answer Relevancy"
                        subtitle="Response quality"
                        value={latestEvaluation?.answer_relevancy ? `${(latestEvaluation.answer_relevancy * 100).toFixed(1)}%` : "—"}
                        description="Assesses whether the answer addresses the question. High scores mean on-topic responses."
                        color="purple"
                      />
                      <MetricCard
                        title="Total Queries"
                        subtitle="Evaluated samples"
                        value={latestEvaluation?.total_queries?.toString() || "0"}
                        description="Number of question-answer pairs evaluated in this run."
                        color="teal"
                      />
                      <MetricCard
                        title="Overall Score"
                        subtitle="Average performance"
                        value={latestEvaluation ? 
                          `${((latestEvaluation.context_precision || 0) * 25 + 
                             (latestEvaluation.faithfulness || 0) * 25 + 
                             (latestEvaluation.answer_relevancy || 0) * 50).toFixed(0)}%` : "—"}
                        description="Weighted average of all metrics for overall RAG system quality assessment."
                        color="orange"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* API Documentation */}
              <ApiDocsCard />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <EvaluationSettings 
                onRunEvaluation={handleRunEvaluation}
                isRunning={isRunning}
              />
              <EvaluationHistory />
            </div>
          </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
