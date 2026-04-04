#!/usr/bin/env python3
from PIL import Image
import numpy as np

def create_black_logo_like_existing():
    """创建和现有logo一样的纯黑色logo"""
    # 读取用户logo的透明背景版本
    user_logo = Image.open("/workspace/projects/public/cm-logo-transparent.png").convert("RGBA")
    data = np.array(user_logo)

    # 将非透明区域改为纯黑色
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    is_logo = a > 0

    # 设置为纯黑色（RGB: 0, 0, 0）
    data[is_logo, 0] = 0  # R
    data[is_logo, 1] = 0  # G
    data[is_logo, 2] = 0  # B
    data[is_logo, 3] = 255  # Alpha - 不透明

    # 保存纯黑色logo
    black_logo = Image.fromarray(data)
    black_logo.save("/workspace/projects/public/cm-logo-black.png", "PNG")

    print("✅ 纯黑色logo已创建: cm-logo-black.png")
    print(f"   尺寸: {black_logo.size}")
    print(f"   材质: 纯黑色，与现有logo一致")

    return black_logo

# 执行
print("开始创建纯黑色logo（与现有logo材质一致）...")
print()

black_logo = create_black_logo_like_existing()

print()
print("✅ 完成！")
