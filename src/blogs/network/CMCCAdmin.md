---
title: 获取中国移动CMCCAdmin账号密码
date: 2024-08-06
categories: 网络
tags:
---
# 简介
获取中国移动CMCCAdmin账号密码

# 使用
## 一、获取必要信息
**查看光猫终端IP、用户名及密码**
默认：
- 账号：user
- 密码：随机（此处用password代替）
- IP：192.168.1.1

## 二、具体操作
连接光猫的局域网
用浏览器打开（打开光猫的Telnet功能）
http://192.168.1.1/usr=CMCCAdmin&psw=aDm8H%25MdA&cmd=1&telnet.gch
打开windows中Telnet功能
打开cmd 输入 
`telnet 192.168.1.1`
login: `CMCCAdmin`
password: `aDm8H%MdA`
再输入
```bash
sidbg 1 DB decry /userconfig/cfg/db_user_cfg.xml
cd /tmp
vi debug-decry-cfg
# 利用vi中的搜索功能
/DevAuthInfo
```
随后即可看到用户名及密码

***参考：[一分钟时间教会如何轻松优雅地获取中国移动光猫超级管理员密码 ](https://www.bilibili.com/read/cv33997947/)***
