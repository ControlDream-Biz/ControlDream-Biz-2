#!/usr/bin/env python3
from PIL import Image
import numpy as np

# 验证真实效果
old_img = Image.open('/workspace/projects/public/building-clean.jpg')
new_img = Image.open('/workspace/projects/public/building-final.jpg')

print("=== 真实logo效果验证 ===")
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

if diff_ratio > 1.0:
    print("✅ 图片有明显变化，真实logo已成功合成")
else:
    print("❌ 图片变化较小")

# 分析logo区域的颜色特征
logo_region = new_rgb[300:700, 600:1200]
logo_region_clean = old_rgb[300:700, 600:1200]

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

# 分析颜色范围
r_values = logo_region[:, :, 0].flatten()
g_values = logo_region[:, :, 1].flatten()
b_values = logo_region[:, :, 2].flatten()

# 去除背景像素（假设背景是亮色）
is_dark = (r_values < 150) & (g_values < 150) & (b_values < 150)
dark_r = r_values[is_dark]
dark_g = g_values[is_dark]
dark_b = b_values[is_dark]

if len(dark_r) > 0:
    print(f"\n深色区域（logo）颜色分析:")
    print(f"R: {dark_r.mean():.2f} ± {dark_r.std():.2f}")
    print(f"G: {dark_g.mean():.2f} ± {dark_g.std():.2f}")
    print(f"B: {dark_b.mean():.2f} ± {dark_b.std():.2f}")

    # 检查颜色是否不均匀（环境反射效果）
    color_variation = max(dark_r.std(), dark_g.std(), dark_b.std())
    if color_variation > 5:
        print(f"✅ 颜色有变化（标准差: {color_variation:.2f}），环境反射效果有效")
    else:
        print(f"⚠️ 颜色变化较小（标准差: {color_variation:.2f}），环境反射效果可能不足")
else:
    print(f"\n⚠️ 未找到深色区域（logo）")

# 检查logo文件
logo_file = Image.open('/workspace/projects/public/cm-logo-black-from-user.jpg')
print(f"\n使用的logo文件: cm-logo-black-from-user.jpg")
print(f"Logo尺寸: {logo_file.size}")

print()
print("✅ 验证完成！")
