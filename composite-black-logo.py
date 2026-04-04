#!/usr/bin/env python3
from PIL import Image
import numpy as np

def composite_black_logo_to_building():
    """将纯黑色logo合成到大场景"""
    # 读取清洁大场景
    building = Image.open("/workspace/projects/public/building-clean.jpg").convert("RGBA")

    # 读取纯黑色logo
    logo = Image.open("/workspace/projects/public/cm-logo-black.png").convert("RGBA")

    # 调整logo大小
    logo_width = 600
    logo_height = int(logo_width / logo.size[0] * logo.size[1])
    logo_resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    # 计算位置：放在建筑顶部中央
    x = (building.size[0] - logo_width) // 2
    y = building.size[1] // 6  # 从顶部1/6处开始

    # 创建结果图层
    result = building.copy()

    # 合成黑色logo
    result.paste(logo_resized, (x, y), logo_resized)

    # 转换为RGB并保存
    result_rgb = result.convert("RGB")
    output_path = "/workspace/projects/public/building-final.jpg"
    result_rgb.save(output_path, "JPEG", quality=98)

    print(f"✅ 纯黑色logo已合成到大场景")
    print(f"   输出: {output_path}")
    print(f"   Logo位置: ({x}, {y})")
    print(f"   Logo尺寸: {logo_width}x{logo_height}")
    print(f"   材质: 纯黑色，与现有logo一致")

    return output_path

# 执行
print("开始将纯黑色logo合成到大场景...")
print()

output = composite_black_logo_to_building()

print()
print("✅ 完成！")
print(f"新的纯黑色logo大场景已保存: {output}")
