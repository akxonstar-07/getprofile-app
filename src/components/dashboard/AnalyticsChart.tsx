"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface AnalyticsChartProps {
  data: any[];
  xKey: string;
  yKey1: string;
  yKey2?: string;
  color1?: string;
  color2?: string;
  height?: number;
}

export default function AnalyticsChart({ 
  data, 
  xKey, 
  yKey1, 
  yKey2, 
  color1 = "#6366f1", // Indigo
  color2 = "#14b8a6", // Teal
  height = 300 
}: AnalyticsChartProps) {
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100 placeholder-pulse" style={{ height }}>
        <p className="text-slate-400 text-sm font-semibold">Not enough data to display chart</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color1} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color1} stopOpacity={0}/>
            </linearGradient>
            {yKey2 && (
              <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color2} stopOpacity={0}/>
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            dy={10}
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
            labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
          />
          
          <Area 
            type="monotone" 
            dataKey={yKey1} 
            stroke={color1} 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#color1)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: color1 }}
          />
          
          {yKey2 && (
            <Area 
              type="monotone" 
              dataKey={yKey2} 
              stroke={color2} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#color2)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: color2 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
