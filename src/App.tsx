import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import TaxReduction from "./pages/TaxReduction";
import PdfViewerPage from "./pages/PdfViewerPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/tax-reduction" element={<TaxReduction />} />
                <Route path="/pdfviewer" element={<PdfViewerPage />} />
                <Route path="/" element={<Index />} />
            </Routes>
        </Router>
    );
}