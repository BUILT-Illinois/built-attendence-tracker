import json
import os, sys

# Only needed if you're keeping deps in src/dependencies
sys.path.append(os.path.join(os.path.dirname(__file__), "dependencies"))

from routes.events import list_events, get_event, delete_event

def response(status, body):
    return {
        "statusCode": status,
        "headers": {"content-type": "application/json"},
        "body": json.dumps(body, default=str),
    }

def get_method_and_path(event):
    # REST API (v1)
    method = event.get("httpMethod")
    path = event.get("path")

    # HTTP API (v2)
    if not method:
        method = event.get("requestContext", {}).get("http", {}).get("method")
    if not path:
        path = event.get("rawPath")

    return (method or ""), (path or "")

def lambda_handler(event, context):
    method, path = get_method_and_path(event)

    # Optional: debug once if you're still getting 404s
    # print("method:", method, "path:", path)

    # Example routing for events
    if path == "/events" and method == "GET":
        status, body = list_events()
        return response(status, body)

    if path.startswith("/events/"):
        event_id = path.split("/events/")[1]
        if method == "GET":
            status, body = get_event(event_id)
            return response(status, body)
        if method == "DELETE":
            status, body = delete_event(event_id)
            return response(status, body)

    return response(404, {"error": "Not found"})
