from langchain_ollama import OllamaLLM

# 注意：因為在 Docker 網路中，host 要填寫服務名稱 "ollama"
llm = OllamaLLM(model="llama3.2", base_url="http://ollama:11434")

response = llm.invoke("請自我介紹，並確認你是否運行在 Docker 中？")
print(f"AI 回覆：\n{response}")