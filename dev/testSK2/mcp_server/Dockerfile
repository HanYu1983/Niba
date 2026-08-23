FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py .

# 預設資料目錄，可掛載 volume
ENV DATA_DIR=/data
ENV MCP_SSE=1
ENV MCP_PORT=8000

EXPOSE 8000

CMD ["python", "server.py"]
