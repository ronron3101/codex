import { redirect } from "next/navigation";
import { cables, fixtures, rules, transformers } from "@/lib/data/seed-data";
import { isAdminAuthorized } from "@/lib/auth";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;

  if (!isAdminAuthorized(token)) {
    redirect("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-8 px-6 py-10">
      <h1 className="text-3xl font-semibold">Admin · LUMINI System Planner</h1>
      <p className="text-lumini-700">Manage fixtures, cable library, transformer catalogue, and rule thresholds.</p>

      <AdminTable
        title="Fixtures"
        headers={["SKU", "Name", "Wattage", "Supported Voltages"]}
        rows={fixtures.map((item) => [item.sku, item.name, `${item.wattage}W`, item.availableVoltages.join(", ")])}
      />

      <AdminTable
        title="Cables"
        headers={["Name", "Resistance Ω/m", "Max Current A"]}
        rows={cables.map((item) => [item.name, item.resistanceOhmPerMetre.toString(), `${item.maxRecommendedCurrent}`])}
      />

      <AdminTable
        title="Transformers"
        headers={["Name", "Size"]}
        rows={transformers.map((item) => [item.name, `${item.sizeWatt}W`])}
      />

      <AdminTable
        title="Rules"
        headers={["Default headroom", "Good threshold", "Caution threshold"]}
        rows={[[`${rules.defaultHeadroomPercent}%`, `<= ${rules.goodVoltageDropPercentMax}%`, `<= ${rules.cautionVoltageDropPercentMax}%`]]}
      />
    </main>
  );
}

function AdminTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <section className="rounded border bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-medium">{title}</h2>
        <button className="rounded border px-3 py-1 text-sm">Add / Edit</button>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b p-2 text-left font-medium">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${title}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${title}-${index}-${cellIndex}`} className="border-b p-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
