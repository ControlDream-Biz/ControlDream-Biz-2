#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

def add_realistic_shadows_and_highlights(building, logo, position):
    """添加真实的阴影和高光效果"""
    x, y = position
    logo_width, logo_height = logo.size

    # 从建筑背景中采样颜色，用于环境反射
    try:
        building_region = building.crop((x, y, x + logo_width, y + logo_height))
        building_data = np.array(building_region)
    except:
        # 如果超出范围，使用默认值
        building_data = np.zeros((logo_height, logo_width, 3), dtype=np.uint8) + 220

    # 计算平均背景颜色
    bg_color = building_data.mean(axis=(0, 1))

    # 创建带环境反射的logo
    logo_data = np.array(logo.convert('RGBA'))
    result_logo = logo_data.copy()

    r, g, b, a = logo_data[:, :, 0], logo_data[:, :, 1], logo_data[:, :, 2], logo_data[:, :, 3]

    # 非透明区域（logo内容）
    is_logo = a > 0

    # 添加环境反射（让logo部分透明，能看到背景）
    reflection_strength = 0.20  # 20%的环境反射
    result_logo[is_logo, 0] = r[is_logo] * (1 - reflection_strength) + bg_color[0] * reflection_strength
    result_logo[is_logo, 1] = g[is_logo] * (1 - reflection_strength) + bg_color[1] * reflection_strength
    result_logo[is_logo, 2] = b[is_logo] * (1 - reflection_strength) + bg_color[2] * reflection_strength
    result_logo[is_logo, 3] = 180  # 70%不透明度

    # 添加顶部高光（模拟阳光从上方照射）
    highlight_mask = np.zeros((logo_height, logo_width), dtype=np.float32)
    for y_pos in range(logo_height):
        # 顶部25%区域有高光
        if y_pos < logo_height * 0.25:
            intensity = 1.0 - (y_pos / (logo_height * 0.25))
            highlight_mask[y_pos, :] = intensity * 12  # 最大12亮度增加

    # 应用高光
    result_logo[:, :, 0] = np.clip(result_logo[:, :, 0] + highlight_mask, 0, 255)
    result_logo[:, :, 1] = np.clip(result_logo[:, :, 1] + highlight_mask, 0, 255)
    result_logo[:, :, 2] = np.clip(result_logo[:, :, 2] + highlight_mask, 0, 255)

    # 添加边缘暗化（模拟玻璃边缘的阴影）
    edge_darken = 0.88  # 边缘暗化到88%

    # 左边缘
    for x_pos in range(4):
        factor = edge_darken + (1 - edge_darken) * (x_pos / 4)
        result_logo[:, x_pos, 0:3] = (result_logo[:, x_pos, 0:3] * factor).astype(np.uint8)

    # 右边缘
    for x_pos in range(4):
        factor = edge_darken + (1 - edge_darken) * (x_pos / 4)
        result_logo[:, -(x_pos+1), 0:3] = (result_logo[:, -(x_pos+1), 0:3] * factor).astype(np.uint8)

    # 添加对角线高光（模拟玻璃反光条纹）
    for i in range(logo_width + logo_height):
        # 对角线
        y_pos = i - logo_width // 2
        x_pos = i

        if 0 <= y_pos < logo_height and 0 <= x_pos < logo_width:
            # 反光条纹
            if i % 35 < 4:  # 每35像素有4像素的反射条纹
                result_logo[y_pos, x_pos, 0] = np.clip(result_logo[y_pos, x_pos, 0] + 18, 0, 255)
                result_logo[y_pos, x_pos, 1] = np.clip(result_logo[y_pos, x_pos, 1] + 18, 0, 255)
                result_logo[y_pos, x_pos, 2] = np.clip(result_logo[y_pos, x_pos, 2] + 22, 0, 255)

    return Image.fromarray(result_logo.astype(np.uint8))

def composite_realistic_logo():
    """合成真实的logo到大场景"""
    # 读取清洁大场景
    building = Image.open("/workspace/projects/public/building-clean.jpg").convert("RGBA")

    # 读取黑色logo
    logo = Image.open("/workspace/projects/public/cm-logo-black-from-user.jpg").convert("RGBA")

    # 调整logo大小
    logo_width = 600
    scale_factor = logo_width / logo.size[0]
    logo_height = int(logo.size[1] * scale_factor)

    # 缩放logo
    logo_resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    # 计算位置
    x = (building.size[0] - logo_width) // 2
    y = building.size[1] // 6

    # 添加真实的阴影和高光
    logo_with_effects = add_realistic_shadows_and_highlights(building, logo_resized, (x, y))

    # 创建结果图层
    result = building.copy()

    # 将logo合成到指定位置
    result.paste(logo_with_effects, (x, y), logo_with_effects)

    # 转换为RGB并保存
    result_rgb = result.convert("RGB")
    output_path = "/workspace/projects/public/building-final.jpg"
    result_rgb.save(output_path, "JPEG", quality=98)

    print(f"✅ 真实logo已合成到大场景")
    print(f"   输出: {output_path}")
    print(f"   Logo位置: ({x}, {y})")
    print(f"   Logo尺寸: {logo_width}x{logo_height}")
    print(f"   效果: 环境反射 + 真实光影 + 玻璃反光条纹")

    return output_path

# 执行
print("开始创建真实的logo效果...")
print()

output = composite_realistic_logo()

print()
print("✅ 完成！")
print(f"真实的logo大场景已保存: {output}")
