from flask import Flask, render_template, request
from better_profanity import profanity
import requests
import re

app = Flask(__name__)

#alternative url if the default URL not work please pick one from here to run the application
#API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"
#API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1"
#API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"


# API endpoint for the chatbot model
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
# Headers for authentication
headers = {"Authorization": "Bearer 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"}
# Questions asked to the user
questions = [
    "What is the title of the story?",
    "Who is the main character of the story?",
    "What type of story would you like (e.g., adventure, romantic, mystery)?"
]
# List to store user answers
answers = []
# Function to query the chatbot model
def query_model(prompt):
    payload = {"inputs": prompt, "options": {"max_new_tokens": 250,"temperature":100, "max_time":120 }}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()
# Function to generate a prompt for the chatbot
def generate_prompt(answers):
    title, character, story_type = answers['title'], answers['character'], answers['story_type']
    return f"Tell me the {story_type} story titled '{title}' about {character}."
# Function to check if a given text is a chatbot prompt
def is_chatbot_prompt(text):
    return re.match(r"Tell me the '[a-zA-Z\s]+' story titled '[a-zA-Z\s]+' about '[a-zA-Z\s]+'", text.strip())
# Flask route for handling chat interactions
@app.route("/", methods=["GET", "POST"])
def chat():
    global answers

    if request.method == "GET":
        answers = []
        return render_template("index.html", chat_history=[], questions=questions, current_question=questions[0])

    elif request.method == "POST":
        user_input = request.form["user_input"].strip().lower()
        chat_history = []

        chat_history_str = request.form.getlist("chat_history")
        for entry in chat_history_str:
            speaker, text = entry.split(",", 1)
            chat_history.append({"speaker": speaker, "text": text})
        # Check for profanity in user input
        if profanity.contains_profanity(user_input):
            answers = []
            return render_template("index.html", chat_history=[], questions=questions, swear_word="We don't accept inappropriate language. Conversation reset. Please input again.")
        # Handle quit command
        if user_input == 'quit':
            answers = []
            return render_template("index.html", chat_history=[], questions=questions, quit_msg="Goodbye!")
         # Handle continue command
        if user_input == 'continue':
            if len(answers) < len(questions):
                error_message = "Can't generate the story without providing more details. Please answer all questions."
                return render_template("index.html", chat_history=chat_history, questions=questions, error_message=error_message)

            chat_history.append({"speaker": "user", "text": user_input})
            if len(chat_history) >= 2:
                response = query_model(chat_history[-2]["text"])
                generated_text = response[0]["generated_text"] if response else "I'm sorry, I couldn't generate a response."
                generated_text = generated_text.replace(chat_history[-2]["text"], "").strip()
                chat_history.append({"speaker": "chatbot", "text": generated_text})
            return render_template("index.html", chat_history=chat_history, questions=questions)
        # when all the question have been answer then only allow the user type quit or continue to block other input.
        if len(answers) < len(questions):
            answers.append(user_input)
            if len(answers) < len(questions):
                current_question = questions[len(answers)]
                chat_history.append({"speaker": "user", "text": user_input})
                chat_history.append({"speaker": "chatbot", "text": current_question})
            else:
                prompt = generate_prompt({'title': answers[0], 'character': answers[1], 'story_type': answers[2]})
                response = query_model(prompt)
                generated_text = response[0]["generated_text"] if response else "I'm sorry, I couldn't generate a response."
                generated_text = generated_text.replace(prompt, "").strip()
                chat_history.append({"speaker": "user", "text": user_input})
                chat_history.append({"speaker": "chatbot", "text": generated_text})
        else:
            #If the user input invalid input show this error message
            if not is_chatbot_prompt(chat_history[-1]["text"]):
                if user_input.lower() == 'continue':
                    chat_history.append({"speaker": "user", "text": user_input})
                else:
                    return render_template("index.html", chat_history=chat_history, questions=questions, error_message="Invalid input. If you want to start a new chat, Please type 'quit' into the chatbot or type 'continue' to generate the next part of story.")


        chat_history_display = [entry for entry in chat_history if entry['speaker'] == 'user' or not is_chatbot_prompt(entry['text'])]

        return render_template("index.html", chat_history=chat_history_display, questions=questions)

# Run the application
if __name__ == "__main__":
    app.run(debug=True)
