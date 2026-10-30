import { useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Presentation } from '../types/presentation';

export function usePdfExport() {
    const [isExporting, setIsExporting] = useState(false);

    const exportToPdf = useCallback(async (presentation: Presentation) => {
        if(!presentation.slides || presentation.slides.length === 0) {
            alert('Презентация пустая. Пожалуйста заполните слады перед экспортом!')
            return;
        }

        setIsExporting(true);
        try {
            const pdfWidth = 297;
            const pdfHeight = 167;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });
            const exportContainer = document.getElementById('pdf-export-hidden');
            if(!exportContainer) {
                throw new Error('Контейнер экспорта не найден!')
            }

            for (let i = 0; i < presentation.slides.length; i++) {
                 if (i > 0) {
                    pdf.addPage([pdfWidth, pdfHeight], 'landscape');
                } 

                const slide = exportContainer.children[i] as HTMLElement;
                if(!slide) continue;
                
                const canvas = await html2canvas(slide, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#FFFFFF'
                });

                const imageData = canvas.toDataURL('image/jpeg');
                pdf.addImage(imageData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                
            }

            const fileName = presentation.name.trim() || 'presentation';
            pdf.save(`${fileName}.pdf`);
        } catch (error) {
            console.error('Ошибка экспорта в PDF', error);
            alert('Произошла ошибка во время экспорта презентации в PDF.');
        }
        finally {
            setIsExporting(false)
        }
    }, []);
    return { exportToPdf, isExporting };
}
