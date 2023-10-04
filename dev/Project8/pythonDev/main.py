from llama_cpp import Llama

def generate_text(model, message):
    prompt = f"[INST] {message.strip()} [/INST]"
    output = model(prompt)
    print(output)

if __name__ == "__main__":
    model = Llama(model_path="llama-2-7b-chat.Q4_0.gguf")
    generate_text(model, """
    已知信息：張三覺得台灣的食物太貴了又難吃
    利用已知信息回答以下問題：張三對台灣的印象是什麼？請用中文回答。
""")
    generate_text(model, """
    已知信息：Azure HDInsight is a fully managed, open-source analytics service for processing big data workloads. It provides popular open-source frameworks, such as Apache Hadoop, Apache Spark, Apache Kafka, and Apache HBase. HDInsight supports various data sources, such as Azure Blob Storage, Azure Data Lake Storage, and Azure Cosmos DB. You can use HDInsight to analyze and process large volumes of data, build real-time analytics solutions, and develop machine learning models. It also integrates with other Azure services, such as Azure Synapse Analytics and Azure Machine Learning.
    利用已知信息回答以下問題：什麼服務可以幫你分析巨量資料
    """)

# {'id': 'cmpl-c8a91cd3-db27-4254-a9f7-db904c332c5c', 'object': 'text_completion', 'created': 1696311538, 'model': 'llama-2-7b-chat.Q4_0.gguf', 'choices': [{'text': "  Subject: Your Recent Statistics - Well Done! 😊\nDear [司机的名字],\nI hope this email finds you well. I wanted to share some of the latest statistics on your performance with our company. 📊\nFirstly, great job on your conversation rate of 0.6! This is a wonderful improvement from last month's rate, and it's clear that you're making an effort to connect with our customers. Keep up the good work! 👍\nAdditionally, I noticed that your receive rate has also increased to", 'index': 0, 'logprobs': None, 'finish_reason': 'length'}], 'usage': {'prompt_tokens': 166, 'completion_tokens': 128, 'total_tokens': 294}}
# {'id': 'cmpl-39b3b74a-a27b-47cf-ace7-7712bf45ac0e', 'object': 'text_completion', 'created': 1696312967, 'model': 'llama-2-7b-chat.Q4_0.gguf', 'choices': [{'text': "  Hello there, 😊\nWow, your statistics are impressive! 🤩 Your meeting rate of 0.1 is way above the average, and your receipt rate of 0.5 is fantastic! 🎉 It's great to see you're doing so well in your work. Keep up the good work! 💪\nAnd hey, I've got a funny joke for you: Why did the chicken cross the playground? To get to the other slide! 😂 Hope that made you smile", 'index': 0, 'logprobs': None, 'finish_reason': 'length'}], 'usage': {'prompt_tokens': 188, 'completion_tokens': 128, 'total_tokens': 316}}