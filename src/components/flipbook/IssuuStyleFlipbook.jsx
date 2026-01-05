import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './IssuuStyleFlipbook.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const IssuuStyleFlipbook = ({ pdfFile, scale = 1.0 }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover page on right, 1+ = two-page spread
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' or 'prev'
  const [prevPages, setPrevPages] = useState({ left: null, right: 1 });
  const [zoom, setZoom] = useState(1.0);
  const [isZooming, setIsZooming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const pagesContainerRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(0); // Start with cover page on right
    setIsDocumentLoaded(true);
  };

  const goToPrevPage = () => {
    if (isFlipping) return;
    
    if (currentPage === 2) {
      // From pages 2-3, go back to cover page on right
      setPrevPages({ left: 2, right: 3 });
      setFlipDirection('prev');
      setCurrentPage(0); // Update immediately so cover page shows underneath
      setIsFlipping(true);
      setTimeout(() => {
        setTimeout(() => setIsFlipping(false), 100);
      }, 1500); // Match animation duration
    } else if (currentPage > 2) {
      // From two-page spread, go back to previous two pages
      const newPage = Math.max(2, currentPage - 2);
      setPrevPages(getPageNumbers());
      setFlipDirection('prev');
      setCurrentPage(newPage); // Update immediately so new page shows underneath
      setIsFlipping(true);
      setTimeout(() => {
        setTimeout(() => setIsFlipping(false), 100);
      }, 1500); // Match animation duration
    }
  };

  const goToNextPage = () => {
    if (isFlipping) return;
    
    if (currentPage === 0) {
      // From cover page, go to pages 2-3 (skip 1-2 since 1 is the cover)
      setPrevPages({ left: null, right: 1 });
      setFlipDirection('next');
      setCurrentPage(2); // Update immediately so pages 2-3 show underneath
      setIsFlipping(true);
      setTimeout(() => {
        setTimeout(() => setIsFlipping(false), 100);
      }, 1500); // Match animation duration
    } else if (currentPage < numPages) {
      // From two-page spread, go to next two pages
      // For even number of pages, stop at numPages-1 (last two-page spread)
      // For odd number of pages, can go to numPages (last page alone)
      const maxPage = numPages % 2 === 0 ? numPages - 1 : numPages;
      const newPage = Math.min(maxPage, currentPage + 2);
      if (newPage > currentPage) {
        setPrevPages(getPageNumbers());
        setFlipDirection('next');
        setCurrentPage(newPage); // Update immediately so new page shows underneath
        setIsFlipping(true);
        setTimeout(() => {
          setTimeout(() => setIsFlipping(false), 100);
        }, 1500); // Match animation duration
      }
    }
  };

  const handleZoomIn = () => {
    if (isZooming) return; // Prevent rapid clicks
    setIsZooming(true);
    setZoom(prev => Math.min(prev + 0.25, 2.0));
    // Clear zooming state after a short delay to allow smooth transition
    setTimeout(() => setIsZooming(false), 300);
  };

  const handleZoomOut = () => {
    if (zoom <= 1.0) return; // Disabled at standard zoom
    if (isZooming) return; // Prevent rapid clicks
    setIsZooming(true);
    const newZoom = Math.max(zoom - 0.25, 1.0);
    setZoom(newZoom);
    // Reset pan when zooming back to 1.0
    if (newZoom === 1.0) {
      setPan({ x: 0, y: 0 });
    }
    // Clear zooming state after a short delay to allow smooth transition
    setTimeout(() => setIsZooming(false), 300);
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1.0) return; // Only allow dragging when zoomed in
    if (isFlipping) return; // Don't allow dragging during page flips
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1.0) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (zoom <= 1.0) return;
    if (isFlipping) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || zoom <= 1.0) return;
    if (e.touches.length === 1) {
      e.preventDefault();
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    
    const mouseMoveHandler = (e) => {
      if (zoom <= 1.0) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };
    
    const mouseUpHandler = () => {
      setIsDragging(false);
    };
    
    const touchMoveHandler = (e) => {
      if (zoom <= 1.0) return;
      if (e.touches.length === 1) {
        e.preventDefault();
        setPan({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y
        });
      }
    };
    
    const touchEndHandler = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('touchend', touchEndHandler);
    
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
    };
  }, [isDragging, dragStart, zoom]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (!pdfFile) return;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    
    if (typeof pdfFile === 'string') {
      // If it's a URL string, use it directly
      link.href = pdfFile;
      link.download = pdfFile.split('/').pop() || 'document.pdf';
    } else {
      // If it's a File/Blob object, create object URL
      const url = URL.createObjectURL(pdfFile);
      link.href = url;
      link.download = pdfFile.name || 'document.pdf';
      
      // Clean up object URL after download starts
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getPageNumbers = () => {
    if (!numPages) return { left: null, right: 1 };
    // Cover page on right side (currentPage === 0)
    if (currentPage === 0) {
      return { left: null, right: 1 };
    }
    // Two-page spread for all other pages
    const left = currentPage;
    let right = currentPage + 1 <= numPages ? currentPage + 1 : null;
    
    // If odd number of pages and we're on the last page, show only left page
    // For odd numPages, the last spread is just the last page alone
    if (numPages % 2 === 1 && currentPage === numPages) {
      right = null;
    }
    
    return { left, right };
  };

  // Get the pages that should be shown underneath during flip
  // The static page (opposite of turning page) should show the next/prev page
  const getPagesDuringFlip = (direction) => {
    if (!numPages) return { left: null, right: 1 };
    
    if (direction === 'next') {
      // Right page is turning, left page should show next left page
      // Based on prevPages, calculate what should be underneath
      if (prevPages.right === 1 && prevPages.left === null) {
        // Cover page turning, show pages 2-3 underneath (skip 1-2 since 1 is the cover)
        return { left: 2, right: 3 <= numPages ? 3 : null };
      }
      const nextLeft = prevPages.left ? prevPages.left + 2 : 1;
      let nextRight = nextLeft + 1 <= numPages ? nextLeft + 1 : null;
      // If odd number of pages and nextLeft is the last page, show only left page
      if (numPages % 2 === 1 && nextLeft === numPages) {
        nextRight = null;
      }
      return { left: nextLeft, right: nextRight };
    } else {
      // Left page is turning, right page should show previous right page
      // Based on prevPages, calculate what should be underneath
      if (prevPages.left === 2 && prevPages.right === 3) {
        // Going back to cover page from pages 2-3
        return { left: null, right: 1 };
      }
      const prevLeft = Math.max(1, prevPages.left - 2);
      const prevRight = prevLeft + 1 <= numPages ? prevLeft + 1 : null;
      return { left: prevLeft, right: prevRight };
    }
  };

  const { left: leftPage, right: rightPage } = isFlipping 
    ? getPagesDuringFlip(flipDirection)
    : getPageNumbers();
  const isCoverPage = currentPage === 0;
  const isLastPageAlone = numPages && numPages % 2 === 1 && leftPage === numPages && !rightPage;
  const progress = numPages ? ((isCoverPage ? 1 : (currentPage + (rightPage ? 1 : 0))) / numPages) * 100 : 0;

  return (
    <div className="issuu-flipbook-container" ref={containerRef}>
      <div className="issuu-flipbook-viewer">
        {/* Navigation Arrows */}
        <button 
          className="issuu-nav-arrow issuu-nav-prev"
          onClick={goToPrevPage}
          disabled={currentPage === 0 || isFlipping}
          aria-label="Previous page"
        >
          ‹
        </button>
        <button 
          className="issuu-nav-arrow issuu-nav-next"
          onClick={goToNextPage}
          disabled={
            (currentPage === 0 && numPages < 2) || 
            (numPages % 2 === 0 ? currentPage >= numPages - 1 : currentPage >= numPages) || 
            isFlipping
          }
          aria-label="Next page"
        >
          ›
        </button>

        {/* Two-Page Spread */}
        <div className={`issuu-pages-spread ${isFlipping ? `flipping flipping-${flipDirection}` : ''}`}>
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            error={null}
          >
            {/* Previous pages (shown during flip) */}
            {isFlipping && (
              <div 
                className="issuu-page-container issuu-pages-prev"
                style={{ 
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, 
                  transformOrigin: 'center center',
                  cursor: zoom > 1.0 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                ref={pagesContainerRef}
              >
                {prevPages.left && (
                  <div className={`issuu-page issuu-page-left ${!prevPages.right ? 'issuu-page-cover' : ''}`}>
                    <Page
                      key={`prev-left-${prevPages.left}`}
                      pageNumber={prevPages.left}
                      scale={scale}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </div>
                )}
                {prevPages.right && (
                  <div className={`issuu-page issuu-page-right ${!prevPages.left ? 'issuu-page-cover' : ''}`}>
                    <Page
                      key={`prev-right-${prevPages.right}`}
                      pageNumber={prevPages.right}
                      scale={scale}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Current pages */}
            <div 
              className={`issuu-page-container issuu-pages-current ${isCoverPage ? 'cover-page' : ''} ${isLastPageAlone ? 'last-page-alone' : ''} ${isZooming ? 'zooming' : ''}`}
              style={{ 
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, 
                transformOrigin: 'center center',
                cursor: zoom > 1.0 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              ref={!isFlipping ? pagesContainerRef : null}
            >
              {/* Left Page */}
              {leftPage && (
                <div className={`issuu-page issuu-page-left ${isLastPageAlone ? 'issuu-page-cover' : ''}`}>
                  <Page
                    key={`current-left-${leftPage}`}
                    pageNumber={leftPage}
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              )}
              
              {/* Right Page */}
              {rightPage && (
                  <div className="issuu-page issuu-page-right">
                  <Page
                    key={`current-right-${rightPage}`}
                    pageNumber={rightPage}
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              )}
            </div>
          </Document>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="issuu-controls-bar">
        <div className="issuu-controls-left">
          <span className="issuu-page-indicator">
            {isCoverPage ? rightPage : `${leftPage}${rightPage ? `-${rightPage}` : ''}`} / {numPages || '...'}
          </span>
          <div className="issuu-progress-bar">
            <div 
              className="issuu-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="issuu-controls-right">
          <button 
            className="issuu-control-btn"
            onClick={handleDownload}
            aria-label="Download PDF"
            title="Download PDF"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button 
            className="issuu-control-btn"
            onClick={handleZoomOut}
            disabled={zoom <= 1.0}
            aria-label="Zoom out"
            style={{ opacity: zoom <= 1.0 ? 0.5 : 1, cursor: zoom <= 1.0 ? 'not-allowed' : 'pointer' }}
          >
            −
          </button>
          <button 
            className="issuu-control-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            +
          </button>
          <button 
            className="issuu-control-btn"
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssuuStyleFlipbook;

