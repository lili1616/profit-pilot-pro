'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [bulletPool, setBulletPool] = useState(0); 
  const [returnedPrincipal, setReturnedPrincipal] = useState(0); 

  // 资产配置
  const [assets, setAssets] = useState([
    { id: 0, name: '🥇 易方达黄金', principal: 4000, val: 0, limit: 200 },
    { id: 1, name: '🥈 国泰有色矿业', principal: 5000, val: 0, limit: 200 },
    { id: 2, name: '🥉 万家中证工业有色', principal: 3000, val: 0, limit: 200 },
    { id: 3, name: '🧪 广发稀有金属', principal: 1900, val: 0, limit: 200 },
    { id: 4, name: '🏦 国投瑞银', principal: 100, val: 0, limit: 100 }
  ]);

  useEffect(() => { setIsMounted(true); }, []);

  // 仪表盘核心：只要数值变了，必须重新计算
  const updateVal = (id: number, input: string) => {
    const num = parseFloat(input) || 0;
    const newAssets = assets.map(a => a.id === id ? { ...a, val: num } : a);
    setAssets(newAssets);
  };

  const handleAction = (id: number) => {
    const a = assets[id];
    const b = a.principal;
    const v = a.val; // 当前输入的盈亏值
    const ratio = v / b;

    if (ratio <= -0.20) {
      alert(`【🚨 极限止损警告】\n亏损达 ${(ratio * 100).toFixed(1)}%！不再补仓，止损离场！`);
    } else if (ratio >= 0.15) {
      const net = Math.floor(v * 0.4);
      const out = Math.floor(net * (1 + b / v));
      setBulletPool(prev => prev + net);
      setReturnedPrincipal(prev => prev + (out - net));
      alert(`【🎯 精准收割】\n1.利润入库：${net}元\n2.本金回流：${out-net}元\n👉 App卖出：${out}元`);
    } else if (ratio <= -0.05) {
      if (bulletPool < a.limit) {
        alert(`【⚠️ 弹药不足】需要${a.limit}元，库内仅剩${bulletPool}元！`);
      } else {
        setBulletPool(prev => prev - a.limit);
        alert(`【🛡️ 战术补仓】已拨付${a.limit}元执行防御！`);
      }
    } else {
      alert("【☕ 静默观望】战况未达触发线，继续持有。");
    }
  };

  if (!isMounted) return null;

  return (
    <div style={{ background: '#000', color: '#d4af37', minHeight: '100vh', padding: '15px' }}>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>PROFIT PILOT 9.0</h2>
      
      {/* 数据池：支持点击修改 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1, border: '2px solid #0f0', padding: '10px', textAlign: 'center', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', color: '#888' }}>子弹库</div>
          <input type="number" value={bulletPool} onChange={e => setBulletPool(Number(e.target.value))} style={{ width: '80%', background: 'transparent', color: '#0f0', border: 'none', textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }} />
        </div>
        <div style={{ flex: 1, border: '2px solid #d4af37', padding: '10px', textAlign: 'center', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', color: '#888' }}>回流池</div>
          <input type="number" value={returnedPrincipal} onChange={e => setReturnedPrincipal(Number(e.target.value))} style={{ width: '80%', background: 'transparent', color: '#d4af37', border: 'none', textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }} />
        </div>
      </div>

      {assets.map((a) => {
        const percent = ((a.val / a.principal) * 100).toFixed(1);
        const color = a.val > 0 ? '#ff4444' : (a.val < 0 ? '#00ff00' : '#666');

        return (
          <div key={a.id} style={{ background: '#1a1a1a', border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* 仪表盘：必须实时跟着 a.val 变 */}
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: color }}>{percent}%</span>
                <b style={{ color: '#fff' }}>{a.name}</b>
              </div>
              <span style={{ fontSize: '11px', color: '#666' }}>本金: {a.principal}</span>
            </div>
            
            <input 
              type="number" 
              placeholder="涨填正数，跌填负数 (例: 500 或 -200)" 
              onChange={e => updateVal(a.id, e.target.value)} 
              style={{ width: '92%', background: '#222', color: '#fff', border: '1px solid #444', padding: '12px', borderRadius: '8px', marginBottom: '10px' }} 
            />
            
            <button 
              onClick={() => handleAction(a.id)} 
              style={{ width: '100%', padding: '15px', background: (a.val/a.principal) <= -0.2 ? '#ff4444' : '#d4af37', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '8px' }}
            >
              {(a.val/a.principal) <= -0.2 ? '🚨 极限止损' : '执行战术指令'}
            </button>
          </div>
        );
      })}
      
      <button onClick={() => {setBulletPool(0); setReturnedPrincipal(0);}} style={{ width: '100%', padding: '10px', background: '#333', color: '#888', border: 'none', borderRadius: '8px' }}>
        重置池子
      </button>
    </div>
  );
}
