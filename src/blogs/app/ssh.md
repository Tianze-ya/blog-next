---
title: SSH
date: 2024-08-07
categories: 软件
tags:
  - 工具
  - linux
---
# 简介
是一种用于**安全地**访问远程计算机的网络协议

# 使用
## 一、修改ssh_d的配置文件
```bash
sudo vim /etc/ssh/sshd_config
# 以下为常用配置（顺序不一）
Port 22 								# 监听端口为22(默认)
ListenAddress 0.0.0.0 					
# 监听地址为任意网段，也可以指定OpenSSH服务器的具体IP

PermitRootLogin yes 					# 允许root用户登录
PubkeyAuthentication yes                # 使用公钥登录
AuthorizedKeysFile .ssh/authorized_keys # 设置公钥的位置
PasswordAuthentication no               # 禁止使用密码登录
PermitEmptyPasswords no 				# 禁止空密码用户登录

#### 其他 ####
# 只允许zhangsan、lisi用户登录
# 且其中lisi用户仅能够从IP地址为61.23.24.25 的主机远程登录
AllowUsers zhangsan lisi@61.23.24.25 	# 多个用户以空格分隔
# 禁止某些用户登录(wangwu)，用法于AllowUsers 类似（注意不要同时使用）
DenyUsers wangwu
```
## 二、生成密钥对
若禁用公钥登录并启用密码登录，则可以省去这一步
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
![](img/note/system/linux/kali/ssh-keygen.png)
把`~/.ssh/id_rsa`移到需要连接sshd的主机上
把`~/.ssh/id_rsa.pub`移到被连接sshd的主机上并改名为`authorized_keys`
## 三、设置开机自启服务
```bash
# 设置开机自启动
sudo systemctl enable ssh
# 取消开机自启动
sudo systemctl disable ssh
```
## 四、ssh常用命令
```bash
# 连接IP的sshd
ssh ip
# 连接IP的user用户的sshd
ssh user@ip
# 打开sshd
sudo service sshd start
# 关闭sshd
sudo service sshd stop
# 查看sshd状态
sudo service sshd status
```
