---
title: ruff
date: 2025-08-14
categories: 软件
tags:
  - 工具
  - Python
cover:
---
# 简介
- ⚡️ 比现有的 linter（如 Flake8）和格式化程序（如 Black）快 10-100 倍
- 🛠️ 支持`pyproject.toml`
- 🤝 Python 3.13 兼容性
- ⚖️ 与 [Flake8](https://docs.astral.sh/ruff/faq/#how-does-ruffs-linter-compare-to-flake8)、isort 和 [Black](https://docs.astral.sh/ruff/faq/#how-does-ruffs-formatter-compare-to-black) 的插入奇偶校验
- 📦 内置缓存，避免重新分析未更改的文件
- 🔧 修复支持自动纠错（例如，自动删除未使用的导入）
- 📏 超过 [800 个内置规则](https://docs.astral.sh/ruff/rules/)，具有本机重新实现 流行的 Flake8 插件
- ⌨️ [VS Code](https://github.com/astral-sh/ruff-vscode) [等的第一](https://docs.astral.sh/ruff/editors/setup)方[编辑器集成](https://docs.astral.sh/ruff/editors)
- 🌎 单存储库友好，具有分[层和级联配置](https://docs.astral.sh/ruff/configuration/#config-file-discovery)

# 安装
```shell
uv tool install ruff
```

# 配置
```pyproject.toml

```