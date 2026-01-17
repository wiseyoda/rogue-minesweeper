/**
 * JSON reporter for simulation results.
 * @module scripts/balance-sim/reporters/json
 */

import type { SimulationReport } from '../types.ts';

/**
 * Generate JSON report string.
 */
export function generateJsonReport(report: SimulationReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Write JSON report to file.
 */
export async function writeJsonReport(
  report: SimulationReport,
  filepath: string
): Promise<void> {
  const fs = await import('node:fs/promises');
  await fs.writeFile(filepath, generateJsonReport(report), 'utf-8');
}
