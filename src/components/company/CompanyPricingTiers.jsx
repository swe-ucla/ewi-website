import React from "react";
import "./CompanyPricingTiers.css";

const tiers = [
    {
        name: "pricing tier 1",
        perks: "description"
    },
    {
        name: "pricing tier 2",
        perks: "description"
    },
    {
        name: "pricing tier 3",
        perks: "description"
    }
]

const CompanyPricingTiers = () => {
    return (
        <div className="pricing-tiers">
            <div className="pricing-container">
                {tiers.map((tier) => (
                    <div className="pricing-box" key={tier.name}>
                        <div className="pricing-title">
                            <h3>{tier.name}</h3>
                        </div>
                        <p className="pricing-perks">{tier.perks}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyPricingTiers;
