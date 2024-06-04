from ..repositories.task_repository import TaskRepository


class TaskService:
    def __init__(self):
        self.task_repository = TaskRepository()

    def create_task(self, data):
        return self.task_repository.create_task(data)

    def get_teacher_tasks(self, teacher_id):
        return self.task_repository.get_teacher_tasks(teacher_id)

    def get_task(self, task_id):
        return self.task_repository.get_task(task_id)

    def add_student_to_task(self, task_id, student_id):
        return self.task_repository.add_student_to_task(task_id, student_id)

    def delete_task(self, task_id):
        return self.task_repository.delete_task(task_id)

    def get_student_tasks(self, student_id):
        return self.task_repository.get_student_tasks(student_id)
