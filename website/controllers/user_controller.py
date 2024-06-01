from flask import Blueprint, request, jsonify
from ..services.user_service import UserService

user_blueprint = Blueprint('users', __name__)
user_service = UserService()


@user_blueprint.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    new_user = user_service.create_user(data)
    return jsonify(new_user), 201


@user_blueprint.route('/', methods=['GET'])
def get_users():
    users = user_service.get_users()
    return jsonify(users), 200


@user_blueprint.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    user = user_service.get_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200


@user_blueprint.route('/authenticate/', methods=['POST'])
def authenticate_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = user_service.get_user_by_email_and_password(email, password)
    if user:
        return jsonify(user), 200
    return jsonify({'error': 'Invalid email or password'}), 401


@user_blueprint.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    updated_user = user_service.update_user(user_id, data)
    if not updated_user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(updated_user), 200


@user_blueprint.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    if user_service.delete_user(user_id):
        return '', 204
    return jsonify({"error": "User not found"}), 404


@user_blueprint.route('/<user_id>/<int:category>/<int:point>', methods=['PUT'])
def update_statistics(user_id, category, point):
    updated_user = user_service.update_statistics(user_id, category, point)
    if not updated_user:
        return jsonify({"error": "User not found"}), 404
    return '', 200
