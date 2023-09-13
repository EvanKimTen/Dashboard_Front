import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MainContainer, ChatContainer, MessageList, Message, Sidebar,Conversation, ConversationList, ConversationHeader, MessageSeparator, Avatar } from '@chatscope/chat-ui-kit-react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from 'react-responsive-carousel';


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
          setSelectedTranscriptID(transcriptID[0].id);
        }
    }, [transcriptID]);

    return (
        <div className='chat'>
            <MainContainer responsive>                
                <Sidebar position="left" scrollable={true}>
                <ConversationList>                                                     {transcriptID.map((object=> {
                    return(
                        <Conversation 
                        key={object.id} 
                        name="Test User" 
                        className='conversation'
                        onClick={() => setSelectedTranscriptID(object.id)}
                        active={object.id === selectedTranscriptID}
                        info={object.createdTime}
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
                                key={index}
                                model={{
                                direction: "incoming"
                                }}
                                payload={item.payload.payload.message}
                            />
                            );
                        } else if (item.type === "request" && item.payload.payload.query) {
                            return (
                                <Message
                                    key={index}
                                    model={{
                                    direction: "outgoing"
                                    }}
                                    payload={item.payload.payload.query}
                                />
                                );
                        } else if (item.type === "request" && item.payload.payload.label) {
                            return (
                                <Message
                                    key={index}
                                    model={{
                                    direction: "outgoing"
                                    }}
                                    payload={item.payload.payload.label}
                                />
                                );
                        } else if (item.type === "carousel") {
                            return (
                                <Message
                                    key={index}
                                    model={{
                                    direction: "incoming",
                                    type: "custom"
                                    }}
                                >
                                    <Message.CustomContent>
                                        {item.payload.payload.cards.map((product)=>{
                                            return(
                                            <Card>
                                                <CardMedia
                                                component="img"
                                                height="250"
                                                image={product.imageUrl}
                                                alt="product image"
                                                />
                                                <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {product.title}
                                                </Typography>
                                                </CardContent>
                                            </Card>
                                            )
                                        })}
                                    </Message.CustomContent>
                                    
                                </Message>
                                );
                        }
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