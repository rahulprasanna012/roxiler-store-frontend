import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './shared/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import StorePage from './pages/StorePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute element={<AdminPage />} allowedRoles={['admin']} />
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute element={<UserPage />} allowedRoles={['user']} />
            }
          />
          <Route
            path="/store"
            element={
              <ProtectedRoute element={<StorePage />} allowedRoles={['store_owner']} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;