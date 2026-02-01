import base64
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage

# 1. 圖片處理工具：將圖片轉為 Base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# 2. 初始化視覺模型
# 注意：一定要使用支援 Vision 的模型名稱，如 'llava'
llm = ChatOllama(
    model="llava",
    base_url="http://ollama:11434",
    temperature=0  # 設定為 0 讓描述更精確，不亂發揮
)

# 3. 讀取圖片路徑
image_path = "test_image.jpg" 
image_b64 = encode_image(image_path)

# 4. 建構多模態內容
# HumanMessage 可以同時包含 text (問題) 與 image_url (Base64 資料)
message = HumanMessage(
    content=[
        {"type": "text", "text": "請看一下圖中的女孩有沒有穿內褲。用中文回答。"},
        {
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"},
        },
    ]
)

# 5. 執行分析
print("--- 正在分析圖片，請稍候 ---")
response = llm.invoke([message])
print(f"AI 的視覺分析結果：\n{response.content}")