from flask import Blueprint, request, jsonify
from ..services.task_service import TaskService

task_blueprint = Blueprint('tasks', __name__)
task_service = TaskService()


@task_blueprint.route('/', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    return jsonify(task_service.create_task(data)), 201


@task_blueprint.route('/teacher/<teacher_id>', methods=['GET'])
def get_teacher_tasks(teacher_id):
    return jsonify(task_service.get_teacher_tasks(teacher_id)), 200


@task_blueprint.route('/<task_id>', methods=['GET'])
def get_task(task_id):
    task = task_service.get_task(task_id)
    if not task:
        return jsonify({"error": "task not found"}), 404
    return jsonify(task), 200