'use client';

import React from 'react';
import Link from 'next/link';
import './privacy-policy.scss';

const PrivacyPolicyPage = () => {
  return (
    <>
      <main>
        <div className="container mx-auto p-4">
          <div className="content grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            <h1>Privacy Policy</h1>
            <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

            <h2>Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>

            <h3>Personal Data</h3>
            <p>Personally identifiable information, such as your name, shipping address, email address, and telephone number.</p>

            <h3>Derivative Data</h3>
            <p>Information our servers automatically collect when you access the Site, such as your IP address, browser type, and operating system.</p>

            <h2>Use of Your Information</h2>
            <p>We may use the information we collect from you in the following ways:</p>
            <ul>
                <li>To operate and maintain our Site;</li>
                <li>To understand and analyze how you use our Site;</li>
                <li>To improve our services and offerings;</li>
                <li>To send you updates and marketing communications;</li>
            </ul>

            <h2>Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations:</p>
            <ul>
                <li>By Law or to Protect Rights;</li>
                <li>Business Transfers;</li>
                <li>Third-Party Service Providers;</li>
            </ul>

            <h2>Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at: privacy@example.com</p>
            <h5>Back to <Link href="/" className='link'>Home</Link></h5>
          </div>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicyPage;
