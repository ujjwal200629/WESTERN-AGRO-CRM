import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiX, FiChevronDown,
  FiChevronUp, FiPackage, FiMapPin, FiMail, FiBriefcase,
  FiAlertCircle, FiAnchor, FiPhone, FiFileText, FiTrash2, FiArchive
} from "react-icons/fi";

function BuyerAvatar({ name }) {
  const initials = name
    ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return <div className="buyer-avatar">{initials}</div>;
}

function Buyers() {
  const navigate = useNavigate();
  const [buyers, setBuyers]         = useState([]);
  const [search, setSearch]         = useState("");
  const [expandedId, setExpandedId] = useState(null);
  
  const [recycleCount, setRecycleCount] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [buyerToDelete, setBuyerToDelete] = useState(null);

  useEffect(() => { 
    fetchBuyers(); 
    fetchRecycleCount();
  }, []);

  const fetchRecycleCount = () => {
    fetch("http://localhost:5000/buyers/recycle-bin")
      .then(res => res.json())
      .then(data => setRecycleCount(data.length))
      .catch(() => setRecycleCount(0));
  };

  const confirmDelete = () => {
    if (!buyerToDelete) return;
    fetch(`http://localhost:5000/buyers/${buyerToDelete.id}/delete`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchBuyers();
          fetchRecycleCount();
          setDeleteModalOpen(false);
          setBuyerToDelete(null);
        }
      })
      .catch(err => console.error(err));
  };

  const fetchBuyers = () => {
    fetch("http://localhost:5000/buyers")
      .then(res => res.json())
      .then(data => {
        const parsed = data.map(b => ({
          ...b,
          products: typeof b.products === "string"
            ? JSON.parse(b.products || "[]")
            : (b.products || [])
        }));
        setBuyers(parsed);
      })
      .catch(() => setBuyers([]));
  };

  /* ── FILTER ── */
  const filtered = buyers.filter(b =>
    (b.buyer_name   || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.company_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.email        || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.country      || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.phone        || "").toLowerCase().includes(search.toLowerCase())
  );

  /* ══════════════════════════ RENDER ══════════════════════════ */
  const customStyles = `
    .buyer-actions-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 10px;
      flex-wrap: nowrap;
    }
    .btn-view-docs {
      background-color: #0e2318;
      color: #c9a96e;
      border: 1px solid #c9a96e;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      height: 40px;
      min-width: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      transition: all 0.2s ease;
      font-size: 13px;
    }
    .btn-view-docs:hover {
      background-color: #153524;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .btn-delete-buyer {
      background-color: transparent;
      color: #d9534f;
      border: 1px solid #d9534f;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 40px;
      width: 40px;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .btn-delete-buyer:hover {
      background-color: rgba(217, 83, 79, 0.1);
      color: #c9302c;
      border-color: #c9302c;
    }
    @media (max-width: 768px) {
      .buyer-actions-container {
        flex-direction: column;
        gap: 6px;
      }
    }
  `;

  return (
    <div className="buyers-page">
      <style>{customStyles}</style>

      {/* PAGE HEADER */}
      <div className="buyers-page-header">
        <div>
          <h1 className="buyers-page-title">Buyers</h1>
          <p className="buyers-page-sub">
            {buyers.length} buyer{buyers.length !== 1 ? "s" : ""} registered
            <span style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>
              <FiFileText size={11} style={{ marginRight: 3 }} />
              Auto-populated from document generation
            </span>
          </p>
        </div>
      </div>

      {/* SEARCH AND RECYCLE BIN */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div className="buyers-search-wrap" style={{ margin: 0, flex: 1, maxWidth: "400px" }}>
          <FiSearch size={15} className="buyers-search-icon" />
          <input
            className="buyers-search"
            placeholder="Search by name, company, email or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <FiX
              size={15}
              className="buyers-search-clear"
              onClick={() => setSearch("")}
            />
          )}
        </div>
        <button 
          className="buyer-action-btn"
          style={{ backgroundColor: "#0e2318", color: "#c9a96e", border: "1px solid #c9a96e", padding: "0 20px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "160px", height: "40px" }}
          onClick={() => navigate("/buyers/recycle-bin")}
        >
          ♻ Recycle Bin ({recycleCount})
        </button>
      </div>

      {/* TABLE */}
      <div className="buyers-table-outer">
        <table className="buyers-table">
          <thead>
            <tr>
              <th style={{ width: 28 }}></th>
              <th>Buyer Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Products</th>
              <th style={{ minWidth: "240px", width: "240px", textAlign: "center", whiteSpace: "nowrap" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "#aaa", padding: "40px" }}>
                  No buyers found. Buyers are created automatically when documents are generated.
                </td>
              </tr>
            )}
            {filtered.map(b => {
              const isOpen = expandedId === b.id;
              const products = b.products || [];
              return (
                <>
                  {/* MAIN ROW */}
                  <tr
                    key={b.id}
                    className={`buyer-main-row${isOpen ? " buyer-row-open" : ""}`}
                    onClick={() => setExpandedId(isOpen ? null : b.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ paddingLeft: 14 }}>
                      <button
                        className={`buyer-action-btn buyer-expand`}
                        title={isOpen ? "Collapse" : "Expand"}
                        onClick={e => { e.stopPropagation(); setExpandedId(isOpen ? null : b.id); }}
                      >
                        {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                      </button>
                    </td>
                    <td>
                      <div className="buyer-name-cell">
                        <BuyerAvatar name={b.buyer_name} />
                        <strong>{b.buyer_name || "—"}</strong>
                      </div>
                    </td>
                    <td>{b.company_name || "—"}</td>
                    <td>{b.email || "—"}</td>
                    <td>{b.phone || "—"}</td>
                    <td>{b.country || "—"}</td>
                    <td>
                      <div className="buyer-product-chips">
                        {products.slice(0, 2).map((p, i) => (
                          <span key={i} className="buyer-chip">{p.product}</span>
                        ))}
                        {products.length > 2 && (
                          <span className="buyer-chip buyer-chip-more">+{products.length - 2}</span>
                        )}
                        {products.length === 0 && <span style={{ color: "#aaa", fontSize: 12 }}>—</span>}
                      </div>
                    </td>
                    <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                      <div className="buyer-actions-container">
                        <button
                          className="btn-view-docs"
                          onClick={e => { e.stopPropagation(); navigate(`/buyers/${b.id}/documents`); }}
                        >
                          View Documents
                        </button>
                        <button
                          className="btn-delete-buyer"
                          onClick={e => { 
                            e.stopPropagation(); 
                            setBuyerToDelete(b); 
                            setDeleteModalOpen(true); 
                          }}
                          title="Move to Recycle Bin"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED DETAIL ROW */}
                  {isOpen && (
                    <tr key={`${b.id}-detail`} className="buyer-detail-row">
                      <td colSpan={8}>
                        <div className="buyer-detail-panel">

                          {/* CONTACT INFO */}
                          <div className="buyer-detail-info">
                            <div className="buyer-detail-info-item">
                              <FiBriefcase size={14} />
                              <span><strong>Company:</strong> {b.company_name || "—"}</span>
                            </div>
                            <div className="buyer-detail-info-item">
                              <FiMail size={14} />
                              <span>{b.email || "—"}</span>
                            </div>
                            <div className="buyer-detail-info-item">
                              <FiPhone size={14} />
                              <span>{b.phone || "—"}</span>
                            </div>
                            <div className="buyer-detail-info-item">
                              <FiMapPin size={14} />
                              <span>{b.country || "—"}</span>
                            </div>
                            <div className="buyer-detail-info-item">
                              <FiMapPin size={14} />
                              <span>{b.address || "—"}</span>
                            </div>
                          </div>

                          {/* NOTES */}
                          {b.notes && (
                            <div className="buyer-important-note">
                              <FiAlertCircle size={16} />
                              <div>
                                <strong>Notes</strong>
                                <p>{b.notes}</p>
                              </div>
                            </div>
                          )}

                          {/* PRODUCTS TABLE */}
                          {products.length > 0 && (
                            <div className="buyer-products-wrap">
                              <div className="buyer-products-title">
                                <FiPackage size={14} /> Products &amp; Trade Terms
                              </div>
                              <div style={{ overflowX: "auto" }}>
                                <table className="buyer-products-table">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Product</th>
                                      <th>Price</th>
                                      <th>Trial Qty</th>
                                      <th>Contract Qty</th>
                                      <th>Total Contract Price</th>
                                      <th>Destination Port</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {products.map((p, i) => (
                                      <tr key={i}>
                                        <td style={{ color: "#c9a96e", fontWeight: 700 }}>{i + 1}</td>
                                        <td><strong>{p.product || "—"}</strong></td>
                                        <td>{p.price ? `$${p.price}` : "—"}</td>
                                        <td>{p.trial_qty || "—"}</td>
                                        <td>{p.contract_qty || "—"}</td>
                                        <td>{p.total_contract_price ? `$${p.total_contract_price}` : "—"}</td>
                                        <td>
                                          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                            <FiAnchor size={12} style={{ color: "#c9a96e" }} />
                                            {p.destination_port || "—"}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {deleteModalOpen && buyerToDelete && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="modal-content" style={{ backgroundColor: "#0e2318", padding: "30px", borderRadius: "12px", border: "1px solid #c9a96e", color: "white", maxWidth: "450px", width: "100%" }}>
            <h2 style={{ marginTop: 0, color: "#c9a96e", display: "flex", alignItems: "center", gap: "10px" }}><FiTrash2 /> Move Buyer to Recycle Bin?</h2>
            <p style={{ lineHeight: "1.6", color: "#e9ebea", marginBottom: "10px" }}>
              This buyer will be removed from the active Buyers list.
            </p>
            <p style={{ lineHeight: "1.6", color: "#aaa", fontSize: "14px", marginBottom: "25px" }}>
              All buyer information, generated documents, document history, account records, and analytics relationships will remain preserved and can be restored later.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}>
              <button 
                onClick={() => { setDeleteModalOpen(false); setBuyerToDelete(null); }}
                style={{ backgroundColor: "transparent", border: "1px solid #aaa", color: "#aaa", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ backgroundColor: "#d9534f", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
              >
                Move to Recycle Bin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Buyers;