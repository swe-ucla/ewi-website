import React from "react";
import "./CompanyPricingTiers.css";

const REGISTER_URL = "http://tinyurl.com/EWI50";
const BUTTON_LABEL = "Get Started";

const registrationPerks = [
    "1 dinner table",
    "1 career fair booth",
    "Up to 2 representatives"
];

const tiers = [
    {
        name: "early bird",
        price: "$900",
        perks: [...registrationPerks, "Available until Thursday, August 13, 2026"]
    },
    {
        name: "regular",
        price: "$1,250",
        perks: [...registrationPerks, "Available until Tuesday, November 10"]
    },
    {
        name: "gold sponsor",
        price: "1 table",
        perks: ["1 table included", "Included with Gold SWE sponsorship"]
    },
    {
        name: "platinum sponsor",
        price: "2 tables",
        perks: ["2 tables included", "Included with Platinum SWE sponsorship"]
    }
]

const CompanyPricingTiers = () => {
    return (
        <div className="pricing-tiers">
            <div className="pricing-container">
                {tiers.map((tier) => (
                    <div className="pricing-box" key={tier.name}>
                        <h3 className="pricing-name">{tier.name}</h3>
                        <p className="pricing-price">{tier.price}</p>
                        <ul className="pricing-perks">
                            {tier.perks.map((perk) => (
                                <li key={perk}>{perk}</li>
                            ))}
                        </ul>
                        <a
                            href={REGISTER_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pricing-button"
                        >
                            {BUTTON_LABEL}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyPricingTiers;
