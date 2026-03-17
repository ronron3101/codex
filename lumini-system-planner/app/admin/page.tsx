import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin/admin-console";
import { listAdminData } from "@/lib/admin-store";
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

  const data = listAdminData();
  const adminToken = token ?? "";

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-8 px-6 py-10">
      <h1 className="text-3xl font-semibold">Admin · LUMINI System Planner</h1>
      <p className="text-lumini-700">Manage fixture, cable, transformer, and threshold catalogs for trade users.</p>

      <AdminConsole token={adminToken} />

      <AdminTable
        title="Fixtures"
        headers={["SKU", "Name", "Wattage", "Supported Voltages"]}
        rows={data.fixtures.map((item) => [item.sku, item.name, `${item.wattage}W`, item.availableVoltages.join(", ")])}
      />

      <AdminTable
        title="Cables"
        headers={["Name", "Resistance Ω/m", "Max Current A"]}
        rows={data.cables.map((item) => [item.name, item.resistanceOhmPerMetre.toString(), `${item.maxRecommendedCurrent}`])}
      />

      <AdminTable
        title="Transformers"
        headers={["Name", "Size"]}
        rows={data.transformers.map((item) => [item.name, `${item.sizeWatt}W`])}
      />

      <AdminTable
        title="Rules"
        headers={["Default headroom", "Good threshold", "Caution threshold"]}
        rows={[[
          `${data.rules.defaultHeadroomPercent}%`,
          `<= ${data.rules.goodVoltageDropPercentMax}%`,
          `<= ${data.rules.cautionVoltageDropPercentMax}%`
        ]]}
      />
    </main>
  );
}

function AdminTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-2 text-xl font-medium">{title}</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b p-2 text-left font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${title}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${title}-${index}-${cellIndex}`} className="border-b p-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
