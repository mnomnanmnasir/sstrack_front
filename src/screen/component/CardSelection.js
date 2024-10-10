import axios from "axios";
import React from "react";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'


const CardSelection = ({ cards, selectedCard, onSelect, onActionComplete ,onSetDefaultCard}) => {

    const handleSetDefaultCard = async (cards) => {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: "Bearer " + token,
        };
        console.log('default card set', cards);
        const DefaultPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
        try {
            const response = await axios.post(`${DefaultPayApiUrl}/owner/setDefaultCard 	`, {
                cardNumber: cards.cardNumber,
                cardType: cards.cardType,
            }, { headers });

            if (response.data.success) {
                console.log('Default card set successfully:', response);
                enqueueSnackbar("Default card set successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                onSetDefaultCard(cards);
                onActionComplete();
            } else {
                console.error('Failed to set default card:', response.data.error);

            }
        } catch (error) {
            console.error('Error:', error);

        }
    };


    const handleDeleteCard = async (card) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }

        const headers = {
            Authorization: "Bearer " + token,
        };
        console.log('delete card', card);
        console.log('delete header', headers);

        const DefaultPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
        try {
            const response = await axios.request({
                url: `${DefaultPayApiUrl}/owner/deleteCard`,
                method: 'delete',
                headers: headers,
                data: {
                    cardNumber: card.cardNumber,
                    cardType: card.cardType,
                }
            });

            if (response.data.success) {
                console.log('Card deleted successfully:', response);
                enqueueSnackbar("Card deleted successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                onActionComplete();
            } else {
                console.error('Failed to delete card:', response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (

        <>
            <SnackbarProvider />
            <div className="container">
                {/* <h3 className="text-center">Select a Card</h3> */}
                <div className="row">


                    {cards.map((card, index) => (
                        <div
                            key={card._id}
                            // className={`col-md-6 col-sm-12 col-12 mb-3 ${selectedCard === card._id ? "border-primary" : ""}`}
                            // className={`col-md-${cards.length === 1 ? 12 : 4} col-sm-12 col-12 mb-3 ${selectedCard === card._id ? "border-primary" : ""}`}
                            className={`col-md-${cards.length === 1 ? 4 : (cards.length === 2 ? 4 : 4)} col-sm-12 col-12 mb-3 ${selectedCard === card._id ? "border-primary" : ""}`}
                        // className={`col-md-${cards.length === 1 ? 12 : (index % 2 === 0 ? 6 : 6)} col-sm-12 col-12 mb-3 ${selectedCard === card._id ? "border-primary" : ""}`}
                        // className={`col-md-${cards.length === 1 ? 12 : (cards.length === 2 ? 6 : 4)} col-sm-12 col-12 mb-3 ${selectedCard === card._id ? "border-primary" : ""}`}
                        // style={{ flexBasis: 'auto' }}
                        >
                            {/* <div className="d-flex justify-content-center"> */}
                            <div className="card align-item-center justify-content-center p-2">
                                <input
                                        id={card._id}
                                        type="radio"
                                        name="selectedCard"
                                        value={card._id}
                                        checked={selectedCard === card._id}
                                        onChange={() => onSelect(card)}
                                        className="form-check-input align-items-center mt-3"
                                    />
                                <label htmlFor={card._id} className="w-100 align-items-center justify-content-center">

                                    {/* <div className="card h-100 gap-2 w-100"> */}
                                        <div className="card-body gap-2 align-items-center" style={{ minHeight: '164px' }}> {/* Add this style */}
                                         
                                            <div className="d-flex align-items-center mb-2 gap-2">
                                                <span className="mr-2">{card.cardType}
                                                </span>
                                                **** {card.cardNumber}
                                                <img
                                                    src={getCardIcon(card.cardType)}
                                                    alt={card.cardType} style={{ maxWidth: '8%' }}
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <div className="gap-2">
                                                <span className="font-weight-bold">{card.cardHolder}</span>
                                                <br />
                                                <span style={{ color: 'grey', fontSize: '15px', marginLeft: '1%' }}>Expires on {card.expMonth}/{card.expYear}</span>
                                                <br />
                                                <span className="text-warning">⚠️ Unverified</span>
                                            </div>
                                            {selectedCard === card._id && (
                                                <div className="d-flex justify-content-end gap-1"> {/* Add this class */}
                                                    <button
                                                        className="btn btn-primary btn-sm mr-2"
                                                        onClick={() => handleSetDefaultCard(card)}
                                                        disabled={cards.length === 1} // Add this prop
                                                    >
                                                        Default
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteCard(card)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    {/* </div> */}

                                </label>
                  

                            {/* </div> */}
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// Function to determine card icon based on card type
const getCardIcon = (cardType) => {
    switch (cardType) {
        case "Mastercard":
            return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
        case "American Express":
            return "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg";
        case "visa":
            return "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"; // Example URL
        default:
            return "";
    }
};
// Inline styles
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f7f7f7",
    },
    title: {
        marginBottom: "20px",
    },
    cardContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        Width: "100%", // Limit width to fit 3 cards in a row
    },
    card: {
        flex: "1 1 calc(33.33% - 20px)", // Flex-basis calculation for 3 cards
        maxWidth: "350px",
        width: "350px", // Full width
        maxHeight: "180px", // Fixed height
        position: "relative",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "border 0.3s ease",
    },
    selectedCard: {
        border: "2px solid #007bff",
    },
    radio: {
        position: "absolute",
        top: "10px",
        right: "10px",
        cursor: "pointer",
    },
    label: {
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
    },
    cardTypeContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    },
    cardType: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
        marginRight: "8px",
    },
    cardNumber: {
        fontSize: "16px",
        color: "#666",
    },
    cardIcon: {
        width: "24px",
        height: "24px",
    },
    cardDetails: {
        fontSize: "14px",
        color: "#555",
    },
    cardHolder: {
        fontWeight: "bold",
        color: "#333",
    },
    expiryDate: {
        color: "#888",
    },
    unverified: {
        color: "#ff9900",
    },
    defaultBadge: {
        position: "absolute",
        bottom: "10px",
        right: "10px",
        padding: "2px 6px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderRadius: "4px",
        fontSize: "12px",
    },
    deleteBadge: {
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "2px 6px",
        backgroundColor: "red",
        color: "#fff",
        borderRadius: "4px",
        fontSize: "12px",
    },
    cardWrapper: {
        // maxWidth: '300px',
        // margin: '0 auto',
    }
};

export default CardSelection;
