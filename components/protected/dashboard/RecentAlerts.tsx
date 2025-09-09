import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Alert = {
  id: string;
  zone: string;
  level: "Advisory" | "Watch" | "Warning";
  window: string;
};

const sample: Alert[] = [
  { id: "A-1023", zone: "North Sector", level: "Watch", window: "Next 6h" },
  { id: "A-1024", zone: "Central", level: "Advisory", window: "Next 12h" },
  { id: "A-1025", zone: "Riverside", level: "Warning", window: "Ongoing" },
];

export default function RecentAlerts({
  alerts = sample,
}: {
  alerts?: Alert[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Window</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.id}</TableCell>
                <TableCell>{a.zone}</TableCell>
                <TableCell>
                  <span
                    className={
                      a.level === "Warning"
                        ? "text-red-600"
                        : a.level === "Watch"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }
                  >
                    {a.level}
                  </span>
                </TableCell>
                <TableCell>{a.window}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
