import requests

API_URL = "https://api-inference.huggingface.co/models/openchat/openchat-3.5-0106"
headers = {"Authorization": "Bearer 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"}

# Function to query the Hugging Face model
def query_model(prompt):
    payload = {"inputs": prompt}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

# Function to get user input
def get_user_input():
    return input("You: ").strip()

# Main function to run the chatbot
def main():
    print("Welcome to the storytelling Chatbot!")
    print("You can engage in a storytelling conversation.")
    print("Type 'quit' to exit.")

    conversation_history = "" 
    
    while True:
        user_input = get_user_input().lower()
        
        if user_input == 'quit':
            print("Goodbye!")
            break
        elif user_input == 'continue':
            if conversation_history:
                response = query_model(conversation_history)
                generated_text = response[0]["generated_text"] if response else "I'm sorry, I couldn't generate a response."
                next_part = generated_text[len(conversation_history):].strip()  # Extract the next part of the story
                conversation_history += next_part + " "  # Update conversation history with the next part of the story
                print("Chatbot:", next_part)
            else:
                print("Chatbot: There's no story to continue. Please start a story first.")
        else:
            # Prepend a storytelling prompt to the user input
            prompt = "Tell me a story about " + user_input + "."
            response = query_model(prompt)
            generated_text = response[0]["generated_text"] if response else "I'm sorry, I couldn't generate a response."
            conversation_history += user_input + " " + generated_text + " "
            print("Chatbot:", generated_text)
                
if __name__ == "__main__":
    main()

