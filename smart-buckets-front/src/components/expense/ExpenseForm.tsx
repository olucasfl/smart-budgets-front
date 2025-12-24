import { useState } from "react";
import { expenseService } from "../../services/expenseService";
import type { ExpenseType } from "../../dtos/ExpenseType";

type Props = {
  hubId: number;
  onSaved: () => void;
};

export function ExpenseForm({ hubId, onSaved }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<ExpenseType>("DEBIT");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !description || !amount) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      await expenseService.create(hubId, {
        name,
        description,
        amount: Number(amount),
        type,
      });

      // reset form
      setName("");
      setDescription("");
      setAmount("");
      setType("DEBIT");

      onSaved();
    } catch (error) {
      alert("Erro ao criar despesa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Nova Despesa</h3>

      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor"
        value={amount}
        min={0}
        step="0.01"
        onChange={(e) =>
          setAmount(e.target.value ? Number(e.target.value) : "")
        }
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as ExpenseType)}
      >
        <option value="CREDIT">Crédito</option>
        <option value="DEBIT">Débito</option>
        <option value="PIX">PIX</option>
        <option value="MONEY">Dinheiro</option>
      </select>

      <button
        className="primary"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Salvando..." : "Adicionar"}
      </button>
    </div>
  );
}
