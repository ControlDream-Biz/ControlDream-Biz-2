#!/usr/bin/env python3
from PIL import Image
import numpy as np

# 对比清洁大场景和最终大场景
old_img = Image.open('/workspace/projects/public/building-clean.jpg')
new_img = Image.open('/workspace/projects/public/building-final.jpg')

print("=== 苹果风格金属logo效果验证 ===")
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
diff_pixels = np.sum(diff > 20)
total_pixels = old_rgb.shape[0] * old_rgb.shape[1]
diff_ratio = (diff_pixels / total_pixels) * 100

print(f"不同像素比例: {diff_ratio:.2f}%")
print()

if diff_ratio > 1.0:
    print("✅ 图片有明显变化，苹果风格金属logo已成功合成")
else:
    print("❌ 图片变化较小")

# 分析logo区域的颜色特征
logo_region = new_rgb[300:800, 600:1200]
logo_region_clean = old_rgb[300:800, 600:1200]

# 计算亮度
brightness_new = logo_region.mean(axis=2).mean()
brightness_old = logo_region_clean.mean(axis=2).mean()

print(f"\nLogo区域亮度对比:")
print(f"合成前: {brightness_old:.2f}")
print(f"合成后: {brightness_new:.2f}")
print(f"亮度变化: {(brightness_new - brightness_old):.2f}")

# 计算颜色对比度（标准差）
contrast_new = logo_region.std(axis=2).mean()
contrast_old = logo_region_clean.std(axis=2).mean()

print(f"\nLogo区域对比度对比:")
print(f"合成前: {contrast_old:.2f}")
print(f"合成后: {contrast_new:.2f}")
print(f"对比度变化: {(contrast_new - contrast_old):.2f}")

if contrast_new > contrast_old:
    print("\n✅ 对比度提升，金属质感增强")

# 检查logo区域的金属色调（银色范围）
r_mean = logo_region[:, :, 0].mean()
g_mean = logo_region[:, :, 1].mean()
b_mean = logo_region[:, :, 2].mean()

print(f"\nLogo区域RGB均值:")
print(f"R: {r_mean:.2f}")
print(f"G: {g_mean:.2f}")
print(f"B: {b_mean:.2f}")

# 银色特征：RGB值接近，且在180-220之间
if 180 < r_mean < 220 and 180 < g_mean < 220 and 180 < b_mean < 220:
    if abs(r_mean - g_mean) < 10 and abs(g_mean - b_mean) < 10:
        print("\n✅ Logo呈现银色金属色调")
    else:
        print("\n⚠️ Logo颜色略有偏离银色")
else:
    print("\n⚠️ Logo颜色不在银色范围内")

print()
print("✅ 验证完成！")
