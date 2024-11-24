import React from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TablePagination from "@mui/material/TablePagination"
import Paper from "@mui/material/Paper"

type Student = {
  numInsc: string
  name: string
  mail: string
  age: number
}

interface EnhancedTableProps {
  students: Student[] // Accept students as props
}

export default function EnhancedTable({ students }: EnhancedTableProps) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - students.length) : 0

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, backgroundColor: "#121212" }}> {/* Dark background for the Paper */}
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-label="students table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>ID</TableCell> {/* White text color for header */}
                <TableCell sx={{ color: "white" }}>Name</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white" }}>Age</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow
                    key={student.numInsc}
                    sx={{
                      backgroundColor: "#1e1e1e", // Dark background for table rows
                      "&:hover": { backgroundColor: "#333" }, // Hover effect
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>{student.numInsc}</TableCell>
                    <TableCell sx={{ color: "white" }}>{student.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>{student.mail}</TableCell>
                    <TableCell sx={{ color: "white" }}>{student.age}</TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: "white" }}
        />
      </Paper>
    </Box>
  )
}
