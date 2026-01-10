from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory

# 1. 初始化模型 (ChatOllama 專門處理對話格式)
model = ChatOllama(
    model="llama3.2",
    base_url="http://ollama:11434"
)

# 2. 設計 Prompt 模板
# {chat_history} 是一個預留位置，LangChain 會自動把歷史紀錄填進去
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一個親切的 AI 助手。"),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
])

# 3. 建立基礎 Chain (LCEL 語法：提示詞 -> 模型)
chain = prompt | model

# 4. 建立記憶儲存器 (Session ID 對應 歷史紀錄)
# 這裡使用內存儲存，重啟程式後記憶會消失
store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

# 5. 將 Chain 封裝進「帶有記憶」的 Runnable 中
with_message_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
)

# 6. 開始測試對話
config = {"configurable": {"session_id": "user_123"}}

print("--- 第一次對話 ---")
response1 = with_message_history.invoke({"input": "你好，我叫阿強。"}, config=config)
print(f"AI: {response1.content}")

print("\n--- 第二次對話 (測試記憶) ---")
response2 = with_message_history.invoke({"input": "我剛剛說我叫什麼名字？"}, config=config)
print(f"AI: {response2.content}")