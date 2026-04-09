import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LLMProvider, useLLM } from './context/LLMContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Settings from './pages/Settings';
import RepoOverview from './pages/RepoOverview';
import CommitsStory from './pages/CommitsStory';
import FileAnalysis from './pages/FileAnalysis';
import Landing from './pages/Landing';

// Wrapper to handle root route logic
const RootRoute = () => {
  return <Landing />;
};

function App() {
  return (
    <AuthProvider>
      <LLMProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/app" element={
              <ProtectedRoute requireConfig={true}>
                <Home />
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            <Route path="/repo/:id/overview" element={
              <ProtectedRoute requireConfig={true}>
                <RepoOverview />
              </ProtectedRoute>
            } />

            <Route path="/repo/:id/commits" element={
              <ProtectedRoute requireConfig={true}>
                <CommitsStory />
              </ProtectedRoute>
            } />

            <Route path="/repo/:id/file-analysis" element={
              <ProtectedRoute requireConfig={true}>
                <FileAnalysis />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </LLMProvider>
    </AuthProvider>
  );
}

export default App;
