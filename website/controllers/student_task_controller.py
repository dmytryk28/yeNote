from flask import Blueprint, request, jsonify
from ..services.student_task_service import StudentTaskService

student_task_blueprint = Blueprint('students_tasks', __name__)
student_task_service = StudentTaskService()


@student_task_blueprint.route('/<student_id>/<task_id>', methods=['POST'])
def connect_student_task(student_id, task_id):
    if student_task_service.connect_student_task(student_id, task_id):
        return '', 201
    return jsonify({"error": "student and task not connected"}), 404

