/** Builds an RFC-4180-ish CSV string (quotes fields containing commas/quotes/newlines) and triggers a client-side download via a Blob URL. */
export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escape = (value: string | number): string => {
    const str = String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const lines = [headers, ...rows].map((row) => row.map(escape).join(","));
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
