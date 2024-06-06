from ..repositories.student_task_repository import StudentTaskRepository


class StudentTaskService:
    def __init__(self):
        self.student_task_repository = StudentTaskRepository()

    def connect_student_task(self, student_id, task_id):
        return self.student_task_repository.connect_student_task(student_id, task_id)
