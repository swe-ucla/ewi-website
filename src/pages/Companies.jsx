import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CompanyRegistration from "../components/companyRegistration/CompanyRegistration";
import GetInvolved from "../components/getInvolved/GetInvolved";
import WhyGetInvolved from "../components/whyGetInvolved/WhyGetInvolved";
import PricingTiers from "../components/pricingTiers/PricingTiers";

const Companies = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="companies-page">
      <CompanyRegistration />
      <PricingTiers />
      <WhyGetInvolved />
    </div>
  );
};

export default Companies;
