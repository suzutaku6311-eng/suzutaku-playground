import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './PrivacyPage.css';

export const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container privacy-page animate-fade-in">
      <div className="privacy-header">
        <h1 className="page-title">{t('privacy.title')}</h1>
      </div>

      <div className="privacy-content">
        <p className="privacy-text">{t('privacy.p1')}</p>

        <section>
          <h2 className="privacy-section-title">{t('privacy.section1Title')}</h2>
          <p className="privacy-text">{t('privacy.section1Desc')}</p>
        </section>

        <section>
          <h2 className="privacy-section-title">{t('privacy.section2Title')}</h2>
          <p className="privacy-text">{t('privacy.section2Desc')}</p>
        </section>

        <section>
          <h2 className="privacy-section-title">{t('privacy.section3Title')}</h2>
          <p className="privacy-text">{t('privacy.section3Desc')}</p>
        </section>
      </div>
    </div>
  );
};
