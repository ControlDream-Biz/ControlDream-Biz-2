#!/usr/bin/env python3
from PIL import Image
import numpy as np
import os

input_path = "/workspace/projects/public/cm-logo-original.png"
output_path = "/workspace/projects/public/cm-logo-transparent.png"

try:
    print(f"正在处理: {input_path}")

    # 打开图片
    img = Image.open(input_path)
    img = img.convert("RGBA")

    # 转换为numpy数组
    data = np.array(img)

    # 假设白色背景接近(255, 255, 255)，我们需要找到白色像素并将alpha设为0
    # 创建一个mask，白色像素设为0，其他像素设为255
    # 使用容差来识别白色
    white_threshold = 240

    # 获取RGB通道
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

    # 创建mask：白色区域（R, G, B都接近255）
    is_white = (r > white_threshold) & (g > white_threshold) & (b > white_threshold)

    # 将白色区域设为透明
    data[is_white, 3] = 0

    # 保存为PNG
    result = Image.fromarray(data)
    result.save(output_path, 'PNG')

    print(f"✅ 透明背景logo已保存到: {output_path}")
    print(f"   原始尺寸: {img.size}")
    print(f"   输出尺寸: {result.size}")
except Exception as e:
    print(f"❌ 处理失败: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
