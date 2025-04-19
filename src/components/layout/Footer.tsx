
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row justify-between items-center md:h-16 gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <Link to="/" className="font-medium">
            BHAI - Behavioral Health Assistant Interface
          </Link>
          <p className="text-center md:text-left text-xs text-muted-foreground">
            BHAI provides information and support, but does not replace professional mental health care.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BHAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
