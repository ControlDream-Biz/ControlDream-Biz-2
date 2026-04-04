#!/usr/bin/env python3
from PIL import Image
import numpy as np

# 读取两个图片进行对比
old_img = Image.open('/workspace/projects/public/building-updated.jpg')
new_img = Image.open('/workspace/projects/public/building-final.jpg')

print(f"旧图片: {old_img.size} - 模式: {old_img.mode}")
print(f"新图片: {new_img.size} - 模式: {new_img.mode}")

# 转换为RGB进行比较
old_rgb = np.array(old_img.convert('RGB'))
new_rgb = np.array(new_img.convert('RGB'))

# 计算差异
diff = np.abs(old_rgb.astype(int) - new_rgb.astype(int))
max_diff = diff.max()
mean_diff = diff.mean()

print(f"\n像素差异统计:")
print(f"最大差异值: {max_diff}")
print(f"平均差异值: {mean_diff:.2f}")

# 计算不同的像素比例
diff_pixels = np.sum(diff > 10)  # 差异大于10认为是不同像素
total_pixels = old_rgb.shape[0] * old_rgb.shape[1]
diff_ratio = (diff_pixels / total_pixels) * 100

print(f"不同像素比例: {diff_ratio:.2f}%")

if diff_ratio > 0.1:
    print("\n✅ 图片有明显变化，新图片确实与旧图片不同")
else:
    print("\n❌ 图片变化很小，可能没有正确更新")
