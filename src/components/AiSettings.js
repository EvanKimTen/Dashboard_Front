import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Button,
  Box,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  FormControl,
  Select,
  Slider,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import MuiInput from "@mui/material/Input";
import CloseIcon from "@mui/icons-material/Close";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

export const AiSettings = (props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { settings, setSettings, saveSettings, userId } = props;

  const handleChange = (event) => {
    setSettings({ ...settings, [event.target.name]: event.target.value });
  };

  const handleInputChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]:
        event.target.value === "" ? 0 : Number(event.target.value),
    });
  };

  const handleBlur = (event) => {
    const { name, min, max } = event.target;
    if (settings[name] < min) {
      setSettings({ ...settings, [name]: Number(min) });
    } else if (settings[name] > max) {
      setSettings({ ...settings, [name]: Number(max) });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleSave = () => {
    saveSettings();
    handleClose();
  };

  return (
    <div>
      <Tooltip title="Settings">
        <Button variant="outlined" onClick={() => handleOpen()}>
          <TuneIcon />
        </Button>
      </Tooltip>

      <Dialog fullWidth maxWidth="xs" open={openDialog} onClose={handleClose}>
        <DialogTitle sx={{ m: 1, width: 380 }}>
          Knowledge Base Settings
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ left: 120 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ m: 1, width: 380 }}>
            <FormControl fullWidth>
              <Select
                name="model"
                id="demo-simple-select"
                value={settings.model}
                onChange={handleChange}
              >
                <MenuItem value={"text-davinci-003"}>
                  GPT-3 DaVinci 1x Tokens
                </MenuItem>
                <MenuItem value={"gpt-3.5-turbo"}>
                  GPT-3.5 Turbo (ChatGPT) 1x Tokens
                </MenuItem>
                <MenuItem value={"claude-instant-v1"}>
                  Claude Instant 1.2 1x Tokens
                </MenuItem>
                <MenuItem value={"claude-v1"}>Claude 1 10x Tokens</MenuItem>
                <MenuItem value={"claude-v2"}>Claude 2 10x Tokens</MenuItem>
                <MenuItem value={"gpt-4"}>GPT-4 25x Tokens</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ m: 1, width: 380 }}>
            <Typography id="input-slider" gutterBottom>
              Temperature
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  name="temperature"
                  value={
                    typeof settings.temperature === "number"
                      ? settings.temperature
                      : 0
                  }
                  onChange={handleChange}
                  aria-labelledby="input-slider"
                  step={0.05}
                  min={0.0}
                  max={1.0}
                />
              </Grid>
              <Grid item>
                <Input
                  name="temperature"
                  value={settings.temperature}
                  size="small"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: 0.05,
                    min: 0.0,
                    max: 1.0,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ m: 1, width: 380 }}>
            <Typography id="input-slider" gutterBottom>
              Max Tokens
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  name="maxchunkSize"
                  value={
                    typeof settings.maxchunkSize === "number"
                      ? settings.maxchunkSize
                      : 1
                  }
                  onChange={handleChange}
                  aria-labelledby="input-slider"
                  min={1}
                  max={512}
                />
              </Grid>
              <Grid item>
                <Input
                  name="maxchunkSize"
                  value={settings.maxchunkSize}
                  size="small"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: 30,
                    min: 1,
                    max: 512,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: 380 },
            }}
            noValidate
            autoComplete="off"
          >
            <Typography id="outlined-textarea" gutterBottom>
              System
            </Typography>
            <TextField
              name="system"
              value={settings.system}
              id="outlined-textarea"
              placeholder="Enter prompt"
              multiline
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ m: 1, width: 380 }}>
            <Typography id="input-slider" gutterBottom>
              Chunk Limit
            </Typography>
            <Input
              name="chunkLimit"
              value={settings.chunkLimit}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                min: 1,
                max: 10,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const Input = styled(MuiInput)`
  width: 42px;
`;
