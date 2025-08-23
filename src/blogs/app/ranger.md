---
title: Ranger
date: 2024-11-26
categories: 软件
tags:
  - linux
  - 工具
---
# 简介
一款在终端中的文件管理器

# 下载
```bash
sudo apt install ranger
```

# 配置
### 生成默认配置文件
```bash
ranger --copy-config=all
```
### 文件图标
需要安装nerdfont 本文不过多赘述 有需自行搜索
下载
```bash
git clone https://github.com/cdump/ranger-devicons2 ~/.config/ranger/plugins/devicons2
```
在`~/.config/ranger/rc.conf`中添加`default_linemode devicons2`
### 照片预览
#### w3m
下载
```bash
sudo apt install w3m-img
```
在`~/.config/ranger/rc.conf`中更改`set preview_images true`
#### ueberzug
下载
```bash
sudo apt install ueberzug
```
`~/.config/ranger/rc.conf`
```
set preview_images true
set preview_images_method ueberzug
```
### Git可视
在`~/.config/ranger/rc.conf`中更改`set vcs_aware true`

### 视屏预览
下载ffmpegthumbnailer 和 mediainfo
```bash
sudo apt install ffmpegthumbnailer mediainfo
```

 `~/.config/ranger/scope.sh`中查找/video
 取消这一段的注释
 ![](img/note/app/ranger/scope.png)
 
### 文本高亮
```bash
sudo apt install highlight
```

### 查看压缩文件
```bash
sudo apt install atool
```

### 预览HTML文件
```bash
sudo apt install lynx elinks
```

### 快捷键
在`rc.conf`中更改或添加以下
#### 智能cw 重命名
按下cw重命名 如果是单个文件就直接重命名 否则使用bulkrename
`map cw eval fm.execute_console("bulkrename") if fm.thisdir.marked_items else fm.open_console("rename " + fm.thisfile.basename)`
#### 智能查找
按下f 智能查找文件
`map f console scout -ftsea%space`
### 修改默认编辑器
打开`rifle.conf`
找到
![](img/note/app/ranger/rifle.png)
将`${VISUAL :-$EDITOR}`全部修改成自己的编辑器 如vim nvim code

# 快捷键
- `q`键退出
- `Enter`打开文件
- `:`进入命令模式
- `hjkl`同vim可切换目录
- `cw`重命名
- `zh`显示隐藏文件
- `Shift+s`切换到当前目录并退出