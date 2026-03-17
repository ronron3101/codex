import type { RecommendationContext } from "@/lib/models";

export function buildRecommendations(context: RecommendationContext): string[] {
  const recommendations: string[] = [];

  if (!context.hasTransformerCapacity) {
    recommendations.push("Design load exceeds 300W. Break the project into multiple transformer zones.");
  }

  if (context.currentDrawAmp > context.maxRecommendedCurrent) {
    recommendations.push("Cable ampacity is exceeded. Select a larger cable to reduce heat and losses.");
  }

  if (context.status !== "Good") {
    recommendations.push("Shorten run length or split fixtures across multiple runs to recover voltage margin.");
  }

  if (context.status === "Not Recommended") {
    recommendations.push("Current voltage drop is outside trade best-practice. Rework topology before procurement.");
  }

  if (context.voltage === 12 && context.voltageDropPercent > 5) {
    recommendations.push("Move to 24V architecture for long-run efficiency and better terminal voltage stability.");
  }

  if (context.topology === "single_run" && context.voltageDropPercent > 3) {
    recommendations.push("Use tee or hub topology to improve consistency across fixture branches.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Design is within recommended tolerance. Proceed to fixture schedule and quote documentation.");
  }

  return recommendations;
}
