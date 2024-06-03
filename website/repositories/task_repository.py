from bson import ObjectId
from website import yenote_db


def strings_to_ids(task):
    task['_id'] = str(task['_id'])
    task['teacher_id'] = str(task['teacher_id'])
    return task


class TaskRepository:
    def __init__(self):
        self.db = yenote_db

    def create_task(self, data):
        data['teacher_id'] = ObjectId(data['teacher_id'])
        return str(self.db.task.insert_one(data).inserted_id)

    def get_task(self, task_id):
        task = self.db.user.find_one({"_id": ObjectId(task_id)})
        if task:
            return strings_to_ids(task)

    def get_teacher_tasks(self, teacher_id):
        tasks = self.db.task.find({"teacher_id": ObjectId(teacher_id)})
        return [strings_to_ids(task) for task in tasks]
