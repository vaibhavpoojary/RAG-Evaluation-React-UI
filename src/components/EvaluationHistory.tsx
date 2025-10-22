import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const EvaluationHistory = () => {
  const { data: evaluations, isLoading } = useQuery({
    queryKey: ['evaluations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Recent Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Recent Evaluations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!evaluations || evaluations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No evaluations yet. Run your first evaluation to see results here.
          </p>
        ) : (
          evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">
                    {evaluation.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(evaluation.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    evaluation.status === 'completed'
                      ? 'bg-metric-green/10 text-metric-green border-metric-green/20'
                      : evaluation.status === 'running'
                      ? 'bg-metric-blue/10 text-metric-blue border-metric-blue/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }
                >
                  {evaluation.status}
                </Badge>
              </div>
              {evaluation.status === 'completed' && (
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Faithfulness:</span>
                    <span className="ml-1 font-semibold">
                      {evaluation.faithfulness?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Relevancy:</span>
                    <span className="ml-1 font-semibold">
                      {evaluation.answer_relevancy?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default EvaluationHistory;
