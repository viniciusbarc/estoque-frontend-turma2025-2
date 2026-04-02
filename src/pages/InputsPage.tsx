import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { ProductInput } from "../types/InputTypes";
import Toast from "../components/Toast";

export default function InputsPage() {
  const [inputs, setInputs] = useState<ProductInput[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchInputs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<ProductInput[]>("/product-inputs");
      setInputs(Array.isArray(data) ? data : []);
    } catch (err) {
      setToast({ message: (err as Error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInputs();
  }, [fetchInputs]);

  return (
    <div className="page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Todas as Entradas</h1>
          <p className="text-muted">Acompanhe as entradas de produtos cadastradas e abra os detalhes individuais.</p>
        </div>
        <Link to="/inputs/new" className="btn btn-primary">
          Nova Entrada
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <p className="empty-text">Carregando...</p>
        ) : inputs.length === 0 ? (
          <p className="empty-text">Nenhuma entrada cadastrada.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>UUID</th>
                  <th>Pedido (UUID)</th>
                  <th>Quantidade</th>
                  <th>Data da Entrada</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inputs.map((input) => (
                  <tr key={input.uuid}>
                    <td><strong>{input.uuid}</strong></td>
                    <td><strong>{input.productOrderId}</strong></td>
                    <td><strong>{input.quantity}</strong></td>
                    <td><strong>{new Date(input.inputDate).toLocaleDateString("pt-BR")}</strong></td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/inputs/${encodeURIComponent(input.uuid)}`} className="btn btn-secondary btn-sm">
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
