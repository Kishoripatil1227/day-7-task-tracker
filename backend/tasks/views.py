import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Task

def serialize(task):
    return {
        "id": task.id,
        "name": task.name,
        "description": task.description,
        "status": task.status,
        "created_date": task.created_date.isoformat(),
    }

@csrf_exempt
def task_list(request):
    if request.method == "GET":
        tasks = Task.objects.order_by("-created_date")
        return JsonResponse([serialize(t) for t in tasks], safe=False)

    if request.method == "POST":
        try:
            data = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        name = data.get("name", "").strip()
        if not name:
            return JsonResponse({"error": "Task name is required"}, status=400)

        task = Task.objects.create(
            name=name,
            description=data.get("description", "").strip(),
            status=data.get("status", "Pending"),
        )
        return JsonResponse(serialize(task), status=201)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def task_detail(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(serialize(task))

    if request.method in ["PUT", "PATCH"]:
        try:
            data = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        if "name" in data:
            task.name = data["name"].strip()
        if "description" in data:
            task.description = data["description"].strip()
        if "status" in data:
            task.status = data["status"]
        task.save()
        return JsonResponse(serialize(task))

    if request.method == "DELETE":
        task.delete()
        return JsonResponse({"message": "Task deleted successfully"})

    return JsonResponse({"error": "Method not allowed"}, status=405)
