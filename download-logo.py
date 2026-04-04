#!/usr/bin/env python3
import requests
from PIL import Image
from io import BytesIO
import os

# 下载logo
logo_url = "https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fimage.png&nonce=2c4a8957-fdbd-480c-a8c1-d6fbef6f5194&project_id=7624946461125541897&sign=ea28c7c866f169376e7199d703a31ef3d5611077baf0f0bbe055e8387ee1b51c"
output_path = "/workspace/projects/public/cm-logo-original.png"

try:
    print(f"正在下载logo从: {logo_url}")
    response = requests.get(logo_url, timeout=30)
    response.raise_for_status()

    # 保存原始图片
    img = Image.open(BytesIO(response.content))
    img.save(output_path, 'PNG')

    print(f"✅ Logo已保存到: {output_path}")
    print(f"   图片尺寸: {img.size}")
    print(f"   图片模式: {img.mode}")
except Exception as e:
    print(f"❌ 下载失败: {e}")
    exit(1)
