import base64
import requests
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

# --- 配置區 ---
BASE_URL = "http://ollama:11434"
SD_URL = "http://stable-diffusion:7860/sdapi/v1/txt2img"

# 1. 初始化模型
vision_model = ChatOllama(model="llava", base_url=BASE_URL)
logic_model = ChatOllama(model="llama3.2", base_url=BASE_URL)

def encode_image(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')

# --- 步驟 1：視覺分析 ---
def analyze_image(img_path):
    print("👀 正在辨識原圖...")
    b64 = encode_image(img_path)
    msg = HumanMessage(content=[
        {"type": "text", "text": "請用英文簡短描述這張圖片的主體與構圖。"},
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}}
    ])
    res = vision_model.invoke([msg])
    return res.content

# --- 步驟 2：提示詞風格化 ---
def stylize_prompt(description, target_style):
    print(f"🧠 正在將描述轉化為 {target_style} 風格...")
    template = ChatPromptTemplate.from_template(
        "根據這個描述：{desc}，撰寫一段高品質的 Stable Diffusion 英文指令。"
        "要求風格為：{style}。只輸出指令，不要有廢話。"
    )
    chain = template | logic_model | StrOutputParser()
    return chain.invoke({"desc": description, "style": target_style})

# --- 步驟 3：呼叫 SD 生圖 ---
def draw_now(final_prompt):
    print("🎨 正在生成新圖片...")
    payload = {"prompt": final_prompt, "steps": 25, "width": 512, "height": 512}
    response = requests.post(SD_URL, json=payload)
    img_data = response.json()['images'][0]
    with open("final_transformation.png", "wb") as f:
        f.write(base64.b64decode(image_data))
    print("✅ 任務完成！結果儲存於 final_transformation.png")

# --- 執行工作流 ---
if __name__ == "__main__":
    # 放入你的測試圖片路徑
    raw_desc = analyze_image("test_image.jpg")
    final_p = stylize_prompt(raw_desc, "Cyberpunk, neon lights, hyper-realistic")
    draw_now(final_p)