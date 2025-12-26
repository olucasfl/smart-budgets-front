import { useState } from "react";
import { expenseService } from "../../services/expenseService";

export default function ExpenseForm({
  hubId,
  onSaved
}: {
  hubId: number;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState("DEBIT");

  const submit = async () => {
    if (!name || !amount) {
      alert("Preencha nome e valor");
      return;
    }

    await expenseService.create(hubId, {
      name,
      description,
      amount: Number(amount),
      type
    });

    setName("");
    setDescription("");
    setAmount("");
    setType("DEBIT");
    onSaved();
  };

  return (
    <div className="form-card fade-in">
      <h3>Nova Despesa</h3>

      <div className="form-horizontal">
        <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Valor" value={amount}
          onChange={e => setAmount(e.target.value ? Number(e.target.value) : "")} />

        <textarea placeholder="Descrição (opcional)"
          value={description}
          onChange={e => setDescription(e.target.value)} />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="DEBIT">Débito</option>
          <option value="CREDIT">Crédito</option>
          <option value="PIX">PIX</option>
          <option value="MONEY">Dinheiro</option>
        </select>

        <button className="primary" onClick={submit}>
          Adicionar
        </button>
      </div>
    </div>
  );
}
