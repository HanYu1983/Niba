from langchain.embeddings import LlamaCppEmbeddings

#Use Llama model for embedding
llama_model_path = "llama-2-7b-chat.Q4_0.gguf"
# embeddings = LlamaCppEmbeddings(model_path=llama_model_path)

#If you want to specify the context window size for embedding, e.g. 2048
embeddings = LlamaCppEmbeddings(model_path=llama_model_path, n_ctx=512)

#Get embedding representation
test_string = "what did the president say about Russia"
test_string_embedding = embeddings.embed_query(test_string)

# https://python.langchain.com/docs/integrations/text_embedding/llamacpp
print(len(test_string_embedding))

def downsample(array):
    # 創建一個空的列表，用來儲存下採樣後的結果
    result = []
    # 遍歷原陣列的索引，每隔兩個取一個
    for i in range(0, len(array), 2):
        # 將原陣列中對應索引的元素加入結果列表
        result.append(array[i])
    # 返回結果列表
    return result

search = {
    "select": "title, content, category",
    "vector": {
        "value": downsample(test_string_embedding),
        "fields": "contentVector",
        "k": 5
    }
}

import json 
with open('search_body.json', 'w', encoding='utf8') as json_file:
    json.dump(search, json_file, ensure_ascii=False)
