import React from 'react';
import student_guide from '../../assets/comingSoon-2.pdf';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`


const PDFViewerStudent = () => {
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
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Document
				file={student_guide}				
                onLoadSuccess={onDocumentLoadSuccess}
			>
				<Page renderAnnotationLayer={false} renderTextLayer={false} pageNumber={pageNumber} scale={0.25}/>
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

export default PDFViewerStudent;