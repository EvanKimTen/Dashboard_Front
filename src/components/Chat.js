import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, Sidebar,Conversation, ConversationList, ConversationHeader, MessageSeparator  } from '@chatscope/chat-ui-kit-react';
import { useState, useEffect } from "react";
import axios from "axios";


const Chat = ({ transcriptID }) => {
    const [transcriptDialog, setTranscriptDialog] = useState([])
    const [selectedTranscriptID, setSelectedTranscriptID] = useState('');

    const getDialog = async () => {
        try {
          const response = await axios.post(`http://localhost:5001/api/proxy/dialog`, {
            query: [
              {
                filter: {
                  ID: selectedTranscriptID,
                },
              },
            ],
          });
          console.log(response.data); 
          setTranscriptDialog(response.data);
        } catch (error) {
          console.error("Dialog error:", error);
        }
    };


    useEffect(() => {
        if (selectedTranscriptID !== '') {
            getDialog();
        }
    }, [selectedTranscriptID]);

    useEffect(() => {
        if (transcriptID && transcriptID.length > 0) {
          setSelectedTranscriptID(transcriptID[0]);
        }
    }, [transcriptID]);

    return (
        <div className='chat'>
                    <MainContainer responsive>                
                      <Sidebar position="left" scrollable={true}>
                        <ConversationList>                                                     {transcriptID.map((id=> {
                            return(
                                <Conversation 
                                key={id} 
                                name="Test User" 
                                className='conversation'
                                onClick={() => setSelectedTranscriptID(id)}
                                active={id === selectedTranscriptID}
                                >
                                </Conversation>
                            )
                        }))}
                        </ConversationList>
                      </Sidebar>
                      
                      <ChatContainer>
                        <ConversationHeader>
                          <ConversationHeader.Content userName="Transcript"  />  
                        </ConversationHeader>
                        <MessageList  >
                          <MessageSeparator content="Converstation Started" />

                    {transcriptDialog.map((item, index) => {
                    if (item.type === "text") {
                        return (
                        <Message
                            key={index} // Use a unique key, such as the index, as React requires unique keys for mapping elements
                            model={{
                            direction: "incoming"
                            }}
                            payload={item.payload.payload.message}
                        />
                        );
                    } else if (item.type === "request") {
                        return (
                            <Message
                                key={index} // Use a unique key, such as the index, as React requires unique keys for mapping elements
                                model={{
                                type: "text",
                                direction: "outgoing"
                                }}
                                payload={item.payload.payload.query}
                            />
                            );
                    }
                    // Handle other types if needed, or return null if you don't want to render them.
                    return null;
                    })}
                          <MessageSeparator content="Converstation Ended" />
                        </MessageList>
                      </ChatContainer>                         
                    </MainContainer>
                  </div>
    )
}

export default Chat