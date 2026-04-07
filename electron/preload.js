import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 应用信息
  getVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),
  getArch: () => ipcRenderer.invoke('arch'),
  getAppPath: (name) => ipcRenderer.invoke('app-path', name),

  // 对话框
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),

  // 外部链接
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // 剪贴板
  readClipboardText: () => ipcRenderer.invoke('read-clipboard-text'),
  writeClipboardText: (text) => ipcRenderer.invoke('write-clipboard-text', text),

  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  unmaximizeWindow: () => ipcRenderer.invoke('unmaximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  reloadWindow: () => ipcRenderer.invoke('reload-window'),
  setFullscreen: (fullscreen) => ipcRenderer.invoke('set-fullscreen', fullscreen),
  setAlwaysOnTop: (onTop) => ipcRenderer.invoke('set-always-on-top', onTop),

  // 屏幕
  getScreenSize: () => ipcRenderer.invoke('get-screen-size'),
  capturePage: () => ipcRenderer.invoke('capture-page'),

  // 系统信息
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getBatteryInfo: () => ipcRenderer.invoke('get-battery-info'),

  // 缓存
  clearCache: () => ipcRenderer.invoke('clear-cache'),

  // 通知
  sendNotification: (title, body) => ipcRenderer.invoke('send-notification', title, body),

  // 监听菜单事件
  onMenuNewTab: (callback) => ipcRenderer.on('menu-new-tab', callback),
  onShowShortcuts: (callback) => ipcRenderer.on('show-shortcuts', callback),

  // 移除监听
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// 类型定义
declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
      getPlatform: () => Promise<string>;
      getArch: () => Promise<string>;
      getAppPath: (name: string) => Promise<string>;
      showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>;
      showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>;
      showOpenDialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>;
      openExternal: (url: string) => Promise<void>;
      readClipboardText: () => Promise<string>;
      writeClipboardText: (text: string) => Promise<void>;
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      unmaximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      reloadWindow: () => Promise<void>;
      setFullscreen: (fullscreen: boolean) => Promise<void>;
      setAlwaysOnTop: (onTop: boolean) => Promise<void>;
      getScreenSize: () => Promise<{ width: number; height: number }>;
      capturePage: () => Promise<string>;
      getSystemInfo: () => Promise<any>;
      getBatteryInfo: () => Promise<{ onBattery: boolean; batteryLevel: number }>;
      clearCache: () => Promise<void>;
      sendNotification: (title: string, body: string) => Promise<void>;
      onMenuNewTab: (callback: () => void) => void;
      onShowShortcuts: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
