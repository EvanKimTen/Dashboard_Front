import { useState } from "react";
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
  DialogTitle,
} from "@mui/material";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

export const DataSourceDropdown = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [input, setInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [tag, setTag] = useState("");
  const open = Boolean(anchorEl);
  const { getDocuments, userId } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenDialog(false);
  };

  const handleUrlClick = (tag) => {
    setTag(tag);
    setOpenDialog(true);
  };

  const handleUrlUpload = async () => {
    try {
      const response = await proxy.post(`/${userId}`, {
        url: input,
      });
      handleClose();
      getDocuments();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (event) => {
    try {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      formData.append("fileName", event.target.files[0].name);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const response = await proxy.post(`/file/${userId}`, formData, config);
      setAnchorEl(null);
      getDocuments();
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
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
        <MenuItem onClick={() => handleUrlClick("url")}>URL</MenuItem>
        <MenuItem onClick={() => handleUrlClick("sitemap")}>Sitemap</MenuItem>
        <SMenuItem component="label">
          Text
          <VisuallyHiddenInput
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
          />
          <p>10mb max</p>
        </SMenuItem>
        <SMenuItem component="label">
          PDF
          <VisuallyHiddenInput
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
          />
          <p>10mb max</p>
        </SMenuItem>
        <SMenuItem component="label">
          DOC
          <VisuallyHiddenInput
            type="file"
            accept=".doc, .docx"
            onChange={handleFileUpload}
          />
          <p>10mb max</p>
        </SMenuItem>
      </Menu>

      <Dialog fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <DialogTitle>
          {tag === "url" ? "Add URL" : "Add URLs From Sitemap"}
        </DialogTitle>
        <DialogContent>
          <TextField
            type="url"
            id="name"
            label={tag === "url" ? "URL" : "Sitemap URL"}
            placeholder={
              tag === "url"
                ? "https://example.com/about"
                : "https://example.com/sitemap.xml"
            }
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

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const SMenuItem = styled(MenuItem)`
  p {
    color: gray;
    font-size: 12px;
    margin-left: 15px;
  }
`;
