import os
import openai

openai.api_type = "azure"
openai.api_base = "https://test-han-openai.openai.azure.com/"
openai.api_version = "2023-07-01-preview"
openai.api_key = ""

ask = "什麼服務可以幫你分析巨量資料。請回答日文。"

response = openai.ChatCompletion.create(
  engine="test-han-gpt35turbo",
  messages = [{"role":"system","content":"You are an AI assistant that helps people find information."},{"role":"user","content":f"已知信息：Azure HDInsight is a fully managed, open-source analytics service for processing big data workloads. It provides popular open-source frameworks, such as Apache Hadoop, Apache Spark, Apache Kafka, and Apache HBase. HDInsight supports various data sources, such as Azure Blob Storage, Azure Data Lake Storage, and Azure Cosmos DB. You can use HDInsight to analyze and process large volumes of data, build real-time analytics solutions, and develop machine learning models. It also integrates with other Azure services, such as Azure Synapse Analytics and Azure Machine Learning.\n    利用已知信息回答以下問題：{ask}"}],
  temperature=0.7,
  max_tokens=800,
  top_p=0.95,
  frequency_penalty=0,
  presence_penalty=0,
  stop=None)

print(response)