import React, { useState } from 'react';
import { FaBox, FaShippingFast, FaCheckCircle, FaClipboardList } from 'react-icons/fa';
import './App.css';
import AgriChatbot from './Chatbot';

function App() {
    const [orders, setOrders] = useState([
        {
            id: 1,
            farmer: "John Doe Farms",
            products: [
                { name: "Organic Wheat", quantity: "50kg" },
                { name: "Basmati Rice", quantity: "30kg" }
            ],
            orderDate: "2023-05-01",
            estimatedDelivery: "2023-05-10",
            carrier: "FastTrack Logistics",
            trackingNumber: "FTL123456789",
            status: "ordered",
            timeline: {
                ordered: "2023-05-01T10:00",
                prepared: null,
                packed: null,
                shipped: null,
                delivered: null
            },
            recipient: {
                name: "",
                phone: ""
            }
        },
        {
            id: 2,
            farmer: "Green Valley Produce",
            products: [
                { name: "Sweet Corn", quantity: "100kg" },
                { name: "Tomatoes", quantity: "25kg" }
            ],
            orderDate: "2023-05-02",
            estimatedDelivery: "2023-05-11",
            carrier: "QuickShip Express",
            trackingNumber: "QSE987654321",
            status: "packed",
            timeline: {
                ordered: "2023-05-02T09:30",
                prepared: null,
                packed: "2023-05-03T14:15",
                shipped: null,
                delivered: null
            },
            recipient: {
                name: "",
                phone: ""
            }
        }
    ]);

    const updateStatus = (orderId, newStatus) => {
        setOrders(orders.map(order => {
            if (order.id === orderId) {
                const updatedTimeline = { ...order.timeline };
                updatedTimeline[newStatus] = new Date().toISOString();

                return {
                    ...order,
                    status: newStatus,
                    timeline: updatedTimeline
                };
            }
            return order;
        }));
    };

    const handleRecipientSubmit = (orderId, recipientName, recipientPhone) => {
        setOrders(orders.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    recipient: {
                        name: recipientName,
                        phone: recipientPhone
                    }
                };
            }
            return order;
        }));
    };

    const statusConfig = {
        ordered: { label: "Ordered", icon: <FaBox />, color: "blue" },
        prepared: { label: "Order Prepared", icon: <FaClipboardList />, color: "orange" },
        packed: { label: "Packed", icon: <FaBox />, color: "yellow" },
        shipped: { label: "Shipped", icon: <FaShippingFast />, color: "purple" },
        delivered: { label: "Delivered", icon: <FaCheckCircle />, color: "green" }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not yet";
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="logistics-container">

            <h1 className="logistics-header">Order Tracking Dashboard</h1>

            <div>
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <div>
                                <h2>Order #{order.id}</h2>
                                <p>Farmer: {order.farmer}</p>
                            </div>
                            <div>
                                <p>Estimated Delivery: {order.estimatedDelivery}</p>
                                <p>{order.carrier} (Tracking: {order.trackingNumber})</p>
                            </div>
                        </div>

                        <div className="order-products">
                            <h3>Products:</h3>
                            <ul>
                                {order.products.map((product, index) => (
                                    <li key={index}>
                                        {product.name} - {product.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="timeline">
                            {Object.entries(statusConfig).map(([statusKey, status]) => {
                                const isCurrent = order.status === statusKey;

                                return (
                                    <div key={statusKey} className="timeline-item">
                                        <div className={`timeline-icon ${status.color}`}>
                                            {status.icon}
                                        </div>
                                        <div className="timeline-content">
                                            <h4>{status.label}</h4>
                                            <p>{formatDate(order.timeline[statusKey])}</p>
                                            {isCurrent && (
                                                <div className="status-buttons">
                                                    {Object.keys(statusConfig).map((nextStatus) => {
                                                        const nextStatusIdx = Object.keys(statusConfig).indexOf(nextStatus);
                                                        const currentStatusIdx = Object.keys(statusConfig).indexOf(order.status);

                                                        if (nextStatusIdx === currentStatusIdx + 1) {
                                                            return (
                                                                <button
                                                                    key={nextStatus}
                                                                    onClick={() => updateStatus(order.id, nextStatus)}
                                                                >
                                                                    Mark as {statusConfig[nextStatus].label}
                                                                </button>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {order.status === "shipped" && (
                            <div className="recipient-form">
                                <h3>Recipient Details</h3>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const recipientName = e.target.recipientName.value;
                                        const recipientPhone = e.target.recipientPhone.value;
                                        handleRecipientSubmit(order.id, recipientName, recipientPhone);
                                    }}
                                >
                                    <div>
                                        <label htmlFor="recipientName">Recipient Name:</label>
                                        <input
                                            type="text"
                                            id="recipientName"
                                            name="recipientName"
                                            placeholder="Enter recipient name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="recipientPhone">Recipient Phone:</label>
                                        <input
                                            type="tel"
                                            id="recipientPhone"
                                            name="recipientPhone"
                                            placeholder="Enter recipient phone"
                                            required
                                        />
                                    </div>
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AgriChatbot />
        </div>
    );
}

export default App;