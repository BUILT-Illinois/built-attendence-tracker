import json
import os, sys

# Only needed if you're keeping deps in src/dependencies
sys.path.append(os.path.join(os.path.dirname(__file__), "dependencies"))

from routes.events import list_events, get_event, delete_event, create_event, update_event
from routes.user import list_users, get_user, delete_user, create_user, update_user
from routes.checkins import create_checkin

def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "content-type": "application/json",
            "access-control-allow-origin": "http://localhost:3000",
            "access-control-allow-headers": "content-type,authorization",
            "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
        },
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

def parse_json_body(event):
    body = event.get("body")
    if not body:
        return {}
    if event.get("isBase64Encoded"):
        import base64
        body = base64.b64decode(body).decode("utf-8")
    return json.loads(body)

def lambda_handler(event, context):
    method, path = get_method_and_path(event)

    if method == "OPTIONS":
        return response(200, {"ok": True})

    # Routing for events
    if path == "/events" and method == "GET":
        status, body = list_events()
        return response(status, body)
    
    if path == "/events" and method == "POST":
        try:
            data = parse_json_body(event)
            status, body = create_event(data)
            return response(status, body)
        except Exception as e:
            return response(500, {"error": str(e)})

    
    if path == "/users" and method == "GET":
        status, body = list_users()
        return response(status, body)
    
    if path == "/users/login" and method == "POST":
        data = parse_json_body(event)
        status, body = create_user(data)
        return response(status, body)
    
    if path == '/checkins' and method == "POST":
        data = parse_json_body(event)
        status, body = create_checkin(data)
        return response(status, body)

    if path.startswith("/events/"):
        event_id = path.split("/events/")[1]
        if method == "GET":
            status, body = get_event(event_id)
            return response(status, body)
        if method == "DELETE":
            status, body = delete_event(event_id)
            return response(status, body)
        if method == "PATCH":
            data = parse_json_body(event)
            status, body = update_event(event_id, data)
            return response(status, body)
    
    if path.startswith("/users/"):
        user_id = path.split("/users/")[1]
        if method == "GET":
            status, body = get_user(user_id)
            return response(status, body)
        if method == "DELETE":
            status, body = delete_user(user_id)
            return response(status, body)
        if method == "PATCH":
            data = parse_json_body(event)
            status, body = update_user(user_id, data)
            return response(status, body)
            

    return response(404, {"error": "Not found"})
