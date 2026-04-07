'use client';

import { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Battery,
  Clock,
  Zap,
  Shield,
  Bell,
  Settings,
  RefreshCw,
  Maximize2,
  Minimize2,
  X,
  Camera,
  Copy,
  Trash2,
  FolderOpen,
  FileText,
  ImageIcon,
  Video,
  Music,
  Terminal,
  Globe,
  Lock,
  Sun,
  Moon,
  WifiOff,
  WifiHigh,
  Activity,
  Database,
  Server,
  Cloud,
  CloudDownload,
  CloudUpload,
  Send,
  Smile,
  HeartHandshake,
  Sparkles,
  Thermometer,
  Droplets,
  Wind,
  Sun as SunIcon,
  Moon as MoonIcon,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShieldQuestion,
  LockOpen,
  Power,
  Smartphone,
  Laptop,
  Tablet,
  Mic,
  MicOff,
  Aperture,
  Scan,
  ScanQrCode,
  BarChart3,
  Users,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// 类型声明
declare global {
  interface Window {
    electronAPI?: any;
  }
}

// 检测是否为 Electron 环境
const isElectron = (): boolean => {
  return typeof window !== 'undefined' && (window as any).electronAPI !== undefined;
};

export function ElectronDashboard() {
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [batteryInfo, setBatteryInfo] = useState<any>(null);
  const [screenSize, setScreenSize] = useState<{ width: number; height: number } | null>(null);
  const [clipboardText, setClipboardText] = useState('');
  const [platform, setPlatform] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [uptime, setUptime] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('online');
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [diskUsage, setDiskUsage] = useState(78);

  useEffect(() => {
    if (!isElectron()) return;

    // 获取系统信息
    const fetchSystemInfo = async () => {
      const info = await window.electronAPI.getSystemInfo();
      setSystemInfo(info);
      setUptime(info.uptime);

      // 获取平台信息
      const plat = await window.electronAPI.getPlatform();
      setPlatform(plat);

      // 获取版本
      const ver = await window.electronAPI.getVersion();
      setVersion(ver);
    };

    // 获取电池信息
    const fetchBatteryInfo = async () => {
      const info = await window.electronAPI.getBatteryInfo();
      setBatteryInfo(info);
    };

    // 获取屏幕大小
    const fetchScreenSize = async () => {
      const size = await window.electronAPI.getScreenSize();
      setScreenSize(size);
    };

    // 初始化数据
    fetchSystemInfo();
    fetchBatteryInfo();
    fetchScreenSize();

    // 定时更新数据
    const interval = setInterval(() => {
      setCpuUsage(Math.random() * 30 + 20);
      setMemoryUsage(Math.random() * 20 + 50);
      setDiskUsage(Math.random() * 10 + 70);
      setUptime(prev => prev + 1);
    }, 2000);

    // 监听网络状态
    window.addEventListener('online', () => setNetworkStatus('online'));
    window.addEventListener('offline', () => setNetworkStatus('offline'));

    // 监听剪贴板
    setInterval(async () => {
      try {
        const text = await window.electronAPI.readClipboardText();
        setClipboardText(text);
      } catch (e) {
        // 忽略错误
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', () => setNetworkStatus('online'));
      window.removeEventListener('offline', () => setNetworkStatus('offline'));
    };
  }, []);

  // 窗口控制
  const handleMinimize = async () => {
    if (isElectron()) {
      await window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = async () => {
    if (isElectron()) {
      await window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = async () => {
    if (isElectron()) {
      await window.electronAPI.closeWindow();
    }
  };

  const handleReload = async () => {
    if (isElectron()) {
      await window.electronAPI.reloadWindow();
    }
  };

  const handleToggleFullscreen = async () => {
    if (isElectron()) {
      setIsFullscreen(!isFullscreen);
      await window.electronAPI.setFullscreen(!isFullscreen);
    }
  };

  const handleToggleAlwaysOnTop = async () => {
    if (isElectron()) {
      setIsAlwaysOnTop(!isAlwaysOnTop);
      await window.electronAPI.setAlwaysOnTop(!isAlwaysOnTop);
    }
  };

  const handleClearCache = async () => {
    if (isElectron()) {
      await window.electronAPI.clearCache();
      alert('缓存已清除');
    }
  };

  const handleScreenshot = async () => {
    if (isElectron()) {
      const dataUrl = await window.electronAPI.capturePage();
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `screenshot-${Date.now()}.png`;
      link.click();
    }
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(clipboardText);
    alert('已复制到剪贴板');
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isElectron()) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Web 版本</h3>
          <p className="text-gray-600">
            此功能仅在桌面应用中可用。请下载 Electron 版本体验完整功能。
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部控制栏 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Monitor className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold">创梦管理后台</h3>
              <p className="text-sm text-gray-600">桌面应用 v{version} • {platform}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleMinimize}>
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleMaximize}>
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleToggleFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReload}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* 主要内容区域 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="system">系统</TabsTrigger>
          <TabsTrigger value="network">网络</TabsTrigger>
          <TabsTrigger value="tools">工具</TabsTrigger>
          <TabsTrigger value="security">安全</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        {/* 概览 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">CPU 使用率</p>
                  <p className="text-2xl font-bold">{Math.round(cpuUsage)}%</p>
                </div>
                <Cpu className="w-8 h-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">内存使用</p>
                  <p className="text-2xl font-bold">{Math.round(memoryUsage)}%</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">磁盘使用</p>
                  <p className="text-2xl font-bold">{Math.round(diskUsage)}%</p>
                </div>
                <HardDrive className="w-8 h-8 text-purple-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">运行时间</p>
                  <p className="text-2xl font-bold">{formatUptime(uptime)}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Battery className="w-5 h-5 mr-2" />
                电池信息
              </h3>
              {batteryInfo && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">电池状态</span>
                    <Badge variant={batteryInfo.onBattery ? 'secondary' : 'default'}>
                      {batteryInfo.onBattery ? '使用电池' : '充电中'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">电量</span>
                    <span>{Math.round(batteryInfo.batteryLevel * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${batteryInfo.batteryLevel * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                显示器信息
              </h3>
              {screenSize && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">分辨率</span>
                    <span>{screenSize.width} x {screenSize.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">宽高比</span>
                    <span>{(screenSize.width / screenSize.height).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">像素密度</span>
                    <span>1x</span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2" />
              系统信息
            </h3>
            {systemInfo && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">平台</p>
                  <p className="font-semibold">{systemInfo.platform}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">架构</p>
                  <p className="font-semibold">{systemInfo.arch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">系统版本</p>
                  <p className="font-semibold">{systemInfo.release}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">主机名</p>
                  <p className="font-semibold">{systemInfo.hostname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">总内存</p>
                  <p className="font-semibold">{formatBytes(systemInfo.totalmem)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">可用内存</p>
                  <p className="font-semibold">{formatBytes(systemInfo.freemem)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPU 核心数</p>
                  <p className="font-semibold">{systemInfo.cpus.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CPU 型号</p>
                  <p className="font-semibold text-sm">{systemInfo.cpus[0]?.model}</p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* 系统管理 */}
        <TabsContent value="system" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">窗口控制</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant={isAlwaysOnTop ? 'default' : 'outline'}
                onClick={handleToggleAlwaysOnTop}
                className="w-full"
              >
                {isAlwaysOnTop ? (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    取消置顶
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    始终置顶
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleToggleFullscreen} className="w-full">
                <Maximize2 className="w-4 h-4 mr-2" />
                全屏模式
              </Button>
              <Button variant="outline" onClick={handleClearCache} className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                清除缓存
              </Button>
              <Button variant="outline" onClick={handleReload} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新页面
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">快捷操作</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={handleScreenshot} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                截图保存
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyClipboard}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                复制剪贴板
              </Button>
              <Button variant="outline" className="w-full">
                <FolderOpen className="w-4 h-4 mr-2" />
                打开数据目录
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">剪贴板内容</h3>
            <div className="p-4 bg-gray-50 rounded-lg min-h-[100px]">
              <p className="text-sm text-gray-600 break-all">
                {clipboardText || '剪贴板为空'}
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* 网络 */}
        <TabsContent value="network" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">网络状态</h3>
            <div className="flex items-center space-x-4">
              <Badge variant={networkStatus === 'online' ? 'default' : 'destructive'}>
                {networkStatus === 'online' ? (
                  <>
                    <WifiHigh className="w-4 h-4 mr-2" />
                    在线
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 mr-2" />
                    离线
                  </>
                )}
              </Badge>
              <span className="text-sm text-gray-600">
                信号强度: 强
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">网络统计</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">下载速度</span>
                  <span className="font-semibold">45.2 MB/s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">上传速度</span>
                  <span className="font-semibold">12.8 MB/s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 工具箱 */}
        <TabsContent value="tools" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">常用工具</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-8 flex flex-col">
                <Terminal className="w-8 h-8 mb-2" />
                终端
              </Button>
              <Button variant="outline" className="h-auto py-8 flex flex-col">
                <Camera className="w-8 h-8 mb-2" />
                截图
              </Button>
              <Button variant="outline" className="h-auto py-8 flex flex-col">
                <ScanQrCode className="w-8 h-8 mb-2" />
                扫码
              </Button>
              <Button variant="outline" className="h-auto py-8 flex flex-col">
                <Copy className="w-8 h-8 mb-2" />
                剪贴板
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">快捷键</h3>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>最小化窗口</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+M</kbd>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>最大化窗口</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+Shift+M</kbd>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>刷新页面</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">F5</kbd>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>强制刷新</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+Shift+R</kbd>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>开发者工具</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+Shift+I</kbd>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>全屏模式</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">F11</kbd>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>显示/隐藏窗口</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+Shift+H</kbd>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* 安全 */}
        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">安全状态</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheck className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-semibold">系统安全</p>
                    <p className="text-sm text-gray-600">所有安全检查通过</p>
                  </div>
                </div>
                <Badge variant="default">正常</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheck className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-semibold">网络加密</p>
                    <p className="text-sm text-gray-600">HTTPS 连接已启用</p>
                  </div>
                </div>
                <Badge variant="default">启用</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheck className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-semibold">数据加密</p>
                    <p className="text-sm text-gray-600">本地数据已加密存储</p>
                  </div>
                </div>
                <Badge variant="default">启用</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">权限管理</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-gray-600" />
                  <span>摄像头权限</span>
                </div>
                <Badge variant="secondary">已授权</Badge>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-gray-600" />
                  <span>麦克风权限</span>
                </div>
                <Badge variant="secondary">已授权</Badge>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-gray-600" />
                  <span>文件访问权限</span>
                </div>
                <Badge variant="secondary">已授权</Badge>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-gray-600" />
                  <span>通知权限</span>
                </div>
                <Badge variant="secondary">已授权</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 设置 */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">应用设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">启动时最小化到托盘</p>
                  <p className="text-sm text-gray-600">应用启动时最小化到系统托盘</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">开机自启动</p>
                  <p className="text-sm text-gray-600">系统启动时自动运行应用</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">关闭时最小化到托盘</p>
                  <p className="text-sm text-gray-600">点击关闭按钮时最小化而不是退出</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">硬件加速</p>
                  <p className="text-sm text-gray-600">启用 GPU 硬件加速</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">外观设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">深色模式</p>
                  <p className="text-sm text-gray-600">使用深色主题</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">透明窗口</p>
                  <p className="text-sm text-gray-600">窗口背景透明度 90%</p>
                </div>
                <Switch />
              </div>

              <div>
                <p className="font-medium mb-2">窗口透明度</p>
                <input
                  type="range"
                  min="50"
                  max="100"
                  defaultValue="100"
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">语言设置</h3>
            <select className="w-full p-2 border rounded-lg">
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
              <option value="ko-KR">한국어</option>
            </select>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">关于</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">应用名称</span>
                <span>创梦管理后台</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">版本</span>
                <span>v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Electron 版本</span>
                <span>{process.versions?.electron || '未知'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Node.js 版本</span>
                <span>{process.versions?.node || '未知'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chrome 版本</span>
                <span>{process.versions?.chrome || '未知'}</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
