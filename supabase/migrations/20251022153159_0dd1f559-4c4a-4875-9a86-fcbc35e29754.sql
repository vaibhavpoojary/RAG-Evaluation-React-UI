-- Create evaluations table to store RAG evaluation runs
CREATE TABLE public.evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Configuration
  model_provider TEXT,
  model_name TEXT,
  top_k INTEGER DEFAULT 5,
  
  -- Overall metrics
  context_precision DECIMAL(5,4),
  context_recall DECIMAL(5,4),
  faithfulness DECIMAL(5,4),
  answer_relevancy DECIMAL(5,4),
  
  -- Additional metadata
  total_queries INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create evaluation_results table for individual query results
CREATE TABLE public.evaluation_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
  query_index INTEGER NOT NULL,
  
  -- Input data
  question TEXT NOT NULL,
  ground_truth TEXT,
  answer TEXT NOT NULL,
  contexts JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Individual metrics
  context_precision DECIMAL(5,4),
  context_recall DECIMAL(5,4),
  faithfulness DECIMAL(5,4),
  answer_relevancy DECIMAL(5,4),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(evaluation_id, query_index)
);

-- Create files table for uploaded evaluation files
CREATE TABLE public.evaluation_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL CHECK (file_type IN ('corpus', 'queries', 'qrels', 'retrieved_results', 'judge_config')),
  file_name TEXT NOT NULL,
  file_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_files ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for demo purposes - adjust based on your auth requirements)
CREATE POLICY "Allow public read access on evaluations"
  ON public.evaluations FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on evaluations"
  ON public.evaluations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on evaluations"
  ON public.evaluations FOR UPDATE
  USING (true);

CREATE POLICY "Allow public read access on evaluation_results"
  ON public.evaluation_results FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on evaluation_results"
  ON public.evaluation_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access on evaluation_files"
  ON public.evaluation_files FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on evaluation_files"
  ON public.evaluation_files FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_evaluations_status ON public.evaluations(status);
CREATE INDEX idx_evaluations_created_at ON public.evaluations(created_at DESC);
CREATE INDEX idx_evaluation_results_evaluation_id ON public.evaluation_results(evaluation_id);
CREATE INDEX idx_evaluation_files_evaluation_id ON public.evaluation_files(evaluation_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON public.evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate average metrics
CREATE OR REPLACE FUNCTION public.calculate_evaluation_metrics(eval_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.evaluations
  SET 
    context_precision = (SELECT AVG(context_precision) FROM public.evaluation_results WHERE evaluation_id = eval_id),
    context_recall = (SELECT AVG(context_recall) FROM public.evaluation_results WHERE evaluation_id = eval_id),
    faithfulness = (SELECT AVG(faithfulness) FROM public.evaluation_results WHERE evaluation_id = eval_id),
    answer_relevancy = (SELECT AVG(answer_relevancy) FROM public.evaluation_results WHERE evaluation_id = eval_id),
    total_queries = (SELECT COUNT(*) FROM public.evaluation_results WHERE evaluation_id = eval_id),
    status = 'completed',
    completed_at = now()
  WHERE id = eval_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;