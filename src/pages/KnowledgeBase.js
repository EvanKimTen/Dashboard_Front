import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";

import EnhancedTable from "../components/EnhancedTable";
import { DataSourceDropdown } from "../components/DataSourceDropdown";
import { AiSettings } from "../components/AiSettings";
import { AiPreview } from "../components/AiPreview";
import Header from "../components/Header";
import { useUserId } from "../hooks/useUserId";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);
  const [viewingDocuments, setViewingDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState({
    model: "",
    temperature: 0,
    maxchunkSize: 0,
    system: "",
    chunkLimit: 0,
  });
  const userId = useUserId();

  useEffect(() => {
    getDocuments();
    getSettings();
  }, []);

  const getDocuments = async () => {
    try {
      const response = await proxy.get(`/${userId}`);
      setDocuments(response.data.data);
      setViewingDocuments(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getSettings = async () => {
    try {
      const response = await proxy.get(`/settings/${userId}`);
      setSettings(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async () => {
    console.log(settings);
    try {
      const response = await proxy.put(`/settings/${userId}`, settings);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length < 1) {
      setViewingDocuments(documents);
    } else {
      const filteredDocuments = documents.filter((document) =>
        document.data.name.toLowerCase().includes(search.toLowerCase())
      );
      console.log(filteredDocuments);
      setViewingDocuments(filteredDocuments);
    }
  };

  return (
    <>
      <Header name={"Knowledge Base"} />
      <TopBar>
        <SearchBar>
          {search < 1 ? (
            <SearchIcon />
          ) : (
            <IconButton
              sx={{
                padding: 0,
              }}
              onClick={() => {
                setSearch("");
                setViewingDocuments(documents);
              }}
            >
              <ClearIcon />
            </IconButton>
          )}

          <input
            type="text"
            value={search}
            placeholder={`Search for ${documents.length} documents`}
            onChange={(e) => handleSearch(e)}
          ></input>
        </SearchBar>
        <Buttons>
          <AiSettings
            settings={settings}
            setSettings={setSettings}
            saveSettings={saveSettings}
            userId={userId}
          />
          <AiPreview settings={settings} userId={userId} />
          <DataSourceDropdown getDocuments={getDocuments} userId={userId} />
        </Buttons>
      </TopBar>
      <Content>
        <EnhancedTable
          documents={viewingDocuments}
          setDocuments={setDocuments}
          getDocuments={getDocuments}
          userId={userId}
        />
        {viewingDocuments.length === 0 && (
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
    </>
  );
};

const Content = styled.div`
  max-height: 80vh; /*..very important if you want scroll bar...*/
  overflow: auto; /*..will introduce scroll bar when needed..*/
  background-color: #ebebeb;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ceddea;
  padding: 1rem;
  background-color: white;
  margin-top: 3.8rem;
  input {
    background-color: white;
  }
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    color: #737a80;
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
  margin-top: 10%;
  svg {
    font-size: 5rem;
  }
`;

export default KnowledgeBase;
