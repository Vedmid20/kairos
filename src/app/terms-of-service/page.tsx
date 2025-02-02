'use client';

import React from 'react';
import Link from 'next/link';
import './terms-of-service.scss';

const TermsOfServicePage = () => {
  return (
    <>
      <main>
        <div className="container mx-auto p-4">
          <div className="content grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            <h1>Terms of Service</h1>
            <p>These Terms of Service govern your use of our website and services.</p>

            <h2>Acceptance of Terms</h2>
            <p>By accessing and using our website, you accept and agree to be bound by these Terms of Service and our Privacy Policy.</p>

            <h3>Changes to Terms</h3>
            <p>We reserve the right to modify these terms at any time, and you agree to be bound by such modifications.</p>

            <h2>Use of Site</h2>
            <p>You agree to use the site only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use of the site.</p>

            <h3>User Content</h3>
            <p>Any content you post or submit to the site remains your property, but by posting it, you grant us a license to use, reproduce, and display it.</p>

            <h3>Termination</h3>
            <p>We may terminate or suspend your access to the site at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users.</p>

            <h2>Disclaimers</h2>
            <p>The site is provided on an "as is" basis without warranties of any kind. We do not guarantee that the site will be available at all times or without interruptions.</p>

            <h2>Limitation of Liability</h2>
            <p>In no event shall we be liable for any damages arising out of or in connection with your use of the site.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at: terms@example.com</p>
            <h5>Back to <Link href="/" className='link'>Home</Link></h5>
          </div>
        </div>
      </main>
    </>
  );
};

export default TermsOfServicePage;
