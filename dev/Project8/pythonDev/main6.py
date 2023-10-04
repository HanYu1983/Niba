import os
from langchain.retrievers import AzureCognitiveSearchRetriever

os.environ["AZURE_COGNITIVE_SEARCH_SERVICE_NAME"] = "test-han-azure"
os.environ["AZURE_COGNITIVE_SEARCH_INDEX_NAME"] = "test1"
os.environ["AZURE_COGNITIVE_SEARCH_API_KEY"] = ""

retriever = AzureCognitiveSearchRetriever(content_key="content", top_k=10)
# print(retriever.get_relevant_documents("what is langchain")[0].page_content)


from langchain.chains import RetrievalQA
from langchain.llms import AzureOpenAI

os.environ["OPENAI_API_TYPE"] = "azure"
os.environ["OPENAI_API_VERSION"] = "2023-05-15"
os.environ["OPENAI_API_KEY"] = ""
os.environ["OPENAI_API_BASE"] = "https://test-han-openai.openai.azure.com/"

llm = AzureOpenAI(
  deployment_name = "test-han-gpt35turbo",
  model_name = "gpt-35-turbo"
)
question = "什麼服務可以提供像是custom domains, SSL certificates，請用中文回答"

chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)
print(chain.run(question))

print("="*20)
from langchain.chains import ConversationalRetrievalChain
chain2 = ConversationalRetrievalChain.from_llm(llm, retriever)
print(chain2.run({"question": question, "chat_history": []}))