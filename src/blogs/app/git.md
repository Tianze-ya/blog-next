---
title: Git 导航
date: 2024-08-04
categories: 软件
tags:
  - 工具
---
# 一、简介
 ***一款分布式版本控制系统软件***
**创始人就是我们伟大的Linux之父 林纳斯·本纳第克特·托瓦兹（Linus Benedict Torvalds）**
**`Git 的出现高效的解决了团队开发中代码难同步的问题`**

# 二、下载

**官网：[Git](https://git-scm.com/)**
安装完成后输入以下命令来检查
```bash
git --version
```

# 三、配置

1、配置用户及邮箱信息
`username: Github 用户名`
`your_email@example.com: Github 邮箱`
```bash
git config --global user.name "username"
git config --global user.email "your_email@example.com"
```

2、创建SSH密钥
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
*一路回车即可*  密钥被存储在 **~/.ssh/id_...**
打开[Github](https://github.com)  Settings -> Access -> SSH and GPG keys -> New SSH key
![](img/note/app/git/git-01.png)

将密钥中的文本填入`key`中，点击`Add SHH key`
![](img/note/app/git/git-02.png)
# 四、创建工作区

如果你创建了一个空仓库，想要把本地代码上传，使用一下命令
```bash
# 初始化仓库
git init
# 绑定远程仓库
# 使用ssh进行添加
git remote add origin repo_url
# 设置主分支
git branch -M main
# 将文件加入缓存区
git add filename
git add . # 添加所有更改的文件
# 提交代码至本地
git commit -m "message"
# 推送至远程仓库
git push -u origin main
# -u, --[no-]set-upstream -> set upstream for git pull/status
```

如果你正加入一个仓库，使用如下命令
```bash
# 克隆仓库
git clone repo_url
# 你可能想要切换至新的分支
git checkout -b new_feature
# 将文件加入缓存区
git add filename
git add . # 添加所有更改的文件
# 提交代码至本地
git commit -m "message"
# 推送至远程仓库
git push -u origin new_feature
# -u, --[no-]set-upstream -> set upstream for git pull/status
```

# 五、常用命令

**参照网站**
- [Git 教程 | 菜鸟教程](https://www.runoob.com/git/git-tutorial.html)
- [Git 使用教程-CSDN博客](https://blog.csdn.net/qq_16027093/article/details/130503317)
