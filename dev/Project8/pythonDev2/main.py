# 不要運行以下的代碼，不然下載檔案後會把C碟灌爆
# import torch
# from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer

# model_path = "daryl149/llama-2-7b-chat-hf"
# model = AutoModelForCausalLM.from_pretrained(model_path).cuda()
# tokenizer = AutoTokenizer.from_pretrained(model_path, use_fast = False)
# streamer = TextStreamer(tokenizer, skip_prompt = True, skip_special_tokens = True)
# prompt = "How to learn AI effectively?"
# generated_ids = model.generate(tokenizer(prompt, return_tensors='pt').input_ids.cuda(), max_new_tokens=100, streamer=streamer)
# print(generated_ids)