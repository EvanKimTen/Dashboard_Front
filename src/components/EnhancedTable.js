import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import CircularProgress from "@mui/material/CircularProgress";
import { visuallyHidden } from "@mui/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

function descendingComparator(a, b, orderBy) {
  let x = "";
  let y = "";
  if (orderBy === "updatedAt") {
    x = a[orderBy];
    y = b[orderBy];
  } else {
    const params = orderBy.split(".");
    x = a[params[0]][params[1]];
    y = b[params[0]][params[1]];
  }
  if (y < x) {
    return -1;
  }
  if (y > x) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "data.name",
    label: "Name",
  },
  {
    id: "data.type",
    label: "Type",
  },
  {
    id: "status.type",
    label: "Status",
  },
  {
    id: "updatedAt",
    label: "Date",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label === "Status" ? (
              <div style={{ marginRight: "1.2rem" }}>Status</div>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onDeleteClick } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Data Sources
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("updatedAt");
  const [selected, setSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    console.log(order, orderBy);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = props.documents.map(
        (document) => document.documentID
      );
      setSelected(newSelected);
      console.log(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, documentID) => {
    const selectedIndex = selected.indexOf(documentID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, documentID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    console.log(newSelected);
  };

  const isSelected = (documentID) => selected.indexOf(documentID) !== -1;

  const onDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    selected.map(async (document) => {
      try {
        const response = await proxy.delete(`/${document}`);
        console.log(response.data);
        props.getDocuments();
        setSelected([]);
        handleClose();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const visibleRows = useMemo(
    () => stableSort(props.documents, getComparator(order, orderBy)),
    [order, orderBy, props.documents]
  );

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%" }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            onDeleteClick={onDeleteClick}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={props.documents.length}
              />
              <TableBody>
                {visibleRows.map((document, index) => {
                  const isItemSelected = isSelected(document.documentID);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, document.documentID)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={document.documentID}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        sx={{
                          width: "33rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "40vw",
                          paddingRight: "4rem",
                        }}
                      >
                        {document.data.name}
                      </TableCell>
                      <TableCell
                        align="left"
                        padding="none"
                        style={{
                          textTransform: "uppercase",
                        }}
                      >
                        {document.data.type}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {document.status.type === "SUCCESS" && (
                          <CheckIcon color="success" />
                        )}
                        {document.status.type === "INITIALIZED" && (
                          <CircularProgress size={20} />
                        )}
                        {document.status.type === "ERROR" && (
                          <ReportGmailerrorredIcon color="error" />
                        )}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {document.updatedAt}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <Dialog fullWidth maxWidth="xs" open={openDialog} onClose={handleClose}>
        <DialogTitle>Delete Items</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} item(s)? <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
