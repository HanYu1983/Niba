# Semantic Kernel 專案：使用 Python 3.11（支援 semantic-kernel 0.9 / 1.x）
FROM python:3.11-slim

WORKDIR /app

# 先只複製依賴檔，利用層快取
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 專案程式由 docker-compose volume 掛載，不 COPY 進 image
# 預設保持執行以便進入容器下指令
CMD ["python", "-u", "-c", "import sys; print('Python', sys.version); print('Ready. Mount project at /app. Run: python hello_planner.py')"]
