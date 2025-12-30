import { useState } from "react";
import { hubService } from "../../services/hubService";

type Props = {
  onSaved: () => void;
};

type FieldErrors = {
  name?: string;
  limit?: string;
  general?: string;
};

export function HubForm({ onSaved }: Props) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  /* =========================
     VALIDAÇÃO
  ========================= */

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!name.trim()) {
      newErrors.name = "Informe o nome do hub.";
    }

    if (!limit) {
      newErrors.limit = "Informe o limite.";
    } else if (Number(limit) <= 0) {
      newErrors.limit = "O limite deve ser maior que zero.";
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
      await hubService.create({
        name: name.trim(),
        budgetLimit: Number(limit),
        description: description.trim()
      });

      setName("");
      setLimit("");
      setDescription("");

      onSaved();
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: "Erro ao criar hub." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hub-form">
      <h3>Novo Hub</h3>

      {errors.general && (
        <div className="form-error">
          {errors.general}
        </div>
      )}

      <div className="hub-form-grid">
        {/* NOME */}
        <div className="form-group full">
          <label>Nome</label>
          <input
            placeholder="Ex: Gastos Agosto"
            value={name}
            onChange={e => setName(e.target.value)}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && (
            <span className="error-text">{errors.name}</span>
          )}
        </div>

        {/* LIMITE */}
        <div className="form-group">
          <label>Limite</label>
          <input
            type="number"
            placeholder="R$ 0.00"
            value={limit}
            onChange={e => setLimit(e.target.value)}
            className={errors.limit ? "input-error" : ""}
          />
          {errors.limit && (
            <span className="error-text">{errors.limit}</span>
          )}
        </div>

        {/* DESCRIÇÃO */}
        <div className="form-group full">
          <label>Descrição (opcional)</label>
          <textarea
            placeholder="Descrição do hub..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* BOTÃO */}
        <div className="form-group button">
          <button
            className="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Hub"}
          </button>
        </div>
      </div>
    </div>
  );
}
