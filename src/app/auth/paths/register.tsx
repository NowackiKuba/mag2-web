import RegisterForm from '../components/forms/RegisterForm';
import AuthCard from '../components/AuthCard';

const Register = () => {
  return (
    <AuthCard mode='register'>
      <RegisterForm />
    </AuthCard>
  );
};

export default Register;
