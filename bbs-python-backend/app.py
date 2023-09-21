from flask import Flask, jsonify, request


from transformers import DistilBertForSequenceClassification, DistilBertTokenizerFast
import torch

# Load the trained model
model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=3)
model.load_state_dict(torch.load('model.pt'))
model.eval()

# Load the tokenizer
tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')

# Write a predict function
def predict(tweet):
    # Prepare the tweet for the model
    inputs = tokenizer(tweet, padding='max_length', truncation=True, max_length=128, return_tensors='pt')

    # Get the model's predictions
    with torch.no_grad():
        outputs = model(**inputs)

    # Get the predicted class
    predicted_class = torch.argmax(outputs.logits, dim=1).item()
    print("thing: ", tweet, "   ", predicted_class)
    return predicted_class

# Test the function
tweet = "shut up"
print("Predicted class: ",tweet, "  ", predict(tweet))


app = Flask(__name__)

@app.route('/moderate', methods=['POST'])
def get_greeting():
    req = request.json.get('message')
    message = str(req)
    message_class = predict(message)
    return {'class': message_class}, 200

if __name__ == '__main__':
    app.run(debug=True)