import { Route, Routes } from 'react-router-dom';
import './App.css'
import ChatPage from './features/components/ChatPage';
import AppLayout from './layout/AppLayout'
import LoginPage from './features/auth/Login';
import SSO from './features/auth/SSO';
import ProtectedRoute from './features/auth/ProtectedRoute';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/sso" element={<SSO />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App
