#!/usr/bin/env python3
from PIL import Image
import numpy as np

# 读取现有公司logo
logo = Image.open("/workspace/projects/public/logo-cm-final.png")

print("=== 现有公司logo分析 ===")
print(f"尺寸: {logo.size}")
print(f"模式: {logo.mode}")

# 转换为RGBA分析
logo_rgba = logo.convert("RGBA")
data = np.array(logo_rgba)

# 分析颜色分布
r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

# 找到非透明像素
is_logo = a > 0

if is_logo.any():
    # 分析非透明区域的颜色
    r_values = r[is_logo]
    g_values = g[is_logo]
    b_values = b[is_logo]

    print("\n颜色分析:")
    print(f"R - 最小: {r_values.min():.2f}, 最大: {r_values.max():.2f}, 平均: {r_values.mean():.2f}")
    print(f"G - 最小: {g_values.min():.2f}, 最大: {g_values.max():.2f}, 平均: {g_values.mean():.2f}")
    print(f"B - 最小: {b_values.min():.2f}, 最大: {b_values.max():.2f}, 平均: {b_values.mean():.2f}")

    # 计算标准差（颜色对比度）
    print(f"\n颜色对比度:")
    print(f"R 标准差: {r_values.std():.2f}")
    print(f"G 标准差: {g_values.std():.2f}")
    print(f"B 标准差: {b_values.std():.2f}")

    # 分析亮度
    brightness = (r_values + g_values + b_values) / 3
    print(f"\n亮度:")
    print(f"最暗: {brightness.min():.2f}")
    print(f"最亮: {brightness.max():.2f}")
    print(f"平均: {brightness.mean():.2f}")

    # 判断颜色类型
    avg_r = r_values.mean()
    avg_g = g_values.mean()
    avg_b = b_values.mean()

    print(f"\n材质判断:")
    if avg_r > 200 and avg_g > 200 and avg_b > 200:
        print("✓ 白色/浅色材质")
    elif avg_r < 100 and avg_g < 100 and avg_b < 100:
        print("✓ 黑色/深色材质")
    elif abs(avg_r - avg_g) < 30 and abs(avg_g - avg_b) < 30:
        print("✓ 银色/灰色金属材质")
    elif avg_b > avg_r + 20 and avg_b > avg_g + 20:
        print("✓ 蓝色材质")
    else:
        print("✓ 彩色材质")

    # 检查是否有渐变（标准差越大，渐变越明显）
    contrast = brightness.std()
    if contrast > 30:
        print(f"✓ 有明显渐变/光泽（对比度: {contrast:.2f}）")
    elif contrast > 10:
        print(f"✓ 有轻微渐变/光泽（对比度: {contrast:.2f}）")
    else:
        print(f"✓ 纯色/无光泽（对比度: {contrast:.2f}）")
else:
    print("\n未找到非透明像素")

# 保存分析结果
print("\n✅ 分析完成")
