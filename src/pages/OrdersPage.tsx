import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { Order } from "../types/OrderTypes";
import Toast from "../components/Toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Order[]>("/product-orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setToast({ message: (err as Error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Todos os Pedidos</h1>
          <p className="text-muted">Acompanhe os pedidos cadastrados e abra os detalhes individuais.</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary">
          Novo Pedido
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <p className="empty-text">Carregando...</p>
        ) : orders.length === 0 ? (
          <p className="empty-text">Nenhum pedido cadastrado.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>UUID</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Data do Pedido</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.uuid}>
                    <td><strong>{o.uuid}</strong></td>
                    <td><strong>{o.product}</strong></td>
                    <td><strong>{o.quantity}</strong></td>
                    <td><strong>{new Date(o.orderDate).toLocaleDateString("pt-BR")}</strong></td>
                    <td>
                      <strong>
                        <span className={`badge ${o.status === "opened" ? "badge-red" : "badge-green"}`}>
                          {o.status}
                        </span>
                      </strong>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/orders/${encodeURIComponent(o.uuid)}`} className="btn btn-secondary btn-sm">
                          Detalhes
                        </Link>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => {}}>
                          Apagar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
