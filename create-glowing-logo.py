#!/usr/bin/env python3
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import os

def create_white_line_logo():
    """创建白色发光线条logo"""
    # 读取透明背景logo
    logo_path = "/workspace/projects/public/cm-logo-transparent.png"
    logo = Image.open(logo_path).convert("RGBA")
    data = np.array(logo)

    # 将黑色像素转换为白色，保留透明度
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

    # 找到非透明像素（logo内容）
    is_logo = a > 0

    # 将非透明像素的颜色改为白色
    data[is_logo, 0] = 255  # R
    data[is_logo, 1] = 255  # G
    data[is_logo, 2] = 255  # B

    # 保存为纯白色线条logo
    white_logo = Image.fromarray(data)
    white_logo.save("/workspace/projects/public/cm-logo-white-line.png", "PNG")

    print("✅ 纯白色线条logo已保存: cm-logo-white-line.png")
    print(f"   尺寸: {white_logo.size}")

    return white_logo

def create_glowing_line_logo(base_logo, glow_layers=3):
    """创建多层发光效果的线条logo"""
    result = base_logo.copy()
    data = np.array(result)

    # 多层发光
    for i in range(glow_layers):
        # 每一层的发光参数
        blur_radius = 10 + i * 8
        opacity = 80 - i * 20

        # 创建发光层
        glow = base_logo.copy()
        glow_data = np.array(glow)

        # 设置发光颜色（白色带蓝色调）
        r, g, b, a = glow_data[:, :, 0], glow_data[:, :, 1], glow_data[:, :, 2], glow_data[:, :, 3]

        # 只对非透明像素应用发光
        is_non_transparent = a > 0

        # 设置发光颜色
        glow_data[is_non_transparent, 0] = 240  # R (略带蓝色)
        glow_data[is_non_transparent, 1] = 245  # G
        glow_data[is_non_transparent, 2] = 255  # B
        glow_data[is_non_transparent, 3] = opacity  # 透明度

        glow = Image.fromarray(glow_data)

        # 应用高斯模糊
        glow = glow.filter(ImageFilter.GaussianBlur(blur_radius))

        # 合并发光层到结果
        result = Image.alpha_composite(result, glow)

    # 添加核心线条（最亮的）
    core_line = base_logo.copy()
    core_data = np.array(core_line)
    r, g, b, a = core_data[:, :, 0], core_data[:, :, 1], core_data[:, :, 2], core_data[:, :, 3]

    is_non_transparent = a > 0
    core_data[is_non_transparent, 0] = 255  # 纯白色
    core_data[is_non_transparent, 1] = 255
    core_data[is_non_transparent, 2] = 255
    core_data[is_non_transparent, 3] = 255  # 不透明

    core_line = Image.fromarray(core_data)
    result = Image.alpha_composite(result, core_line)

    result.save("/workspace/projects/public/cm-logo-glowing-white.png", "PNG")
    print("✅ 发光白色线条logo已保存: cm-logo-glowing-white.png")

    return result

# 执行
print("开始创建白色发光线条logo...")
print()

# 1. 创建纯白色线条logo
white_logo = create_white_line_logo()
print()

# 2. 创建多层发光效果
glowing_logo = create_glowing_line_logo(white_logo, glow_layers=4)
print()

print("✅ 完成！")
