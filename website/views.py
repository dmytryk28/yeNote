from flask import Blueprint, render_template

# Define the 'views' Blueprint
views = Blueprint('views', __name__)

# Define another Blueprint 'lala' (not used in this code snippet)
lala = Blueprint('lala', __name__)


# Define the route for the home page
@views.route('/')
def home():
    # Render the home page template
    return render_template("desktop_1.html")


# Define the route for the task page with a dynamic integer parameter
@views.route('/task/<int:number>')
def task(number):
    # Render the task page template with a task_id set to None
    return render_template("task.html", task_id=None)


# Define the route for the signup page
@views.route('/signup')
def registration():
    # Render the sign-up/in page template with sign_up set to True
    return render_template("sign_up_in.html", sign_up=True)


# Define the route for the signin page
@views.route('/signin')
def authentication():
    # Render the sign-up/in page template with sign_up set to False
    return render_template("sign_up_in.html", sign_up=False)


# Define the route for the profile page
@views.route('/profile')
def profile():
    # Render the profile page template
    return render_template("profile.html")


# Define the route for the create test page
@views.route('/create_test')
def create_test():
    # Render the create test page template with a task_id set to None
    return render_template("create_test.html", task_id=None)


# Define the route for the teacher's view of a specific test with a dynamic task_id parameter
@views.route('/teacher/<task_id>')
def show_test_teacher(task_id):
    # Render the create test page template with the given task_id
    return render_template("create_test.html", task_id=task_id)


# Define the route for the student's view of a specific test with a dynamic task_id parameter
@views.route('/student/<task_id>')
def show_test_student(task_id):
    # Render the task page template with the given task_id
    return render_template("task.html", task_id=task_id)
