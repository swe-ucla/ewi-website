import React from 'react';
import './FlippingBookEmbed.css';

const FlippingBookEmbed = ({ issuuUrl = "https://issuu.com/lianelsalinton/docs/ewi-survival-guide" }) => {
  const getIssuuEmbedUrl = (url) => {
    try {
      const match = url.match(/issuu\.com\/([^\/]+)\/docs\/([^\/\?]+)/);
      if (match) {
        const username = match[1];
        const documentName = match[2];
        return `https://e.issuu.com/embed.html#${username}/${documentName}`;
      }
      return url.replace('issuu.com', 'e.issuu.com/embed.html#').replace('/docs/', '/');
    } catch (error) {
      console.error('Error parsing Issuu URL:', error);
      return url;
    }
  };

  const embedUrl = getIssuuEmbedUrl(issuuUrl);

  return (
    <div className="flippingbook-embed-container">
      <iframe
        src={embedUrl}
        allowFullScreen
        title="EWI Survival Guide"
      />
    </div>
  );
};

export default FlippingBookEmbed;

