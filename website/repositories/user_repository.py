import bcrypt
from bson import ObjectId
from website import yenote_db


class UserRepository:
    def __init__(self):
        self.db = yenote_db

    def create_user(self, data):
        user_id = self.db.user.insert_one(data).inserted_id
        new_user = self.db.user.find_one({"_id": user_id})
        new_user['_id'] = str(new_user['_id'])
        new_user.pop('password')
        return new_user

    def get_users(self):
        users = list(self.db.user.find())
        for user in users:
            user['_id'] = str(user['_id'])
            user.pop('password')
        return users

    def get_user(self, user_id):
        user = self.db.user.find_one({"_id": ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
            user.pop('password')
        print(user)
        return user

    def get_user_by_email_and_password(self, email, password):
        user = self.db.user.find_one({"email": email})
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            user['_id'] = str(user['_id'])
            user.pop('password')
            return user

    def update_user(self, user_id, data):
        result = self.db.user.update_one({"_id": ObjectId(user_id)}, {"$set": data})
        if result.matched_count == 0:
            return None
        updated_user = self.db.user.find_one({"_id": ObjectId(user_id)})
        updated_user['_id'] = str(updated_user['_id'])
        updated_user.pop('password')
        return updated_user

    def delete_user(self, user_id):
        result = self.db.user.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    def update_statistics(self, user_id, category, point):
        user = self.db.user.find_one({"_id": ObjectId(user_id)})
        if not user:
            return False
        category = str(category)
        if 'statistics' not in user:
            user['statistics'] = {}
        if category not in user['statistics']:
            user['statistics'][category] = [0, 0]
        user['statistics'][category][0] += 1
        user['statistics'][category][1] += point
        self.db.user.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"statistics": user['statistics']}}
        )
        return True
