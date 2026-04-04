#!/usr/bin/env python3
from PIL import Image
import numpy as np

# 对比旧图片和新图片
old_img = Image.open('/workspace/projects/public/building-clean.jpg')
new_img = Image.open('/workspace/projects/public/building-final.jpg')

print("=== 大场景logo合成对比 ===")
print()
print(f"清洁大场景尺寸: {old_img.size}")
print(f"最终大场景尺寸: {new_img.size}")
print()

# 转换为RGB进行比较
old_rgb = np.array(old_img.convert('RGB'))
new_rgb = np.array(new_img.convert('RGB'))

# 计算差异
diff = np.abs(old_rgb.astype(int) - new_rgb.astype(int))
max_diff = diff.max()
mean_diff = diff.mean()

print("像素差异统计:")
print(f"最大差异值: {max_diff}")
print(f"平均差异值: {mean_diff:.2f}")

# 计算不同的像素比例
diff_pixels = np.sum(diff > 15)
total_pixels = old_rgb.shape[0] * old_rgb.shape[1]
diff_ratio = (diff_pixels / total_pixels) * 100

print(f"不同像素比例: {diff_ratio:.2f}%")
print()

if diff_ratio > 0.5:
    print("✅ 图片有明显变化，发光线条logo已成功合成")
else:
    print("❌ 图片变化很小，可能没有正确合成")

# 检查logo区域的亮度（应该增加）
logo_region = new_rgb[300:800, 600:1200]  # logo所在区域
logo_brightness = logo_region.mean()

logo_region_clean = old_rgb[300:800, 600:1200]
logo_brightness_clean = logo_region_clean.mean()

print()
print(f"Logo区域亮度对比:")
print(f"合成前: {logo_brightness_clean:.2f}")
print(f"合成后: {logo_brightness:.2f}")
print(f"亮度提升: {(logo_brightness - logo_brightness_clean):.2f}")

if logo_brightness > logo_brightness_clean:
    print("✅ Logo区域亮度明显提升，发光效果有效")
