---
title: Nmap
date: 2024-06-09
categories: 软件
tags:
  - 工具
  - linux
  - 渗透
---
# 简介
**nmap是一款非常强大的主机发现和端口扫描工具**
注 以 IP: 172.16.200.131 为目标机器
# 常用命令
### 主机查找

**输入事例**
```bash
sudo nmap -sn 172.16.200.0/24
```
![](img/note/app/nmap/nmap-01.png)
- -sn 指定IP地址
- 0/24 表示0~256的所有可能
**该命令用于查找IP地址范围内活跃的IP 即主机查找**

### 端口扫描

**输入事例**
```bash
sudo nmap --min-rate 10000 -p- 172.16.200.131
```
![](img/note/app/nmap/nmap-02.png)
- --min-rate 即最小查找时间 需按情况调整 10000适用于大部分场景
- -p- 指定IP地址 后面的-为查找所有端口
一般需要扫描两次 此处不做演示
##### **二次扫描**

**输入事例**
```bash
sudo nmap -sU --min-rate 10000 -p- 172.16.200.131
```
![](img/note/app/nmap/nmap-03.png)
- -sU 指定扫描UDP
此处防止遗漏分别扫描TCP和UDP 获得全部端口

### 获取信息

**输入事例**
```bash
sudo nmap -sT -sV -O -p80,111,777,52497,5353,40444 172.16.200.131
```
![](img/note/app/nmap/nmap-04.png)
- -sT  指定TCP 因为很多端口会同时有TCP和UDP 所以这里把UDP也写上
- -sV 查看版本
- -O  查看系统类型
- -p 后接端口号 用 "," 隔开

**输入事例**
```bash
sudo nmap --script=vuln -p80,111,777,52497,5353,40444 172.16.200.131
```
- --script 指定扫描脚本

该命令会扫描可行漏洞
