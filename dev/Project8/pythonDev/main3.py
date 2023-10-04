from langchain.document_loaders import UnstructuredFileLoader, TextLoader
from langchain.text_splitter import CharacterTextSplitter, RecursiveCharacterTextSplitter
from langchain.embeddings import LlamaCppEmbeddings
import json 

# loader = UnstructuredFileLoader("sample.pdf")
# documents = loader.load()

# text_splitter = CharacterTextSplitter(chunk_size=800, chunk_overlap=0)
# texts = text_splitter.split_documents(documents)[:5]

loader = TextLoader("state_of_the_union.txt", encoding="utf-8")
documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=80)
texts = text_splitter.split_documents(documents)[:5]
print(texts)

llama_model_path = "llama-2-7b-chat.Q4_0.gguf"
embeddings = LlamaCppEmbeddings(model_path=llama_model_path)

def downsample(array):
    # 創建一個空的列表，用來儲存下採樣後的結果
    result = []
    # 遍歷原陣列的索引，每隔兩個取一個
    for i in range(0, len(array), 2):
        # 將原陣列中對應索引的元素加入結果列表
        result.append(array[i])
    # 返回結果列表
    return result

def to_dict(idx_and_item):
    idx, text = idx_and_item
    print("handle..."+str(idx)) 
    test_string_embedding = embeddings.embed_query(text.page_content)
    test_string_embedding = downsample(test_string_embedding)
    print(len(test_string_embedding))
    return {
        "id": str(idx),
        "title": "no",
        "content": text.page_content,
        "category": "no",
        "titleVector": [],
        "contentVector": test_string_embedding,
        "@search.action": "upload"
    }

values = list(map(to_dict, enumerate(texts)))
upload_docs = {
    "value": values
}

with open('upload_docs.json', 'w', encoding='utf8') as json_file:
    json.dump(upload_docs, json_file, ensure_ascii=False)