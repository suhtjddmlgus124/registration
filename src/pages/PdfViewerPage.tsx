import { useLocation } from "react-router-dom";
import PdfViewer from "@/components/PdfViewer";


export default function PdfViewerPage() {
    const location = useLocation();
    const { fileUrl, fileName } = location.state;

    return (
        <main>
            { fileUrl }
            <PdfViewer fileUrl={fileUrl} fileName={fileName} />
        </main>
    );
}