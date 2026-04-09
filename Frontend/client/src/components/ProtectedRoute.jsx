import Loader from './Loader';
import { useAuth } from '../context/AuthContext';
import { useLLM } from '../context/LLMContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireConfig = false }) => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { isConfigured, loading: llmLoading } = useLLM();
    const location = useLocation();

    if (authLoading || llmLoading) {
        return <Loader text="Verifying access..." fullScreen={true} />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireConfig && !isConfigured) {
        return <Navigate to="/settings" replace />;
    }

    return children;
};

export default ProtectedRoute;
