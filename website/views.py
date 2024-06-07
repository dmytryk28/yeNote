from flask import Blueprint, render_template

views = Blueprint('views', __name__)


@views.route('/')
def home():
    return render_template("desktop_1.html")


@views.route('/task/<int:number>')
def task(number):
    return render_template("task.html", task_id=None)


@views.route('/signup')
def registration():
    return render_template("sign_up_in.html", sign_up=True)


@views.route('/signin')
def authentication():
    return render_template("sign_up_in.html", sign_up=False)


@views.route('/profile')
def profile():
    return render_template("profile.html")


@views.route('/create_test')
def create_test():
    return render_template("create_test.html", task_id=None)


@views.route('/teacher/<task_id>')
def show_test_teacher(task_id):
    return render_template("create_test.html", task_id=task_id)


@views.route('/student/<task_id>')
def show_test_student(task_id):
    return render_template("task.html", task_id=task_id)
