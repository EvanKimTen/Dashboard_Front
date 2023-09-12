import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Button,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import EnhancedTable from "../components/EnhancedTable";
import { async } from "q";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [input, setInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenDialog(false);
  };

  //   useEffect(() => {
  //     getDocuments();
  //   }, []);

  //   const getDocuments = async () => {
  //     try {
  //       const response = await proxy.get("/");
  //       setDocuments(response.data.data);
  //       console.log(response.data.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  const handleUrlClick = () => {
    setOpenDialog(true);
  };

  const handleUrlUpload = async () => {
    try {
      const response = await proxy.post("/", {
        url: input,
      });
      handleClose();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <TopBar>
        <SearchBar>
          <SearchIcon />
          <input type="text" placeholder="Search for documents"></input>
        </SearchBar>
        <Buttons>
          <Button variant="outlined">
            <TuneIcon />
          </Button>
          <Button variant="outlined">AI Preview</Button>
          <Button
            variant="contained"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Add Data Source
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{
              width: 300,
            }}
          >
            <MenuItem onClick={handleUrlClick}>URL(s)</MenuItem>
            <MenuItem onClick={handleClose}>Sitemap</MenuItem>
            <MenuItem onClick={handleClose}>Text</MenuItem>
            <MenuItem onClick={handleClose}>PDF</MenuItem>
            <MenuItem onClick={handleClose}>DOC</MenuItem>
          </Menu>
        </Buttons>
      </TopBar>
      <Content>
        <EnhancedTable />
      </Content>
      <Dialog fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <DialogTitle>Add URL</DialogTitle>
        <DialogContent>
          <TextField
            type="url"
            id="name"
            label="URL"
            placeholder="https://example.com/about"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            margin="dense"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUrlUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const Content = styled.div`
  max-height: 40rem; /*..very important if you want scroll bar...*/
  overflow: auto; /*..will introduce scroll bar when needed..*/
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ceddea;
  padding: 1rem;
  button {
    border: 1px solid #b7c4d0;
  }
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    color: #b7c4d0;
    font-size: 1.5rem;
  }
  input {
    margin-left: 0.6rem;
    font-size: 1rem;
    border: none;
    outline: none;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

export default KnowledgeBase;
