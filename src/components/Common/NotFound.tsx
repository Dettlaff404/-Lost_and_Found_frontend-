import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const NotFound = () => {
    return (
        <Container fluid className="vh-100 bg-dark d-flex align-items-center justify-content-center">
            <Row>
                <Col>
                    <Alert variant="danger" className="text-center p-4 shadow-lg">
                        <div className="mb-4 text-center">
                            <div 
                                className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: '80px', 
                                    height: '80px', 
                                    margin: '0 auto',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    border: '2px solid #dc3545'
                                }}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="50" 
                                    height="50" 
                                    fill="#dc3545" 
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8.864 14.42c-.224.274-.58.426-.96.426H3.456c-.57 0-1.08-.31-1.345-.78L.051 7.606a1.54 1.54 0 0 1 .363-1.845L7.433.123a1.567 1.567 0 0 1 2.134 0l7.02 5.638a1.54 1.54 0 0 1 .362 1.845l-1.06 2.047a.5.5 0 0 1-.448.276H9.98l.348 2.8a.5.5 0 0 1-.5.55h-1.5c-.24 0-.44-.173-.48-.412L8.14 9.792H4.51c-.24 0-.44-.173-.48-.412l-.242-1.9z"/>
                                </svg>
                            </div>
                        </div>
                        <h1 className="display-4 text-danger mb-3">Page Not Found</h1>
                        <p className="lead text-dark mb-4">
                            Oops! The page you're looking for seems to have wandered off into the digital abyss.
                        </p>
                        <div className="mt-4 d-flex justify-content-center gap-3">
                            <Alert.Link href="/" className="btn btn-danger">
                                Return to Home
                            </Alert.Link>
                            <Alert.Link href="#" onClick={() => window.history.back()} className="btn btn-outline-danger">
                                Go Back
                            </Alert.Link>
                        </div>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
}

export default NotFound;