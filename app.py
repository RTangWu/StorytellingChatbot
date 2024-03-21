from flask import Flask, render_template, request
from better_profanity import profanity
import requests
import re
import random

app = Flask(__name__)

API_URL = "https://api-inference.huggingface.co/models/openchat/openchat-3.5-0106"
headers = {"Authorization": "Bearer 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"}

def query_model(prompt):
    payload = {"inputs": prompt}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


def generate_prompt(user_input):
    prompt_templates = [
        "Tell me a {} story about {} and {}.",
        "I want to hear a {} story about {} and {}.",
        "Can you tell me about a {} story related to {} and {}?"
    ]
    
    # Extract topic, character name, and story type from user input
    topic_match = re.match(r'\b(?:tell me a|story about|related to)\s+(\w+)\b', user_input.lower())
    character_match = re.match(r'\b(?:tell me a|story about|related to)\s+(\w+)\s+and\s+(\w+)\b', user_input.lower())
    story_type_match = re.match(r'\b(?:tell me a|story about|related to)\s+(\w+)\s+(adventure|romantic|mystery)\b', user_input.lower())
    
    if story_type_match:
        topic = story_type_match.group(1)
        story_type = story_type_match.group(2)
        prompt = random.choice(prompt_templates).format(story_type, topic, "someone")
    elif character_match:
        topic = character_match.group(1)
        character = character_match.group(2)
        prompt = f"Tell me a story about {topic} and {character}."
    elif topic_match:
        topic = topic_match.group(1)
        prompt = random.choice(prompt_templates).format("interesting", topic, "someone")
    else:
        prompt = "Create me a story about " + user_input + "."
    
    return prompt



@app.route("/", methods=["GET", "POST"])
def chat():
    if request.method == "GET":
        return render_template("index.html", chat_history=[])
    elif request.method == "POST":
        user_input = request.form["user_input"].strip().lower()


        if profanity.contains_profanity(user_input):
            return render_template("index.html", chat_history=[], error_message="We don't accept inappropriate language. Please input again.")

        chat_history = []


        chat_history_str = request.form.getlist("chat_history")
        for entry in chat_history_str:
            speaker, text = entry.split(",", 1)
            chat_history.append({"speaker": speaker, "text": text})

        if user_input == 'quit':
            return render_template("index.html", quit_msg="Chatbot: Goodbye!")

        chat_history.append({"speaker": "user", "text": user_input})  

        if user_input == 'continue':
            if len(chat_history) >= 2:  
                response = query_model(chat_history[-2]["text"])  
                generated_text = response[0]["generated_text"] if response else "I'm sorry, I couldn't generate a response."
                next_part = generated_text[len(chat_history[-2]["text"]):].strip()
                if next_part:
                    chat_history.append({"speaker": "chatbot", "text": next_part})
                return render_template("index.html", chat_history=chat_history)
            else:
                return render_template("index.html", chat_history=[{"speaker": "chatbot", "text": "There's no story to continue. Please start a story first."}])

        else:

            prompt = generate_prompt(user_input)
            response = query_model(prompt)
            generated_text = response[0]["generated_text"] if response else "I'm sorry, I couldn't generate a response."
            if not user_input.startswith("tell me a story about "):
                generated_text = generated_text[len(prompt):].strip() 
            chat_history.append({"speaker": "chatbot", "text": generated_text})
            return render_template("index.html", chat_history=chat_history)

if __name__ == "__main__":
    app.run(debug=True)