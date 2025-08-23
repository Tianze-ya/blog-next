---
title: Gostty
date: 2025-03-28
categories: 软件
tags:
  - linux
cover:
---
# 简介
美观快速开箱即用的终端模拟器

# 下载
```bash
export VER="1.1.3" && export ARCH="x86_64"
wget https://github.com/psadi/ghostty-appimage/releases/download/v${VER}/Ghostty-${VERSION}-${ARCH}.AppImage
chmod +x Ghostty-${VER}-${ARCH}.AppImage
sudo install ./Ghostty-${VER}-${ARCH}.AppImage /usr/local/bin/ghostty
```
随后自行添加桌面环境

# 配置
`~/.config/ghostty/config`
```
maximize = true
font-size = 20
font-family = MapleMono-NF-CN
```
