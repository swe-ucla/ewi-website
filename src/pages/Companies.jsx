import React from "react";
import CompanyRegistration from "../components/companyRegistration/CompanyRegistration";
import GetInvolved from "../components/getInvolved/GetInvolved";
import WhyGetInvolved from "../components/whyGetInvolved/WhyGetInvolved";
import Testimonials from "../components/testimonials/Testimonials";
import "./Companies.css";

const Companies = () => {
  return (
    <div className="companies-page">
      <CompanyRegistration />
      <GetInvolved />
      <WhyGetInvolved />
      <Testimonials />
    </div>
  );
};

export default Companies;
