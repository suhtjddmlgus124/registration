import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs', // 최신 버전은 .mjs 확장자일 수 있음
    import.meta.url,
).toString();


export default function PdfViewer({ fileUrl, fileName }: { fileUrl: string, fileName: string }) {
    const [ numPages, setNumPages ] = useState<number>(1);
    const [ currentPage, setCurrentPage ] = useState<number>(1);

    function handleLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setCurrentPage(1);
    }

    function handleCurrentPage(e: React.ChangeEvent<HTMLInputElement>) {
        const page = Number(e.target.value);
        if(page < 1) setCurrentPage(1);
        else if(page > numPages) setCurrentPage(numPages);
        else setCurrentPage(page);
    }

    function handleDownload() {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName;
        a.click();
    }

    function handlePrint() {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = fileUrl;

        document.body.appendChild(iframe);

        iframe.onload = () => {
            if(iframe.contentWindow) {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            }
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        };
    }
    
    return (
        <div>
            <div>{ fileName }</div>

            <Document file={fileUrl} loading="PDF를 불러오는 중..." onLoadSuccess={handleLoadSuccess}>
                <Page pageNumber={currentPage} loading="페이지를 불러오는 중..." renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
            { numPages && 
                <div>
                    <button onClick={() => setCurrentPage(prev => prev-1)} disabled={currentPage <= 1}>{"<"}</button>
                    <input type="number" value={currentPage} onChange={handleCurrentPage} /> / { numPages }
                    <button onClick={() => setCurrentPage(prev => prev+1)} disabled={currentPage >= numPages}>{">"}</button>
                </div>
            }

            <button onClick={handleDownload}>다운로드</button>
            <button onClick={handlePrint}>인쇄</button>
        </div>
    );
}