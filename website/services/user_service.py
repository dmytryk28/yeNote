from ..repositories.user_repository import UserRepository
import bcrypt


class UserService:
    def __init__(self):
        self.user_repository = UserRepository()

    def create_user(self, data):
        data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        return self.user_repository.create_user(data)

    def get_users(self):
        return self.user_repository.get_users()

    def get_user(self, user_id):
        return self.user_repository.get_user(user_id)

    def get_user_by_email_and_password(self, email, password):
        return self.user_repository.get_user_by_email_and_password(email, password)

    def update_user(self, user_id, data):
        if 'password' in data:
            data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        return self.user_repository.update_user(user_id, data)

    def delete_user(self, user_id):
        return self.user_repository.delete_user(user_id)

    def update_statistics(self, user_id, category, point):
        return self.user_repository.update_statistics(user_id, category, point)
