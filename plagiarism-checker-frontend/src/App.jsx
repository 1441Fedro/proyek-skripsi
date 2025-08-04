import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import ProtectedRoute from './utils/ProtectedRoute'
import CreateUserPage from './pages/CreateUserPage'
import SimilarityResultPage from './pages/SimilarityResultPage'
import UserManagementPage from './pages/UserManagementPage';
import UploadReportPage from './pages/UploadReportPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        } />
        <Route path="/result" element={
          <ProtectedRoute>
            <SimilarityResultPage />
          </ProtectedRoute>
        } />
        {/* <Route path="/uploaded-reports" element={
          <ProtectedRoute requireAdmin>
            <UploadReportPage />
          </ProtectedRoute>
          } /> */}
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin>
            <UserManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-user" element={
          <ProtectedRoute requireAdmin>
            <CreateUserPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
