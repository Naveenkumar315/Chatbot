import { Route, Routes } from 'react-router-dom';
import './App.css'
import ChatPage from './features/components/ChatPage';
import AppLayout from './layout/AppLayout'

function App() {

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App
