import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
    );

    const url = new URL(req.url);
    const evaluationId = url.searchParams.get('id');

    if (!evaluationId) {
      return new Response(
        JSON.stringify({ error: 'Missing evaluation ID parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch evaluation
    const { data: evaluation, error: evalError } = await supabaseClient
      .from('evaluations')
      .select('*')
      .eq('id', evaluationId)
      .single();

    if (evalError || !evaluation) {
      return new Response(
        JSON.stringify({ error: 'Evaluation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch results
    const { data: results, error: resultsError } = await supabaseClient
      .from('evaluation_results')
      .select('*')
      .eq('evaluation_id', evaluationId)
      .order('query_index', { ascending: true });

    if (resultsError) {
      console.error('Error fetching results:', resultsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch evaluation results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = {
      evaluation: {
        id: evaluation.id,
        name: evaluation.name,
        description: evaluation.description,
        status: evaluation.status,
        created_at: evaluation.created_at,
        completed_at: evaluation.completed_at,
        model_provider: evaluation.model_provider,
        model_name: evaluation.model_name,
        top_k: evaluation.top_k,
        total_queries: evaluation.total_queries,
        metrics: {
          context_precision: evaluation.context_precision,
          context_recall: evaluation.context_recall,
          faithfulness: evaluation.faithfulness,
          answer_relevancy: evaluation.answer_relevancy,
        },
      },
      results: results || [],
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-evaluation function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
