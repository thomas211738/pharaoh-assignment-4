from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from lsa import lsa_model

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('query', '')
    top_documents = lsa_model.get_top_documents(query)
    return jsonify(top_documents)

if __name__ == '__main__':
    app.run(debug=True)
