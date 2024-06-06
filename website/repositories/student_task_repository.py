from bson import ObjectId
from website import yenote_db


def strings_to_ids(s_t):
    s_t['_id'] = str(s_t['_id'])
    s_t['student_id'] = str(s_t['student_id'])
    s_t['task_id'] = str(s_t['task_id'])
    return s_t


class StudentTaskRepository:
    def __init__(self):
        self.db = yenote_db

    def connect_student_task(self, student_id, task_id):
        self.db.students_tasks.insert_one({
            "student_id": ObjectId(student_id),
            "task_id": ObjectId(task_id)
        })
        return True


