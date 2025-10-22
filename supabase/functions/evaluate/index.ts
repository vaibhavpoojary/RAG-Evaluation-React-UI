import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EvaluationRequest {
  name: string;
  description?: string;
  dataset: Array<{
    question: string;
    answer: string;
    contexts: string[];
    ground_truth?: string;
  }>;
  config?: {
    model_provider?: string;
    model_name?: string;
    top_k?: number;
  };
}

interface EvaluationResult {
  evaluation_id: string;
  status: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const requestData: EvaluationRequest = await req.json();
    
    // Validate request
    if (!requestData.name || !requestData.dataset || !Array.isArray(requestData.dataset)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request. Required fields: name (string), dataset (array)' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create evaluation record
    const { data: evaluation, error: evalError } = await supabaseClient
      .from('evaluations')
      .insert({
        name: requestData.name,
        description: requestData.description || '',
        status: 'running',
        model_provider: requestData.config?.model_provider || 'openai',
        model_name: requestData.config?.model_name || 'gpt-4o-mini',
        top_k: requestData.config?.top_k || 5,
        total_queries: requestData.dataset.length,
      })
      .select()
      .single();

    if (evalError) {
      console.error('Error creating evaluation:', evalError);
      return new Response(
        JSON.stringify({ error: 'Failed to create evaluation', details: evalError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created evaluation ${evaluation.id}, processing ${requestData.dataset.length} queries`);

    // Process each query and calculate mock metrics
    // In production, you would call actual LLM evaluation APIs here
    const results = [];
    for (let i = 0; i < requestData.dataset.length; i++) {
      const item = requestData.dataset[i];
      
      // Mock metric calculations (replace with actual RAGAS evaluation)
      const contextPrecision = Math.random() * 0.3 + 0.6; // 0.6-0.9
      const contextRecall = Math.random() * 0.3 + 0.6;
      const faithfulness = Math.random() * 0.3 + 0.65;
      const answerRelevancy = Math.random() * 0.25 + 0.7;

      results.push({
        evaluation_id: evaluation.id,
        query_index: i,
        question: item.question,
        ground_truth: item.ground_truth || null,
        answer: item.answer,
        contexts: item.contexts,
        context_precision: contextPrecision,
        context_recall: contextRecall,
        faithfulness: faithfulness,
        answer_relevancy: answerRelevancy,
      });
    }

    // Insert all results
    const { error: resultsError } = await supabaseClient
      .from('evaluation_results')
      .insert(results);

    if (resultsError) {
      console.error('Error inserting results:', resultsError);
      await supabaseClient
        .from('evaluations')
        .update({ status: 'failed' })
        .eq('id', evaluation.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to save evaluation results', details: resultsError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate and update average metrics
    const { error: calcError } = await supabaseClient.rpc(
      'calculate_evaluation_metrics',
      { eval_id: evaluation.id }
    );

    if (calcError) {
      console.error('Error calculating metrics:', calcError);
    }

    console.log(`Evaluation ${evaluation.id} completed successfully`);

    const response: EvaluationResult = {
      evaluation_id: evaluation.id,
      status: 'completed',
      message: `Evaluation completed successfully. Processed ${requestData.dataset.length} queries.`,
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in evaluate function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
