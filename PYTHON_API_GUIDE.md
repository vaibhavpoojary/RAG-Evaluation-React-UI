# RAG Evaluation API - Python Integration Guide

## Overview

This RAG Evaluation Dashboard follows the RAGAS framework standards and provides RESTful API endpoints for Python integration.

## Base URL

```
https://invhposqpwwmllhbuobl.supabase.co/functions/v1
```

## API Endpoints

### 1. Run Evaluation

**Endpoint:** `POST /evaluate`

Evaluates a RAG system using the RAGAS framework metrics.

#### Request Format

```python
import requests
import json

url = "https://invhposqpwwmllhbuobl.supabase.co/functions/v1/evaluate"
headers = {"Content-Type": "application/json"}

payload = {
    "name": "Product QA Evaluation",
    "description": "Evaluating product documentation RAG system",
    "dataset": [
        {
            "question": "What is the return policy?",
            "answer": "You can return items within 30 days...",
            "contexts": [
                "Our return policy allows returns within 30 days...",
                "Items must be in original condition..."
            ],
            "ground_truth": "Returns accepted within 30 days with receipt"
        }
    ],
    "config": {
        "model_provider": "openai",
        "model_name": "gpt-4o-mini",
        "top_k": 5
    }
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()
print(result)
```

#### Response Format

```json
{
    "evaluation_id": "uuid",
    "status": "completed",
    "message": "Evaluation completed successfully. Processed 10 queries."
}
```

### 2. Get Evaluation Results

**Endpoint:** `GET /get-evaluation?id={evaluation_id}`

Retrieves detailed results for a specific evaluation.

#### Python Example

```python
import requests

evaluation_id = "your-evaluation-id"
url = f"https://invhposqpwwmllhbuobl.supabase.co/functions/v1/get-evaluation?id={evaluation_id}"

response = requests.get(url)
data = response.json()

print(f"Status: {data['evaluation']['status']}")
print(f"Context Precision: {data['evaluation']['metrics']['context_precision']}")
print(f"Faithfulness: {data['evaluation']['metrics']['faithfulness']}")
```

#### Response Format

```json
{
    "evaluation": {
        "id": "uuid",
        "name": "Product QA Evaluation",
        "status": "completed",
        "created_at": "2025-10-22T12:00:00Z",
        "completed_at": "2025-10-22T12:05:00Z",
        "total_queries": 10,
        "metrics": {
            "context_precision": 0.75,
            "context_recall": 0.82,
            "faithfulness": 0.88,
            "answer_relevancy": 0.85
        }
    },
    "results": [
        {
            "query_index": 0,
            "question": "What is the return policy?",
            "answer": "You can return items within 30 days...",
            "contexts": [...],
            "context_precision": 0.80,
            "context_recall": 0.85,
            "faithfulness": 0.90,
            "answer_relevancy": 0.88
        }
    ]
}
```

### 3. List Evaluations

**Endpoint:** `GET /list-evaluations?limit=10&offset=0&status=completed`

Lists all evaluations with pagination.

#### Python Example

```python
import requests

url = "https://invhposqpwwmllhbuobl.supabase.co/functions/v1/list-evaluations"
params = {
    "limit": 10,
    "offset": 0,
    "status": "completed"  # optional filter
}

response = requests.get(url, params=params)
data = response.json()

for evaluation in data['evaluations']:
    print(f"{evaluation['name']}: {evaluation['metrics']['faithfulness']}")
```

## RAGAS Metrics Explained

### Context Precision
Measures the relevance of retrieved contexts to the question. Higher scores indicate better retrieval quality.

### Context Recall
Measures coverage of relevant information in retrieved contexts. Higher scores mean less missing information.

### Faithfulness
Evaluates whether the answer is grounded in the provided context without hallucinations.

### Answer Relevancy
Assesses whether the answer actually addresses the question asked.

## Python SDK Example

```python
class RAGEvaluator:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def evaluate(self, name, dataset, config=None):
        """Run a RAG evaluation"""
        url = f"{self.base_url}/evaluate"
        payload = {
            "name": name,
            "dataset": dataset,
            "config": config or {}
        }
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    
    def get_results(self, evaluation_id):
        """Get evaluation results"""
        url = f"{self.base_url}/get-evaluation"
        response = requests.get(url, params={"id": evaluation_id})
        response.raise_for_status()
        return response.json()
    
    def list_evaluations(self, limit=10, offset=0, status=None):
        """List all evaluations"""
        url = f"{self.base_url}/list-evaluations"
        params = {"limit": limit, "offset": offset}
        if status:
            params["status"] = status
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

# Usage
evaluator = RAGEvaluator("https://invhposqpwwmllhbuobl.supabase.co/functions/v1")

# Run evaluation
result = evaluator.evaluate(
    name="My RAG Test",
    dataset=[
        {
            "question": "What is AI?",
            "answer": "AI is artificial intelligence...",
            "contexts": ["AI refers to...", "Machine learning is..."],
            "ground_truth": "Artificial intelligence"
        }
    ]
)

# Get results
evaluation = evaluator.get_results(result['evaluation_id'])
print(f"Faithfulness: {evaluation['evaluation']['metrics']['faithfulness']}")
```

## Data Format Standards

This API follows RAGAS/LangChain evaluation standards:

- **question**: The query/question asked
- **answer**: The generated answer from your RAG system
- **contexts**: List of retrieved context chunks (List[str])
- **ground_truth**: Expected/reference answer (optional)

## Error Handling

```python
try:
    result = evaluator.evaluate(name="Test", dataset=data)
except requests.exceptions.HTTPError as e:
    print(f"API Error: {e.response.json()}")
except Exception as e:
    print(f"Error: {str(e)}")
```

## Rate Limits

- No authentication required for public endpoints
- Recommended: Max 100 requests per minute
- Batch large evaluations when possible

## Advanced Integration

### Async Python Support

```python
import aiohttp
import asyncio

async def evaluate_async(dataset):
    async with aiohttp.ClientSession() as session:
        url = "https://invhposqpwwmllhbuobl.supabase.co/functions/v1/evaluate"
        async with session.post(url, json={
            "name": "Async Eval",
            "dataset": dataset
        }) as response:
            return await response.json()

# Run
result = asyncio.run(evaluate_async(my_dataset))
```

### Integration with RAGAS

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
import requests

# Get results from our API
response = requests.get(f"{base_url}/get-evaluation?id={eval_id}")
data = response.json()

# Compare with local RAGAS evaluation
# Use our API for storage and visualization
# Use local RAGAS for custom metrics
```

## Support

For issues or questions, refer to the dashboard UI at your deployment URL.
