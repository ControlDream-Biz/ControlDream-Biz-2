#!/usr/bin/env python3
from PIL import Image
import numpy as np

# 对比清洁大场景和最终大场景
old_img = Image.open('/workspace/projects/public/building-clean.jpg')
new_img = Image.open('/workspace/projects/public/building-final.jpg')

print("=== 纯黑色logo效果验证 ===")
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
    print("✅ 图片有明显变化，纯黑色logo已成功合成")
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

# 检查logo区域的黑色特征
r_mean = logo_region[:, :, 0].mean()
g_mean = logo_region[:, :, 1].mean()
b_mean = logo_region[:, :, 2].mean()

print(f"\nLogo区域RGB均值:")
print(f"R: {r_mean:.2f}")
print(f"G: {g_mean:.2f}")
print(f"B: {b_mean:.2f}")

# 黑色特征：RGB值都很低
if r_mean < 150 and g_mean < 150 and b_mean < 150:
    print("\n✅ Logo呈现深色/黑色色调")
    if brightness_new < brightness_old:
        print("✅ Logo区域亮度降低，黑色logo成功应用")
else:
    print("\n⚠️ Logo颜色偏亮，可能不是纯黑色")

# 读取纯黑色logo进行对比
black_logo = Image.open('/workspace/projects/public/cm-logo-black.png')
black_logo_data = np.array(black_logo.convert('RGB'))
print(f"\n纯黑色logo亮度: {black_logo_data.mean():.2f}")
print(f"目标logo区域亮度: {brightness_new:.2f}")

print()
print("✅ 验证完成！")
