export function formatDate(dateString, options = {}) {
  if (!dateString) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: options.withTime ? "short" : undefined,
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const diffInHours = Math.round((date.getTime() - Date.now()) / 3600000);

  if (Math.abs(diffInHours) < 24) {
    return new Intl.RelativeTimeFormat("id-ID", {
      numeric: "auto",
    }).format(diffInHours, "hour");
  }

  return new Intl.RelativeTimeFormat("id-ID", {
    numeric: "auto",
  }).format(Math.round(diffInHours / 24), "day");
}

export function formatRiskLabel(riskLevel) {
  const map = {
    rendah: "Risiko Rendah",
    sedang: "Risiko Sedang",
    tinggi: "Risiko Tinggi",
  };

  return map[riskLevel] ?? riskLevel;
}

export function formatScore(score) {
  return `${score ?? 0}/100`;
}

export function getRiskTone(riskLevel) {
  if (riskLevel === "tinggi") {
    return "danger";
  }

  if (riskLevel === "sedang") {
    return "warning";
  }

  return "success";
}

export function capitalizeWords(value = "") {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
