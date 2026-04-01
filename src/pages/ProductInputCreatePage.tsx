import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import type { CreateProductInputResponse } from "../types/InputTypes";
import Toast from "../components/Toast";

export default function ProductInputCreatePage() {
  const navigate = useNavigate();
  const [productOrderId, setProductOrderId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await api.post<CreateProductInputResponse>("/product-inputs", {
        productOrderId,
        quantity: Number(quantity),
        inputDate,
      });

      navigate(`/inputs/${encodeURIComponent(data.productInputId)}`, {
        state: { toast: { message: "Entrada criada com sucesso!", type: "success" as const } },
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
          <h1 className="page-title">Nova Entrada</h1>
          <p className="text-muted">Registre uma entrada de produto e veja os detalhes após salvar.</p>
        </div>
        <Link to="/inputs" className="btn btn-secondary">Voltar para Entradas</Link>
      </div>

      <div className="card form-card">
        <h2>Dados da Entrada</h2>
        <form onSubmit={handleCreate} className="form create-product-form" noValidate>
          <div className="field">
            <label htmlFor="productOrderId">UUID do Pedido</label>
            <input
              id="productOrderId"
              type="text"
              value={productOrderId}
              onChange={(e) => setProductOrderId(e.target.value)}
              placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
            />
          </div>

          <div className="field">
            <label htmlFor="quantity">Quantidade</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex: 10"
            />
          </div>

          <div className="field">
            <label htmlFor="inputDate">Data da Entrada</label>
            <input
              id="inputDate"
              type="datetime-local"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Criando..." : "Criar Entrada"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
