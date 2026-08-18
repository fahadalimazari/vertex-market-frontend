import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    // Basic Meta
    document.title = title ? `${title} | Vertex Market` : 'Vertex Market - Enterprise Marketplace';
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = keywords;
    }

    // OpenGraph
    const setOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', title || 'Vertex Market');
    setOgTag('og:description', description || 'Enterprise Marketplace');
    setOgTag('og:type', 'website');
    if (image) setOgTag('og:image', image);
    if (url) setOgTag('og:url', url);

  }, [title, description, keywords, image, url]);

  return null;
};

export default SEO;
