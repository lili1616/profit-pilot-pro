'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [bulletPool, setBulletPool] = useState(0); 
  const [returnedPrincipal, setReturnedPrincipal] = useState(0); 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const [assets, setAssets] = useState([
    { id: 0, name: '🥇 易方达黄金', principal: 4000, gain: '', loss: '', limit: 200 },
    { id: 1, name: '🥈 国泰有色矿业', principal: 5000, gain: '', loss: '', limit: 200 },
    { id: 2, name: '🥉 万家中证工业有色', principal: 3000, gain: '', loss: '', limit: 200 },
    { id: 3, name: '🧪 广发稀有金属', principal: 1900, gain: '', loss: '', limit: 200 },
    { id: 4, name: '🏦 国投瑞银', principal: 100, gain: '', loss: '', limit: 100 }
  ]);

  const updateAsset = (id, type, val) => {
    const newAssets = [...assets];
    // 输入互斥：填了盈利，亏损自动清空；反之亦然
    if (type === 'gain') newAssets[id].loss = '';
    if (type === 'loss') newAssets[id].gain = '';
    newAssets[id][type] = val;
    setAssets(newAssets);
  };

  const handleAction = (id) => {
    const a = assets[id];
    const b = a.principal;
    const g = parseFloat(a.gain) || 0;
    const l = parseFloat(a.loss) || 0;

    // --- 核心战斗判定开始 ---
    
    // 1. 强制止损判定 (亏损金额 >= 本金的20%)
    if (l >= b * 0.20) {
      alert(`【🚨 极限止损警告】\n\n亏损已达 ${((l/b)*100).toFixed(1)}%！\n战况极其惨烈，已触及割肉红线。\n👉 指令：立即停止补仓，执行止损离场，保全余部！`);
      return;
    }

    // 2. 止盈收割判定 (盈利金额 >= 本金的15%)
    if (g >= b * 0.15) {
      const net = Math.floor(g * 0.4);
      const out = Math.floor(net * (1 + b / g));
      setBulletPool(prev => prev + net);
      setReturnedPrincipal(prev => prev + (out - net));
      alert(`【🎯 精准收割指令】\n\n盈利达标！\n1. 利润入库：${net}元\n2. 本金回流：${out - net}元\n👉 请在App卖出填写：${out}元`);
      return;
    }

    // 3. 战术补仓判定 (亏损金额 >= 本金的5%)
    if (l >= b * 0.05) {
      if (bulletPool < a.limit) {
        alert(`【⚠️ 弹药枯竭】\n\n亏损已达补仓线，但子弹库余额 (${bulletPool}元) 不足！\n👉 请先止盈其他项目换取子弹。`);
      } else {
        setBulletPool(prev => prev - a.limit);
        alert(`【🛡️ 战术补仓】\n\n亏损触发防线。已从子弹库拨付 ${a.limit}元 执行防御！`);
      }
      return;
    }

    // 4. 默认状态：静默观望
    alert("【☕ 静默观望】\n\n战况波动未达触发线（15%盈/5%跌）。\n👉 目前无需操作，保持阵位，继续观望。");
  };

  if (!isMounted) return null;

  return (
    <div style={{background: '#000', color: '#d4af37', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif'}}>
      <h2 style={{textAlign: 'center', color: '#fff', letterSpacing: '2px'}}>PROFIT PILOT 9.0</h2>
      
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <div style={{flex: 1, border: '2px solid #0f0', padding: '10px', textAlign: 'center', borderRadius: '10px'}}>
          <div style={{fontSize: '11px', color: '#888'}}>子弹库(纯利)</div>
          <input type="number" value={bulletPool} onChange={(e)=>setBulletPool(parseFloat(e.target.value)||0)} style={{width:'80%', background:'transparent', color:'#0f0', border:'none', textAlign:'center', fontSize:'22px', fontWeight:'bold'}} />
        </div>
        <div style={{flex: 1, border: '2px solid #d4af37', padding: '10px', textAlign: 'center', borderRadius: '10px'}}>
          <div style={{fontSize: '11px', color: '#888'}}>回流本金池</div>
          <input type="number" value={returnedPrincipal} onChange={(e)=>setReturnedPrincipal(parseFloat(e.target.value)||0)} style={{width:'80%', background:'transparent', color:'#d4af37', border:'none', textAlign:'center', fontSize:'22px', fontWeight:'bold'}} />
        </div>
      </div>

      {assets.map((a) => {
        const p = (parseFloat(a.gain) || 0) - (parseFloat(a.loss) || 0);
        const percent = ((p / a.principal) * 100).toFixed(1);
        const ratio = p / a.principal;

        return (
          <div key={a.id} style={{background: '#1a1a1a', border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '12px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{fontSize: '18px', fontWeight: 'bold', color: p > 0 ? '#ff4444' : (p < 0 ? '#00ff00' : '#666')}}>{percent}%</span>
                <b style={{color: '#fff'}}>{a.name}</b>
              </div>
              <span style={{fontSize: '11px', color: '#666'}}>本金: {a.principal}</span>
            </div>
            
            <div style={{display: 'flex', gap: '8px', marginBottom: '15px'}}>
              <input type="number" value={a.gain} placeholder="填盈利" onChange={e => updateAsset(a.id, 'gain', e.target.value)} style={{flex: 1, background: '#222', color: '#ff4444', border: '1px solid #444', padding: '12px', borderRadius: '8px'}} />
              <input type="number" value={a.loss} placeholder="填亏损" onChange={e => updateAsset(a.id, 'loss', e.target.value)} style={{flex: 1, background: '#222', color: '#00ff00', border: '1px solid #444', padding: '12px', borderRadius: '8px'}} />
            </div>
            
            <button 
              onClick={() => handleAction(a.id)} 
              style={{
                width: '100%', padding: '15px', 
                background: ratio <= -0.2 ? '#ff4444' : '#d4af37', 
                color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '8px', fontSize: '16px'
              }}
            >
              {ratio <= -0.2 ? '🚨 极限止损警告' : '执行战术指令'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
