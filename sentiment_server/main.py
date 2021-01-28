from flask import request, jsonify
from flask_api import FlaskAPI
from textblob_de import TextBlobDE as TextBlob
from flask_cors import CORS

app = FlaskAPI(__name__)
CORS(app)

@app.route('/sentiment', methods=["POST"])
def sentiment_analysis():
    """
    Forms a sentiment from given sentence
    :return: sentiment ranging from -1 (bad) to 1 (good) while 0 equals neutral.
    """
    data = request.get_json(force=True)
    print(data)
    sentence = data["sentence"]
    print(sentence)
    sentiment = TextBlob(sentence).sentiment
    return jsonify(sentiment)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=4000)
