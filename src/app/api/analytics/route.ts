import { NextResponse, NextRequest } from 'next/server';
import { getAnalytics, createOrUpdateVisitor, logPageView } from '@/lib/db/queries';

/**
 * Analytics API
 * 用于收集和分析用户访问数据
 */

export async function GET(_request: NextRequest) {
  try {
    const analytics = await getAnalytics();
    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'track_visitor') {
      const visitor = await createOrUpdateVisitor(data);
      return NextResponse.json({ success: true, visitor });
    }

    if (action === 'track_page_view') {
      const pageView = await logPageView(data);
      return NextResponse.json({ success: true, pageView });
    }

    if (action === 'track_metric') {
      // Web Vitals 指标追踪
      console.log('Web Vitals:', data);
      // 这里可以保存到数据库或发送到监控服务
      return NextResponse.json({ success: true, metric: data.metric });
    }

    if (action === 'track_event') {
      // 自定义事件追踪
      console.log('Custom Event:', data);
      // 这里可以保存到数据库
      return NextResponse.json({ success: true, event: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}
