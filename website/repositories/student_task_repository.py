from bson import ObjectId
from website import yenote_db
from .task_repository import oids_to_strings


class StudentTaskRepository:
    def __init__(self):
        self.db = yenote_db

    def connect_student_task(self, student_id, task_id):
        self.db.students_tasks.insert_one({
            "student_id": ObjectId(student_id),
            "task_id": ObjectId(task_id)
        })
        return True

    def get_student_tasks(self, student_id):
        student_tasks = self.db.students_tasks.find({"student_id": ObjectId(student_id)})
        task_ids = [st['task_id'] for st in student_tasks]
        tasks = self.db.task.find({"_id": {"$in": task_ids}})
        return oids_to_strings(tasks)

    def get_students_with_task(self, task_id):
        student_tasks = self.db.students_tasks.find({"task_id": ObjectId(task_id)})
        student_ids = [st['student_id'] for st in student_tasks]
        students = self.db.user.find({"_id": {"$in": student_ids}})
        students = oids_to_strings(students)
        for student in students:
            student.pop('password')
        return students

    def update_result(self, student_id, task_id, data):
        self.db.students_tasks.update_one(
            {"student_id": ObjectId(student_id), "task_id": ObjectId(task_id)},
            {"$set": {"result": data}}
        )
        return True

    def get_result(self, student_id, task_id):
        result = self.db.students_tasks.find_one(
            {"student_id": ObjectId(student_id), "task_id": ObjectId(task_id)}
        )
        return oids_to_strings(result)

