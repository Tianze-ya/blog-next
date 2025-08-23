---
title: Tmux
date: 2024-06-22
categories: 软件
tags:
  - 工具
  - linux
---
# 简介
- 终端复用
- 多任务管理

# 安装

```bash
brew install tmux
```

# 配置
### 一、安装TPM
```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```
### 二、配置文件
`~/.tmux.conf`
```
# List of plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'christoomey/vim-tmux-navigator'
set -g @plugin 'tmux-plugins/tmux-yank'
set -g @plugin 'jimeh/tmuxifier'

# catppuccin theme
set -g @plugin 'catppuccin/tmux'
set -g @catppuccin_flavor 'mocha'

run '~/.tmux/plugins/tpm/tpm'

# non-plugin-options
set -g default-terminal 'tmux-256color'
set -g base-index 1
set -g pane-base-index 1
set -g renumber-windows on
set -g mouse on

# visual mode
set-window-option -g mode-keys vi
bind-key -T copy-mode-vi v send-keys -X begin-selection
bind-key -T copy-mode-vi C-v send-keys -X rectangle-toggle
bind-key -T copy-mode-vi y send-keys -X copy-selection-and-cancel

# keymaps
unbind C-b
set -g prefix C-Space
```
按下`prefix+Shift+i`来安装插件

### 三、其中的插件
#### christoomey/vim-tmux-navigator
可以让你用`Ctrl+h/j/k/l`在vim-Pane和tmux-pane中无缝切换
#### tmux-plugins/tmux-yank
将在缓存区中复制的内容复制到系统剪贴板中，在远程服务器中同样生效
#### jimeh/tmuxifier
详见[jimeh/tmuxifier](https://github.com/jimeh/tmuxifier)

# 常用快捷键
***完整快捷键查询 [Tmux Cheat Sheet](https://tmuxcheatsheet.com/)***
- Prefix - `Crrl+Space`
- ChangeWindow - `Ctrl+1/2/3...`
- EnterSelection - `Ctrl+[`
- SelectPane - `Ctrl+h/j/k/l`
