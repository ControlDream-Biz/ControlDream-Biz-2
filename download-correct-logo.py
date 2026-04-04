#!/usr/bin/env python3
import requests
from PIL import Image
from io import BytesIO

# 下载logo
logo_url = "https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E9%BB%91%E5%BA%95%E7%99%BDLOGO_%E5%8F%8D%E7%99%BD.jpg&nonce=fbfea7c2-e9f6-4bf1-9e54-485aca9f182c&project_id=7624946461125541897&sign=45162aea3fa55a49485ca5c7e608c5048682c50af61910594907bfad19470de2"
output_path = "/workspace/projects/public/黑底白LOGO_反白.jpg"

try:
    print(f"正在下载logo从: {logo_url}")
    response = requests.get(logo_url, timeout=30)
    response.raise_for_status()

    # 保存原始图片
    img = Image.open(BytesIO(response.content))
    img.save(output_path, 'JPEG')

    print(f"✅ Logo已保存到: {output_path}")
    print(f"   图片尺寸: {img.size}")
    print(f"   图片模式: {img.mode}")

    # 分析颜色
    img_rgb = img.convert('RGB')
    data = list(img_rgb.getdata())

    r_values = [d[0] for d in data]
    g_values = [d[1] for d in data]
    b_values = [d[2] for d in data]

    print(f"\n颜色分析:")
    print(f"R - 最小: {min(r_values)}, 最大: {max(r_values)}, 平均: {sum(r_values)/len(r_values):.2f}")
    print(f"G - 最小: {min(g_values)}, 最大: {max(g_values)}, 平均: {sum(g_values)/len(g_values):.2f}")
    print(f"B - 最小: {min(b_values)}, 最大: {max(b_values)}, 平均: {sum(b_values)/len(b_values):.2f}")

except Exception as e:
    print(f"❌ 下载失败: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
