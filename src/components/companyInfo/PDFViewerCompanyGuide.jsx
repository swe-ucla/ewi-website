import React from 'react';
import company_guide from '../../assets/Updated CSG.pdf';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const PDFViewerCompanyGuide = () => {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
        setPageNumber(1);
	};

	const goToPrevPage = () =>
		setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

	const goToNextPage = () =>
		setPageNumber(
			pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
		);

	return (
		<div>
			<Document
				file={company_guide}				
                onLoadSuccess={onDocumentLoadSuccess}
			>
				<Page renderAnnotationLayer={false} renderTextLayer={false} pageNumber={pageNumber} scale={55/72}/>
			</Document>
            <div>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <a href="#Prev" className='btn btn-primary' onClick={goToPrevPage} style={{marginRight: '1.5rem'}}>Prev</a>
                <a href="#Next" className='btn btn-primary' onClick={goToNextPage} style={{marginRight: '1rem'}}>Next</a>
            </div>
		</div>
	);
};

export default PDFViewerCompanyGuide;