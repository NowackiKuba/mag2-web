import LoginForm from '../components/forms/LoginForm';
import AuthCard from '../components/AuthCard';

const Login = () => {
  return (
    <AuthCard mode='login'>
      <LoginForm />
    </AuthCard>
  );
};

export default Login;
