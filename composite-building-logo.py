#!/usr/bin/env python3
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import os

def composite_glowing_logo_to_building():
    """将发光线条logo合成到大场景上"""
    # 读取清洁的大场景
    building = Image.open("/workspace/projects/public/building-clean.jpg").convert("RGBA")

    # 读取发光logo
    logo = Image.open("/workspace/projects/public/cm-logo-glowing-white.png").convert("RGBA")

    # 调整logo大小（根据建筑大小）
    logo_width = 600  # logo宽度
    logo_height = int(logo_width / logo.size[0] * logo.size[1])
    logo_resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    # 计算位置：放在建筑顶部中央位置
    x = (building.size[0] - logo_width) // 2
    y = building.size[1] // 6  # 从顶部1/6处开始

    # 创建一个临时图层来合成logo
    result = building.copy()

    # 为logo添加额外的环境光反射效果
    logo_data = np.array(logo_resized)
    r, g, b, a = logo_data[:, :, 0], logo_data[:, :, 1], logo_data[:, :, 2], logo_data[:, :, 3]

    # 对logo进行轻微的颜色调整，使其与建筑玻璃反光融合
    is_non_transparent = a > 0

    # 增加一些蓝色调，模拟玻璃反光
    logo_data[is_non_transparent, 0] = np.clip(logo_data[is_non_transparent, 0] * 1.0, 0, 255)
    logo_data[is_non_transparent, 1] = np.clip(logo_data[is_non_transparent, 1] * 1.05, 0, 255)
    logo_data[is_non_transparent, 2] = np.clip(logo_data[is_non_transparent, 2] * 1.1, 0, 255)

    logo_resized = Image.fromarray(logo_data)

    # 合成logo到建筑
    result.paste(logo_resized, (x, y), logo_resized)

    # 添加全局发光氛围（在logo周围的轻微光晕）
    glow_layer = Image.new("RGBA", building.size, (0, 0, 0, 0))

    # 在logo位置创建一个淡淡的蓝色光晕
    glow_radius = 150
    glow_x = x + logo_width // 2
    glow_y = y + logo_height // 2

    # 创建径向渐变光晕
    for i in range(glow_radius, 0, -5):
        alpha = int(30 * (1 - i / glow_radius))  # 中心不透明，边缘透明
        color = (240, 245, 255, alpha)

        # 绘制椭圆光晕
        from PIL import ImageDraw
        draw = ImageDraw.Draw(glow_layer)
        bbox = [
            glow_x - i,
            glow_y - int(i * 0.6),
            glow_x + i,
            glow_y + int(i * 0.6)
        ]
        draw.ellipse(bbox, fill=color)

    # 合并光晕
    result = Image.alpha_composite(result, glow_layer)

    # 转换为RGB并保存
    result_rgb = result.convert("RGB")
    output_path = "/workspace/projects/public/building-final.jpg"
    result_rgb.save(output_path, "JPEG", quality=98)

    print(f"✅ 发光线条logo已合成到大场景")
    print(f"   输出: {output_path}")
    print(f"   Logo位置: ({x}, {y})")
    print(f"   Logo尺寸: {logo_width}x{logo_height}")

    return output_path

# 执行
print("开始将发光线条logo合成到大场景...")
print()

output = composite_glowing_logo_to_building()

print()
print("✅ 完成！")
print(f"新的大场景已保存: {output}")
