import { useState } from "react";
import { hubService } from "../../services/hubService";

export function HubForm({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budgetLimit, setBudgetLimit] = useState(0);

  const submit = () => {
    hubService.create({ name, description, budgetLimit }).then(() => {
      setName("");
      setDescription("");
      setBudgetLimit(0);
      onSaved();
    });
  };

  return (
    <div className="card">
      <h3>Novo Hub</h3>

      <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} />
      <input
        type="number"
        placeholder="Limite"
        value={budgetLimit}
        onChange={e => setBudgetLimit(Number(e.target.value))}
      />

      <button className="primary" onClick={submit}>
        Salvar
      </button>
    </div>
  );
}
