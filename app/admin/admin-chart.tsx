'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Sen', penjualan: 4000, pesanan: 24 },
  { name: 'Sel', penjualan: 3000, pesanan: 18 },
  { name: 'Rab', penjualan: 2000, pesanan: 12 },
  { name: 'Kam', penjualan: 2780, pesanan: 16 },
  { name: 'Jum', penjualan: 1890, pesanan: 10 },
  { name: 'Sab', penjualan: 2390, pesanan: 15 },
  { name: 'Min', penjualan: 3490, pesanan: 20 },
]

export default function AdminChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="penjualan" stroke="#10b981" strokeWidth={3} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
