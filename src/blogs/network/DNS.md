---
title: 加速器无法访问Github
date: 2024-12-01
categories: 网络
tags:
---
# 简介
解决加速器无法访问Github

# 一键脚本
```bash
echo "nameserver 114.114.114.114" | sudo tee -a /etc/resolv.conf

printf "\
199.232.68.133 raw.githubusercontent.com\n\
199.232.68.133 user-images.githubusercontent.com\n\
199.232.68.133 avatars2.githubusercontent.com\n\
199.232.68.133 avatars1.githubusercontent.com\n" | sudo tee -a /etc/hosts
```