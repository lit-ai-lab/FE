import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, RotateCcw, Download, Highlighter, X } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import useWindowSize from './useWindowSize';

// Use specific worker version that's compatible
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

const PdfViewer = ({ fileUrl, onExtractText }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0); // Zoom scale
  const [selectedText, setSelectedText] = useState('');
  const windowSize = useWindowSize();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop();
    link.click();
  };

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0)); // Max zoom 3x
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5)); // Min zoom 0.5x
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  // Text selection handler
  const handleTextSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text && text.length > 0) {
        setSelectedText(text);
        console.log('Selected text:', text);
      } else {
        setSelectedText('');
      }
    }, 100);
  };

  // Add extracted text function
  const addExtractedText = useCallback(() => {
    if (selectedText && selectedText.length > 2) {
      const extractedData = {
        id: Date.now(),
        text: selectedText,
        page: pageNumber,
        timestamp: new Date().toLocaleString()
      };
      
      // Call parent callback if provided
      if (onExtractText) {
        onExtractText(extractedData);
      }
      
      // Clear selected text and selection
      setSelectedText('');
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
      console.log('Text extracted');
    }
  }, [selectedText, pageNumber, onExtractText]);

  // Keyboard event handler for text extraction
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+H or Cmd+H to extract selected text
      if ((e.ctrlKey || e.metaKey) && e.key === 'h' && selectedText) {
        e.preventDefault();
        addExtractedText();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedText, addExtractedText]);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Control buttons */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={handleDownload} 
          style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Download size={16} />
          PDF 다운로드
        </button>
        
        {/* Zoom controls */}
        <button onClick={zoomOut} style={{ padding: '8px 12px', backgroundColor: '#6b7280', color: 'white', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ZoomOut size={16} />
        </button>
        <span style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: '4px', minWidth: '60px' }}>
          {Math.round(scale * 100)}%
        </span>
        <button onClick={zoomIn} style={{ padding: '8px 12px', backgroundColor: '#6b7280', color: 'white', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ZoomIn size={16} />
        </button>
        <button onClick={resetZoom} style={{ padding: '8px 12px', backgroundColor: '#059669', color: 'white', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <RotateCcw size={16} />
        </button>
        
        {/* Text extraction controls */}
        {selectedText && (
          <button onClick={addExtractedText} style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Highlighter size={16} />
            중요 내용 추출
          </button>
        )}
      </div>

      {/* Selected text display */}
      {selectedText && (
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#fef3c7', borderRadius: '4px', border: '1px solid #f59e0b' }}>
          <strong>Selected:</strong> "{selectedText}"
        </div>
      )}

      {/* PDF Document */}
      <div 
        style={{
          width: '100%', 
          maxHeight: '70vh',
          overflow: 'auto',
          margin: '0 auto',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}
        onMouseUp={handleTextSelection}
        onKeyUp={handleTextSelection}
      >
        <Document 
          file={fileUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page 
            width={windowSize.width * 0.8 * scale} // Apply zoom scale
            pageNumber={pageNumber}
            onGetTextSuccess={handleTextSelection}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* Page navigation */}
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        {pageNumber > 1 && (
          <button 
            onClick={() => setPageNumber(prev => prev - 1)}
            style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', borderRadius: '4px', border: 'none' }}
          >
            ← 이전페이지
          </button>
        )}
        
        <span style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontWeight: 'bold' }}>
          Page {pageNumber} of {numPages}
        </span>
        
        {pageNumber < numPages && (
          <button 
            onClick={() => setPageNumber(prev => prev + 1)}
            style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', borderRadius: '4px', border: 'none' }}
          >
            다음페이지 →
          </button>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
