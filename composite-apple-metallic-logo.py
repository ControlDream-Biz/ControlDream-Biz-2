#!/usr/bin/env python3
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import numpy as np

def enhance_metallic_reflection():
    """增强金属反射效果"""
    # 读取基础金属logo
    metallic_logo = Image.open("/workspace/projects/public/cm-logo-apple-metallic.png").convert("RGBA")
    logo_data = np.array(metallic_logo)

    width, height = metallic_logo.size

    # 创建额外的反射层
    reflection_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    reflection_data = np.array(reflection_layer)

    r, g, b, a = logo_data[:, :, 0], logo_data[:, :, 1], logo_data[:, :, 2], logo_data[:, :, 3]
    is_logo = a > 0

    # 添加水平线状高光（模拟金属表面的反射条纹）
    for y in range(height):
        for x in range(width):
            if is_logo[y, x]:
                # 创建水平条纹反射
                stripe = (y % 20) / 20  # 0-1循环

                # 高光强度
                if 0.3 < stripe < 0.4:
                    highlight = 30
                elif 0.7 < stripe < 0.8:
                    highlight = 20
                else:
                    highlight = 0

                # 添加高光
                if highlight > 0:
                    reflection_data[y, x, 0] = 255
                    reflection_data[y, x, 1] = 255
                    reflection_data[y, x, 2] = 255
                    reflection_data[y, x, 3] = highlight

    reflection_layer = Image.fromarray(reflection_data.astype(np.uint8))

    # 合并反射层
    metallic_logo = Image.alpha_composite(metallic_logo, reflection_layer)

    # 添加环境反射（从天空和建筑的反射）
    env_reflection = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(env_reflection)

    # 顶部高光（天空反射）
    for i in range(width):
        for y in range(height):
            if is_logo[y, i]:
                # 顶部区域更亮
                sky_reflection = max(0, 30 * (1 - y / (height * 0.6)))
                if sky_reflection > 0:
                    reflection_data[y, i, 0] = 240
                    reflection_data[y, i, 1] = 245
                    reflection_data[y, i, 2] = 255
                    reflection_data[y, i, 3] = int(sky_reflection)

    env_reflection = Image.fromarray(reflection_data.astype(np.uint8))
    metallic_logo = Image.alpha_composite(metallic_logo, env_reflection)

    # 添加边缘光（模拟金属边缘的锐利反射）
    edge_sharpen = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    edge_data = np.array(edge_sharpen)

    for y in range(1, height - 1):
        for x in range(1, width - 1):
            if is_logo[y, x]:
                # 检查梯度（边缘检测）
                gradient_x = abs(int(is_logo[y, x+1]) - int(is_logo[y, x-1]))
                gradient_y = abs(int(is_logo[y+1, x]) - int(is_logo[y-1, x]))

                if gradient_x > 0 or gradient_y > 0:
                    # 边缘像素
                    edge_data[y, x, 0] = 200
                    edge_data[y, x, 1] = 200
                    edge_data[y, x, 2] = 220
                    edge_data[y, x, 3] = 100

    edge_sharpen = Image.fromarray(edge_data.astype(np.uint8))
    metallic_logo = Image.alpha_composite(metallic_logo, edge_sharpen)

    # 应用轻微的模糊使反射更自然
    metallic_logo = metallic_logo.filter(ImageFilter.SMOOTH)

    # 保存增强后的金属logo
    metallic_logo.save("/workspace/projects/public/cm-logo-apple-enhanced.png", "PNG")
    print("✅ 增强反射效果的金属logo已保存: cm-logo-apple-enhanced.png")

    return metallic_logo

def composite_metallic_logo_to_building():
    """将金属logo合成到大场景"""
    # 读取清洁大场景
    building = Image.open("/workspace/projects/public/building-clean.jpg").convert("RGBA")

    # 读取增强金属logo
    logo = Image.open("/workspace/projects/public/cm-logo-apple-enhanced.png").convert("RGBA")
    logo_data = np.array(logo)

    # 调整logo大小
    logo_width = 600
    logo_height = int(logo_width / logo.size[0] * logo.size[1])
    logo_resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    # 计算位置
    x = (building.size[0] - logo_width) // 2
    y = building.size[1] // 6

    # 合成
    result = building.copy()

    # 根据背景调整logo颜色，使其与玻璃融合
    logo_resized_data = np.array(logo_resized)
    building_region = np.array(result.crop((x, y, x + logo_width, y + logo_height)))

    r_logo, g_logo, b_logo, a_logo = logo_resized_data[:, :, 0], logo_resized_data[:, :, 1], logo_resized_data[:, :, 2], logo_resized_data[:, :, 3]
    r_build, g_build, b_build = building_region[:, :, 0], building_region[:, :, 1], building_region[:, :, 2]

    # 融合计算
    is_logo = a_logo > 0
    blend_ratio = 0.3  # 30%背景融合

    final_r = np.where(is_logo,
                       r_logo * (1 - blend_ratio) + r_build * blend_ratio,
                       r_build)
    final_g = np.where(is_logo,
                       g_logo * (1 - blend_ratio) + g_build * blend_ratio,
                       g_build)
    final_b = np.where(is_logo,
                       b_logo * (1 - blend_ratio) + b_build * blend_ratio,
                       b_build)

    # 创建结果图层
    final_region = np.stack([final_r, final_g, final_b], axis=2).astype(np.uint8)

    # 更新结果
    result.paste(Image.fromarray(final_region), (x, y))

    # 添加微弱的环境反射光晕
    glow = Image.new("RGBA", building.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)

    glow_x = x + logo_width // 2
    glow_y = y + logo_height // 2
    glow_radius = 120

    for i in range(glow_radius, 0, -10):
        alpha = int(15 * (1 - i / glow_radius))
        color = (220, 230, 255, alpha)
        draw.ellipse([
            glow_x - i,
            glow_y - int(i * 0.6),
            glow_x + i,
            glow_y + int(i * 0.6)
        ], fill=color)

    result = Image.alpha_composite(result, glow)

    # 转换为RGB并保存
    result_rgb = result.convert("RGB")
    output_path = "/workspace/projects/public/building-final.jpg"
    result_rgb.save(output_path, "JPEG", quality=98)

    print(f"✅ 苹果风格金属logo已合成到大场景")
    print(f"   输出: {output_path}")
    print(f"   Logo位置: ({x}, {y})")
    print(f"   Logo尺寸: {logo_width}x{logo_height}")

    return output_path

# 执行
print("开始增强金属反射效果并合成...")
print()

enhanced_logo = enhance_metallic_reflection()
print()

output = composite_metallic_logo_to_building()

print()
print("✅ 完成！")
print(f"新的苹果风格金属logo大场景已保存: {output}")
