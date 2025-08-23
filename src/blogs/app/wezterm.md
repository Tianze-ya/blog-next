---
title: Wezterm
date: 2024-08-11
categories: 软件
tags: []
---
# 简介
一款由Rust编写的Terminal
具有强大的定制化内容
官网： https://wezfurlong.org/wezterm/

# 安装
```bash
brew tap wezterm/wezterm-linuxbrew
brew install wezterm
```
随后自行添加桌面环境

或者
```bash
curl -fsSL https://apt.fury.io/wez/gpg.key | sudo gpg --yes --dearmor -o /etc/apt/keyrings/wezterm-fury.gpg
echo 'deb [signed-by=/etc/apt/keyrings/wezterm-fury.gpg] https://apt.fury.io/wez/ * *' | sudo tee /etc/apt/sources.list.d/wezterm.list
sudo apt update
sudo apt install wezterm
```
# 配置
```bash
mkdir ~/.config/wezterm
vim ~/.config/wezterm/wezterm.lua
```

```lua
local wezterm = require("wezterm")
local config = {
	font_size = 20,
	font = wezterm.font{
		family = "Maple Mono NF",
		weight = "Regular",
		harfbuzz_features = { "+cv01", "+cv04"},
	},
	color_scheme = "Catppuccin Mocha",
	use_fancy_tab_bar = false,
	hide_tab_bar_if_only_one_tab = true,
	window_decorations = "RESIZE",
	show_new_tab_button_in_tab_bar = false,
	window_background_opacity = 0.9,
	macos_window_background_blur = 70,
	text_background_opacity = 0.9,
	adjust_window_size_when_changing_font_size = false,
	initial_cols = 100,
    initial_rows = 50,
	window_padding = {
		left = 20, 
		right = 20,
		top = 20,
		bottom = 5,
	},
	keys = {
		{ key = 'n', mods = 'ALT', 
		action = wezterm.action.ToggleFullScreen,
		},
		-- For Tmux
		{
		key = "1", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "1" })
		}),
		},
		{
		key = "2", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "2" })
		}),
		},
		{
		key = "3", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "3" })
		}),
		},
		{
		key = "4", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "4" })
		}),
		},
		{
		key = "5", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "5" })
		}),
		},
		{
		key = "6", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "6" })
		}),
		},
		{
		key = "7", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "7" })
		}),
		},
		{
		key = "8", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "8" })
		}),
		},
		{
		key = "9", mods = "CTRL",
		action = wezterm.action.Multiple({
			wezterm.action.SendKey({ mods = "CTRL",key = " " }),
			wezterm.action.SendKey({ key = "9" })
		}),
		},
	},
}

wezterm.on('gui-startup', function(cmd)
  local tab, pane, window = wezterm.mux.spawn_window(cmd or {})
  window:gui_window():maximize()
end)

return config
```

# 快捷键
- FullScreen - `Alt+n`