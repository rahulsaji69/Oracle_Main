import React, { useState, useEffect } from 'react';
import './CustomsAgent.css';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaDownload, FaEye, FaTimes, FaSignOutAlt, FaClipboardList, FaUserTie } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Base_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const CustomsAgent = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [pendingShipments, setPendingShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentReview, setDocumentReview] = useState({
    billOfLading: {
      status: 'pending',
      comments: '',
      isAuthentic: null,
      lastChecked: null
    },
    commercialInvoice: {
      status: 'pending',
      comments: '',
      isAuthentic: null,
      lastChecked: null
    },
    packingList: {
      status: 'pending',
      comments: '',
      isAuthentic: null,
      lastChecked: null
    },
    customsDocuments: {
      status: 'pending',
      comments: '',
      isAuthentic: null,
      lastChecked: null
    },
    certificateOfOrigin: {
      status: 'pending',
      comments: '',
      isAuthentic: null,
      lastChecked: null
    }
  });
  const [viewingDocument, setViewingDocument] = useState(null);
  const [requestingAdditional, setRequestingAdditional] = useState(false);
  const [additionalRequest, setAdditionalRequest] = useState({
    message: '',
    requestedDocuments: []
  });

  // Fetch bookings that need customs verification
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Base_URL}/api/booking/bookings`);
      // Filter bookings that need customs verification or are in the process
      const customsBookings = response.data.data.filter(booking => 
        booking.status === 'CUSTOMS_VERIFICATION' || 
        booking.customsVerificationStatus === 'IN_PROGRESS' ||
        booking.customsVerificationStatus === 'PENDING' ||
        booking.status === 'PENDING' // Include all pending bookings
      );
      
      // Format the bookings for display
      const formattedBookings = customsBookings.map(booking => ({
        id: booking._id,
        customer: booking.shipperName,
        submissionDate: new Date(booking.createdAt).toISOString().split('T')[0],
        status: booking.customsVerificationStatus === 'IN_PROGRESS' ? 'Under Review' : 'Pending Review',
        priority: booking.isHazardous ? 'High' : 'Medium',
        booking: booking // Keep the original booking object
      }));
      
      setPendingShipments(formattedBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleDocumentVerification = async (docType) => {
    if (!selectedShipment) return;
    
    try {
      // Update local state for immediate feedback
      setDocumentReview(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          isAuthentic: true,
          lastChecked: new Date().toISOString(),
          status: 'verified'
        }
      }));
      
      // Check if all documents are verified
      const updatedReview = {
        ...documentReview,
        [docType]: {
          ...documentReview[docType],
          isAuthentic: true,
          lastChecked: new Date().toISOString(),
          status: 'verified'
        }
      };
      
      const allVerified = Object.values(updatedReview).every(doc => doc.status === 'verified');
      
      // Update the booking's customs verification status in the database if all docs verified
      if (allVerified) {
        await axios.put(`${Base_URL}/api/booking/bookings/${selectedShipment.id}`, {
          customsVerificationStatus: 'APPROVED'
        });
        toast.success('All documents verified and approved');
        fetchBookings(); // Refresh the data
      }
    } catch (error) {
      console.error('Error updating document verification:', error);
      toast.error('Failed to update document verification');
    }
  };

  const handleDocumentRejection = async (docType) => {
    if (!selectedShipment) return;
    
    try {
      // Update local state
      setDocumentReview(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          isAuthentic: false,
          lastChecked: new Date().toISOString(),
          status: 'rejected'
        }
      }));
      
      // Update the booking in the database
      await axios.put(`${Base_URL}/api/booking/bookings/${selectedShipment.id}`, {
        customsVerificationStatus: 'REJECTED'
      });
      
      toast.info('Document rejected');
      fetchBookings(); // Refresh the data
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document');
    }
  };

  const handleApproveForClearance = async () => {
    if (!selectedShipment) return;
    
    try {
      const response = await axios.put(`${Base_URL}/api/booking/bookings/${selectedShipment.id}`, {
        customsVerificationStatus: 'APPROVED',
        status: 'CUSTOMS_APPROVED'
      });
      
      console.log('Approval response:', response.data);
      
      toast.success('Shipment approved for customs clearance');
      fetchBookings(); // Refresh the data
      setSelectedShipment(null);
    } catch (error) {
      console.error('Error approving shipment:', error);
      toast.error('Failed to approve shipment');
    }
  };

  const handleRequestAdditional = async () => {
    if (!selectedShipment || !additionalRequest.message) {
      toast.error('Please provide a message for the shipper');
      return;
    }
    
    try {
      // In a real app, this would send a notification or email to the shipper
      await axios.put(`${Base_URL}/api/booking/bookings/${selectedShipment.id}`, {
        customsVerificationStatus: 'PENDING',
        additionalDocumentsRequested: true,
        additionalDocumentsMessage: additionalRequest.message,
        requestedDocuments: additionalRequest.requestedDocuments
      });
      
      toast.info('Request for additional documents sent to shipper');
      setRequestingAdditional(false);
      fetchBookings(); // Refresh the data
    } catch (error) {
      console.error('Error requesting additional documents:', error);
      toast.error('Failed to send request');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FaCheckCircle className="status-icon verified" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return <FaExclamationCircle className="status-icon pending" />;
    }
  };

  const handleViewDocument = (docType) => {
    if (!selectedShipment || !selectedShipment.booking) return;
    
    const docPath = selectedShipment.booking.documents?.[docType];
    if (!docPath) {
      toast.error(`No ${docType} document available`);
      return;
    }
    
    // Set the document to view
    setViewingDocument({
      type: docType,
      url: `${Base_URL}/${docPath}`
    });
  };

  const handleDownloadDocument = (docType) => {
    if (!selectedShipment || !selectedShipment.booking) return;
    
    const docPath = selectedShipment.booking.documents?.[docType];
    if (!docPath) {
      toast.error(`No ${docType} document available`);
      return;
    }
    
    // Create a temporary anchor element to download the file
    const link = document.createElement('a');
    link.href = `${Base_URL}/${docPath}`;
    link.download = `${docType}_${selectedShipment.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDocumentRequest = (docType) => {
    setAdditionalRequest(prev => {
      if (prev.requestedDocuments.includes(docType)) {
        return {
          ...prev,
          requestedDocuments: prev.requestedDocuments.filter(doc => doc !== docType)
        };
      } else {
        return {
          ...prev,
          requestedDocuments: [...prev.requestedDocuments, docType]
        };
      }
    });
  };

  const handleLogout = () => {
    // In a real application, this would clear authentication tokens/cookies
    localStorage.removeItem('authToken');
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="customs-agent-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <FaUserTie className="agent-icon" />
          <h2>Customs Portal</h2>
        </div>
        <div className="sidebar-menu">
          <div className="menu-item active">
            <FaClipboardList />
            <span>Document Review</span>
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Customs Document Review Dashboard</h2>
          <div className="header-actions">
            <div className="pending-count">
              Pending Reviews: {pendingShipments.length}
            </div>
            <div className="agent-profile">
              <span className="agent-name">Agent Smith</span>
              <div className="agent-avatar"></div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading shipments...</div>
        ) : (
          <>
            {/* Pending Shipments List */}
            <div className="pending-shipments-section">
              <h3>Pending Document Reviews</h3>
              <div className="shipments-grid">
                {pendingShipments.map(shipment => (
                  <div 
                    key={shipment.id} 
                    className={`shipment-card ${selectedShipment?.id === shipment.id ? 'selected' : ''}`}
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <div className="shipment-header">
                      <span className={`priority-badge ${shipment.priority.toLowerCase()}`}>
                        {shipment.priority}
                      </span>
                      <span className="shipment-id">{shipment.id}</span>
                    </div>
                    <div className="shipment-details">
                      <p><strong>Customer:</strong> {shipment.customer}</p>
                      <p><strong>Submitted:</strong> {shipment.submissionDate}</p>
                      <p><strong>Status:</strong> {shipment.status}</p>
                    </div>
                  </div>
                ))}
                
                {pendingShipments.length === 0 && (
                  <div className="no-shipments">
                    No shipments pending customs review
                  </div>
                )}
              </div>
            </div>

            {/* Document Review Section */}
            {selectedShipment && (
              <div className="document-review-section">
                <h3>Document Review for Shipment {selectedShipment.id}</h3>
                
                <div className="documents-grid">
                  {Object.entries(documentReview).map(([docType, details]) => (
                    <div key={docType} className="document-review-card">
                      <div className="document-header">
                        <h4>{docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                        {getStatusIcon(details.status)}
                      </div>
                      
                      <div className="document-actions">
                        <button 
                          className="action-button view"
                          onClick={() => handleViewDocument(docType)}
                        >
                          <FaEye /> View Document
                        </button>
                        <button 
                          className="action-button download"
                          onClick={() => handleDownloadDocument(docType)}
                        >
                          <FaDownload /> Download
                        </button>
                      </div>

                      <div className="verification-controls">
                        <button 
                          className="verify-button"
                          onClick={() => handleDocumentVerification(docType)}
                        >
                          Verify
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => handleDocumentRejection(docType)}
                        >
                          Reject
                        </button>
                      </div>

                      <div className="review-notes">
                        <textarea
                          placeholder="Add review comments..."
                          value={details.comments}
                          onChange={(e) => setDocumentReview(prev => ({
                            ...prev,
                            [docType]: {
                              ...prev[docType],
                              comments: e.target.value
                            }
                          }))}
                        />
                      </div>

                      <div className="verification-status">
                        {details.lastChecked && (
                          <p className="last-checked">
                            Last checked: {new Date(details.lastChecked).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="review-summary">
                  <h4>Review Summary</h4>
                  <div className="summary-stats">
                    <div className="stat">
                      <span>Verified:</span>
                      <span>{Object.values(documentReview).filter(doc => doc.status === 'verified').length}</span>
                    </div>
                    <div className="stat">
                      <span>Pending:</span>
                      <span>{Object.values(documentReview).filter(doc => doc.status === 'pending').length}</span>
                    </div>
                    <div className="stat">
                      <span>Rejected:</span>
                      <span>{Object.values(documentReview).filter(doc => doc.status === 'rejected').length}</span>
                    </div>
                  </div>
                </div>

                <div className="final-decision">
                  <button 
                    className="approve-clearance"
                    onClick={handleApproveForClearance}
                    disabled={Object.values(documentReview).some(doc => doc.status === 'pending' || doc.status === 'rejected')}
                  >
                    Approve for Clearance
                  </button>
                  <button 
                    className="request-additional"
                    onClick={() => setRequestingAdditional(true)}
                  >
                    Request Additional Documents
                  </button>
                </div>
              </div>
            )}

            {/* Document Viewer Modal */}
            {viewingDocument && (
              <div className="document-viewer-overlay">
                <div className="document-viewer-modal">
                  <div className="document-viewer-header">
                    <h3>{viewingDocument.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                    <button 
                      className="close-button"
                      onClick={() => setViewingDocument(null)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="document-viewer-content">
                    <iframe 
                      src={viewingDocument.url} 
                      title={viewingDocument.type}
                      width="100%"
                      height="500px"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}

            {/* Request Additional Documents Modal */}
            {requestingAdditional && (
              <div className="request-documents-overlay">
                <div className="request-documents-modal">
                  <div className="request-documents-header">
                    <h3>Request Additional Documents</h3>
                    <button 
                      className="close-button"
                      onClick={() => setRequestingAdditional(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="request-documents-content">
                    <div className="document-checkboxes">
                      <h4>Select Documents to Request:</h4>
                      {Object.keys(documentReview).map(docType => (
                        <div key={docType} className="document-checkbox">
                          <input 
                            type="checkbox"
                            id={`request-${docType}`}
                            checked={additionalRequest.requestedDocuments.includes(docType)}
                            onChange={() => toggleDocumentRequest(docType)}
                          />
                          <label htmlFor={`request-${docType}`}>
                            {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="message-to-shipper">
                      <h4>Message to Shipper:</h4>
                      <textarea
                        value={additionalRequest.message}
                        onChange={(e) => setAdditionalRequest(prev => ({
                          ...prev,
                          message: e.target.value
                        }))}
                        placeholder="Explain why you need additional documentation..."
                        rows="5"
                      ></textarea>
                    </div>
                    <div className="request-documents-actions">
                      <button 
                        className="cancel-button"
                        onClick={() => setRequestingAdditional(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="send-request-button"
                        onClick={handleRequestAdditional}
                        disabled={!additionalRequest.message || additionalRequest.requestedDocuments.length === 0}
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomsAgent; 