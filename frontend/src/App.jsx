import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentHome from './pages/student/StudentHome';
import EventDetails from './pages/student/EventDetails';
import MyEvents from './pages/student/MyEvents';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateEvent from './pages/organizer/CreateEvent';
import Participants from './pages/organizer/Participants';

// Admin Pages
import AdminPanel from './pages/admin/AdminPanel';

// Shared Pages
import ChatRoom from './pages/shared/ChatRoom';
import ChatRoomList from './components/ChatRoomList';

import './styles/theme.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Student Routes */}
                <Route path="/student" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentHome />
                  </ProtectedRoute>
                } />
                <Route path="/student/event/:id" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <EventDetails />
                  </ProtectedRoute>
                } />
                <Route path="/student/my-events" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MyEvents />
                  </ProtectedRoute>
                } />
                <Route path="/student/chat" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <ChatRoomList />
                  </ProtectedRoute>
                } />

                {/* Organizer Routes */}
                <Route path="/organizer" element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/organizer/create" element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <CreateEvent />
                  </ProtectedRoute>
                } />
                <Route path="/organizer/participants/:id" element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <Participants />
                  </ProtectedRoute>
                } />
                <Route path="/organizer/chat" element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <ChatRoomList />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/admin/chat" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ChatRoomList />
                  </ProtectedRoute>
                } />

                {/* Chat Route - accessible to all authenticated users */}
                <Route path="/chat/:eventId" element={
                  <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
                    <ChatRoom />
                  </ProtectedRoute>
                } />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
