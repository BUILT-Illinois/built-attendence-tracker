import json
from routes.events import list_events, get_event, delete_event

def response(status, body):
    return {
        "statusCode": status,
        "headers": {"content-type": "application/json"},
        "body": json.dumps(body, default=str),
    }

def lambda_handler(event, context):
    path = event.get("path", "")
    method = event.get("httpMethod", "")

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
