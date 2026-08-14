import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const BarChart = ({ data }) => {
    return (
        <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-80">
            <h3 className="text-lg font-bold text-gray-700 mb-6 text-center">نتائج التقييم</h3>

            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                    />
                    <YAxis
                        hide
                        domain={[0, 100]}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-right">
                                        <p className="font-bold text-gray-700">{data.label}</p>
                                        <p className="text-[#6A5ACD] font-bold" style={{ color: data.color }}>{data.value}%</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={50} animationDuration={1500}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList dataKey="value" position="top" fill="#6b7280" fontSize={14} fontWeight="bold" formatter={(val) => `${val}%`} />
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;
