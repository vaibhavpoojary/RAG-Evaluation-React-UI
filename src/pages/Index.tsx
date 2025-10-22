import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FileUploadCard from "@/components/FileUploadCard";
import MetricCard from "@/components/MetricCard";
import EvaluationSettings from "@/components/EvaluationSettings";
import ApiDocsCard from "@/components/ApiDocsCard";
import EvaluationHistory from "@/components/EvaluationHistory";
import { FileText, Search, Target, Database, Settings2, Beaker, Code } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-12 mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Beaker className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">RAG Evaluation Suite</h1>
            <p className="text-white/90 text-lg">
              Upload your RAG documents and view comprehensive RAG performance insights instantly
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* File Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* API Documentation */}
              <ApiDocsCard />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUploadCard
                  title="Corpus File"
                  description="JSONL file with document reference"
                  status="uploaded"
                  icon={<FileText className="w-5 h-5 text-primary" />}
                />
                <FileUploadCard
                  title="Queries File"
                  description="JSONL with questions and qids (question info)"
                  status="required"
                  icon={<Search className="w-5 h-5 text-primary" />}
                />
                <FileUploadCard
                  title="Qrels File"
                  description="JSONL with document relevance"
                  status="required"
                  icon={<Target className="w-5 h-5 text-primary" />}
                />
                <FileUploadCard
                  title="Retrieved Results File"
                  description="JSONL file with qid and retrieved documents and answers"
                  status="required"
                  icon={<Database className="w-5 h-5 text-primary" />}
                />
              </div>
              
              <FileUploadCard
                title="Judge Config File"
                description="Optional: JSONL with custom judge prompts."
                status="optional"
                icon={<Settings2 className="w-5 h-5 text-primary" />}
              />

              {/* Dashboard Section */}
              <div className="mt-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard</h2>
                  <p className="text-muted-foreground">High-level overview of the evaluation results (RAGAS metrics)</p>
                </div>

                <div className="space-y-6">
                  {/* Retrieval Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Retrieval Metrics (No-LLM)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard
                        title="Avg. Precision@K"
                        subtitle="Measures accuracy of top-K results"
                        value="0.23"
                        description="How many top-K results are relevant. Precision reflects quality: high precision means fewer false positives."
                        color="blue"
                      />
                      <MetricCard
                        title="Avg. Recall@K"
                        subtitle="Coverage of relevant results"
                        value="0.70"
                        description="What fraction (%) does it cover? If all relevant documents make it in top-K, recall is 1.0. Recall measures completeness."
                        color="magenta"
                      />
                      <MetricCard
                        title="Avg. NDCG@K"
                        subtitle="Normalized ranking quality"
                        value="0.50"
                        description="Blends ranking and recall. Takes order/rank of results into account, giving weights to early results. Penalizes out-of-order retrieval."
                        color="green"
                      />
                    </div>
                  </div>

                  {/* LLM Judge Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Beaker className="w-5 h-5 text-primary" />
                      LLM Judge Metrics (RAGAS Framework)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard
                        title="Context Precision"
                        subtitle="Relevance score"
                        value="70.00%"
                        description="Measures the relevance of retrieved contexts to the question. Higher scores indicate better retrieval quality."
                        color="orange"
                      />
                      <MetricCard
                        title="Faithfulness"
                        subtitle="Answer grounding"
                        value="60.00%"
                        description="Evaluates whether the answer is grounded in the provided context without hallucinations. Critical for trustworthy AI."
                        color="teal"
                      />
                      <MetricCard
                        title="Answer Relevancy"
                        subtitle="Response quality"
                        value="85.00%"
                        description="Assesses whether the answer actually addresses the question asked. High scores mean the answer is on-topic."
                        color="purple"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <EvaluationSettings />
              <EvaluationHistory />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
