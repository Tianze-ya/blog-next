---
title: 高效管理python的工具uv
date: 2025-08-11
categories: 软件
tags:
  - Python
cover:
---
# 简介
高效管理python的工具uv

- 🚀 单一工具可替换`pip` `pip-tools` `pipx` `poetry` `pyenv` `twine` `virtualenv`
- ⚡️ 比`pip`快 [10-100 倍](https://github.com/astral-sh/uv/blob/main/BENCHMARKS.md)。
- 🗂️ 提供[全面的项目管理](https://github.com/astral-sh/uv#projects)，具有[通用锁定文件](https://docs.astral.sh/uv/concepts/projects/layout#the-lockfile)。
- ❇️ [运行脚本](https://github.com/astral-sh/uv#scripts)，支持[内联依赖项元数据](https://docs.astral.sh/uv/guides/scripts#declaring-script-dependencies)。
- 🐍 [安装和管理](https://github.com/astral-sh/uv#python-versions) Python 版本。
- 🛠️ [运行并安装](https://github.com/astral-sh/uv#tools)作为 Python 包发布的工具。
- 🔩 包括一个[像素兼容接口](https://github.com/astral-sh/uv#the-pip-interface)，可通过 熟悉的 CLI。
- 🏢 支持货运式[工作空间](https://docs.astral.sh/uv/concepts/projects/workspaces) 可扩展的项目。
- 💾 磁盘空间高效，具有[全局缓存](https://docs.astral.sh/uv/concepts/cache) 依赖重复数据删除。
- ⏬ 无需 Rust 或 Python 即可安装。
- 🖥️ 支持 macOS、Linux 和 Windows。

# 下载
```shell
# On macOS and Linux.
curl -LsSf https://astral.sh/uv/install.sh | sh
# On Windows.
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
set Path=C:\Users\tianze\.local\bin;%Path%
```

# 使用
```shell
# 更新uv
uv self update
# 交互式创建项目
uv init -p ~ -n ~(--python --name)
# 添加/删除库 (在打包时不包含)
uv add ~ （--dev）
uv remove ~（--dev）
# 添加库作为全局工具
uv toll install ~
# 运行工具
uv tool run ~
# 默认创建.venv
uv venv
# 指定Python版本
uv venv --python ~
# 包含系统包
uv venv --system
# 列出已安装版本
uv python list
# 安装特定版本
uv python install ~
# 切换版本
uv use ~
# 根据pyproject.toml安装依赖
uv sync
# 强制使用lock文件版本（CI场景）
uv sync --frozen
# 运行
uv run ~
```