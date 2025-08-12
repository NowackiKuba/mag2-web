import AuthCard from '../components/AuthCard';
import BusinessInfoForm from '../components/forms/business-info-form';

const BusinessInfo = () => {
  return (
    <AuthCard mode='register'>
      <BusinessInfoForm />
    </AuthCard>
  );
};

export default BusinessInfo;
