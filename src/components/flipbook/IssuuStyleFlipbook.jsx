import React, { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./IssuuStyleFlipbook.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FLIP_MS = 1100;

const IssuuStyleFlipbook = ({ pdfFile, scale = 1.0 }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover on right; else left page of spread
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");
  const [turningPages, setTurningPages] = useState({ left: null, right: 1 });
  const [zoom, setZoom] = useState(1.0);
  const [isZooming, setIsZooming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const pagesContainerRef = useRef(null);
  const flipTimeoutRef = useRef(null);

  const clearFlipTimeout = () => {
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
  };

  useEffect(() => () => clearFlipTimeout(), []);

  const getPageNumbers = useCallback(
    (page = currentPage) => {
      if (!numPages) return { left: null, right: 1 };
      if (page === 0) return { left: null, right: 1 };

      const left = page;
      let right = left + 1 <= numPages ? left + 1 : null;
      if (numPages % 2 === 1 && left === numPages) {
        right = null;
      }
      return { left, right };
    },
    [currentPage, numPages]
  );

  const startFlip = (direction, fromPages, toPage) => {
    clearFlipTimeout();
    setTurningPages(fromPages);
    setFlipDirection(direction);
    setCurrentPage(toPage);
    setIsFlipping(true);
    flipTimeoutRef.current = setTimeout(() => {
      setIsFlipping(false);
      flipTimeoutRef.current = null;
    }, FLIP_MS);
  };

  const onDocumentLoadSuccess = ({ numPages: loaded }) => {
    setNumPages(loaded);
    setCurrentPage(0);
  };

  const goToPrevPage = () => {
    if (isFlipping || currentPage === 0) return;

    if (currentPage === 2) {
      startFlip("prev", getPageNumbers(), 0);
      return;
    }

    if (currentPage > 2) {
      startFlip("prev", getPageNumbers(), Math.max(2, currentPage - 2));
    }
  };

  const goToNextPage = () => {
    if (isFlipping || !numPages) return;

    if (currentPage === 0) {
      if (numPages < 2) return;
      startFlip("next", getPageNumbers(), 2);
      return;
    }

    const maxPage = numPages % 2 === 0 ? numPages - 1 : numPages;
    const newPage = Math.min(maxPage, currentPage + 2);
    if (newPage > currentPage) {
      startFlip("next", getPageNumbers(), newPage);
    }
  };

  const handleZoomIn = () => {
    if (isZooming) return;
    setIsZooming(true);
    setZoom((prev) => Math.min(prev + 0.25, 2.0));
    setTimeout(() => setIsZooming(false), 300);
  };

  const handleZoomOut = () => {
    if (zoom <= 1.0 || isZooming) return;
    setIsZooming(true);
    const newZoom = Math.max(zoom - 0.25, 1.0);
    setZoom(newZoom);
    if (newZoom === 1.0) setPan({ x: 0, y: 0 });
    setTimeout(() => setIsZooming(false), 300);
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1.0 || isFlipping) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (zoom <= 1.0 || isFlipping || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - pan.x,
      y: e.touches[0].clientY - pan.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return undefined;

    const mouseMoveHandler = (e) => {
      if (zoom <= 1.0) return;
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const mouseUpHandler = () => setIsDragging(false);
    const touchMoveHandler = (e) => {
      if (zoom <= 1.0 || e.touches.length !== 1) return;
      e.preventDefault();
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    };
    const touchEndHandler = () => setIsDragging(false);

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("touchmove", touchMoveHandler, { passive: false });
    document.addEventListener("touchend", touchEndHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("touchmove", touchMoveHandler);
      document.removeEventListener("touchend", touchEndHandler);
    };
  }, [isDragging, dragStart, zoom]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (!pdfFile) return;
    const link = document.createElement("a");
    if (typeof pdfFile === "string") {
      link.href = pdfFile;
      link.download = pdfFile.split("/").pop() || "document.pdf";
    } else {
      const url = URL.createObjectURL(pdfFile);
      link.href = url;
      link.download = pdfFile.name || "document.pdf";
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
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const { left: leftPage, right: rightPage } = getPageNumbers();
  const isCoverPage = currentPage === 0;
  const isLastPageAlone =
    numPages && numPages % 2 === 1 && leftPage === numPages && !rightPage;
  const progress = numPages
    ? ((isCoverPage ? 1 : currentPage + (rightPage ? 1 : 0)) / numPages) * 100
    : 0;

  const panStyle = {
    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
    transformOrigin: "center center",
    cursor: zoom > 1.0 ? (isDragging ? "grabbing" : "grab") : "default",
  };

  const atEnd =
    !numPages ||
    (currentPage === 0 && numPages < 2) ||
    (numPages % 2 === 0 ? currentPage >= numPages - 1 : currentPage >= numPages);

  const turningIsCover = !turningPages.left && !!turningPages.right;
  const turningIsLastAlone = !!turningPages.left && !turningPages.right;

  return (
    <div className="issuu-flipbook-container" ref={containerRef}>
      <div className="issuu-flipbook-viewer">
        <button
          type="button"
          className="issuu-nav-arrow issuu-nav-prev"
          onClick={goToPrevPage}
          disabled={currentPage === 0 || isFlipping}
          aria-label="Previous page"
        >
          ‹
        </button>
        <button
          type="button"
          className="issuu-nav-arrow issuu-nav-next"
          onClick={goToNextPage}
          disabled={atEnd || isFlipping}
          aria-label="Next page"
        >
          ›
        </button>

        <div
          className={`issuu-pages-spread${
            isFlipping ? ` flipping flipping-${flipDirection}` : ""
          }`}
        >
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            error={null}
          >
            {/* Only the page that turns overlays the destination spread */}
            {isFlipping && (
              <div
                className={`issuu-page-container issuu-pages-prev${
                  turningIsCover ? " cover-page" : ""
                }${turningIsLastAlone ? " last-page-alone" : ""}`}
                style={panStyle}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {flipDirection === "next" && turningPages.right && (
                  <>
                    {!turningIsCover && (
                      <div className="issuu-page issuu-page-left issuu-page-spacer" aria-hidden="true" />
                    )}
                    <div
                      className={`issuu-page issuu-page-right${
                        turningIsCover ? " issuu-page-cover" : ""
                      }`}
                    >
                      <Page
                        key={`turn-right-${turningPages.right}`}
                        pageNumber={turningPages.right}
                        scale={scale}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </div>
                  </>
                )}
                {flipDirection === "prev" && turningPages.left && (
                  <>
                    <div
                      className={`issuu-page issuu-page-left${
                        turningIsLastAlone ? " issuu-page-cover" : ""
                      }`}
                    >
                      <Page
                        key={`turn-left-${turningPages.left}`}
                        pageNumber={turningPages.left}
                        scale={scale}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </div>
                    {!turningIsLastAlone && (
                      <div className="issuu-page issuu-page-right issuu-page-spacer" aria-hidden="true" />
                    )}
                  </>
                )}
              </div>
            )}

            <div
              className={`issuu-page-container issuu-pages-current${
                isCoverPage ? " cover-page" : ""
              }${isLastPageAlone ? " last-page-alone" : ""}${
                isZooming ? " zooming" : ""
              }`}
              style={panStyle}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              ref={!isFlipping ? pagesContainerRef : null}
            >
              {leftPage && (
                <div
                  className={`issuu-page issuu-page-left${
                    isLastPageAlone ? " issuu-page-cover" : ""
                  }`}
                >
                  <Page
                    key={`current-left-${leftPage}`}
                    pageNumber={leftPage}
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
              )}
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

      <div className="issuu-controls-bar">
        <div className="issuu-controls-left">
          <span className="issuu-page-indicator">
            {isCoverPage
              ? rightPage
              : `${leftPage}${rightPage ? `-${rightPage}` : ""}`}{" "}
            / {numPages || "..."}
          </span>
          <div className="issuu-progress-bar">
            <div className="issuu-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="issuu-controls-right">
          <button
            type="button"
            className="issuu-control-btn"
            onClick={handleDownload}
            aria-label="Download PDF"
            title="Download PDF"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            type="button"
            className="issuu-control-btn"
            onClick={handleZoomOut}
            disabled={zoom <= 1.0}
            aria-label="Zoom out"
            style={{
              opacity: zoom <= 1.0 ? 0.5 : 1,
              cursor: zoom <= 1.0 ? "not-allowed" : "pointer",
            }}
          >
            −
          </button>
          <button
            type="button"
            className="issuu-control-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
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
