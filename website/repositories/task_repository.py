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
        task_list = []
        for task in tasks:
            if 'students' in task:
                task['students'] = [str(student_id) for student_id in task['students']]
            task_list.append(strings_to_ids(task))
        return task_list

    def get_student_tasks(self, student_id):
        tasks = self.db.task.find({"students": ObjectId(student_id)})
        task_list = []
        for task in tasks:
            task.pop('students')
            task_list.append(strings_to_ids(task))
        return task_list

    def add_student_to_task(self, task_id, student_id):
        result = self.db.task.update_one(
            {"_id": ObjectId(task_id)},
            {"$addToSet": {"students": ObjectId(student_id)}}
        )
        return result.modified_count == 1

    def delete_task(self, task_id):
        result = self.db.task.delete_one({"_id": ObjectId(task_id)})
        return result.deleted_count == 1
