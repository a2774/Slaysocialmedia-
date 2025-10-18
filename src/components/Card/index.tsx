import React from "react";
// import "./style.css";
// import QRSampleImg from "../../constants/assets/qr-sample.png";

interface CardProps {
  card: {
    title: string;
    qr_url: string;
  };
}
const Card = (props: CardProps) => {
  const { card } = props;

  return (
    <div className="card-container nft-inner">
      <div className="card-image">
        <img
          src={card.qr_url}
          alt="Card QR"
          style={{ width: "100%", height: "300px", objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          padding: "12px",
          fontSize: "24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>{card.title}</div>
      </div>
    </div>
  );
};

export default Card;
