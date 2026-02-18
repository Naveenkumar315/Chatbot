import { Route, Routes } from 'react-router-dom';
import './App.css'
import ChatPage from './features/components/ChatPage';
import AppLayout from './layout/AppLayout'
import LoginPage from './features/components/Login';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App
