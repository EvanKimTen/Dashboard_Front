import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { LuSearch, LuSettings2 } from "react-icons/lu";
import { width } from "@mui/system";

const proxy = axios.create({
  baseURL: "http://localhost:5001/proxy/knowledge-base",
});

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = async () => {
    try {
      const response = await proxy.get("/");
      setDocuments(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <TopBar>
        <SearchBar>
          <LuSearch />
          <input type="text" placeholder="Search for documents"></input>
        </SearchBar>
        <Buttons>
          <button type="button" class="btn btn-light">
            <LuSettings2 />
          </button>
          <button type="button" class="btn btn-light">
            AI Preview
          </button>
          <button type="button" class="btn btn-primary ">
            Add Data Source
          </button>
        </Buttons>
      </TopBar>
      <Content>
        <ul>
          <ListItem>
            <button></button>
            <li style={{ width: "28.3rem" }}>Name</li>
            <a style={{ width: "1.3rem" }}>Type</a>
            <a style={{ width: "3.8rem" }}>Status</a>
            <a>Date</a>
          </ListItem>
          {documents.length === 0 && <h3>No documents</h3>}
          {documents.map((document) => {
            return (
              <ListItem key={document.documentID}>
                <button></button>
                <li>{document.data.name.substring(0, 48)}...</li>
                <a>{document.data.type}</a>
                <a>{document.status.type}</a>
                <a>{document.updatedAt}</a>
              </ListItem>
            );
          })}
        </ul>
      </Content>
    </div>
  );
};

const Content = styled.div`
  height: 40rem; /*..very important if you want scroll bar...*/
  overflow: auto; /*..will introduce scroll bar when needed..*/
`;

const ListItem = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 2.5rem;
  border-bottom: 1px solid #ceddea;
  padding: 1rem;

  button {
    background-color: white;
    border: 2px solid #b7c4d0;
    border-radius: 0.2rem;
    width: 1rem;
    height: 1rem;
  }

  li {
    list-style-type: none;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ceddea;
  padding: 1rem;
  overflow: hidden;

  button {
    border: 1px solid #b7c4d0;
  }
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1.8rem;
  svg {
    color: #b7c4d0;
    font-size: 1.3rem;
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
