import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import SelfQuizzing from '@/pages/SelfQuizzing';
import SelfQuizzingDetails from '@/pages/SelfQuizzingDetails';
import Multiplayer from '@/pages/Multiplayer';
import BrainEnhancement from '@/pages/BrainEnhancement';
import Leaderboard from '@/pages/Leaderboard';
import EncodingCharts from '@/pages/EncodingCharts';
import Profile from '@/pages/Profile';
import Artifacts from '@/pages/Artifacts';
import ArtifactDetails from '@/pages/ArtifactDetails';
import Dynasties from '@/pages/Dynasties';
import Puzzles from '@/pages/Puzzles';
import Scan from '@/pages/Scan';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app routes - all require authentication */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/self-quizzing" element={<SelfQuizzing />} />
          <Route path="/self-quizzing/:id" element={<SelfQuizzingDetails />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/brain-enhancement" element={<BrainEnhancement />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/encoding-charts" element={<EncodingCharts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/artifacts" element={<Artifacts />} />
          <Route path="/artifacts/:id" element={<ArtifactDetails />} />
          <Route path="/dynasties" element={<Dynasties />} />
          <Route path="/puzzles/:id" element={<Puzzles />} />
          <Route path="/scan" element={<Scan />} />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
