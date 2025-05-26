
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-atlas-purple">Cookie Policy</h1>
            <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-atlas-dark">What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you 
                visit our website. They are widely used to make websites work more efficiently and provide 
                information to website owners.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-atlas-dark">How We Use Cookies</h2>
              <p className="mb-4">GameAtlas uses cookies for several purposes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Essential cookies:</strong> These are necessary for the website to function properly</li>
                <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website</li>
                <li><strong>Functional cookies:</strong> These enable enhanced functionality and personalization</li>
                <li><strong>Advertising cookies:</strong> These may be used to deliver relevant advertisements</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-atlas-dark">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mb-2 text-atlas-teal">Session Cookies</h3>
              <p className="mb-4">
                These are temporary cookies that remain in your browser until you leave the website. 
                They help us remember your preferences during your visit.
              </p>
              
              <h3 className="text-xl font-semibold mb-2 text-atlas-teal">Persistent Cookies</h3>
              <p className="mb-4">
                These cookies remain on your device for a set period or until you delete them. 
                They help us recognize you when you return to our website.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-atlas-dark">Managing Cookies</h2>
              <p className="mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are 
                already on your computer and you can set most browsers to prevent them from being placed.
              </p>
              <p className="mb-4">
                However, if you do this, you may have to manually adjust some preferences every time you 
                visit a site and some services and functionalities may not work.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-atlas-dark">Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please contact us at{" "}
                <a href="mailto:privacy@gameatlas.com" className="text-atlas-purple hover:underline">
                  privacy@gameatlas.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cookies;
