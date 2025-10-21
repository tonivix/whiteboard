import { useHistory } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

/**
 * About page demonstrating react-router-dom v5 API usage
 * Uses deprecated useHistory hook that has breaking changes in v6
 */
export default function About() {
  const history = useHistory();

  const goBack = () => {
    // v5 API - breaking change in v6
    history.goBack();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={goBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-4">About Collaborative Whiteboard</h1>
          
          <div className="space-y-4 text-gray-700">
            <p>
              This is a collaborative whiteboard developed with React and Next.js,
              inspired by Miro. It allows you to create drawings, shapes and text on
              an interactive canvas.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Free drawing with pen</li>
              <li>Creation of geometric shapes (rectangles and circles)</li>
              <li>Text addition</li>
              <li>Color selection</li>
              <li>Stroke thickness adjustment</li>
              <li>Canvas panning</li>
              <li>Export to PNG</li>
              <li>Clear canvas</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">Technologies</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>React 18</li>
              <li>Next.js</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui</li>
              <li>react-router-dom v5 (outdated - for Dependabot testing)</li>
            </ul>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This project intentionally uses react-router-dom v5,
                which is outdated and has breaking changes in v6. This is for
                Dependabot testing purposes.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

