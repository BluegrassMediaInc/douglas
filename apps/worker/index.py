# apps/worker/index.py
import json
from typing import Dict, Any

def handler(request) -> Dict[str, Any]:
    """
    Vercel Python (3.11) Background Function entrypoint.
    Runs on every cron hit or manual /worker HTTP call.
    """

    # TODO: pull one pending job from Postgres, generate PDF, mark done
    result = {"status": "noop", "msg": "worker is alive 🔄"}

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(result),
    }
