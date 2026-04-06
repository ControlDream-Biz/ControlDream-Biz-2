'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, Globe, MessageSquare, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Analytics {
  totalVisitors: number;
  recentVisitors: number;
  totalPageViews: number;
  totalConversations: number;
  pageViewDistribution: Record<string, number>;
  languageDistribution: Record<string, number>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExport = async () => {
    if (!analytics) return;

    const exportData = {
      ...analytics,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              数据分析仪表板
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              查看网站访问数据和用户行为统计
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              onClick={fetchAnalytics}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              刷新
            </Button>
            <Button
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              导出数据
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">总访客数</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics?.totalVisitors || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                最近30天: {analytics?.recentVisitors || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">页面浏览</CardTitle>
              <Eye className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics?.totalPageViews || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                总浏览次数
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">语言分布</CardTitle>
              <Globe className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Object.keys(analytics?.languageDistribution || {}).length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                支持的语言
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">对话总数</CardTitle>
              <MessageSquare className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics?.totalConversations || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                AI客服对话
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Page Views */}
          <Card>
            <CardHeader>
              <CardTitle>页面浏览分布</CardTitle>
              <CardDescription>各页面访问次数统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.pageViewDistribution &&
                  Object.entries(analytics.pageViewDistribution).map(
                    ([page, count]) => (
                      <div key={page}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 dark:text-gray-300">
                            {page}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${(count / (analytics.totalPageViews || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                {!analytics?.pageViewDistribution ||
                  Object.keys(analytics.pageViewDistribution).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    暂无数据
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Language Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>语言分布</CardTitle>
              <CardDescription>用户语言偏好统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.languageDistribution &&
                  Object.entries(analytics.languageDistribution).map(
                    ([lang, count]) => (
                      <div key={lang}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 dark:text-gray-300">
                            {lang}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${(count / (analytics.totalVisitors || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                {!analytics?.languageDistribution ||
                  Object.keys(analytics.languageDistribution).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    暂无数据
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
