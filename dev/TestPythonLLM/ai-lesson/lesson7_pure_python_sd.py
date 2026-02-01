import torch
from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler

model_path = "/models/Stable-diffusion/strangeformula_v1.safetensors"

# 1. 改用 XL Pipeline (如果這是 SDXL 模型)
# 如果模型是 SD 1.5，請用 StableDiffusionPipeline，並縮減提示詞
pipe = StableDiffusionXLPipeline.from_single_file(
    model_path,
    torch_dtype=torch.float16,
    variant="fp16",
    use_safetensors=True
).to("cuda")

# 2. 解決長提示詞問題 (簡單暴力法：縮減提示詞)
# 或是使用以下邏輯將其截斷
def generate_pure_python(prompt, neg_prompt):
    # SDXL 支持較長的提示詞，但仍有限制
    # 我們先手動過濾掉一些重複的詞以縮短長度
    print("🎨 正在生成...")
    
    image = pipe(
        prompt=prompt,
        negative_prompt=neg_prompt,
        num_inference_steps=20,
        guidance_scale=7.5,
        # SDXL 預設建議 1024x1024
        width=896,
        height=1152 
    ).images[0]
    
    image.save("lesson7_fix.png")

# 5. 執行測試
if __name__ == "__main__":
    p = """shibuya rin, cutegirl, goddess, lightgray eyes, round pretty face, japanese idol, mole under the eye, extremely blush, shibuya rin, long eyelashes, extremely beautiful face, blunt bangs, black hair, goth, high resolution, light skinned woman, soft pale white skin, (albino: skin: 1.3), pinkish white albino skin, pale skin, ultra pale skin, (oiled skin: 1.3), view your audience, (Huge breasts, breast expansion: 1.3), (Rich pink areola: 1.3), (Erect huge nipples: 1.3), (extremely long nipples: 1.3), (long hourglass figure: 1.3), (thick thighs: 1.3), (long legs: 1.3), (hyper bubble butt: 1.3), (dumptruck wide ass: 1.3), (colossal ass: 1.3), (hyper gigantic cock: 1.29), very long cock, POV titfuck, lying down on her back, standing, whole body view, on her back, arched back, absolutely massive cock between her boobs, (my meter long enormous long penis on her chest: 1.2), in bed"""
    n = """worst quality, low quality, bad anatomy, deformed, mutated hands, extra limbs, missing fingers, poorly drawn face, blurry, out of focus,
extra nipples, fused fingers, bad proportions, watermark, text, signature, logo, username,
censor bar, mosaic censoring, underwear, panties visible, bra, clothed pussy, covered genitals, no wind effect,
cartoon, anime style, illustration, 3d render, painting, sketch, lowres, jpeg artifacts,
overexposed, underexposed, plastic skin, doll face, childlike, loli, aged, old woman"""
    generate_pure_python(p, n)


# =============
