---
title: Zsh
date: 2024-08-11
categories: 软件
tags:
  - linux
---
# 简介
一款扩展性强的shell

# 安装
安装zsh
```bash
brew install zsh
```
设置为默认shell
```bash
chsh -s /bin/zsh
```

# 插件
## 终端提示符
有两个推荐，二选一

### powerlevel10k
```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.powerlevel10k
echo 'source ~/.powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc
```
输入`p10k configure`可配置

### Starrship
[starrship官网](https://starship.rs/zh-CN)
```bash
sudo curl -sS https://starship.rs/install.sh | sh
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
```
配置文件`~/.config/starship.toml`

## 配置
`~/.zshrc`
