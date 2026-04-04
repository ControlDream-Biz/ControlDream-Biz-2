#!/usr/bin/env python3
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import numpy as np

def create_apple_style_metallic_logo():
    """创建苹果风格金属材质logo"""
    # 读取透明背景logo
    logo = Image.open("/workspace/projects/public/cm-logo-transparent.png").convert("RGBA")
    logo_data = np.array(logo)

    # 创建金属渐变色
    width, height = logo.size
    metallic_logo = np.zeros_like(logo_data)

    # 从logo中提取形状（非透明区域）
    r, g, b, a = logo_data[:, :, 0], logo_data[:, :, 1], logo_data[:, :, 2], logo_data[:, :, 3]
    is_logo = a > 0

    # 创建金属渐变（模拟苹果铝材质）
    # 使用对角线渐变：左上深灰 → 中间白色 → 右下深灰
    y_indices, x_indices = np.indices((height, width))

    # 归一化坐标
    x_norm = x_indices / (width - 1)
    y_norm = y_indices / (height - 1)

    # 对角线位置（0在左上，1在右下）
    diagonal = (x_norm + y_norm) / 2

    # 金属渐变色（铝材质）
    # 深灰 → 浅灰 → 白色 → 浅灰 → 深灰
    for y in range(height):
        for x in range(width):
            if is_logo[y, x]:
                # 计算对角线位置
                pos = (x / (width - 1) + y / (height - 1)) / 2

                # 创建金属渐变
                # 使用正弦函数创建平滑过渡
                metal_value = 180 + 75 * np.sin(pos * np.pi)

                # 添加一些变化，模拟金属纹理
                texture = 5 * np.sin(pos * np.pi * 4) * np.cos(pos * np.pi * 2)
                metal_value += texture

                # 确保在合理范围内
                metal_value = np.clip(metal_value, 150, 255)

                # 转换为RGB
                metallic_logo[y, x, 0] = int(metal_value)  # R
                metallic_logo[y, x, 1] = int(metal_value)  # G
                metallic_logo[y, x, 2] = int(metal_value)  # B
                metallic_logo[y, x, 3] = 255  # Alpha

    # 保存基础金属logo
    metallic_base = Image.fromarray(metallic_logo.astype(np.uint8))
    metallic_base.save("/workspace/projects/public/cm-logo-metallic-base.png", "PNG")
    print("✅ 基础金属logo已保存: cm-logo-metallic-base.png")

    # 添加高光反射
    highligth_overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(highligth_overlay)

    # 在logo的左上角添加高光
    highlight_x = width // 3
    highlight_y = height // 3
    highlight_radius = min(width, height) // 4

    for i in range(highlight_radius, 0, -5):
        alpha = int(40 * (1 - i / highlight_radius))
        color = (255, 255, 255, alpha)
        draw.ellipse([
            highlight_x - i,
            highlight_y - int(i * 0.8),
            highlight_x + i,
            highlight_y + int(i * 0.8)
        ], fill=color)

    # 合并高光
    metallic_base = Image.alpha_composite(metallic_base, highligth_overlay)

    # 添加边缘发光（模拟金属边缘的反射）
    edge_glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    edge_data = np.array(edge_glow)

    # 找到边缘像素
    for y in range(1, height - 1):
        for x in range(1, width - 1):
            if is_logo[y, x]:
                # 检查邻居是否透明（边缘检测）
                neighbors = [
                    is_logo[y-1, x], is_logo[y+1, x],
                    is_logo[y, x-1], is_logo[y, x+1]
                ]
                if not all(neighbors):
                    # 边缘像素，添加微弱的白色反射
                    edge_data[y, x, 0] = 220
                    edge_data[y, x, 1] = 220
                    edge_data[y, x, 2] = 230
                    edge_data[y, x, 3] = 180

    edge_glow = Image.fromarray(edge_data.astype(np.uint8))
    metallic_base = Image.alpha_composite(metallic_base, edge_glow)

    # 应用轻微的高斯模糊使边缘更平滑
    metallic_base = metallic_base.filter(ImageFilter.SMOOTH_MORE)

    # 保存最终金属logo
    metallic_base.save("/workspace/projects/public/cm-logo-apple-metallic.png", "PNG")
    print("✅ 苹果风格金属logo已保存: cm-logo-apple-metallic.png")

    return metallic_base

# 执行
print("开始创建苹果风格金属材质logo...")
print()

metallic_logo = create_apple_style_metallic_logo()

print()
print("✅ 完成！")
print(f"Logo尺寸: {metallic_logo.size}")
