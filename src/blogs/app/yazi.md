---
title: yazi
date: 2024-12-21
categories: 软件
tags:
  - linux
  - 工具
cover:
---
# 简介
一款开箱即用 扩展性强的终端文件管理器

# 安装
请在此之前安装Nerd Font
```bash
brew install yazi ffmpeg sevenzip jq poppler fd ripgrep fzf zoxide imagemagick
```

# 插件和配置
将此代码放到您的zshrc/bashrc中
```bash
function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
		builtin cd -- "$cwd"
	fi
	rm -f -- "$tmp"
}
```

下载
```bash
ya pack -a KKV9/compress
ya pack -a yazi-rs/plugins:git
ya pack -a h-hg/yamb
ya pack -a llanosrocas/yaziline
ya pack -a yazi-rs/flavors:catppuccin-mocha
ya pack -a yazi-rs/plugins:full-border
ya pack -a yazi-rs/plugins:max-preview
```

```bash
git clone https://github.com/Tianze-ya/yazi.git
rm -rf ./yazi/.git
cp -r ./yazi ~/.config/
```