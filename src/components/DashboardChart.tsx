import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardChart() {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  const data = [
    { month: "Jan", profiles: 12 },
    { month: "Feb", profiles: 19 },
    { month: "Mar", profiles: 15 },
    { month: "Apr", profiles: 25 },
    { month: "May", profiles: 22 },
    { month: "Jun", profiles: 30 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.profileGrowth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: isMobile ? 10 : 30 }}
              >
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="colorProfiles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderRadius: "0.5rem",
                    border: "1px solid hsl(var(--border))",
                    fontSize: "0.875rem",
                    color: "hsl(var(--card-foreground))",
                  }}
                  cursor={{ stroke: "var(--primary)", strokeWidth: 2, opacity: 0.1 }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "0.75rem",
                    color: "hsl(var(--foreground))",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="profiles"
                  stroke="var(--primary)"
                  fill="url(#colorProfiles)"
                  dot={{ fill: "var(--primary)", stroke: "#fff", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}