import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CompanyHero from "../components/company/CompanyHero";
import CompanyPricingTiers from "../components/company/CompanyPricingTiers";
import CompanyGetInvolved from "../components/company/CompanyGetInvolved";
import CompanySurvivalGuide from "../components/company/CompanySurvivalGuide";

const Companies = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="companies-page">
      <CompanyHero />
      <CompanyPricingTiers />
      <CompanyGetInvolved />
      <CompanySurvivalGuide />
    </div>
  );
};

export default Companies;
