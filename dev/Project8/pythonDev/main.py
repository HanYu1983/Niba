from llama_cpp import Llama

def generate_text(model, message):
    prompt = f"[INST] {message.strip()} [/INST]"
    output = model(prompt)
    print(output)

if __name__ == "__main__":
    model = Llama(model_path="llama-2-7b-chat.Q4_0.gguf")
    generate_text(model, "hello")