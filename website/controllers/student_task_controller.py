from flask import Blueprint, request, jsonify
from ..services.student_task_service import StudentTaskService

student_task_blueprint = Blueprint('students_tasks', __name__)
student_task_service = StudentTaskService()


# Route to connect a student with a task
@student_task_blueprint.route('/<student_id>/<task_id>', methods=['POST'])
def connect_student_task(student_id, task_id):
    if student_task_service.connect_student_task(student_id, task_id):
        return '', 201
    return jsonify({"error": "student and task not connected"}), 404


# Route to get the result of a student's task
@student_task_blueprint.route('/<student_id>/<task_id>', methods=['GET'])
def get_result(student_id, task_id):
    return jsonify(student_task_service.get_result(student_id, task_id)), 200


# Route to update the result of a student's task
@student_task_blueprint.route('/<student_id>/<task_id>', methods=['PUT'])
def update_result(student_id, task_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    res = student_task_service.update_result(student_id, task_id, data)
    if res:
        return '', 201
    return jsonify({"error": "Connection not found"}), 404


# Route to get tasks of a specific student
@student_task_blueprint.route('/student/<student_id>', methods=['GET'])
def get_student_tasks(student_id):
    return jsonify(student_task_service.get_student_tasks(student_id)), 200


# Route to get students who have a specific task
@student_task_blueprint.route('/task/<task_id>', methods=['GET'])
def get_students_with_task(task_id):
    return jsonify(student_task_service.get_students_with_task(task_id)), 200
