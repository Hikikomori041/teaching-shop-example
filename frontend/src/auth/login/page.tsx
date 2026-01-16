import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/auth';
import toast from 'react-hot-toast';
import AuthFormLayout from '../AuthFormLayout';
import FormField from '../FormField';
import SubmitButton from '../SubmitButton';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(username, password);
      authLogin(response.token, response.user);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Sign in to your account"
      subtitle="Or"
      linkText="create a new account"
      linkTo="/register"
      onSubmit={handleSubmit}
    >
      <div className="rounded-md shadow-sm -space-y-px">
        <FormField
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          position="first"
        />
        <FormField
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          position="last"
        />
      </div>
      <div>
        <SubmitButton
          loading={loading}
          loadingText="Signing in..."
          text="Sign in"
        />
      </div>
    </AuthFormLayout>
  );
}
