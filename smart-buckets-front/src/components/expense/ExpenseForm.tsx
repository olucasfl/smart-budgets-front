import { useState } from "react";
import { expenseService } from "../../services/expenseService";

type Props = {
  hubId: number;
  onSaved: () => void;
};

type FieldErrors = {
  name?: string;
  amount?: string;
  general?: string;
};

export default function ExpenseForm({ hubId, onSaved }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("DEBIT");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  /* =========================
     VALIDAÇÃO FRONTEND
  ========================= */

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!name.trim()) {
      newErrors.name = "Informe o nome da despesa.";
    }

    if (!amount) {
      newErrors.amount = "Informe o valor.";
    } else if (Number(amount) <= 0) {
      newErrors.amount = "O valor deve ser maior que zero.";
    } else if (isNaN(Number(amount))) {
      newErrors.amount = "Valor inválido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await expenseService.create({
        hubId,
        name: name.trim(),
        amount: Number(amount),
        description: description.trim(),
        type
      });

      // reset
      setName("");
      setAmount("");
      setDescription("");
      setType("DEBIT");

      onSaved();
    } catch (err: any) {
      // erro vindo da API
      if (err?.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else if (err?.message === "Network Error") {
        setErrors({ general: "Erro de conexão. Tente novamente." });
      } else {
        setErrors({ general: "Erro inesperado ao salvar despesa." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-wrapper">
      <div className="expense-form">
        <h3>Nova Despesa</h3>

        {errors.general && (
          <div className="form-error">
            {errors.general}
          </div>
        )}

        <div className="expense-form-grid">
          {/* NOME */}
          <div className="form-group">
            <label>Nome</label>
            <input
              placeholder="Ex: Pizza"
              value={name}
              onChange={e => setName(e.target.value)}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && (
              <span className="error-text">{errors.name}</span>
            )}
          </div>

          {/* VALOR */}
          <div className="form-group">
            <label>Valor</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className={errors.amount ? "input-error" : ""}
            />
            {errors.amount && (
              <span className="error-text">{errors.amount}</span>
            )}
          </div>

          {/* DESCRIÇÃO */}
          <div className="form-group full">
            <label>Descrição (opcional)</label>
            <textarea
              placeholder="Detalhes da despesa..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* TIPO */}
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="PIX">Pix</option>
              <option value="CREDIT">Crédito</option>
              <option value="DEBIT">Débito</option>
              <option value="MONEY">Dinheiro</option>
            </select>
          </div>

          {/* BOTÃO */}
          <div className="form-group button">
            <button
              className="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
