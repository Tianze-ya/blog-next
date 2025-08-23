---
title: 开机自启
date: 2023-4-12
categories: 代码
tags:
  - Python
---
# 简介
开机自启

# Auto Run

代码如下：
```python
import os
import sys
import winreg
import ctypes
import win32api
import win32con


def auto_run(switch:bool=True) -> None:
    BaseName = os.path.basename(sys.argv[0]) #获取程序名
    if not ctypes.windll.shell32.IsUserAnAdmin():
                ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, BaseName, None, 1)
                return#是否管理员权限

    location = fr"SOFTWARE\Microsoft\Windows\CurrentVersion\Run" #注册表位置

    #判断是否已经自启
    def is_auto_run() ->bool:
        # 获取注册表该位置的所有键值
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, location)
        i = 0
        while True:
            try:
                # 获取注册表对应位置的键和值
                if winreg.EnumValue(key, i)[0] == BaseName:
                    return True
                i += 1
            except OSError: #直到值遍历完
                winreg.CloseKey(key) #关闭注册表
                break
        return False

    #设置自启
    Is_auto_run = is_auto_run()
    if switch:
        if not Is_auto_run:
            sys.setrecursionlimit(1000000) #设置递归深度，防止Timeover
            commnd = os.path.join(os.getcwd(),BaseName) #启动软件的命令
            name = BaseName
            
            key = win32api.RegOpenKey(win32con.HKEY_CURRENT_USER, location, 0, win32con.KEY_ALL_ACCESS) #打开注册表
            
            win32api.RegSetValueEx(key, name, 0, win32con.REG_SZ, commnd)#设值
            win32api.RegCloseKey(key) #关闭注册表
    else:
        if Is_auto_run:
            
            key = win32api.RegOpenKey(win32con.HKEY_CURRENT_USER, location, 0, win32con.KEY_ALL_ACCESS)#打开注册表
            
            win32api.RegDeleteValue(key, BaseName)#删除注册表
            win32api.RegCloseKey(key) #关闭注册表

```

# 库:
```bash
pip install pywin32
```

*仅支持windows系统，需要管理员权限*
[讲解](https://www.bilibili.com/video/BV1Pz4y1c7Mx/)
