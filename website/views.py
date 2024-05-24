from flask import Blueprint, render_template

views = Blueprint('views', __name__)


@views.route('/')
def home():
    return render_template("desktop_1.html")


@views.route('/task/<int:number>')
def task(number):
    return render_template("task.html", num=number)
