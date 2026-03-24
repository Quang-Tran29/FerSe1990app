import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:9999";

const pageStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.9rem",
  color: "#0f172a",
};

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "1rem",
};

const summaryCardStyle = {
  padding: "0.9rem 1rem",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(16, 185, 129, 0.1))",
  border: "1px solid rgba(148, 163, 184, 0.7)",
};

const tableWrapperStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.96)",
  borderRadius: "18px",
  padding: "1.25rem 1.5rem",
  boxShadow: "0 16px 40px rgba(148, 163, 184, 0.3)",
  border: "1px solid rgba(148, 163, 184, 0.7)",
};

const filterRowStyle = {
  display: "flex",
  gap: "0.75rem",
  marginBottom: "0.9rem",
};

const selectStyle = {
  minWidth: "190px",
  padding: "0.5rem 0.75rem",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.9)",
  backgroundColor: "rgba(248, 250, 252, 0.95)",
  color: "#0f172a",
  fontSize: "0.85rem",
  outline: "none",
};

const searchInputStyle = {
  flex: 1,
  padding: "0.5rem 0.9rem",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.9)",
  backgroundColor: "rgba(248, 250, 252, 0.95)",
  color: "#0f172a",
  fontSize: "0.85rem",
  outline: "none",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
  color: "#0f172a",
};

const thStyle = {
  textAlign: "left",
  padding: "0.6rem 0.75rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.6)",
  color: "rgb(71 85 105)",
  fontWeight: 600,
};

const tdStyle = {
  padding: "0.55rem 0.75rem",
  borderBottom: "1px solid rgba(226, 232, 240, 1)",
  color: "#111827",
};

const badgeBaseStyle = {
  borderRadius: "999px",
  padding: "0.15rem 0.6rem",
  fontSize: "0.76rem",
  fontWeight: 600,
  textTransform: "uppercase",
};

const detailsButtonStyle = {
  padding: "6px 11px",
  borderRadius: "999px",
  border: "1px solid rgba(15, 23, 42, 0.45)",
  backgroundColor: "white",
  cursor: "pointer",
  fontSize: "0.82rem",
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(15, 23, 42, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  padding: "1rem",
};

const modalStyle = {
  width: "100%",
  maxWidth: "760px",
  maxHeight: "85vh",
  overflow: "auto",
  backgroundColor: "white",
  borderRadius: "20px",
  padding: "1.25rem 1.4rem",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.45)",
  border: "1px solid rgba(148, 163, 184, 0.8)",
};

const closeButtonStyle = {
  borderRadius: "999px",
  border: "1px solid rgba(15, 23, 42, 0.5)",
  backgroundColor: "white",
  cursor: "pointer",
  padding: "6px 11px",
};

const statusColorMap = {
  pending: {
    color: "#92400e",
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    border: "1px solid rgba(245, 158, 11, 0.55)",
  },
  processing: {
    color: "#1d4ed8",
    backgroundColor: "rgba(96, 165, 250, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.55)",
  },
  shipped: {
    color: "#6d28d9",
    backgroundColor: "rgba(196, 181, 253, 0.35)",
    border: "1px solid rgba(139, 92, 246, 0.5)",
  },
  completed: {
    color: "#166534",
    backgroundColor: "rgba(134, 239, 172, 0.3)",
    border: "1px solid rgba(34, 197, 94, 0.5)",
  },
  cancelled: {
    color: "#991b1b",
    backgroundColor: "rgba(252, 165, 165, 0.3)",
    border: "1px solid rgba(239, 68, 68, 0.5)",
  },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch(`${API}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = statusFilter === "all" || order.status === statusFilter;
      const keyword = searchTerm.toLowerCase();
      const matchKeyword =
        String(order.orderCode || "").toLowerCase().includes(keyword) ||
        String(order.customerName || "").toLowerCase().includes(keyword) ||
        String(order.customerPhone || "").toLowerCase().includes(keyword);
      return matchStatus && matchKeyword;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  }, [orders]);

  const formatCurrency = (amount) => `${Number(amount || 0).toLocaleString()} VNĐ`;

  const getStatusBadgeStyle = (status) => ({
    ...badgeBaseStyle,
    ...(statusColorMap[status] || statusColorMap.pending),
  });

  return (
    <div style={pageStyle}>
      <h2 style={{ fontSize: "1.1rem", color: "#0f172a" }}>Quản lý đơn hàng</h2>

      <div style={cardsGridStyle}>
        <div style={summaryCardStyle}>
          <div style={{ fontSize: "0.8rem", color: "rgb(100 116 139)" }}>Tổng đơn hàng</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{orders.length}</div>
        </div>
        <div style={summaryCardStyle}>
          <div style={{ fontSize: "0.8rem", color: "rgb(100 116 139)" }}>Đơn đang xử lý</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{pendingCount}</div>
        </div>
        <div style={summaryCardStyle}>
          <div style={{ fontSize: "0.8rem", color: "rgb(100 116 139)" }}>
            Doanh thu (đơn hoàn tất)
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{formatCurrency(totalRevenue)}</div>
        </div>
      </div>

      <div style={tableWrapperStyle}>
        <div style={filterRowStyle}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="completed">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên khách, SĐT..."
            style={searchInputStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Mã đơn</th>
              <th style={thStyle}>Khách hàng</th>
              <th style={thStyle}>Ngày đặt</th>
              <th style={thStyle}>Thanh toán</th>
              <th style={thStyle}>Tổng tiền</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td style={tdStyle}>{order.orderCode}</td>
                <td style={tdStyle}>
                  <div>{order.customerName}</div>
                  <div style={{ fontSize: "0.8rem", color: "rgb(100 116 139)" }}>
                    {order.customerPhone}
                  </div>
                </td>
                <td style={tdStyle}>{order.createdAt}</td>
                <td style={tdStyle}>{order.paymentMethod || "N/A"}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{formatCurrency(order.totalAmount)}</td>
                <td style={tdStyle}>
                  <span style={getStatusBadgeStyle(order.status)}>{order.status}</span>
                </td>
                <td style={tdStyle}>
                  <button
                    type="button"
                    style={detailsButtonStyle}
                    onClick={() => setSelectedOrder(order)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={7}>
                  Không có đơn hàng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div style={modalOverlayStyle} onClick={() => setSelectedOrder(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h3 style={{ margin: 0 }}>Chi tiết đơn {selectedOrder.orderCode}</h3>
              <button type="button" style={closeButtonStyle} onClick={() => setSelectedOrder(null)}>
                Đóng
              </button>
            </div>

            <div style={{ marginBottom: "1rem", lineHeight: 1.6 }}>
              <div>
                <strong>Khách hàng:</strong> {selectedOrder.customerName} -{" "}
                {selectedOrder.customerPhone}
              </div>
              <div>
                <strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}
              </div>
              <div>
                <strong>Thanh toán:</strong> {selectedOrder.paymentMethod}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                <span style={getStatusBadgeStyle(selectedOrder.status)}>{selectedOrder.status}</span>
              </div>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Sản phẩm</th>
                  <th style={thStyle}>SL</th>
                  <th style={thStyle}>Đơn giá</th>
                  <th style={thStyle}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {(selectedOrder.items || []).map((item, idx) => (
                  <tr key={`${item.productId}-${idx}`}>
                    <td style={tdStyle}>{item.productName || `SP #${item.productId}`}</td>
                    <td style={tdStyle}>{item.quantity}</td>
                    <td style={tdStyle}>{formatCurrency(item.price)}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      {formatCurrency(Number(item.quantity || 0) * Number(item.price || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "0.9rem", textAlign: "right", fontWeight: 700 }}>
              Tổng thanh toán: {formatCurrency(selectedOrder.totalAmount)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
