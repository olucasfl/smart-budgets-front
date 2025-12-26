import { useState } from "react";
import { hubService } from "../../services/hubService";

export function HubForm({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [limit, setLimit] = useState<number | "">("");

  const submit = async () => {
    if (!name || !limit) {
      alert("Preencha todos os campos");
      return;
    }

    await hubService.create({
      name,
      description,
      budgetLimit: Number(limit)
    });

    setName("");
    setDescription("");
    setLimit("");
    onSaved();
  };

  return (
    <div className="form-card fade-in">
      <h3>Novo Hub</h3>

      <div className="form-horizontal">
        <div className="form-group">
          <label>Nome</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Limite</label>
          <input
            type="number"
            value={limit}
            onChange={e =>
              setLimit(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>

        <div className="form-group form-full">
          <label>Descrição</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="form-action form-full">
          <button className="primary" onClick={submit}>
            Salvar Hub
          </button>
        </div>
      </div>
    </div>
  );
}
