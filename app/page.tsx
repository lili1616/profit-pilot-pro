'use client'; // 必须保留这一行，用于 Next.js 客户端运行

import React, { useState } from 'react';

export default function App() {
  const [bulletPool, setBulletPool] = useState(0); // 纯利润子弹
  const [returnedPrincipal, setReturnedPrincipal] = useState(0); // 已回笼本金

  // 预设你的五支基金数据
  const [assets, setAssets] = useState([
    { id: 0, name: '🥇 易方达黄金', principal: 4000, profit: 0, limit: 200 },
    { id: 1, name: '🥈 国泰有色矿业', principal: 5000, profit: 0, limit: 200 },
    { id: 2, name: '🥉 万家中证工业有色', principal: 3000, profit: 0, limit: 200 },
    { id: 3, name: '🧪 广发稀有金属', principal: 1900, profit: 0, limit: 200 },
    { id: 4, name: '🏦 国投瑞银', principal: 100, profit: 0, limit: 100 }
  ]);

  const updateVal = (id, type, val) => {
    const newAssets = [...assets];
    const num = Number(val);
    newAssets[id].profit = type === 'gain' ? num : -num;
    setAssets(newAssets);
  };

  const handleTakeProfit = (id) => {
    const asset = assets[id];
    const p = asset.profit;
    const b = asset.principal;
    if (p <= 0) return;
    const netProfitGoal = Math.floor(p * 0.4); 
    const totalWithdraw = Math.floor(netProfitGoal * (1 + b / p));
    const principalPart = totalWithdraw - netProfitGoal;
    setBulletPool(prev => prev + netProfitGoal);
    setReturnedPrincipal(prev => prev + principalPart);
    alert(`【止盈指令】\n1. 纯利入库：${netProfitGoal}元\n2. 本金回流：${principalPart}元\n👉 App卖出填：${totalWithdraw}元`);
  };

  const investBullet = (id) => {
    const asset = assets[id];
    if (bulletPool < asset.limit) { alert("子弹不足！"); return; }
    setBulletPool(prev => prev - asset.limit);
    alert(`【补仓指令】已从子弹库扣除 ${asset.limit} 元预算`);
  };

  return (
    <div style={{background: '#0a0a0a', color: '#d4af37', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif'}}>
      <h2 style={{textAlign: 'center', letterSpacing: '2px'}}>PROFIT PILOT 9.0</h2>
      
      {/* 顶部：双资金看板 */}
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <div style={{flex: 1, border: '1px solid #00ff00', padding: '10px', borderRadius: '10px', textAlign: 'center', background: 'rgba(0,255,0,0.05)'}}>
          <div style={{fontSize: '12px', color: '#888'}}>子弹库(纯利)</div>
          <div style={{fontSize: '20px', color: '#00ff00', fontWeight: 'bold'}}>{bulletPool} 元</div>
        </div>
        <div style={{flex: 1, border: '1px solid #d4af37', padding: '10px', borderRadius: '10px', textAlign: 'center', background: 'rgba(212,175,55,0.05)'}}>
          <div style={{fontSize: '12px', color: '#888'}}>回流本金池</div>
          <div style={{fontSize: '20px', color: '#d4af37', fontWeight: 'bold'}}>{returnedPrincipal} 元</div>
        </div>
      </div>

      {assets.map((asset) => {
        const rate = asset.profit / asset.principal;
        const isGain = asset.profit >= 0;
        const absProfit = Math.abs(asset.profit);
        const canTake = rate >= 0.15;
        const canBuy = rate <= -0.05;

        return (
          <div key={asset.id} style={{background: '#161616', border: '1px solid #333', borderRadius: '15px', padding: '15px', marginBottom: '15px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
              <div>
                <div style={{fontSize: '16px', fontWeight: 'bold', color: '#fff'}}>{asset.name}</div>
                <div style={{fontSize: '11px', color: '#666'}}>初始本金: {asset.principal}</div>
              </div>
              <div style={{color: isGain ? '#ff4444' : '#00ff00', fontWeight: 'bold', fontSize: '18px'}}>{(rate*100).toFixed(1)}%</div>
            </div>
            
            <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
              <div style={{flex: 1}}>
                <label style={{fontSize: '11px', color: '#ff4444'}}>盈利(+):</label>
                <input type="number" value={isGain ? absProfit : ''} onChange={(e) => updateVal(asset.id, 'gain', e.target.value)} style={{background: '#222', color: '#ff4444', border: 'none', width: '85%', padding: '10px', borderRadius: '5px'}} />
              </div>
              <div style={{flex: 1}}>
                <label style={{fontSize: '11px', color: '#00ff00'}}>亏损(-):</label>
                <input type="number" value={!isGain ? absProfit : ''} onChange={(e) => updateVal(asset.id, 'loss', e.target.value)} style={{background: '#222', color: '#00ff00', border: 'none', width: '85%', padding: '10px', borderRadius: '5px'}} />
              </div>
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={() => handleTakeProfit(asset.id)} disabled={!canTake} style={{flex: 1.2, background: canTake ? '#d4af37' : '#333', color: canTake ? '#000' : '#666', border: 'none', padding: '12px', fontWeight: 'bold', borderRadius: '8px'}}>精准止盈</button>
              <button onClick={() => investBullet(asset.id)} disabled={!canBuy} style={{flex: 1, background: canBuy ? '#00ff00' : '#333', color: canBuy ? '#000' : '#666', border: 'none', padding: '12px', fontWeight: 'bold', borderRadius: '8px'}}>补仓 {asset.limit}</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
