import { Badge } from "../ui/Badge";

export function RiskBadge({ riskLevel }) {
  if (riskLevel === "tinggi") {
    return <Badge tone="danger">Risiko Tinggi</Badge>;
  }

  if (riskLevel === "sedang") {
    return <Badge tone="warning">Risiko Sedang</Badge>;
  }

  return <Badge tone="success">Risiko Rendah</Badge>;
}
