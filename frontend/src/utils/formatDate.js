// "2026-11-10" ou "2026-11-10T09:30:00" -> "10/11/2026"
// (lê o texto direto, sem passar por Date, para o fuso não trocar o dia)
export function formatDate(date) {
  const match = String(date ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : "—";
}

// Data de hoje no formato do <input type="date">
export function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
