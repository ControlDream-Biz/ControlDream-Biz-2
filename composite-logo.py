#!/usr/bin/env python3
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import numpy as np
import os

def create_logo_with_effect(base_size=(800, 600)):
    """创建带有拟物化效果的logo板"""
    # 读取透明背景logo
    logo_path = "/workspace/projects/public/cm-logo-transparent.png"
    logo = Image.open(logo_path).convert("RGBA")

    # 调整logo大小（保持宽高比）
    logo_width = 400  # logo宽度
    logo_height = int(logo_width / logo.size[0] * logo.size[1])
    logo_resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    # 创建白色亚克力板背景（半透明）
    board_padding = 80
    board_width = logo_width + board_padding * 2
    board_height = logo_height + board_padding * 2

    # 创建新画布
    board = Image.new("RGBA", (board_width, board_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(board)

    # 绘制白色半透明亚克力板（圆角矩形）
    corner_radius = 40
    # 创建一个临时图层来绘制圆角矩形
    temp = Image.new("RGBA", (board_width, board_height), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp)

    # 绘制白色半透明背景
    bg_color = (255, 255, 255, 230)  # 白色，90%不透明度
    temp_draw.rounded_rectangle(
        [(0, 0), (board_width, board_height)],
        radius=corner_radius,
        fill=bg_color
    )

    # 绘制边框（白色，轻微阴影效果）
    border_color = (245, 245, 245, 255)
    temp_draw.rounded_rectangle(
        [(0, 0), (board_width, board_height)],
        radius=corner_radius,
        fill=None,
        outline=border_color,
        width=2
    )

    # 合并背景板
    board = Image.alpha_composite(board, temp)

    # 计算logo居中位置
    logo_x = (board_width - logo_width) // 2
    logo_y = (board_height - logo_height) // 2

    # 绘制logo
    board.paste(logo_resized, (logo_x, logo_y), logo_resized)

    return board

def apply_shadow(image, offset=(10, 10), blur_radius=15, opacity=80):
    """为图片添加阴影效果"""
    # 创建阴影层
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)

    # 绘制阴影
    shadow_color = (0, 0, 0, opacity)
    shadow_draw.rounded_rectangle(
        [(offset[0], offset[1]),
         (image.size[0] + offset[0], image.size[1] + offset[1])],
        radius=40,
        fill=shadow_color
    )

    # 模糊阴影
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur_radius))

    # 合并阴影和原图
    result = Image.new("RGBA", image.size, (0, 0, 0, 0))
    result.paste(shadow, (0, 0))
    result = Image.alpha_composite(result, image)

    return result

def apply_glow(image, glow_color=(200, 220, 255), blur_radius=30, opacity=60):
    """为图片添加发光效果"""
    # 创建发光层
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)

    # 绘制发光
    glow_with_alpha = (*glow_color, opacity)
    glow_draw.rounded_rectangle(
        [(0, 0), (image.size[0], image.size[1])],
        radius=40,
        fill=glow_with_alpha
    )

    # 模糊发光
    glow = glow.filter(ImageFilter.GaussianBlur(blur_radius))

    # 合并发光和原图
    result = Image.new("RGBA", image.size, (0, 0, 0, 0))
    result.paste(glow, (0, 0))
    result = Image.alpha_composite(result, image)

    return result

def composite_logo_to_scene(scene_path, output_path, position=(0.5, 0.3), scale=1.0):
    """将logo合成到场景中"""
    # 读取场景图片
    scene = Image.open(scene_path).convert("RGBA")

    # 创建拟物化效果logo
    logo_board = create_logo_with_effect()

    # 应用发光效果
    logo_board = apply_glow(logo_board, glow_color=(220, 230, 255), blur_radius=25, opacity=50)

    # 应用阴影效果
    logo_board = apply_shadow(logo_board, offset=(8, 8), blur_radius=12, opacity=70)

    # 缩放logo板
    if scale != 1.0:
        new_width = int(logo_board.size[0] * scale)
        new_height = int(logo_board.size[1] * scale)
        logo_board = logo_board.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # 计算位置
    x = int(scene.size[0] * position[0] - logo_board.size[0] // 2)
    y = int(scene.size[1] * position[1] - logo_board.size[1] // 2)

    # 确保logo不超出边界
    x = max(20, min(scene.size[0] - logo_board.size[0] - 20, x))
    y = max(20, min(scene.size[1] - logo_board.size[1] - 20, y))

    # 合成logo到场景
    scene.paste(logo_board, (x, y), logo_board)

    # 转换为RGB并保存为JPEG
    scene_rgb = scene.convert("RGB")
    scene_rgb.save(output_path, "JPEG", quality=95)

    print(f"✅ 已保存: {output_path} (logo位置: {x}, {y})")

# 处理所有场景
scenes = [
    ("building-clean.jpg", "building-final.jpg", (0.5, 0.25), 1.2),
    ("reception-clean.jpg", "reception-final.jpg", (0.5, 0.15), 1.0),
    ("game-dev-clean.jpg", "game-dev-final.jpg", (0.85, 0.15), 0.8),
    ("software-dev-clean.jpg", "software-dev-final.jpg", (0.85, 0.15), 0.8),
    ("hardware-lab-clean.jpg", "hardware-lab-final.jpg", (0.85, 0.15), 0.8)
]

base_dir = "/workspace/projects/public/"

for scene_file, output_file, position, scale in scenes:
    scene_path = os.path.join(base_dir, scene_file)
    output_path = os.path.join(base_dir, output_file)
    composite_logo_to_scene(scene_path, output_path, position, scale)

print("\n✅ 所有场景logo合成完成！")
