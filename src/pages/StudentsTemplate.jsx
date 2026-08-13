import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import StudentsTemplate from "../components/StudentsTemplate/StudentsTemplate";

const StudentsTemplatePage = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return <StudentsTemplate />;
};

export default StudentsTemplatePage;
