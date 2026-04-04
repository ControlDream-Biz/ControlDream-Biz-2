#!/usr/bin/env python3
import requests
from PIL import Image
from io import BytesIO
import os

# 场景图片URL列表
scenes = [
    ("building-clean.jpg", "https://coze-coding-project.tos.coze.site/coze_storage_7624948934653509659/image/generate_image_7b80deb5-d9a3-496a-8f16-484cbf054daf.jpeg?sign=1806866705-caa975c901-0-2f1c6191fafa48f3c33b85756b3efd3b1c72e32f5124ddf9de8ce18da135b3de"),
    ("reception-clean.jpg", "https://coze-coding-project.tos.coze.site/coze_storage_7624948934653509659/image/generate_image_9d6ea3f7-d797-4cc8-9976-cbba1a17cf82.jpeg?sign=1806866704-c591cbea1d-0-56688aee34523964eb9d35ef77cd04bc0ae87039b4372c532ec56bc4fd79dda4"),
    ("game-dev-clean.jpg", "https://coze-coding-project.tos.coze.site/coze_storage_7624948934653509659/image/generate_image_749d9517-d005-4147-babd-47b53577133e.jpeg?sign=1806866704-5bb3901df8-0-374e63b3060c8bf06c8526f55b9fd834ff6daa2c2141eeb252d85d12585ccbcd"),
    ("software-dev-clean.jpg", "https://coze-coding-project.tos.coze.site/coze_storage_7624948934653509659/image/generate_image_d0adcac2-7e74-4c78-9303-5a3e08a3084e.jpeg?sign=1806866704-78058f4238-0-a61c82a4cf6c7df2bffe3157b6bea23d6d4080f6a40320067930a3a9d1e3487a"),
    ("hardware-lab-clean.jpg", "https://coze-coding-project.tos.coze.site/coze_storage_7624948934653509659/image/generate_image_1d093ead-c573-4e19-bfd9-d5ecdfd375d9.jpeg?sign=1806866703-cc6dd234a5-0-755d79590b71be51d942c6b9dbdacda09dae75902e6706aa7e31b851efb3e799")
]

output_dir = "/workspace/projects/public/"

for filename, url in scenes:
    try:
        print(f"正在下载: {filename}")
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        output_path = os.path.join(output_dir, filename)
        img = Image.open(BytesIO(response.content))
        img.save(output_path, 'JPEG', quality=95)

        print(f"✅ 已保存: {output_path} (尺寸: {img.size})")
    except Exception as e:
        print(f"❌ 下载失败 {filename}: {e}")

print("\n✅ 所有场景图片下载完成")
