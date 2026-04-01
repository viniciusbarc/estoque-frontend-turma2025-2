import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../api";
import type { ProductInput } from "../types/InputTypes";
import Toast from "../components/Toast";

export default function ProductInputDetailsPage() {
  const { productInputId = "" } = useParams<{ productInputId: string }>();
  const location = useLocation();
  const [input, setInput] = useState<ProductInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const state = location.state as { toast?: { message: string; type: "success" | "error" } } | null;

    if (state?.toast) {
      setToast(state.toast);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    let cancelled = false;

    async function fetchInput() {
      try {
        const { data } = await api.get<ProductInput>(`/product-inputs/${encodeURIComponent(productInputId)}`);
        if (!cancelled) setInput(data);
      } catch (err) {
        if (!cancelled) setToast({ message: (err as Error).message, type: "error" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInput();
    return () => { cancelled = true; };
  }, [productInputId]);

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1 className="page-title">Detalhes da Entrada</h1>
        <Link to="/inputs" className="btn btn-secondary">Voltar para Entradas</Link>
      </div>

      {loading ? (
        <div className="card"><p className="empty-text">Carregando entrada...</p></div>
      ) : !input ? (
        <div className="card"><p className="empty-text">Entrada não encontrada.</p></div>
      ) : (
        <div className="card detail-card">
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">UUID</span>
              <strong><div data-testid="input-uuid">{input.uuid}</div></strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">UUID do Pedido</span>
              <strong><div data-testid="input-order-id">{input.productOrderId}</div></strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quantidade</span>
              <strong><div data-testid="input-quantity">{input.quantity}</div></strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Data da Entrada</span>
              <strong><div data-testid="input-date">{new Date(input.inputDate).toLocaleString("pt-BR")}</div></strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
