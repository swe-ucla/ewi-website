import React from "react";
import "./pricingTiers.css";


const tiers = [
    {
        name: "tier 1",
        perks: "description"
    },
    {
        name: "tier 2",
        perks: "description"
    },
    {
        name: "tier 3",
        perks: "description"
    }
]

const PricingTiers = () => {
    return (
        <div className="pricing-tiers">
            <div className="pricing-container">
                {tiers.map((tier) => (
                    <div className="pricing-box" key={tier.name}>
                        <h3>{tier.name}</h3>
                        <p>{tier.perks}</p>
                    </div>   
                ))}
            </div>
        </div>
    );
};

export default PricingTiers;