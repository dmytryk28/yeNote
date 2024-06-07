from bson import ObjectId
from pymongo.cursor import Cursor

from website import yenote_db


def oids_to_strings(data):
    if isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, dict):
        return {k: oids_to_strings(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [oids_to_strings(item) for item in data]
    elif isinstance(data, Cursor):
        return [oids_to_strings(item) for item in data]
    return data


class TaskRepository:
    def __init__(self):
        self.db = yenote_db

    def create_task(self, data):
        data['teacher_id'] = ObjectId(data['teacher_id'])
        return str(self.db.task.insert_one(data).inserted_id)

    def get_task(self, task_id):
        task = self.db.task.find_one({"_id": ObjectId(task_id)})
        if task:
            return oids_to_strings(task)

    def get_teacher_tasks(self, teacher_id):
        tasks = self.db.task.find({"teacher_id": ObjectId(teacher_id)})
        return oids_to_strings(tasks)

    def delete_task(self, task_id):
        result = self.db.task.delete_one({"_id": ObjectId(task_id)})
        return result.deleted_count == 1
