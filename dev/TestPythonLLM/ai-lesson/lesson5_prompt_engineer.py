from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. 初始化 Ollama 模型
llm = ChatOllama(
    model="llama3.2",
    base_url="http://ollama:11434",
    temperature=0.7 # 稍微提高隨機性，增加創意
)

# 2. 定義系統提示詞 (這是靈魂所在)
# 我們告訴 Ollama 它是一個專家，並規定輸出的格式
system_template = """你是一位專業的 Stable Diffusion 提示詞工程師。
你的任務是將使用者的簡單中文描述，擴寫成高品質的英文繪圖指令。

請遵循以下規則：
1. 輸出必須全是英文。
2. 包含細節描述、藝術風格（如 Cyberpunk, Oil Painting）、燈光（如 Volumetric lighting）。
3. **只輸出指令本身**，不要有任何「Here is your prompt」之類的廢話。
"""

prompt_template = ChatPromptTemplate.from_messages([
    ("system", system_template),
    ("human", "請幫我優化這個描述：{user_input}")
])

# 3. 建立 LangChain (LCEL 語法)
# StrOutputParser 會確保我們拿到的直接是字串內容
chain = prompt_template | llm | StrOutputParser()

# 4. 測試擴寫功能
def get_better_prompt(text):
    print(f"原始輸入: {text}")
    better_prompt = chain.invoke({"user_input": text})
    print(f"優化後的指令: \n{better_prompt.strip()}")
    return better_prompt.strip()

# 執行
optimized_text = get_better_prompt("穿西裝的橘貓")