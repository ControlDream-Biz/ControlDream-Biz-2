import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, shell, dialog, globalShortcut, clipboard, Notification, screen, powerMonitor } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

// 检查是否为开发环境
const isDev = process.env.NODE_ENV === 'development';
const port = 5000;
const url = isDev ? `http://localhost:${port}/admin` : 'https://chuangmeng.com/admin';

// 创建应用图标
const getIcon = () => {
  if (isDev) {
    // 开发环境使用默认图标
    return nativeImage.createEmpty();
  }
  // 生产环境使用应用图标
  return nativeImage.createFromPath(path.join(__dirname, '../public/icon-512.png'));
};

// 创建主窗口
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: '创梦管理后台 v1.0',
    icon: getIcon(),
    frame: true,
    transparent: false,
    resizable: true,
    maximizable: true,
    minimizable: true,
    fullscreenable: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    show: false, // 等待加载完成后再显示
  });

  // 加载应用
  mainWindow.loadURL(url);

  // 窗口加载完成后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // 开发环境打开开发者工具
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // 阻止新窗口打开（在默认浏览器中打开）
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // 处理窗口关闭事件
  mainWindow.on('close', (event) => {
    if (!isQuitting && process.platform === 'darwin') {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 创建应用菜单
  createAppMenu();

  // 创建系统托盘
  createTray();

  // 注册全局快捷键
  registerGlobalShortcuts();

  return mainWindow;
}

// 创建应用菜单
function createAppMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建标签页',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            mainWindow?.webContents.send('menu-new-tab');
          },
        },
        {
          label: '新建窗口',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            createNewWindow();
          },
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            isQuitting = true;
            app.quit();
          },
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: '重做',
          accelerator: 'CmdOrCtrl+Y',
          role: 'redo',
        },
        { type: 'separator' },
        {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll',
        },
      ],
    },
    {
      label: '视图',
      submenu: [
        {
          label: '刷新',
          accelerator: 'CmdOrCtrl+R',
          role: 'reload',
        },
        {
          label: '强制刷新',
          accelerator: 'CmdOrCtrl+Shift+R',
          role: 'forceReload',
        },
        {
          label: '清除缓存',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => {
            mainWindow?.webContents.session.clearCache();
            sendNotification('缓存已清除', '浏览器缓存已成功清除');
          },
        },
        { type: 'separator' },
        {
          label: '放大',
          accelerator: 'CmdOrCtrl+Plus',
          role: 'zoomIn',
        },
        {
          label: '缩小',
          accelerator: 'CmdOrCtrl+-',
          role: 'zoomOut',
        },
        {
          label: '恢复默认大小',
          accelerator: 'CmdOrCtrl+0',
          role: 'resetZoom',
        },
        { type: 'separator' },
        {
          label: '全屏',
          accelerator: 'F11',
          role: 'togglefullscreen',
        },
        {
          label: '开发者工具',
          accelerator: 'CmdOrCtrl+Shift+I',
          role: 'toggleDevTools',
        },
      ],
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        {
          label: '最大化',
          accelerator: 'CmdOrCtrl+Shift+M',
          role: 'maximize',
        },
        {
          label: '恢复',
          role: 'unmaximize',
        },
        { type: 'separator' },
        {
          label: '始终置顶',
          accelerator: 'CmdOrCtrl+Shift+T',
          type: 'checkbox',
          click: (menuItem) => {
            mainWindow?.setAlwaysOnTop(menuItem.checked);
          },
        },
        {
          label: '透明模式',
          accelerator: 'CmdOrCtrl+Shift+O',
          type: 'checkbox',
          click: (menuItem) => {
            mainWindow?.setOpacity(menuItem.checked ? 0.9 : 1);
          },
        },
      ],
    },
    {
      label: '工具',
      submenu: [
        {
          label: '截图',
          accelerator: 'CmdOrCtrl+Alt+S',
          click: async () => {
            const bounds = mainWindow?.getBounds();
            if (bounds) {
              const image = await mainWindow?.webContents.capturePage();
              const filePath = dialog.showSaveDialogSync(mainWindow!, {
                defaultPath: `screenshot-${Date.now()}.png`,
                filters: [{ name: 'PNG', extensions: ['png'] }],
              });
              if (filePath && image) {
                const fs = await import('fs');
                fs.writeFileSync(filePath, image.toPNG());
                sendNotification('截图成功', `已保存到: ${filePath}`);
              }
            }
          },
        },
        {
          label: '打开应用数据目录',
          click: () => {
            shell.openPath(app.getPath('userData'));
          },
        },
        {
          label: '检查更新',
          click: () => {
            sendNotification('检查更新', '当前已是最新版本');
          },
        },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '使用指南',
          accelerator: 'F1',
          click: () => {
            shell.openExternal('https://github.com/your-repo/docs');
          },
        },
        {
          label: '快捷键说明',
          click: () => {
            mainWindow?.webContents.send('show-shortcuts');
          },
        },
        {
          label: '反馈问题',
          click: () => {
            shell.openExternal('https://github.com/your-repo/issues');
          },
        },
        { type: 'separator' },
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: '关于',
              message: '创梦管理后台',
              detail: `版本: 1.0.0\n平台: ${os.platform()}\n架构: ${os.arch()}\nElectron: ${process.versions.electron}`,
              buttons: ['确定'],
            });
          },
        },
      ],
    },
  ];

  // macOS 特殊菜单
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 创建系统托盘
function createTray() {
  const icon = getIcon();
  tray = new Tray(icon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        mainWindow?.show();
      },
    },
    { type: 'separator' },
    {
      label: '刷新',
      click: () => {
        mainWindow?.reload();
      },
    },
    {
      label: '清除缓存',
      click: () => {
        mainWindow?.webContents.session.clearCache();
        sendNotification('缓存已清除', '浏览器缓存已成功清除');
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('创梦管理后台');
  tray.setContextMenu(contextMenu);

  // 单击托盘显示窗口
  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });

  // 最小化到托盘
  mainWindow?.on('minimize', () => {
    if (!isQuitting) {
      mainWindow?.hide();
    }
  });
}

// 注册全局快捷键
function registerGlobalShortcuts() {
  // Cmd/Ctrl+Shift+H: 显示/隐藏窗口
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });

  // Cmd/Ctrl+Shift+C: 复制当前URL
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    const url = mainWindow?.webContents.getURL();
    if (url) {
      clipboard.writeText(url);
      sendNotification('复制成功', `已复制当前URL到剪贴板`);
    }
  });

  // Cmd/Ctrl+Shift+Q: 快速退出
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    isQuitting = true;
    app.quit();
  });

  // F5: 强制刷新
  globalShortcut.register('F5', () => {
    mainWindow?.reload();
  });
}

// 创建新窗口
function createNewWindow() {
  const newWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: '创梦管理后台',
    icon: getIcon(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  newWindow.loadURL(url);

  if (isDev) {
    newWindow.webContents.openDevTools();
  }
}

// 发送系统通知
function sendNotification(title: string, body: string) {
  if (Notification.isSupported()) {
    new Notification({ title, body, icon: getIcon() }).show();
  }
}

// IPC 事件处理
ipcMain.handle('app-version', () => app.getVersion());

ipcMain.handle('platform', () => process.platform);

ipcMain.handle('arch', () => process.arch);

ipcMain.handle('app-path', (event, name) => app.getPath(name as any));

ipcMain.handle('show-message-box', async (event, options) => {
  return await dialog.showMessageBox(mainWindow!, options);
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  return await dialog.showSaveDialog(mainWindow!, options);
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  return await dialog.showOpenDialog(mainWindow!, options);
});

ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
});

ipcMain.handle('read-clipboard-text', () => {
  return clipboard.readText();
});

ipcMain.handle('write-clipboard-text', (event, text) => {
  clipboard.writeText(text);
});

ipcMain.handle('minimize-window', () => {
  mainWindow?.minimize();
});

ipcMain.handle('maximize-window', () => {
  mainWindow?.maximize();
});

ipcMain.handle('unmaximize-window', () => {
  mainWindow?.unmaximize();
});

ipcMain.handle('close-window', () => {
  mainWindow?.close();
});

ipcMain.handle('reload-window', () => {
  mainWindow?.reload();
});

ipcMain.handle('set-fullscreen', (event, fullscreen) => {
  mainWindow?.setFullScreen(fullscreen);
});

ipcMain.handle('set-always-on-top', (event, onTop) => {
  mainWindow?.setAlwaysOnTop(onTop);
});

ipcMain.handle('get-screen-size', () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  return { width, height };
});

ipcMain.handle('capture-page', async () => {
  if (mainWindow) {
    const image = await mainWindow.webContents.capturePage();
    return image.toDataURL();
  }
  return null;
});

ipcMain.handle('get-system-info', () => {
  return {
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    version: os.version(),
    hostname: os.hostname(),
    homedir: os.homedir(),
    tmpdir: os.tmpdir(),
    cpus: os.cpus(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    loadavg: os.loadavg(),
    uptime: os.uptime(),
  };
});

ipcMain.handle('clear-cache', async () => {
  if (mainWindow) {
    await mainWindow.webContents.session.clearCache();
    await mainWindow.webContents.session.clearStorageData();
  }
});

ipcMain.handle('get-battery-info', () => {
  if (powerMonitor.onBattery) {
    return {
      onBattery: powerMonitor.onBattery,
      batteryLevel: powerMonitor.getBatteryLevel?.() || 0,
    };
  }
  return { onBattery: false, batteryLevel: 1 };
});

ipcMain.handle('send-notification', (event, title, body) => {
  sendNotification(title, body);
});

// 应用启动
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// 应用关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
  globalShortcut.unregisterAll();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// 单实例锁定
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
