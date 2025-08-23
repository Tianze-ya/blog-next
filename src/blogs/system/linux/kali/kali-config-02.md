---
title: 配置Kali-02
date: 2024-08-04
categories: 系统
tags:
  - kali
  - linux
---
# 简介
配置Kali-03

# 导航
*1. [配置 Kali-00](https://tianze-ya.github.io/blog/system/linux/kali/kali-config-00/)*
*2. [配置 Kali-01](https://tianze-ya.github.io/blog/system/linux/kali/kali-config-01/)*
*3. [配置 Kali-02](https://tianze-ya.github.io/blog/system/linux/kali/kali-config-02/)                     <== 您在此处*

# 一、修改用户名和密码

```bash
# 设置root用户密码，随后重启，登录root用户
sudo passwd root
# 更改用户名
usermod -l new_name kali
# 更好家目录名
mv /home/kali /home/new_name
usermod -d /home/new_name -m new_name
# 为用户设置新密码
passwd new_name
```

# 二、修改组名和主机名
```bash
# 更改组名
sudo groupmod -n new_name kali
# 更改主机名
sudo sed -i "a\127.0.0.1 new_hostname" /etc/hosts
sudo hostnamectl set-hostname new_hostname
# 删去旧主机名
sudo sed -i "2d" /etc/hosts
```

# 三、更改用户权限
```bash
# [用户名]    [被管理主机的IP]=([可以使用的身份])   [NOPASSWD: ][授权的命令]
# %[组名]    [被管理主机的IP]=([可以使用的身份])   [NOPASSWD: ][授权的命令]
# [被管理主机的IP]、[可以使用的身份]、[授权的命令] 都可以使用 ALL 来表示不限制
# 示例（NOPASSWD 不需要输入密码）
sudo sed -i "a\new_name    ALL=(ALL)   NOPASSWD:ALL" /etc/sudoers
```
