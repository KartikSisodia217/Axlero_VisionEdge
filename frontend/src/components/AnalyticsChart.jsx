import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import { motion } from "framer-motion";

const data = [
  { day: "Mon", users: 12, streams: 5 },
  { day: "Tue", users: 20, streams: 8 },
  { day: "Wed", users: 28, streams: 12 },
  { day: "Thu", users: 35, streams: 15 },
  { day: "Fri", users: 45, streams: 18 },
  { day: "Sat", users: 55, streams: 20 },
  { day: "Sun", users: 70, streams: 25 },
];

function AnalyticsChart() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
    >
      <Card
        sx={{
          borderRadius: 5,
          boxShadow:
            "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={3}
          >
            <Box>

              <Typography
                variant="h5"
                fontWeight="bold"
              >
                Weekly Analytics
              </Typography>

              <Typography
                color="text.secondary"
              >
                Users & Stream Growth
              </Typography>

            </Box>
          </Box>

          <ResponsiveContainer
            width="100%"
            height={360}
          >

            <AreaChart data={data}>

              <defs>

                <linearGradient
                  id="users"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#2563EB"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#2563EB"
                    stopOpacity={0}
                  />

                </linearGradient>

                <linearGradient
                  id="streams"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#10B981"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#10B981"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
              />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Area
                type="monotone"
                dataKey="users"
                stroke="#2563EB"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#users)"
              />

              <Area
                type="monotone"
                dataKey="streams"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#streams)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

    </motion.div>
  );
}

export default AnalyticsChart;