import { useHistory, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileText } from "lucide-react";

/**
 * Navigation component using react-router-dom v5 API
 * This uses deprecated APIs that have breaking changes in v6:
 * - useHistory() replaced by useNavigate()
 * - history.push() replaced by navigate()
 * - useLocation() API changed
 */
export default function Navigation() {
  const history = useHistory();
  const location = useLocation();

  const navigateToHome = () => {
    // v5 API - breaking change in v6
    history.push("/");
  };

  const navigateToAbout = () => {
    // v5 API - breaking change in v6
    history.push("/about");
  };

  return (
    <nav className="flex gap-2 p-4 bg-white border-b">
      <Button
        variant={location.pathname === "/" ? "default" : "outline"}
        onClick={navigateToHome}
      >
        <Home className="w-4 h-4 mr-2" />
        Whiteboard
      </Button>
      <Button
        variant={location.pathname === "/about" ? "default" : "outline"}
        onClick={navigateToAbout}
      >
        <FileText className="w-4 h-4 mr-2" />
        About
      </Button>
    </nav>
  );
}

