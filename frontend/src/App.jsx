import { Route, Routes } from 'react-router-dom';
import './App.css'
import ChatPage from './features/components/ChatPage';
import AppLayout from './layout/AppLayout'
import LoginPage from './features/auth/Login';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import UpdatePasswordPage from './features/auth/UpdatePasswordPage';
import SSO from './features/auth/SSO';
import ProtectedRoute from './features/auth/ProtectedRoute';
import SignupForm from './features/auth/SignupForm';
import AuthLayout from './features/auth/AuthLayout';
import ToastProvider from './features/utils/ToastProvider';



function App() {

  return (
    <>
      <ToastProvider />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Route>
        <Route path="/sso" element={<SSO />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App
