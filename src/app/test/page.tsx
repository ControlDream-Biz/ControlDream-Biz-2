'use client';

export default function TestPage() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>测试页面</h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>这个页面用于测试按钮是否能正常显示</p>

      {/* 测试按钮 - 使用最简单的方式 */}
      <button
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '50px',
          width: '100px',
          height: '100px',
          backgroundColor: 'red',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          borderRadius: '10px',
          zIndex: 999999999,
          cursor: 'pointer',
        }}
        onClick={() => alert('按钮点击成功！')}
      >
        测试按钮
      </button>
    </div>
  );
}
