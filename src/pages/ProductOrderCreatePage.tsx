import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import Toast from "../components/Toast";

export default function ProductOrderCreatePage() {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await api.post<{ productOrderId: string }>("/product-orders", {
        barcode,
        quantity: Number(quantity),
        orderDate,
      });

      navigate(`/orders/${encodeURIComponent(data.productOrderId)}`, {
        state: { toast: { message: "Pedido criado com sucesso!", type: "success" as const } },
      });
    } catch (err) {
      setToast({ message: (err as Error).message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Novo Pedido</h1>
          <p className="text-muted">Cadastre um pedido e veja os detalhes após salvar.</p>
        </div>
        <Link to="/orders" className="btn btn-secondary">Voltar para Pedidos</Link>
      </div>

      <div className="card form-card">
        <h2>Dados do Pedido</h2>
        <form onSubmit={handleCreate} className="form create-product-form" noValidate>
          <div className="field">
            <label htmlFor="barcode">Código de Barras do Produto</label>
            <input
              id="barcode"
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Ex: 1234567899"
            />
          </div>

          <div className="field">
            <label htmlFor="quantity">Quantidade</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex: 10"
            />
          </div>

          <div className="field">
            <label htmlFor="orderDate">Data do Pedido</label>
            <input
              id="orderDate"
              type="datetime-local"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Criando..." : "Criar Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
