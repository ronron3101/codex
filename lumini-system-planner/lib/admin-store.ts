import { randomUUID } from "node:crypto";
import { cables, fixtures, rules, transformers } from "@/lib/data/seed-data";
import type { Cable, CalculationRules, Fixture, Transformer } from "@/lib/models";

const fixtureStore: Fixture[] = [...fixtures];
const cableStore: Cable[] = [...cables];
const transformerStore: Transformer[] = [...transformers];
let ruleStore: CalculationRules = { ...rules };

export function listAdminData() {
  return {
    fixtures: fixtureStore,
    cables: cableStore,
    transformers: transformerStore,
    rules: ruleStore
  };
}

export function createFixture(input: Omit<Fixture, "id">): Fixture {
  const entry = { ...input, id: randomUUID() };
  fixtureStore.push(entry);
  return entry;
}

export function createCable(input: Omit<Cable, "id">): Cable {
  const entry = { ...input, id: randomUUID() };
  cableStore.push(entry);
  return entry;
}

export function createTransformer(input: Omit<Transformer, "id">): Transformer {
  const entry = { ...input, id: randomUUID() };
  transformerStore.push(entry);
  return entry;
}

export function updateRules(input: CalculationRules): CalculationRules {
  ruleStore = { ...input };
  return ruleStore;
}
