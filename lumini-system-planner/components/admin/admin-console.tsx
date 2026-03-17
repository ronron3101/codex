"use client";

import { useState } from "react";

interface AdminConsoleProps {
  token: string;
}

export function AdminConsole({ token }: AdminConsoleProps) {
  const [message, setMessage] = useState<string>("");

  async function postResource(path: string, payload: Record<string, unknown>, method = "POST") {
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setMessage(`Update failed for ${path}`);
      return;
    }

    setMessage(`Saved via ${path}`);
  }

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="text-xl font-medium">Admin actions</h2>
      <p className="mt-2 text-sm text-lumini-700">Add or update catalog data from this protected panel.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <button
          className="rounded border px-3 py-2 text-left"
          type="button"
          onClick={() =>
            postResource("/api/admin/fixtures", {
              sku: `LUM-CUSTOM-${Date.now().toString().slice(-4)}`,
              name: "Custom Accent Fixture",
              wattage: 7,
              supportedVoltages: [12, 24]
            })
          }
        >
          Add sample fixture
        </button>

        <button
          className="rounded border px-3 py-2 text-left"
          type="button"
          onClick={() =>
            postResource("/api/admin/cables", {
              name: "8/2 Long-Run Cable",
              resistanceOhmPerMetre: 0.002061,
              maxRecommendedCurrent: 40
            })
          }
        >
          Add sample cable
        </button>

        <button
          className="rounded border px-3 py-2 text-left"
          type="button"
          onClick={() =>
            postResource("/api/admin/transformers", {
              name: "LUMINI 400W Transformer",
              sizeWatt: 400
            })
          }
        >
          Add sample transformer
        </button>

        <button
          className="rounded border px-3 py-2 text-left"
          type="button"
          onClick={() =>
            postResource(
              "/api/admin/rules",
              {
                defaultHeadroomPercent: 25,
                goodVoltageDropPercentMax: 3,
                cautionVoltageDropPercentMax: 8
              },
              "PUT"
            )
          }
        >
          Save default thresholds
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-lumini-700">{message}</p> : null}
    </section>
  );
}
