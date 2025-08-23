---
title: Kitty
date: 2024-11-18
categories: 软件
tags:
  - linux
---
# 介绍
kitty 是一款极好的终端模拟器
- 快速
- 美观

# 安装
```bash
curl -L https://sw.kovidgoyal.net/kitty/installer.sh | sh /dev/stdin
sudo ln -s ~/.local/kitty.app/bin/kitty /usr/local/bin/kitty
```
随后自行添加桌面环境

# 配置
运行以下命令，已来更改主题
通过/键搜索 推荐Catppuccin-Mocha
```bash
kitty +kitten themes
```
随后按下M键来修改配置主题

`~/.config/kitty/kitty.conf`
```
# BEGIN_KITTY_THEME
# Catppuccin-Mocha
include current-theme.conf
# END_KITTY_THEME

# font
font_size 24
font_family          Maple Mono NF CN ExtraLight
bold_font            Maple Mono NF CN Bold
italic_font          Maple Mono NF CN Italic
bold_italic_font     Maple Mono NF CN Bold Italic
font_features        MapleMono-NF-CN-ExtraLight +cv01 +cv04
font_features        MapleMono-NF-CN-Bold +cv01 +cv04
font_features        MapleMono-NF-CN-Italic +cv01 +cv04
font_features        MapleMono-NF-CN-BoldItalic +cv01 +cv04
# -> !=
disable_ligatures cursor

# window
hide_window_decorations        titlebar-only
window_padding_width           15
background_opacity             0.8
background_blur                64
remember_window_size           yes

# tab bar
tab_bar_edge                top
tab_bar_style               powerline
tab_powerline_style         slanted

# vim key mapping
#map ctrl+s send_text all \e:w\r
#map ctrl+p send_text all :Telescope find_files\r
#map ctrl+shift+f send_text all :Telescope live_grep\r
#map ctrl+b send_text all :Neotree toggle\r

# tmux key mapping
map ctrl+1 combine : send_key ctrl+space : send_key 1
map ctrl+2 combine : send_key ctrl+space : send_key 2
map ctrl+3 combine : send_key ctrl+space : send_key 3
map ctrl+4 combine : send_key ctrl+space : send_key 4
map ctrl+5 combine : send_key ctrl+space : send_key 5
map ctrl+6 combine : send_key ctrl+space : send_key 6
map ctrl+7 combine : send_key ctrl+space : send_key 7
map ctrl+8 combine : send_key ctrl+space : send_key 8
map ctrl+9 combine : send_key ctrl+space : send_key 9

# cursor
cursor_blink_interval 0
detect_urls no
mouse_hide_wait 0.5
```