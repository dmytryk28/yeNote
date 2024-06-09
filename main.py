from website import create_app
from flask_cors import CORS

# Create an instance of the Flask application using the create_app function
app = create_app()

# Enable Cross-Origin Resource Sharing (CORS) for the Flask application
CORS(app)

if __name__ == '__main__':
    # Run the Flask application in debug mode
    app.run(debug=True)
