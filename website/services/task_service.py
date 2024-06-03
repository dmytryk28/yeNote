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
