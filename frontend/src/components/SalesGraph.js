import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  CartesianGrid,
  defs,
} from "recharts";

const SalesGraph = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2F5BFF" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#2F5BFF" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fontSize: 12, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="rate"
          stroke="none"
          fill="url(#colorRate)"
        />

        <Line
          type="monotone"
          dataKey="rate"
          stroke="#2F5BFF"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesGraph;
