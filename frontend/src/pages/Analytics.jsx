import {
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const weeklyData = [
  { day: "Mon", users: 15, streams: 8 },
  { day: "Tue", users: 22, streams: 10 },
  { day: "Wed", users: 30, streams: 15 },
  { day: "Thu", users: 40, streams: 18 },
  { day: "Fri", users: 52, streams: 22 },
  { day: "Sat", users: 65, streams: 28 },
  { day: "Sun", users: 80, streams: 35 },
];

const pieData = [
  { name: "Running", value: 75 },
  { name: "Stopped", value: 15 },
  { name: "Offline", value: 10 },
];

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

function Analytics() {
  return (
    <>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Analytics
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                Weekly Activity
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <AreaChart data={weeklyData}>

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
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="day" />

                  <YAxis />

                  <Tooltip />

                  <Area
                    dataKey="users"
                    stroke="#2563EB"
                    fill="url(#users)"
                  />

                </AreaChart>
              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                Stream Status
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={110}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                Monthly Growth
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <BarChart data={weeklyData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="day" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="streams"
                    fill="#10B981"
                  />

                </BarChart>
              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </>
  );
}

export default Analytics;