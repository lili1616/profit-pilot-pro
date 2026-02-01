'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [bulletPool, setBulletPool] = useState(0); 
  const [returnedPrincipal, setReturnedPrincipal] = useState(0); 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const [assets, setAssets] = useState([
    { id: 0, name: '🥇 易方达黄金', principal: 4000, profit: 0, limit: 200 },
    { id: 1, name: '🥈 国泰有色矿业', principal: 5000, profit: 0, limit: 200 },
    { id: 2, name: '🥉 万家中证工业有色', principal: 3000, profit: 0, limit: 200 },
    { id: 3, name: '🧪 广发稀有金属', principal: 1900, profit: 0, limit: 200 },
    { id: 4, name: '🏦 国投瑞银', principal: 100, profit: 0, limit: 100 }
  ]);

  const updateVal = (id, type, val) => {
    const newAssets = [...assets];
    const num = Number(val) || 0;
    newAssets[id].profit = type === 'gain' ? num : -num;
    setAssets(newAssets);
  };

  const handleAction = (id) => {
    const asset = assets[id];
    const p = asset.profit;
    const b = asset.principal;
    
    if (p >= b * 0.15) {
      const netProfit = Math.floor(p * 0.4);
      const totalOut = Math.floor(netProfit * (1 + b / p));
      setBulletPool(prev => prev + netProfit);
      setReturnedPrincipal(prev => prev + (totalOut - netProfit));
      alert(`【止盈指令】\n1.纯利入库：${netProfit}元\n2.本金回流：${totalOut - netProfit}元\n👉 App卖出填：${totalOut}元`);
    } else if (p <= -b * 0.05) {
      if (bulletPool < asset.limit) { alert("子弹库余额不足！"); return; }
      setBulletPool(prev => prev - asset.limit);
      alert(`【补仓指令】已扣除 ${asset.limit}元 子弹`);
    }
  };

  if (!isMounted) return null;

  return (
    <div style={{background: '#000', color: '#d4af37', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif'}}>
      <h2 style={{textAlign: 'center', color: '#fff'}}>PROFIT PILOT 9.0</h2>
      
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <div style={{flex: 1, border: '2px solid #0f0', padding: '10px', textAlign: 'center', borderRadius: '10px'}}>
          <div style={{fontSize: '12px', color: '#888'}}>子弹库(纯利)</div>
          <div style={{fontSize: '20px', color: '#0f0', fontWeight: 'bold'}}>{bulletPool}</div>
        </div>
        <div style={{flex: 1, border: '2px solid #d4af37', padding: '10px', textAlign: 'center', borderRadius: '10px'}}>
          <div style={{fontSize: '12px', color: '#888'}}>回流本金池</div>
          <div style={{fontSize: '20px', color: '#d4af37', fontWeight: 'bold'}}>{returnedPrincipal}</div>
        </div>
      </div>

      {assets.map((asset) => (
        <div key={asset.id} style={{background: '#1a1a1a', border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '12px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
            <span style={{color: '#fff', fontWeight: 'bold'}}>{asset.name}</span>
            <span style={{color: asset.profit >= 0 ? '#ff4444' : '#00ff00', fontWeight: 'bold'}}>{((asset.profit/asset.principal)*100).toFixed(1)}%</span>
          </div>
          <div style={{fontSize: '11px', color: '#666', marginBottom: '10px'}}>初始本金: {asset.principal} 元</div>
          <div style={{display: 'flex', gap: '8px', marginBottom: '15px'}}>
            <input type="number" placeholder="填盈利" onChange={e => updateVal(asset.id, 'gain', e.target.value)} style={{flex: 1, background: '#333', color: '#ff4444', border: 'none', padding: '10px', borderRadius: '5px'}} />
            <input type="number" placeholder="填亏损" onChange={e => updateVal(asset.id, 'loss', e.target.value)} style={{flex: 1, background: '#333', color: '#00ff00', border: 'none', padding: '10px', borderRadius: '5px'}} />
          </div>
          <button onClick={() => handleAction(asset.id)} style={{width: '100%', padding: '12px', background: '#d4af37', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '8px'}}>执行战斗指令</button>
        </div>
      ))}
    </div>
  );
}
