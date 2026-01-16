import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { register } from '../../api/auth';
import toast from 'react-hot-toast';
import AuthFormLayout from '../AuthFormLayout';
import FormField from '../FormField';
import SubmitButton from '../SubmitButton';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register(username, email, password);
      login(response.token, response.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Create your account"
      subtitle="Already have an account?"
      linkText="Sign in"
      linkTo="/login"
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
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          position="middle"
        />
        <FormField
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          position="middle"
        />
        <FormField
          id="confirm-password"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          position="last"
        />
      </div>
      <div>
        <SubmitButton
          loading={loading}
          loadingText="Creating account..."
          text="Create account"
        />
      </div>
    </AuthFormLayout>
  );
}
