import requests
import base64
import json

# SD 服務在 Docker 網路中的位址
SD_URL = "http://stable-diffusion:7860/sdapi/v1/txt2img"

def generate_image(prompt_text):
    payload = {
        "prompt": prompt_text,
        "negative_prompt": "easynegative, low quality, bad hands",
        "steps": 25,
        "width": 512,
        "height": 512,
        "cfg_scale": 7
    }

    print(f"正在向 SD 發送繪圖請求: {prompt_text}")
    response = requests.post(SD_URL, json=payload)
    
    if response.status_code == 200:
        r = response.json()
        # SD 回傳的是一組 Base64 列表
        image_data = r['images'][0]
        
        with open("lesson4_output.png", "wb") as f:
            f.write(base64.b64decode(image_data))
        print("圖片生成成功！請查看 lesson4_output.png")
    else:
        print(f"失敗：{response.text}")

# 測試畫一張圖
generate_image("A futuristic cat wearing a spacesuit, cyberpunk style, high detail")