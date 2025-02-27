import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/Chat';
import { Navbar } from './components/Navbar';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
  // Get new chat session when component mounts
  useEffect(() => {
    console.log('Current Chat ID changed:', currentChatId);
    console.log('Trace:', new Error().stack);
    if (currentChatId === null) {
      console.log('Attempting to create new chat');
      createNewChat();
    } else {
      // Add this block to load chat history when currentChatId changes
      console.log('Loading chat history for current chat ID');
      loadChatHistory(currentChatId);
    }
  }, [currentChatId]);
  

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chat/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      setCurrentChatId(data.sessionId);
      setMessages([]); 
      setFiles([]); 
      
      return data.sessionId;
    } catch (error) {
      console.error('Error creating new chat:', error);
      return null;
    }
  };
  // const handleSubmit = async (input) => {
  //   if (!input.trim()) return;
  
  //   // Create the user message object
  //   const newMessage = { role: 'user', content: input };
    
  //   // Immediately add the user message to the messages state
  //   setMessages(prevMessages => [...prevMessages, newMessage]);
  
  //   try {
  //     const response = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         sessionId: currentChatId,
  //         messages: [...messages, newMessage] // Send updated messages including new message
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  
  //     const data = await response.json();
      
  //     if (data.error) {
  //       throw new Error(data.error);
  //     }

  //     console.log('Assistant response:', data.content);
  
  //     // Add the assistant's response to the messages
  //     setMessages(prevMessages => [...prevMessages, {
  //       role: 'assistant',
  //       content: data.content
  //     }]);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     // Add an error message if the request fails
  //     setMessages(prevMessages => [...prevMessages, {
  //       role: 'assistant',
  //       content: 'Sorry, there was an error processing your request.'
  //     }]);
  //   }
  // };

  const handleSubmit = async (input) => {
    if (!input.trim()) return;
  
    const newMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    const sessionId = currentChatId || (await createNewChat());

    
    // Set loading state to true before API call
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          messages: [...messages, newMessage]
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Assistant response:', data.content);
  
      setMessages(prevMessages => [...prevMessages, {
        role: 'assistant',
        content: data.content
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      // Set loading state to false after response or error
      setIsLoading(false);
    }
  };


  const handleFileUpload = async (uploadedFiles) => {
    const formData = new FormData();
    uploadedFiles.forEach(file => {
      formData.append('files[]', file);
    });

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      setFiles(prev => [...prev, ...uploadedFiles]);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: `Uploaded files: ${uploadedFiles.map(f => f.name).join(', ')}` },
        { role: 'assistant', content: data.message || 'Files uploaded successfully.' }
      ]);
    } catch (error) {
      console.error('Error uploading files:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error uploading the files.' }
      ]);
    }
  };

  const loadChatHistory = async (chatId) => {
    console.log('Loading chat history for chatId:', chatId);
    try {
      const response = await fetch(`/api/chat/load/${chatId}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentChatId(chatId);
      setMessages(data.messages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  return (
  <div className="flex flex-col h-screen">
  {/* Navbar */}
  <div className="flex-none">
    <Navbar />
  </div>
  
  {/* Main content */}
  <div className="flex flex-1 overflow-hidden">
    <Sidebar
      onFileUpload={handleFileUpload}
      currentChatId={currentChatId}
      setCurrentChatId={setCurrentChatId}
      files={files}
    />
    <ChatArea
      messages={messages}
      onSubmit={handleSubmit}
      isLoading={isLoading}  // Pass loading state to ChatArea
    />
  </div>
  </div>
  );
}

export default App;