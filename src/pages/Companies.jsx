import CompanyRegistration from "../components/companyRegistration/CompanyRegistration";
import GetInvolved from "../components/getInvolved/GetInvolved";
import WhyGetInvolved from "../components/whyGetInvolved/WhyGetInvolved";
import Testimonials from "../components/testimonials/Testimonials";

const Companies = () => {
  return (
    <div 
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(178.796deg, rgb(157, 167, 122) 0%, rgb(206, 211, 188) 30%, rgb(255, 255, 255) 50%, rgb(255, 225, 237) 75%, rgb(236, 186, 208) 100%)",
        paddingBottom: 0
      }}
    >
      <CompanyRegistration />
      <GetInvolved />
      <WhyGetInvolved />
      <Testimonials />
    </div>
  );
};

export default Companies;
