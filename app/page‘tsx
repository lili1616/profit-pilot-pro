'use client';

import { useState, useEffect } from 'react';

export default function ProfitPilotPro() {
  // ============ 核心状态管理 ============
  const [principal, setPrincipal] = useState<number>(10000); // 本金
  const [currentValue, setCurrentValue] = useState<number>(10000); // 当前市值
  const [profitLoss, setProfitLoss] = useState<number>(0); // 盈亏金额
  const [percent, setPercent] = useState<number>(0); // 盈亏百分比

  // 资金池状态
  const [bulletPool, setBulletPool] = useState<number>(0); // 子弹库
  const [refluxPool, setRefluxPool] = useState<number>(0); // 回流池

  // UI 状态
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    type: 'profit' | 'loss' | 'warning' | 'info';
    actions?: Array<{ label: string; onClick: () => void; danger?: boolean }>;
  } | null>(null);

  // 编辑状态
  const [editingBullet, setEditingBullet] = useState<boolean>(false);
  const [editingReflux, setEditingReflux] = useState<boolean>(false);

  // ============ 实时计算盈亏百分比 ============
  useEffect(() => {
    if (principal > 0) {
      const calculatedProfitLoss = currentValue - principal;
      const calculatedPercent = (calculatedProfitLoss / principal) * 100;

      setProfitLoss(calculatedProfitLoss);
      setPercent(calculatedPercent);

      // 自动触发判定逻辑
      checkTradingSignals(calculatedPercent, calculatedProfitLoss);
    }
  }, [currentValue, principal]);

  // ============ 交易信号判定 ============
  const checkTradingSignals = (percentValue: number, profitLossValue: number) => {
    // 极限止损警告 (-20%)
    if (percentValue <= -20) {
      triggerExtremeLossWarning(profitLossValue);
    }
    // 止盈信号 (15%)
    else if (percentValue >= 15) {
      triggerProfitTaking(profitLossValue);
    }
    // 战术补仓 (-5%)
    else if (percentValue <= -5 && percentValue > -20) {
      triggerTacticalRebalance(profitLossValue);
    }
  };

  // ============ 止盈逻辑 (15%) ============
  const triggerProfitTaking = (profit: number) => {
    const pureProfitRatio = 0.40; // 40%
    const pureProfit = profit * pureProfitRatio;
    const sellTotal = pureProfit * (1 + principal / profit);

    setModalContent({
      title: '🎯 精准收割 - 止盈信号',
      message: `
        当前盈利已达 ${percent.toFixed(2)}%，触发止盈条件！

        📊 计算详情：
        • 总盈利：¥${profit.toFixed(2)}
        • 纯利润 (40%)：¥${pureProfit.toFixed(2)}
        • 建议卖出总额：¥${sellTotal.toFixed(2)}

        💡 操作建议：
        将 ¥${pureProfit.toFixed(2)} 转入回流池，锁定利润。
      `,
      type: 'profit',
      actions: [
        {
          label: '精准收割',
          onClick: () => executeProfitTaking(pureProfit, sellTotal),
        },
        {
          label: '静默观望',
          onClick: () => setShowModal(false),
        },
      ],
    });
    setShowModal(true);
  };

  const executeProfitTaking = (pureProfit: number, sellTotal: number) => {
    // 将纯利润转入回流池
    setRefluxPool(prev => prev + pureProfit);
    // 减少当前市值
    setCurrentValue(prev => prev - sellTotal);
    setShowModal(false);

    // 成功提示
    setTimeout(() => {
      setModalContent({
        title: '✅ 收割成功',
        message: `已将 ¥${pureProfit.toFixed(2)} 转入回流池！`,
        type: 'info',
        actions: [{ label: '确定', onClick: () => setShowModal(false) }],
      });
      setShowModal(true);
    }, 300);
  };

  // ============ 战术补仓 (-5%) ============
  const triggerTacticalRebalance = (loss: number) => {
    const rebalanceAmount = Math.min(bulletPool * 0.2, bulletPool); // 使用20%子弹库

    if (bulletPool <= 0) {
      setModalContent({
        title: '⚠️ 子弹库不足',
        message: `
          当前亏损 ${percent.toFixed(2)}%，建议战术补仓。
          但子弹库余额不足 (¥${bulletPool.toFixed(2)})。

          💡 建议：静默观望，等待反弹或补充子弹库。
        `,
        type: 'warning',
        actions: [{ label: '静默观望', onClick: () => setShowModal(false) }],
      });
      setShowModal(true);
      return;
    }

    setModalContent({
      title: '📈 战术补仓 - 买入信号',
      message: `
        当前亏损 ${percent.toFixed(2)}%，触发补仓条件！

        📊 计算详情：
        • 当前亏损：¥${Math.abs(loss).toFixed(2)}
        • 子弹库余额：¥${bulletPool.toFixed(2)}
        • 建议补仓金额：¥${rebalanceAmount.toFixed(2)} (20%)

        💡 操作建议：
        使用子弹库资金降低成本，等待反弹。
      `,
      type: 'loss',
      actions: [
        {
          label: '战术补仓',
          onClick: () => executeTacticalRebalance(rebalanceAmount),
        },
        {
          label: '静默观望',
          onClick: () => setShowModal(false),
        },
      ],
    });
    setShowModal(true);
  };

  const executeTacticalRebalance = (amount: number) => {
    // 从子弹库扣除
    setBulletPool(prev => prev - amount);
    // 增加本金和市值
    setPrincipal(prev => prev + amount);
    setCurrentValue(prev => prev + amount);
    setShowModal(false);

    // 成功提示
    setTimeout(() => {
      setModalContent({
        title: '✅ 补仓成功',
        message: `已从子弹库扣除 ¥${amount.toFixed(2)}，成本已降低！`,
        type: 'info',
        actions: [{ label: '确定', onClick: () => setShowModal(false) }],
      });
      setShowModal(true);
    }, 300);
  };

  // ============ 极限止损警告 (-20%) ============
  const triggerExtremeLossWarning = (loss: number) => {
    setModalContent({
      title: '🚨 极限止损 - 紧急警告',
      message: `
        ⚠️ 当前亏损已达 ${percent.toFixed(2)}%！

        📊 损失详情：
        • 本金：¥${principal.toFixed(2)}
        • 当前市值：¥${currentValue.toFixed(2)}
        • 累计亏损：¥${Math.abs(loss).toFixed(2)}

        🚨 风险提示：
        亏损已超过 -20% 极限阈值，建议立即止损割肉！
        继续持有可能导致更大损失。

        ⛔ 不再建议补仓，请谨慎决策！
      `,
      type: 'warning',
      actions: [
        {
          label: '极限止损 (割肉)',
          onClick: () => executeExtremeLoss(),
          danger: true,
        },
        {
          label: '静默观望 (风险自负)',
          onClick: () => setShowModal(false),
        },
      ],
    });
    setShowModal(true);
  };

  const executeExtremeLoss = () => {
    // 清空当前持仓，转入回流池（即使是负数也记录）
    setRefluxPool(prev => prev + currentValue);
    setCurrentValue(0);
    setPrincipal(0);
    setShowModal(false);

    // 止损完成提示
    setTimeout(() => {
      setModalContent({
        title: '✅ 止损完成',
        message: `已执行极限止损，剩余资金已转入回流池。`,
        type: 'info',
        actions: [{ label: '确定', onClick: () => setShowModal(false) }],
      });
      setShowModal(true);
    }, 300);
  };

  // ============ 手动输入处理 ============
  const handleProfitLossInput = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCurrentValue = principal + numValue;
    setCurrentValue(newCurrentValue);
  };

  const handleCurrentValueInput = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setCurrentValue(numValue);
  };

  // ============ 渲染 ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      {/* 顶部资金池 */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          💰 Profit Pilot Pro
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* 子弹库 */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-yellow-400">🎯 子弹库</h3>
              <button
                onClick={() => setEditingBullet(!editingBullet)}
                className="text-xs bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
              >
                {editingBullet ? '保存' : '编辑'}
              </button>
            </div>
            {editingBullet ? (
              <input
                type="number"
                value={bulletPool}
                onChange={(e) => setBulletPool(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-700 text-white text-2xl font-bold p-2 rounded border border-yellow-600"
              />
            ) : (
              <div className="text-3xl font-bold text-yellow-400">
                ¥{bulletPool.toFixed(2)}
              </div>
            )}
            <p className="text-sm text-gray-400 mt-2">用于战术补仓的预备资金</p>
          </div>

          {/* 回流池 */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-green-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-green-400">💎 回流池</h3>
              <button
                onClick={() => setEditingReflux(!editingReflux)}
                className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              >
                {editingReflux ? '保存' : '编辑'}
              </button>
            </div>
            {editingReflux ? (
              <input
                type="number"
                value={refluxPool}
                onChange={(e) => setRefluxPool(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-700 text-white text-2xl font-bold p-2 rounded border border-green-600"
              />
            ) : (
              <div className="text-3xl font-bold text-green-400">
                ¥{refluxPool.toFixed(2)}
              </div>
            )}
            <p className="text-sm text-gray-400 mt-2">止盈收割后的利润池</p>
          </div>
        </div>
      </div>

      {/* 主界面 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：百分比仪表盘 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-8 border-2 border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-center">📊 实时仪表盘</h2>

            {/* 百分比显示 */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#374151"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke={percent >= 0 ? '#ef4444' : '#10b981'}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${Math.abs(percent) * 5.03} 502.4`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={`text-5xl font-bold ${
                    percent >= 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {percent >= 0 ? '盈利' : '亏损'}
                </div>
              </div>
            </div>

            {/* 详细数据 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <span className="text-gray-400">本金</span>
                <span className="font-semibold">¥{principal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <span className="text-gray-400">当前市值</span>
                <span className="font-semibold">¥{currentValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <span className="text-gray-400">盈亏金额</span>
                <span
                  className={`font-semibold ${
                    profitLoss >= 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {profitLoss >= 0 ? '+' : ''}¥{profitLoss.toFixed(2)}
                </span>
              </div>
            </div>

            {/* 状态指示 */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="text-center">
                {percent >= 15 && (
                  <div className="text-red-500 font-bold">🎯 止盈信号</div>
                )}
                {percent <= -20 && (
                  <div className="text-red-600 font-bold animate-pulse">🚨 极限止损</div>
                )}
                {percent <= -5 && percent > -20 && (
                  <div className="text-yellow-500 font-bold">📈 补仓信号</div>
                )}
                {percent > -5 && percent < 15 && (
                  <div className="text-gray-400">😌 静默观望</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：输入控制面板 */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-8 border-2 border-gray-700">
            <h2 className="text-2xl font-semibold mb-6">⚙️ 交易控制面板</h2>

            {/* 本金输入 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                本金 (¥)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-700 text-white text-xl font-semibold p-4 rounded-lg border-2 border-gray-600 focus:border-yellow-600 focus:outline-none"
                placeholder="输入本金"
              />
            </div>

            {/* 输入方式选择 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 方式1：直接输入当前市值 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  方式1：当前市值 (¥)
                </label>
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => handleCurrentValueInput(e.target.value)}
                  className="w-full bg-gray-700 text-white text-xl font-semibold p-4 rounded-lg border-2 border-gray-600 focus:border-blue-600 focus:outline-none"
                  placeholder="输入当前市值"
                />
              </div>

              {/* 方式2：输入盈亏金额 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  方式2：盈亏金额 (¥)
                </label>
                <input
                  type="number"
                  value={profitLoss}
                  onChange={(e) => handleProfitLossInput(e.target.value)}
                  className="w-full bg-gray-700 text-white text-xl font-semibold p-4 rounded-lg border-2 border-gray-600 focus:border-purple-600 focus:outline-none"
                  placeholder="输入盈亏金额 (正数为盈利)"
                />
              </div>
            </div>

            {/* 快捷操作按钮 */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setCurrentValue(principal * 1.15)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                +15% 止盈
              </button>
              <button
                onClick={() => setCurrentValue(principal * 0.95)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                -5% 补仓
              </button>
              <button
                onClick={() => setCurrentValue(principal * 0.80)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                -20% 止损
              </button>
              <button
                onClick={() => setCurrentValue(principal)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                重置
              </button>
            </div>

            {/* 说明文档 */}
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-yellow-400">📖 操作说明</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 输入本金和当前市值，左侧仪表盘实时更新</li>
                <li>• 盈利达 <span className="text-red-500 font-bold">15%</span> 触发止盈信号</li>
                <li>• 亏损达 <span className="text-yellow-500 font-bold">-5%</span> 触发补仓信号</li>
                <li>• 亏损达 <span className="text-red-600 font-bold">-20%</span> 触发极限止损警告</li>
                <li>• 点击资金池可手动编辑金额</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 模态弹窗 */}
      {showModal && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border-2 border-gray-600">
            <h3 className="text-2xl font-bold mb-4">{modalContent.title}</h3>
            <div className="text-gray-300 whitespace-pre-line mb-6">
              {modalContent.message}
            </div>
            <div className="flex gap-3">
              {modalContent.actions?.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    action.danger
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
