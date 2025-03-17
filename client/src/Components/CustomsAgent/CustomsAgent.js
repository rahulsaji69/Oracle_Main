import React, { useState } from 'react';
import './CustomsAgent.css';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaDownload, FaEye } from 'react-icons/fa';

const CustomsAgent = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);
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
    importLicense: {
      status: 'pending',
      comments: '',
      isAuthentic: null,
      lastChecked: null
    },
    insuranceCertificate: {
      status: 'pending',
      comments: '',
      isAuthentic: null,
      lastChecked: null
    }
  });

  // Mock data for pending shipments
  const pendingShipments = [
    {
      id: 'SHP001',
      customer: 'ABC Trading Co.',
      submissionDate: '2024-03-15',
      status: 'Pending Review',
      priority: 'High'
    },
    {
      id: 'SHP002',
      customer: 'XYZ Imports',
      submissionDate: '2024-03-14',
      status: 'Documents Incomplete',
      priority: 'Medium'
    }
  ];

  const handleDocumentVerification = (docType) => {
    setDocumentReview(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        isAuthentic: true,
        lastChecked: new Date().toISOString(),
        status: 'verified'
      }
    }));
  };

  const handleDocumentRejection = (docType) => {
    setDocumentReview(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        isAuthentic: false,
        lastChecked: new Date().toISOString(),
        status: 'rejected'
      }
    }));
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

  return (
    <div className="customs-agent-container">
      <div className="dashboard-header">
        <h2>Customs Document Review Dashboard</h2>
        <div className="pending-count">
          Pending Reviews: {pendingShipments.length}
        </div>
      </div>

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
                  <button className="action-button view">
                    <FaEye /> View Document
                  </button>
                  <button className="action-button download">
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
              disabled={Object.values(documentReview).some(doc => doc.status === 'pending' || doc.status === 'rejected')}
            >
              Approve for Clearance
            </button>
            <button className="request-additional">
              Request Additional Documents
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomsAgent; 