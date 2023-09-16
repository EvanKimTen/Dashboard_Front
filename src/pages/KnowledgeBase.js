import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import FindInPageIcon from "@mui/icons-material/FindInPage";

import EnhancedTable from "../components/EnhancedTable";
import { DataSourceDropdown } from "../components/DataSourceDropdown";
import { AiSettings } from "../components/AiSettings";
import { AiPreview } from "../components/AiPreview";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);
  const [viewingDocuments, setViewingDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    maxchunkSize: 400,
    system:
      "넌 흑염소 농장협회 어시스턴트야. 꼭 한국어로만 대답해줘. 다른 언어는 절대 쓰면 안 돼. 다시 한 번 경고하는데 한국어로만 답해줘.",
    chunkLimit: 3,
  });

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = async () => {
    try {
      const response = await proxy.get("/");
      setDocuments(response.data.data);
      setViewingDocuments(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length < 1) {
      console.log("all");
      setViewingDocuments(documents);
    } else {
      const filteredDocuments = documents.filter((document) =>
        document.data.name.toLowerCase().includes(search.toLowerCase())
      );
      console.log(filteredDocuments);
      console.log("filtered");
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
            value={search}
            placeholder={`Search for ${documents.length} documents`}
            onChange={(e) => handleSearch(e)}
          ></input>
        </SearchBar>
        <Buttons>
          <AiSettings settings={settings} setSettings={setSettings} />
          <AiPreview settings={settings} />
          <DataSourceDropdown getDocuments={getDocuments} />
        </Buttons>
      </TopBar>
      <Content>
        <EnhancedTable
          documents={viewingDocuments}
          setDocuments={setDocuments}
          getDocuments={getDocuments}
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
