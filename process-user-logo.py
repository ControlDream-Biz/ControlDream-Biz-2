#!/usr/bin/env python3
from PIL import Image
import numpy as np

def extract_and_convert_to_black():
    """提取白色logo并转换为黑色"""
    # 读取logo
    logo = Image.open("/workspace/projects/public/黑底白LOGO_反白.jpg").convert("RGB")
    data = np.array(logo)

    print(f"原始logo尺寸: {logo.size}")

    # 提取白色部分（假设背景是黑色，logo是白色）
    # 白色像素的特征：RGB值都很高
    white_threshold = 180

    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]

    # 创建白色logo的mask
    is_white = (r > white_threshold) & (g > white_threshold) & (b > white_threshold)

    # 创建新的RGBA图像
    rgba_data = np.zeros((logo.size[1], logo.size[0], 4), dtype=np.uint8)

    # 复制白色部分，并将颜色改为黑色
    rgba_data[:, :, 0] = np.where(is_white, 0, 0)  # R: 黑色
    rgba_data[:, :, 1] = np.where(is_white, 0, 0)  # G: 黑色
    rgba_data[:, :, 2] = np.where(is_white, 0, 0)  # B: 黑色
    rgba_data[:, :, 3] = np.where(is_white, 255, 0)  # Alpha: 白色区域不透明，其他透明

    # 保存为透明背景的黑色logo
    black_logo = Image.fromarray(rgba_data, 'RGBA')

    # 裁剪掉周围的空白区域
    bbox = black_logo.getbbox()
    if bbox:
        black_logo = black_logo.crop(bbox)
        print(f"裁剪后logo尺寸: {black_logo.size}")

    black_logo.save("/workspace/projects/public/cm-logo-black-from-user.jpg", "PNG")

    print("✅ 黑色logo已创建: cm-logo-black-from-user.png")

    return black_logo

def composite_to_building():
    """合成到大场景"""
    # 读取清洁大场景
    building = Image.open("/workspace/projects/public/building-clean.jpg").convert("RGBA")

    # 读取黑色logo
    logo = Image.open("/workspace/projects/public/cm-logo-black-from-user.jpg").convert("RGBA")

    # 调整logo大小
    logo_width = 600
    scale_factor = logo_width / logo.size[0]
    logo_height = int(logo.size[1] * scale_factor)
    logo_resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    # 计算位置
    x = (building.size[0] - logo_width) // 2
    y = building.size[1] // 6

    # 合成
    result = building.copy()
    result.paste(logo_resized, (x, y), logo_resized)

    # 转换为RGB并保存
    result_rgb = result.convert("RGB")
    output_path = "/workspace/projects/public/building-final.jpg"
    result_rgb.save(output_path, "JPEG", quality=98)

    print(f"\n✅ Logo已合成到大场景")
    print(f"   输出: {output_path}")
    print(f"   Logo位置: ({x}, {y})")
    print(f"   Logo尺寸: {logo_width}x{logo_height}")

    return output_path

# 执行
print("开始处理用户提供的logo...")
print()

black_logo = extract_and_convert_to_black()
print()

output = composite_to_building()

print()
print("✅ 完成！")
print(f"新的黑色logo大场景已保存: {output}")
