import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Tooltip,
} from "@mui/material";
import MuiInput from "@mui/material/Input";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

export const AiPreview = (props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [question, setQuestion] = useState("");
  const [prevQuestion, setPrevQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [sources, setSources] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { settings, userId } = props;

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await proxy.post(`/preview/${userId}`, {
        question,
        settings,
      });
      setResponse(response.data.output);
      setSources(response.data.chunks);
      setPrevQuestion(question);
      setQuestion("");
      console.log(question);
      console.log(prevQuestion);
      setIsLoading(false);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Tooltip title="Preview">
        <Button variant="outlined" onClick={() => handleOpen()}>
          AI Preview
        </Button>
      </Tooltip>

      <Dialog fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <DialogTitle sx={{ m: 1, width: 500 }}>
          Preview Knowledge Base
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ left: 270 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflowX: "hidden" }}>
          <Box
            component="form"
            sx={{
              m: 1,
              width: 535,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="Ask a question"
              sx={{ width: 500 }}
              onChange={handleChange}
              value={question}
            />
            <Button
              variant="contained"
              sx={{ width: 20, height: 30, fontSize: 10 }}
              disabled={!question}
              onClick={handleSubmit}
              disableElevation
            >
              Enter
            </Button>
          </Box>
          <Box
            sx={{
              justifyContent: "center",
              alignItem: "center",
              gap: 2,
            }}
            display={isLoading === false ? "none" : "flex"}
          >
            <label>Generating response...</label>
            <CircularProgress size={25} />
          </Box>
          <Box
            component="form"
            sx={{ m: 1, width: 535 }}
            noValidate
            display={response === "" || isLoading ? "none" : "flex"}
            flexDirection={"column"}
            autoComplete="off"
          >
            <TextField
              name="response"
              id="outlined-textarea"
              multiline
              disabled
              value={prevQuestion + "\n---\n" + response}
            />
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Sources</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {sources &&
                  sources.map((source) => {
                    return (
                      <Typography sx={{ fontSize: 13, width: 500 }}>
                        {"[" + source.source.name + "]"}
                        <br />
                        {source.content}
                        <br />
                        <br />
                      </Typography>
                    );
                  })}
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};
