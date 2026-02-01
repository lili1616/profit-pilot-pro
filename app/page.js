'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [bulletPool, setBulletPool] = useState(0); 
  const [returnedPrincipal, setReturnedPrincipal] = useState(0); 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // 1. 初始化资产配置
  const [assets, setAssets] = useState([
    { id: 0, name: '🥇 易方达黄金', principal: 4000, gain: '', loss: '', limit: 200 },
    { id: 1, name: '🥈 国泰有色矿业', principal: 5000, gain: '', loss: '', limit: 200 },
    { id: 2, name: '🥉 万家中证工业有色', principal: 3000, gain: '', loss: '', limit: 200 },
    { id: 3, name: '🧪 广发稀有金属', principal: 1900, gain: '', loss: '', limit: 200 },
    { id: 4, name: '🏦 国投瑞银', principal: 100, gain: '', loss: '', limit: 100 }
  ]);

  const updateAsset = (id: number, type: 'gain' | 'loss', val: string) => {
    const newAssets = [...assets];
    if (type === 'gain') newAssets[id].loss = ''; // 互斥
    if (type === 'loss') newAssets[id].gain = ''; // 互斥
    newAssets[id][type] = val;
    setAssets(newAssets);
  };

  const handleAction = (id: number) => {
    const a = assets[id];
    const b = a.principal;
    const g = parseFloat(a.gain) || 0;
    const l = parseFloat(a.loss) || 0;
    const ratio = g > 0 ? (g / b) : (l > 0 ? -(l / b) : 0);

    // --- 战术指令判定 ---
    if (ratio <= -0.20) {
      alert(`【🚨 极限止损警告】\n亏损已达 ${(ratio * 100).toFixed(1)}%！\n战况惨烈，已触及割肉红线。指令：立即停止补仓，止损离场！`);
    } else if (ratio >= 0.15) {
      const net = Math.floor(g * 0.4);
      const totalOut = Math.floor(net * (1 + b / g));
      setBulletPool(prev => prev + net);
      setReturnedPrincipal(prev => prev + (totalOut - net));
      alert(`【🎯 精准收割指令】\n盈利达标！\n1. 利润入库：${net}元\n2. 本金回流：${totalOut - net}元\n👉 App卖出填：${totalOut}元`);
    } else if (ratio <= -0.05) {
      if (bulletPool < a.limit) {
        alert(`【⚠️ 弹药枯竭】需补仓${a.limit}元，但子弹库仅剩${bulletPool}元！请先止盈。`);
      } else {
        setBulletPool(prev => prev - a.limit);
        alert(`【🛡️ 战术补仓】已拨付 ${a.limit}元 执行防御！`);
      }
    } else {
      alert("【☕ 静默观望】战况未达触发线，保持阵位。");
    }
  };

  if (!isMounted) return null;

  return (
    <div style={{ background: '#000', color: '#d4af37', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>PROFIT PILOT 9.0</h2>
      
      {/* 顶部池子：支持手动修改和清零 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1, border: '2px solid #0f0', padding: '10px', textAlign: 'center', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', color: '#888' }}>子弹库(可改)</div>
          <input type="number" value={bulletPool} onChange={(e) => setBulletPool(Number(e.target.value))} style={{ width: '80%', background: 'transparent', color: '#0f0', border: 'none', textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }} />
        </div>
        <div style={{ flex: 1, border: '2px solid #d4af37', padding: '10px', textAlign: 'center', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', color: '#888' }}>回流池(可改)</div>
          <input type="number" value={returnedPrincipal} onChange={(e) => setReturnedPrincipal(Number(e.target.value))} style={{ width: '80%', background: 'transparent', color: '#d4af37', border: 'none', textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }} />
        </div>
      </div>

      {assets.map((a) => {
        // 实时仪表盘计算
        const gVal = parseFloat(a.gain) || 0;
        const lVal = parseFloat(a.loss) || 0;
        const currentP = gVal > 0 ? gVal : (lVal > 0 ? -lVal : 0);
        const percent = ((currentP / a.principal) * 100).toFixed(1);
        const pColor = currentP > 0 ? '#ff4444' : (currentP < 0 ? '#00ff00' : '#666');

        return (
          <div key={a.id} style={{ background: '#1a1a1a', border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: pColor }}>{percent}%</span>
                <b style={{ color: '#fff' }}>{a.name}</b>
              </div>
              <span style={{ fontSize: '11px', color: '#666' }}>本金: {a.principal}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <input type="number" value={a.gain} placeholder="填盈利" onChange={e => updateAsset(a.id, 'gain', e.target.value)} style={{ flex: 1, background: '#222', color: '#ff4444', border: '1px solid #444', padding: '12px', borderRadius: '8px' }} />
              <input type="number" value={a.loss} placeholder="填亏损" onChange={e => updateAsset(a.id, 'loss', e.target.value)} style={{ flex: 1, background: '#222', color: '#00ff00', border: '1px solid #444', padding: '12px', borderRadius: '8px' }} />
            </div>
            
            <button onClick={() => handleAction(a.id)} style={{ width: '100%', padding: '15px', background: (currentP / a.principal) <= -0.2 ? '#ff4444' : '#d4af37', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '8px', fontSize: '16px' }}>
              {(currentP / a.principal) <= -0.2 ? '🚨 极限止损警告' : '执行战术指令'}
            </button>
          </div>
        );
      })}
      
      <button onClick={() => {setBulletPool(0); setReturnedPrincipal(0);}} style={{ width: '100%', padding: '10px', background: '#333', color: '#888', border: 'none', borderRadius: '8px', marginTop: '10px' }}>
        重置所有池子数据
      </button>
    </div>
  );
}
