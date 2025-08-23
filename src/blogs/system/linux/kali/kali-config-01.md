---
title: 配置Kali-01
date: 2024-08-04
categories: 系统
tags:
  - kali
  - linux
---
# 简介
配置Kali-01

# 导航
*1. [配置 Kali-00](https://tianze-ya.github.io/blog/system/linux/kali/kali-config-00/)*
*2. [配置 Kali-01](https://tianze-ya.github.io/blog/system/linux/kali/kali-config-01/)                     <== 您在此处*
*3. [配置 Kali-02](https://tianze-ya.github.io/blog/system/linux/kali/kali-config-02/)*

# 一、登录
*默认用户：`kali`*
*默认密码：`kali`*

# 二、调整分辨率
Applications -> Settings -> Display
设置完成后点击 Apply （应用）

# 三、换源
```bash
# 更改/etc/apt/sources.list 文件
sudo sed -i "s@http://http.kali.org/kali@https://mirrors.tuna.tsinghua.edu.cn/kali@g" /etc/apt/sources.list
# 更新软件包
sudo apt update
```
*此处更换清华源*

# 四、汉化
#### 1、设置中文
```bash
sudo dpkg-reconfigure locales
```
使用方向键移动到`zh_CN.UTF-8 UTF-8`空格键选中 回车
接着选中`zh_CN.UTF-8`回车确定
重启即可生效

#### 2、安装中文输入法
*此处安装 fcitx 输入法*
参考：*[Kali 设置中文输入法 ](https://blog.csdn.net/weixin_43550772/article/details/139817468)*
```bash
sudo apt install fcitx fcitx-pinyin
```
将默认输入法改为 fcitx
打开 fcitx 配置，将拼音输入法移至第一位，按`Ctrl+Space`切换输入法
