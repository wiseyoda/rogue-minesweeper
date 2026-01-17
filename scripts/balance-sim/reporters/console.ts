/**
 * Console reporter for simulation results.
 * @module scripts/balance-sim/reporters/console
 */

import type { SimulationReport, AggregatedStats, BalanceWarning } from '../types.ts';

/**
 * ANSI color codes for terminal output.
 */
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Format a number with fixed decimals and padding.
 */
function fmt(n: number, decimals: number = 1, width: number = 8): string {
  return n.toFixed(decimals).padStart(width);
}

/**
 * Print a horizontal line.
 */
function line(char: string = '─', length: number = 60): string {
  return char.repeat(length);
}

/**
 * Generate console report output.
 */
export function generateConsoleReport(report: SimulationReport): string {
  const { stats, warnings, config, durationMs } = report;
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push(`${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  lines.push(`${colors.bold}${colors.cyan}║           BALANCE SIMULATION REPORT                        ║${colors.reset}`);
  lines.push(`${colors.bold}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  lines.push('');

  // Configuration summary
  lines.push(`${colors.bold}Configuration${colors.reset}`);
  lines.push(line());
  lines.push(`  Mode: ${config.mode === 'single' ? 'Single Run' : 'Session'}`);
  lines.push(`  Runs: ${config.mode === 'single' ? config.runs.toLocaleString() : `${config.sessions} sessions × ${config.runsPerSession} runs`}`);
  lines.push(`  Duration: ${(durationMs / 1000).toFixed(2)}s`);
  if (config.seed !== null) {
    lines.push(`  Seed: ${config.seed}`);
  }
  lines.push('');

  // Floor Progression
  lines.push(`${colors.bold}Floor Progression${colors.reset}`);
  lines.push(line());
  lines.push(`  Mean:   ${fmt(stats.floorReached.mean, 2)}`);
  lines.push(`  Median: ${fmt(stats.floorReached.median, 1)}`);
  lines.push(`  Range:  ${stats.floorReached.min} - ${stats.floorReached.max}`);
  lines.push(`  P10:    ${fmt(stats.floorReached.p10, 1)}    P90: ${fmt(stats.floorReached.p90, 1)}`);
  lines.push(`  StdDev: ${fmt(stats.floorReached.stdDev, 2)}`);
  lines.push('');

  // Death distribution (top 10 floors)
  lines.push(`${colors.bold}Death Distribution${colors.reset}`);
  lines.push(line());
  const deathFloors = Object.entries(stats.deathsByFloor)
    .map(([floor, count]) => ({ floor: parseInt(floor), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  for (const { floor, count } of deathFloors) {
    const percent = (count / stats.runCount * 100).toFixed(1);
    const bar = '█'.repeat(Math.ceil(parseFloat(percent) / 3));
    lines.push(`  Floor ${floor.toString().padStart(2)}: ${percent.padStart(5)}% ${colors.dim}${bar}${colors.reset}`);
  }
  lines.push('');

  // Gold Economy
  lines.push(`${colors.bold}Gold Economy${colors.reset}`);
  lines.push(line());
  lines.push(`  Per Run (mean):   ${fmt(stats.goldPerRun.mean, 0)}`);
  lines.push(`  Per Run (median): ${fmt(stats.goldPerRun.median, 0)}`);
  lines.push(`  Range:            ${stats.goldPerRun.min} - ${stats.goldPerRun.max}`);
  lines.push('');

  // Gold per floor (first 10 floors with data)
  const goldFloors = Object.entries(stats.goldPerFloor)
    .map(([floor, data]) => ({ floor: parseInt(floor), ...data }))
    .sort((a, b) => a.floor - b.floor)
    .slice(0, 10);

  if (goldFloors.length > 0) {
    lines.push(`  ${colors.dim}Gold by Floor:${colors.reset}`);
    for (const { floor, mean, samples } of goldFloors) {
      lines.push(`    Floor ${floor.toString().padStart(2)}: ${fmt(mean, 0)} avg (n=${samples})`);
    }
    lines.push('');
  }

  // Item Statistics
  lines.push(`${colors.bold}Item Purchase Rates${colors.reset}`);
  lines.push(line());
  const itemRates = Object.entries(stats.itemPurchaseRate)
    .sort((a, b) => b[1] - a[1]);

  for (const [itemId, rate] of itemRates) {
    const indicator = rate > 2 ? colors.yellow : rate < 0.2 ? colors.dim : '';
    lines.push(`  ${indicator}${itemId.padEnd(15)}: ${rate.toFixed(2)} per run${colors.reset}`);
  }
  lines.push('');

  // Survival Metrics
  lines.push(`${colors.bold}Survival Metrics${colors.reset}`);
  lines.push(line());
  lines.push(`  Avg Damage Blocked: ${fmt(stats.averageDamageBlocked, 2)}`);
  lines.push(`  Avg Damage Taken:   ${fmt(stats.averageDamageTaken, 2)}`);
  lines.push('');

  // Survival rate by floor (key floors)
  const survivalFloors = [1, 3, 5, 7, 10, 15, 20];
  lines.push(`  ${colors.dim}Survival Rate by Floor:${colors.reset}`);
  for (const floor of survivalFloors) {
    const rate = stats.survivalRateByFloor[floor];
    if (rate !== undefined) {
      const color = rate < 0.1 ? colors.red : rate < 0.5 ? colors.yellow : colors.green;
      lines.push(`    Floor ${floor.toString().padStart(2)}: ${color}${(rate * 100).toFixed(1)}%${colors.reset}`);
    }
  }
  lines.push('');

  // Warnings
  if (warnings.length > 0) {
    lines.push(`${colors.bold}Balance Warnings${colors.reset}`);
    lines.push(line());
    for (const warning of warnings) {
      const icon = warning.severity === 'critical' ? `${colors.red}⚠` :
                   warning.severity === 'warning' ? `${colors.yellow}⚡` :
                   `${colors.blue}ℹ`;
      lines.push(`  ${icon} ${warning.message}${colors.reset}`);
    }
    lines.push('');
  }

  // Footer
  lines.push(`${colors.dim}${line()}${colors.reset}`);
  lines.push(`${colors.dim}Generated: ${report.timestamp}${colors.reset}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Print report to console.
 */
export function printConsoleReport(report: SimulationReport): void {
  console.log(generateConsoleReport(report));
}

/**
 * Print a single warning.
 */
export function printWarning(warning: BalanceWarning): void {
  const icon = warning.severity === 'critical' ? `${colors.red}⚠` :
               warning.severity === 'warning' ? `${colors.yellow}⚡` :
               `${colors.blue}ℹ`;
  console.log(`${icon} ${warning.message}${colors.reset}`);
}

/**
 * Print progress update.
 */
export function printProgress(completed: number, total: number): void {
  const percent = ((completed / total) * 100).toFixed(0);
  process.stdout.write(`\r  Progress: ${completed.toLocaleString()} / ${total.toLocaleString()} (${percent}%)`);
}

/**
 * Clear progress line.
 */
export function clearProgress(): void {
  process.stdout.write('\r' + ' '.repeat(60) + '\r');
}
