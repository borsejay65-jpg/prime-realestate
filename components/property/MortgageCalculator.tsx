'use client'

import { useState, useMemo } from 'react'
import { Calculator } from 'lucide-react'
import { calculateEMI, formatPrice } from '@/lib/utils'

export default function MortgageCalculator({ propertyPrice }: { propertyPrice: number }) {
  const [loan, setLoan] = useState(Math.round(propertyPrice * 0.8))
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const e = calculateEMI(loan, rate, tenure)
    const total = e * tenure * 12
    return { emi: e, totalInterest: total - loan, totalAmount: total }
  }, [loan, rate, tenure])

  const principalPercent = (loan / totalAmount) * 100

  return (
    <div className="card p-6">
      <h3 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-gold" /> EMI Calculator
      </h3>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Loan Amount</span>
            <span className="font-semibold">{formatPrice(loan)}</span>
          </div>
          <input type="range" min={0} max={propertyPrice} step={100000} value={loan}
            onChange={e => setLoan(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Interest Rate</span>
            <span className="font-semibold">{rate}%</span>
          </div>
          <input type="range" min={5} max={15} step={0.1} value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Loan Tenure</span>
            <span className="font-semibold">{tenure} Years</span>
          </div>
          <input type="range" min={1} max={30} step={1} value={tenure}
            onChange={e => setTenure(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold" />
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
          <p className="font-display text-3xl font-bold text-gold">{formatPrice(Math.round(emi))}</p>
        </div>
        <div className="h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4">
          <div className="h-full bg-gradient-gold rounded-full" style={{ width: `${principalPercent}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <div><span className="inline-block w-3 h-3 rounded-full bg-gradient-gold mr-1" /> Principal: {formatPrice(loan)}</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-1" /> Interest: {formatPrice(Math.round(totalInterest))}</div>
        </div>
      </div>
    </div>
  )
}
