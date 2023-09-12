import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {documents.length === 0 && <h3>No documents</h3>}
      <ul>
        {documents.map((document) => {
          return (
            <ListItem key={document.documentID}>
              <li>{document.data.name}</li>
              <a>type</a>
              <a>status</a>
              <a>date</a>
            </ListItem>
          );
        })}
      </ul>
    </div>
  );
};

const ListItem = styled.div`
  display: flex;
  gap: 1rem;
  border: 2px solid black;
  margin-top: 1rem;
  padding: 1rem;

  li {
    list-style-type: none;
  }
`;

export default KnowledgeBase;
