import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { Theme, SxProps } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import TablePagination, {
  TablePaginationProps,
} from "@mui/material/TablePagination";

// ----------------------------------------------------------------------

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...other
}: any) {
  return (
    <Box sx={{ position: "relative", ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{
          borderTopColor: "transparent",
          color: "#fff",
        }}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: "absolute",
            },
          }}
        />
      )}
    </Box>
  );
}
