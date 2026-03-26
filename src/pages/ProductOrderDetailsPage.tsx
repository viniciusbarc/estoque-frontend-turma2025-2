import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import Toast from "../components/Toast";

interface OrderDetails {
  uuid: string;
  product: string;
  productBarcode: string;
  quantity: number;
  orderDate: string;
  status: string;
}

export default function ProductOrderDetailsPage() {
  const { productOrderId = "" } = useParams<{ productOrderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOrder() {
      try {
        const { data } = await api.get<OrderDetails>(`/product-orders/${encodeURIComponent(productOrderId)}`);
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled) setToast({ message: (err as Error).message, type: "error" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrder();
    return () => { cancelled = true; };
  }, [productOrderId]);

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1 className="page-title">Detalhes do Pedido</h1>
        <Link to="/orders" className="btn btn-secondary">Voltar para Pedidos</Link>
      </div>

      {loading ? (
        <div className="card"><p className="empty-text">Carregando pedido...</p></div>
      ) : !order ? (
        <div className="card"><p className="empty-text">Pedido não encontrado.</p></div>
      ) : (
        <div className="card detail-card">
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">UUID</span>
              <strong>{order.uuid}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Produto</span>
              <strong>{order.product}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Código de Barras</span>
              <strong>{order.productBarcode}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quantidade</span>
              <strong>{order.quantity}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Data do Pedido</span>
              <strong>{new Date(order.orderDate).toLocaleString("pt-BR")}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <strong>
                <span className={`badge ${order.status === "opened" ? "badge-red" : "badge-green"}`}>
                  {order.status}
                </span>
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
