import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SellerDocs() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const docAppUrl = process.env.REACT_APP_DOC_AUTO_URL || "http://localhost:5173";
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.action === "navigate" && e.data.to) {
        navigate(e.data.to);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  return (
    <div style={{ width: '100%', height: '100vh', margin: '-20px' }}>
      <iframe 
        src={`${docAppUrl}/sellers/${sellerId}/documents?created_by=${encodeURIComponent(username)}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Seller Documents"
      />
    </div>
  );
}

export default SellerDocs;
