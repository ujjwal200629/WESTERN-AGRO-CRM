import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiX, FiChevronDown,
  FiChevronUp, FiPackage, FiMapPin, FiMail, FiBriefcase,
  FiAlertCircle, FiAnchor, FiPhone, FiFileText
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

  useEffect(() => { fetchBuyers(); }, []);

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
  return (
    <div className="buyers-page">

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

      {/* SEARCH */}
      <div className="buyers-search-wrap">
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
              <th>Actions</th>
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
                    <td>
                      <div className="action-buttons">
                        <button
                          style={{ backgroundColor: "#2b2b2b", color: "#c9a96e" }}
                          onClick={e => { e.stopPropagation(); navigate(`/buyers/${b.id}/documents`); }}
                        >
                          View Documents
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
    </div>
  );
}

export default Buyers;