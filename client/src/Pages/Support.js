import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Card, Accordion, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import LoginNav from "../Components/Navbar/LoginNav";

function Support() {
  const location = useLocation();
  const [key, setKey] = useState("faq");
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
    priority: "Medium"
  });
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "system", message: "Welcome to live support! How can we help you today?" }
  ]);

  // Get active tab from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["faq", "documentation", "ticket", "chat"].includes(tab)) {
      setKey(tab);
    }
  }, [location]);

  // Handle ticket form changes
  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm({
      ...ticketForm,
      [name]: value
    });
  };

  // Submit support ticket
  const submitTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/support/tickets', ticketForm);
      toast.success("Ticket submitted successfully! We'll get back to you soon.");
      setTicketForm({
        name: "",
        email: "",
        subject: "",
        description: "",
        priority: "Medium"
      });
    } catch (error) {
      toast.error("Failed to submit ticket. Please try again.");
      console.error("Error submitting ticket:", error);
    }
  };

  // Send chat message
  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: "user", message: chatMessage }]);
    
    // Simulate response (in real app, this would come from backend/agent)
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { 
          sender: "agent", 
          message: "Thanks for your message. An agent will respond shortly. For immediate assistance, please call our support line at 1-800-SHIP-NOW." 
        }
      ]);
    }, 1000);
    
    setChatMessage("");
  };

  return (
    <>
      <LoginNav />
      <ToastContainer position="top-right" autoClose={3000} />
      <Container className="my-4" style={{ marginTop: "100px", maxWidth: "1200px" }}>
        <h1 className="mb-4">Customer Support</h1>
        
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4">
          <Tab eventKey="faq" title="FAQ">
            <Card>
              <Card.Body>
                <h3>Frequently Asked Questions</h3>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>How do I track my shipment?</Accordion.Header>
                    <Accordion.Body>
                      You can track your shipment by clicking on the "Track" option in the main menu and entering your tracking number. Your shipment's current status and location will be displayed with the estimated time of arrival.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>What payment methods are accepted?</Accordion.Header>
                    <Accordion.Body>
                      We accept all major credit cards, bank transfers, and digital payment methods including PayPal. For corporate accounts, we also offer net-30 terms upon approval.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>How do I book a new shipment?</Accordion.Header>
                    <Accordion.Body>
                      To book a new shipment, navigate to the "eBookings" section from the main menu. Fill out the required information about your cargo, origin, and destination, then select your preferred shipping options and proceed to payment.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>What happens if my shipment is delayed?</Accordion.Header>
                    <Accordion.Body>
                      If your shipment experiences a delay, you'll receive a notification via email and on your dashboard. Our system automatically updates ETAs based on real-time conditions. For significant delays, our support team will proactively contact you with alternative options.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>How do I modify an existing booking?</Accordion.Header>
                    <Accordion.Body>
                      To modify an existing booking, go to your Dashboard, find the booking in your list, and select "Modify." Changes are subject to availability and may incur additional fees depending on the timing and nature of the modification.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="documentation" title="Documentation">
            <Card>
              <Card.Body>
                <h3>Support Documentation</h3>
                <Row className="mb-4">
                  <Col md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <h5>User Guides</h5>
                        <p>Complete guides for using our shipping platform</p>
                        <Button variant="outline-primary">Download PDF</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <h5>Shipping Procedures</h5>
                        <p>Step-by-step procedures for different shipping types</p>
                        <Button variant="outline-primary">View Guide</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <h5>Customs Information</h5>
                        <p>Documentation requirements for international shipping</p>
                        <Button variant="outline-primary">Learn More</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <h4>Quick Guides</h4>
                <ul>
                  <li><a href="#!">How to create an account</a></li>
                  <li><a href="#!">Booking your first shipment</a></li>
                  <li><a href="#!">Understanding shipping terms</a></li>
                  <li><a href="#!">Tracking and notifications guide</a></li>
                  <li><a href="#!">Payment and billing information</a></li>
                </ul>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="ticket" title="Submit a Ticket">
            <Card>
              <Card.Body>
                <h3>Submit Support Ticket</h3>
                <Form onSubmit={submitTicket}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="name" 
                          value={ticketForm.name} 
                          onChange={handleTicketChange} 
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email" 
                          value={ticketForm.email} 
                          onChange={handleTicketChange} 
                          required 
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="subject" 
                      value={ticketForm.subject} 
                      onChange={handleTicketChange} 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={5} 
                      name="description" 
                      value={ticketForm.description} 
                      onChange={handleTicketChange} 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select 
                      name="priority" 
                      value={ticketForm.priority} 
                      onChange={handleTicketChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </Form.Select>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit Ticket
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="chat" title="Live Chat">
            <Card>
              <Card.Body>
                <h3>Live Support Chat</h3>
                <div 
                  style={{
                    height: "400px", 
                    border: "1px solid #ddd", 
                    borderRadius: "4px",
                    padding: "10px",
                    marginBottom: "15px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  {chatHistory.map((msg, index) => (
                    <div 
                      key={index} 
                      style={{
                        maxWidth: "75%",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        backgroundColor: msg.sender === "user" ? "#007bff" : "#f8f9fa",
                        color: msg.sender === "user" ? "white" : "black",
                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start"
                      }}
                    >
                      {msg.message}
                    </div>
                  ))}
                </div>
                <Form onSubmit={sendChatMessage}>
                  <div className="d-flex">
                    <Form.Control 
                      type="text" 
                      placeholder="Type your message..." 
                      value={chatMessage} 
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <Button type="submit" variant="primary" className="ms-2">
                      Send
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
      <Footer />
    </>
  );
}

export default Support; 