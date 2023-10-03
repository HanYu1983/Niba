from langchain.embeddings import LlamaCppEmbeddings

#Use Llama model for embedding
llama_model_path = "llama-2-7b-chat.Q4_0.gguf"
embeddings = LlamaCppEmbeddings(model_path=llama_model_path)

#If you want to specify the context window size for embedding, e.g. 2048
embeddings = LlamaCppEmbeddings(model_path=llama_model_path, n_ctx=2048)

#Get embedding representation
test_string = "This is a test document."
test_string_embedding = embeddings.embed_query(test_string)
print(test_string_embedding)