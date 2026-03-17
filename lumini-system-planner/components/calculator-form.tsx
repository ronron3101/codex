"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { calculatePlannerResult, calculateSplitRunScenario } from "@/lib/calculations/engine";
import { cables, fixtures, rules } from "@/lib/data/seed-data";
import type { CalculationResult } from "@/lib/models";
import { plannerSchema, type PlannerFormInput } from "@/lib/schemas/planner";

const stepLabels = ["System", "Fixtures", "Cable", "Transformer", "Result"];

export function CalculatorForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [splitHint, setSplitHint] = useState<CalculationResult | null>(null);
  const [calcError, setCalcError] = useState<string>("");

  const form = useForm<PlannerFormInput>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      projectType: "Residential Estate",
      voltage: 12,
      topology: "single_run",
      fixtures: [{ fixtureId: fixtures[0].id, quantity: 1 }],
      cableId: cables[0].id,
      runLengthMetres: 20,
      headroomPercent: rules.defaultHeadroomPercent,
      reserveCapacityWatt: 0
    }
  });

  const values = form.watch();

  const addFixture = () => {
    form.setValue("fixtures", [...values.fixtures, { fixtureId: fixtures[0].id, quantity: 1 }]);
  };

  const runCalculation = (data: PlannerFormInput) => {
    setCalcError("");
    try {
      const computed = calculatePlannerResult(data);
      const split = calculateSplitRunScenario(data, 2);
      setResult(computed);
      setSplitHint(split);
      setStep(5);
    } catch (error) {
      setCalcError(error instanceof Error ? error.message : "Calculation failed");
    }
  };

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-lumini-300 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">LUMINI System Planner</h1>
      <p className="mt-2 text-lumini-700">Professional low-voltage planning for specification and installation teams.</p>

      <ol className="mt-6 grid gap-2 text-xs uppercase tracking-wide text-lumini-700 md:grid-cols-5">
        {stepLabels.map((label, index) => {
          const itemStep = index + 1;
          return (
            <li
              key={label}
              className={`rounded border px-2 py-1 ${itemStep === step ? "border-lumini-900 text-lumini-900" : "border-lumini-300"}`}
            >
              {itemStep}. {label}
            </li>
          );
        })}
      </ol>

      <form onSubmit={form.handleSubmit(runCalculation)} className="mt-8 space-y-8">
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Step 1 · System setup</h2>
            <input className="w-full rounded border p-2" {...form.register("projectType")} placeholder="Project type" />
            <select className="w-full rounded border p-2" {...form.register("voltage", { valueAsNumber: true })}>
              <option value={12}>12V</option>
              <option value={24}>24V</option>
            </select>
            <select className="w-full rounded border p-2" {...form.register("topology")}>
              <option value="single_run">Single Run</option>
              <option value="tee">Tee</option>
              <option value="hub">Hub</option>
            </select>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Step 2 · Fixture load</h2>
            {values.fixtures.map((fixture, index) => (
              <div className="grid grid-cols-2 gap-3" key={`${fixture.fixtureId}-${index}`}>
                <select className="rounded border p-2" {...form.register(`fixtures.${index}.fixtureId`)}>
                  {fixtures.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} · {item.wattage}W
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="rounded border p-2"
                  {...form.register(`fixtures.${index}.quantity`, { valueAsNumber: true })}
                />
              </div>
            ))}
            <button type="button" className="rounded border px-3 py-2" onClick={addFixture}>
              Add fixture
            </button>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Step 3 · Cable and run</h2>
            <select className="w-full rounded border p-2" {...form.register("cableId")}>
              {cables.map((cable) => (
                <option key={cable.id} value={cable.id}>
                  {cable.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              className="w-full rounded border p-2"
              {...form.register("runLengthMetres", { valueAsNumber: true })}
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Step 4 · Transformer strategy</h2>
            <input
              type="number"
              min={0}
              className="w-full rounded border p-2"
              {...form.register("headroomPercent", { valueAsNumber: true })}
            />
            <input
              type="number"
              min={0}
              className="w-full rounded border p-2"
              {...form.register("reserveCapacityWatt", { valueAsNumber: true })}
              placeholder="Reserve capacity (W)"
            />
          </div>
        ) : null}

        {step === 5 && result ? (
          <div className="space-y-4" data-testid="result-panel">
            <h2 className="text-xl font-medium">Step 5 · Results</h2>
            <StatusBadge status={result.status} />
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <ResultCard label="Connected Load" value={`${result.totalConnectedLoadWatt} W`} />
              <ResultCard label="Design Load" value={`${result.designLoadWatt} W`} />
              <ResultCard label="Current Draw" value={`${result.currentDrawAmp} A`} />
              <ResultCard label="Voltage Drop" value={`${result.voltageDropPercent}%`} />
              <ResultCard label="Drop Voltage" value={`${result.voltageDropVolt} V`} />
              <ResultCard label="End-of-run Voltage" value={`${result.endOfRunVoltage} V`} />
            </div>
            <p className="rounded border border-lumini-300 bg-lumini-100 p-3">
              Transformer Recommendation: {result.transformerRecommendation?.name ?? "Custom engineering required"}
            </p>
            {splitHint ? (
              <p className="text-sm text-lumini-700">
                Split-run check (2 runs): estimated drop {splitHint.voltageDropPercent}%.
              </p>
            ) : null}
            <ul className="list-disc space-y-1 pl-6 text-lumini-700">
              {result.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
            <div className="grid gap-2 md:grid-cols-2">
              <button type="button" className="rounded bg-lumini-900 px-4 py-2 text-white">
                Email me this result
              </button>
              <button type="button" className="rounded border px-4 py-2">
                Download PDF
              </button>
              <button type="button" className="rounded border px-4 py-2">
                Request full fixture schedule
              </button>
              <button type="button" className="rounded border px-4 py-2">
                Send plans for review
              </button>
            </div>
          </div>
        ) : null}

        {calcError ? <p className="text-sm text-red-700">{calcError}</p> : null}

        <div className="flex gap-3">
          {step > 1 && step < 5 ? (
            <button type="button" className="rounded border px-4 py-2" onClick={() => setStep((value) => value - 1)}>
              Back
            </button>
          ) : null}
          {step < 4 ? (
            <button type="button" className="rounded bg-lumini-900 px-4 py-2 text-white" onClick={() => setStep((value) => value + 1)}>
              Continue
            </button>
          ) : null}
          {step === 4 ? (
            <button type="submit" className="rounded bg-lumini-900 px-4 py-2 text-white">
              Calculate
            </button>
          ) : null}
          {step === 5 ? (
            <button type="button" className="rounded border px-4 py-2" onClick={() => setStep(1)}>
              Start new plan
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-lumini-300 p-3">
      <p className="text-xs uppercase tracking-wide text-lumini-700">{label}</p>
      <p className="mt-1 text-base font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: CalculationResult["status"] }) {
  const className =
    status === "Good"
      ? "bg-emerald-100 text-emerald-900"
      : status === "Caution"
        ? "bg-amber-100 text-amber-900"
        : "bg-red-100 text-red-900";

  return <p className={`inline-flex rounded px-3 py-1 text-sm font-medium ${className}`}>Status: {status}</p>;
}
