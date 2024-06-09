from bson import ObjectId
from website import yenote_db
from .task_repository import oids_to_strings
from datetime import datetime


class StudentTaskRepository:
    def __init__(self):
        self.db = yenote_db

    def connect_student_task(self, student_id, task_id):
        ids = {
            "student_id": ObjectId(student_id),
            "task_id": ObjectId(task_id)
        }
        existing_document = self.db.students_tasks.find_one(ids)
        if existing_document:
            return False
        self.db.students_tasks.insert_one(ids)
        return True

    def get_student_tasks(self, student_id):
        pipeline = [
            {
                "$match": {
                    "student_id": ObjectId(student_id)
                }
            },
            {
                "$lookup": {
                    "from": "task",
                    "localField": "task_id",
                    "foreignField": "_id",
                    "as": "task"
                }
            },
            {
                "$unwind": "$task"
            },
            {
                "$addFields": {
                    "task.sum_score": {
                        "$cond": {
                            "if": {"$gt": [{"$size": {"$ifNull": ["$result", []]}}, 0]},
                            "then": {
                                "$sum": {
                                    "$map": {
                                        "input": {"$ifNull": ["$result", []]},
                                        "as": "r",
                                        "in": {
                                            "$convert": {
                                                "input": "$$r.score",
                                                "to": "int",
                                                "onError": 0,
                                                "onNull": 0
                                            }
                                        }
                                    }
                                }
                            },
                            "else": "$$REMOVE"
                        }
                    }
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": {
                        "$mergeObjects": ["$task", {"sum_score": "$task.sum_score"}]
                    }
                }
            },
            {
                "$project": {
                    "result": 0
                }
            }
        ]

        student_tasks = list(self.db.students_tasks.aggregate(pipeline))
        return oids_to_strings(student_tasks)

    def get_students_with_task(self, task_id):
        pipeline = [
            {
                "$match": {
                    "task_id": ObjectId(task_id)
                }
            },
            {
                "$group": {
                    "_id": "$student_id",
                    "sum_score": {
                        "$sum": {
                            "$sum": {
                                "$map": {
                                    "input": {
                                        "$ifNull": ["$result", []]
                                    },
                                    "as": "r",
                                    "in": {
                                        "$convert": {
                                            "input": "$$r.score",
                                            "to": "int",
                                            "onError": 0,
                                            "onNull": 0
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "has_result": {
                        "$max": {
                            "$cond": {
                                "if": {"$gt": [{"$size": {"$ifNull": ["$result", []]}}, 0]},
                                "then": True,
                                "else": False
                            }
                        }
                    }
                }
            },
            {
                "$lookup": {
                    "from": "user",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "student"
                }
            },
            {
                "$unwind": "$student"
            },
            {
                "$addFields": {
                    "student.sum_score": {
                        "$cond": {
                            "if": "$has_result",
                            "then": "$sum_score",
                            "else": "$$REMOVE"
                        }
                    }
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": "$student"
                }
            },
            {
                "$project": {
                    "password": 0
                }
            }
        ]

        students = list(self.db.students_tasks.aggregate(pipeline))
        return oids_to_strings(students)

    def update_result(self, student_id, task_id, data):
        existing_document = self.db.students_tasks.find_one(
            {"student_id": ObjectId(student_id), "task_id": ObjectId(task_id)},
            {"date_time": 1}
        )
        if existing_document and "date_time" not in existing_document:
            self.db.students_tasks.update_one(
                {"student_id": ObjectId(student_id), "task_id": ObjectId(task_id)},
                {
                    "$set": {"date_time": datetime.now().strftime("%H:%M:%S %d.%m.%Y")}
                }
            )
        self.db.students_tasks.update_one(
            {"student_id": ObjectId(student_id), "task_id": ObjectId(task_id)},
            {
                "$set": {"result": data}
            }
        )
        return True

    def get_result(self, student_id, task_id):
        result = self.db.students_tasks.find_one(
            {"student_id": ObjectId(student_id), "task_id": ObjectId(task_id)}
        )
        return oids_to_strings(result)
