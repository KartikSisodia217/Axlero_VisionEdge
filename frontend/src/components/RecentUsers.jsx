import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";

const users = [
  {
    id: 1,
    name: "Rajesh Reddy",
    email: "rajesh@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Karthik",
    email: "karthik@gmail.com",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul",
    email: "rahul@gmail.com",
    status: "Inactive",
  },
];

function RecentUsers() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        mt: 3,
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Recent Users
        </Typography>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell><b>Name</b></TableCell>

              <TableCell><b>Email</b></TableCell>

              <TableCell><b>Status</b></TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {users.map((user) => (

              <TableRow key={user.id}>

                <TableCell>{user.name}</TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>

                  <Chip
                    label={user.status}
                    color={
                      user.status === "Active"
                        ? "success"
                        : "error"
                    }
                  />

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </CardContent>
    </Card>
  );
}

export default RecentUsers;