import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


type TaxReductionForm = {
    applicantName: string;
    residentNumberFront: string;
    address: string;
    reductionTarget: string;
    reductionReason: string;
    applicationDate: string;
};

export default function TaxReduction() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm<TaxReductionForm>({ mode: 'onBlur' });
    
    async function handlePDF(form: TaxReductionForm) {
        try {
            const { PDFDocument } = await import('pdf-lib');
            const fontkit = (await import('@pdf-lib/fontkit')).default;

            const pdfBytes = await fetch(`${import.meta.env.BASE_URL}templates/지방세감면신청서양식.pdf`).then(res => res.arrayBuffer());
            const fontBytes = await fetch(`${import.meta.env.BASE_URL}fonts/HCRDotum.ttf`).then(res => res.arrayBuffer());

            const pdfDoc = await PDFDocument.load(pdfBytes);
            pdfDoc.registerFontkit(fontkit);
            const korFont = await pdfDoc.embedFont(fontBytes);

            const [ year, month, date ] = form.applicationDate.split('-');
            const stripedMonth = month.replace(/^0+/, '');
            const stripedDate = date.replace(/^0+/, '');
            const fieldInfo = [
                { name: 'applicantName', value: form.applicantName },
                { name: 'residentNumberFront', value: form.residentNumberFront },
                { name: 'address', value: form.address },
                { name: 'reductionTarget', value: form.reductionTarget },
                { name: 'reductionReason', value: form.reductionReason },
                { name: 'year', value: year },
                { name: 'month', value: stripedMonth },
                { name: 'date', value: stripedDate },
                { name: 'applicantName2', value: form.applicantName },
            ];

            const pdfForm = pdfDoc.getForm();
            fieldInfo.forEach(({ name, value }) => {
                const field = pdfForm.getTextField(name);
                if(field) {
                    field.setFontSize(9);
                    field.setText(value);
                    field.updateAppearances(korFont);
                }
            });
            pdfForm.flatten();

            const resultPdfBytes = await pdfDoc.save();
            const pdfBlob = new Blob([resultPdfBytes as any], { type: 'application/pdf' });
            const fileUrl = URL.createObjectURL(pdfBlob);

            navigate('/pdfviewer', { state: { fileUrl: fileUrl, fileName: '지방세감면신청서.pdf' }});
        }
        catch(error) {
            alert(error);
        }
    }

    return (
        <main>
            <h2>지방세 감면 신청서 양식</h2>

            <form onSubmit={handleSubmit(handlePDF)}>
                <label>
                    성명
                    <input type="text" autoComplete="off" {...register('applicantName', { required: '필수 항목입니다.' })} />
                </label>
                <label>
                    주민등록번호 앞자리
                    <input type="text" autoComplete="off" {...register('residentNumberFront', { required: '필수 항목입니다.' })} />
                </label>
                <label>
                    주소
                    <input type="text" autoComplete="off" {...register('address', { required: '필수 항목입니다.' })} />
                </label>
                <label>
                    감면 대상
                    <input type="text" autoComplete="off" {...register('reductionTarget', { required: '필수 항목입니다.' })} />
                </label>
                <label>
                    감면 사유
                    <select autoComplete="off" {...register('reductionReason', { required: '필수 항목입니다.' })}>
                        <option>생애 최초</option>
                        <option>출산·양육</option>
                        <option>기타</option>
                    </select>
                </label>
                <label>
                    신청 날짜
                    <input type="date" autoComplete="off" {...register('applicationDate', { required: '필수 항목입니다.' })} />
                </label>
                <div>
                    <button type="submit">지방세 감면 신청서 완성</button>
                </div>
            </form>
        </main>
    );
}