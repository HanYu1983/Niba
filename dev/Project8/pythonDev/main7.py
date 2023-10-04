import requests
import json

AZURE_COGNITIVE_SEARCH_SERVICE_NAME = "test-han-azure"
AZURE_COGNITIVE_SEARCH_INDEX_NAME = "test2"
AZURE_COGNITIVE_SEARCH_API_KEY = ""

OPENAI_API_TYPE = "azure"
OPENAI_API_VERSION = "2023-05-15"
OPENAI_API_KEY = ""
OPENAI_API_BASE = "https://test-han-openai.openai.azure.com/"
openai_deployment_name = "test-han-ada"

def getEmbeddings(texts: list[str]) -> list[list[float]]:
    url = f'{OPENAI_API_BASE}/openai/deployments/{openai_deployment_name}/embeddings?api-version={OPENAI_API_VERSION}'
    headers = {
        "api-key": OPENAI_API_KEY,
        "Content-Type": "application/json",
    }
    data = json.dumps({
        "input": texts,
    })
    print(url)
    # https://blog.gtwang.org/programming/python-requests-module-tutorial/
    r = requests.post(url, data=data, headers=headers)
    print(r.status_code)
    print(r.text)
    jsonObj = json.loads(r.text)
    if jsonObj["data"] is None:
        raise ValueError("must has data")
    # generator (lazy)
    embeddings = (data["embedding"] for data in jsonObj["data"])
    # evaluate
    embeddings = list(embeddings)
    return embeddings


def generateUploadDoc(filepath) -> None:
    from langchain.document_loaders import UnstructuredFileLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    loader = UnstructuredFileLoader(filepath)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)

    page_contents = [text.page_content for text in texts]
    pageSize = 16
    page_contents_partition = [page_contents[i:i + pageSize]
                               for i in range(0, len(page_contents), pageSize)]

    def writeDocPageContentsPartitionOne(i: int, page_contents: list[str]) -> None:
        embeddings = getEmbeddings(page_contents)

        def toDict(info: tuple[int, str, list[float]]):
            idx, text, embeddings = info
            return {
                "id": str(idx),
                "title": "no",
                "content": text,
                "category": "no",
                "titleVector": [],
                "contentVector": embeddings,
                "@search.action": "upload"
            }

        values = zip(range(i * pageSize, i*pageSize +
                     len(page_contents)), page_contents, embeddings)
        values = (toDict(value) for value in values)
        values = list(values)
        upload_docs = {
            "value": values
        }
        with open(f'upload_docs_{i}.json', 'w', encoding='utf8') as json_file:
            json.dump(upload_docs, json_file, ensure_ascii=False)

    for i, page_contents_parition_one in zip(range(len(page_contents_partition)), page_contents_partition):
        writeDocPageContentsPartitionOne(i, page_contents_parition_one)


def generateSearchDoc(searchText:str) -> None:
    embedding = getEmbeddings([searchText])[0]
    value = {
        "select": "title, content, category",
        "vector": {
            "value": embedding,
            "fields": "contentVector",
            "k": 5
        }
    }
    with open('search_body.json', 'w', encoding='utf8') as json_file:
        json.dump(value, json_file, ensure_ascii=False)
    pass

def runConversaion(question)->None:
    import os
    from langchain.retrievers import AzureCognitiveSearchRetriever

    os.environ["AZURE_COGNITIVE_SEARCH_SERVICE_NAME"] = AZURE_COGNITIVE_SEARCH_SERVICE_NAME
    os.environ["AZURE_COGNITIVE_SEARCH_INDEX_NAME"] = AZURE_COGNITIVE_SEARCH_INDEX_NAME
    os.environ["AZURE_COGNITIVE_SEARCH_API_KEY"] = AZURE_COGNITIVE_SEARCH_API_KEY

    retriever = AzureCognitiveSearchRetriever(content_key="content", top_k=10)

    from langchain.chains import RetrievalQA
    from langchain.llms import AzureOpenAI

    os.environ["OPENAI_API_TYPE"] = OPENAI_API_TYPE
    os.environ["OPENAI_API_VERSION"] = OPENAI_API_VERSION
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
    os.environ["OPENAI_API_BASE"] = OPENAI_API_BASE

    llm = AzureOpenAI(
        deployment_name = "test-han-gpt35turbo",
        model_name = "gpt-35-turbo"
    )

    chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)
    print(chain.run(question))

    print("="*20)
    from langchain.chains import ConversationalRetrievalChain
    chain2 = ConversationalRetrievalChain.from_llm(llm, retriever)
    print(chain2.run({"question": question, "chat_history": []}))
    


# getEmbeddings(["wow!", "gen"])
# generateUploadDoc("Fitad交接第一版.pdf")
# generateSearchDoc("廣告平台有哪些")
runConversaion("DAC TOTO專案更新的第7步")
