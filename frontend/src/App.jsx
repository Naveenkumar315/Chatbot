import { Route, Routes } from 'react-router-dom';
import './App.css'
import ChatPage from './features/components/ChatPage';
import AppLayout from './layout/AppLayout'
import LoginPage from './features/auth/Login';
import SSO from './features/auth/SSO';
import ProtectedRoute from './features/auth/ProtectedRoute';
import SignupForm from './features/auth/SignupForm';
import AuthLayout from './features/auth/AuthLayout';


function App() {

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupForm />} />
      </Route>
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
