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
import FindInPageIcon from "@mui/icons-material/FindInPage";

import EnhancedTable from "../components/EnhancedTable";
import { DataSourceDropdown } from "../components/DataSourceDropdown";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);
  const [viewingDocuments, setViewingDocuments] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = async () => {
    try {
      const response = await proxy.get("/");
      setDocuments(response.data.data);
      setViewingDocuments(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    setInput(e.target.value);
    if (e.target.value.length < 1) {
      setViewingDocuments(documents);
    } else {
      const filteredDocuments = documents.filter((document) =>
        document.data.name.includes(input)
      );
      setViewingDocuments(filteredDocuments);
    }
  };

  return (
    <div>
      <TopBar>
        <SearchBar>
          <SearchIcon />
          <input
            type="text"
            value={input}
            placeholder="Search for documents"
            onChange={(e) => handleSearch(e)}
          ></input>
        </SearchBar>
        <Buttons>
          <Button variant="outlined">
            <TuneIcon />
          </Button>
          <Button variant="outlined">AI Preview</Button>
          <DataSourceDropdown getDocuments={getDocuments} />
        </Buttons>
      </TopBar>
      <Content>
        {viewingDocuments.length > 0 ? (
          <EnhancedTable
            documents={viewingDocuments}
            setDocuments={setDocuments}
            getDocuments={getDocuments}
          />
        ) : (
          <Label>
            <FindInPageIcon color="primary" />
            <h3>No data sources exist</h3>
            <h4>
              Upload text, PDF, URLs, and create a Chat-GPT like agent
              experience.
            </h4>
          </Label>
        )}
      </Content>
    </div>
  );
};

const Content = styled.div`
  max-height: 40rem; /*..very important if you want scroll bar...*/
  height: 40rem;
  overflow: auto; /*..will introduce scroll bar when needed..*/
  background-color: #fcfcfc;
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

const Label = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15%;

  svg {
    font-size: 5rem;
  }
`;

export default KnowledgeBase;
