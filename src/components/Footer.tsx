
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-atlas-dark text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold">Game<span className="text-atlas-teal">Atlas</span></span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Unlock organic discoverability for your games across the web.
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white">Features</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">Terms</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white">Cookies</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} GameAtlas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
