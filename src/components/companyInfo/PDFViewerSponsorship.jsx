import React from 'react';
import sponsorship_packet from '../../assets/24-25SWE@UCLASPONSORSHIP PACKET.pdf';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const PDFViewerSponsorship = () => {
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
				file={sponsorship_packet}				
                onLoadSuccess={onDocumentLoadSuccess}
			>
				<Page renderAnnotationLayer={false} renderTextLayer={false} pageNumber={pageNumber} scale={55/72}/>
			</Document>
            <div style={{paddingTop: '10px'}}>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <div style={{paddingTop: '15px'}}>
					<a href="#Prev" className='btn btn-primary' onClick={goToPrevPage} style={{marginRight: '1.5rem'}}>Prev</a>
                	<a href="#Next" className='btn btn-primary' onClick={goToNextPage} style={{marginRight: '1rem'}}>Next</a>
				</div>
            </div>
		</div>
	);
};

export default PDFViewerSponsorship;