/**
 * Markdown reporter for simulation results.
 * @module scripts/balance-sim/reporters/markdown
 */

import type { SimulationReport, AggregatedStats, SessionAggregatedStats } from '../types.ts';

/**
 * Generate markdown report string.
 */
export function generateMarkdownReport(report: SimulationReport): string {
  const { stats, warnings, config, durationMs, timestamp } = report;
  const lines: string[] = [];

  // Title
  lines.push('# Balance Simulation Report');
  lines.push('');
  lines.push(`Generated: ${timestamp}`);
  lines.push('');

  // Configuration
  lines.push('## Configuration');
  lines.push('');
  lines.push('| Parameter | Value |');
  lines.push('|-----------|-------|');
  lines.push(`| Mode | ${config.mode === 'single' ? 'Single Run' : 'Session'} |`);
  if (config.mode === 'single') {
    lines.push(`| Total Runs | ${config.runs.toLocaleString()} |`);
  } else {
    lines.push(`| Sessions | ${config.sessions} |`);
    lines.push(`| Runs per Session | ${config.runsPerSession} |`);
  }
  lines.push(`| Duration | ${(durationMs / 1000).toFixed(2)}s |`);
  if (config.seed !== null) {
    lines.push(`| Seed | ${config.seed} |`);
  }
  lines.push(`| Starting Floor | ${config.startingFloor} |`);
  lines.push('');

  // Starting Upgrades
  const { startingUpgrades: upgrades } = config;
  if (upgrades.vitality > 0 || upgrades.fortune > 0 || upgrades.preparation > 0 ||
      upgrades.resilience > 0 || upgrades.firstClickSafety) {
    lines.push('### Starting Upgrades');
    lines.push('');
    lines.push('| Upgrade | Level |');
    lines.push('|---------|-------|');
    if (upgrades.vitality > 0) lines.push(`| Vitality | ${upgrades.vitality} |`);
    if (upgrades.fortune > 0) lines.push(`| Fortune | ${upgrades.fortune} |`);
    if (upgrades.preparation > 0) lines.push(`| Preparation | ${upgrades.preparation} |`);
    if (upgrades.resilience > 0) lines.push(`| Resilience | ${upgrades.resilience} |`);
    if (upgrades.firstClickSafety) lines.push(`| First Click Safety | ✓ |`);
    lines.push('');
  }

  // Floor Progression
  lines.push('## Floor Progression');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Mean | ${stats.floorReached.mean.toFixed(2)} |`);
  lines.push(`| Median | ${stats.floorReached.median.toFixed(1)} |`);
  lines.push(`| Min | ${stats.floorReached.min} |`);
  lines.push(`| Max | ${stats.floorReached.max} |`);
  lines.push(`| P10 | ${stats.floorReached.p10.toFixed(1)} |`);
  lines.push(`| P25 | ${stats.floorReached.p25.toFixed(1)} |`);
  lines.push(`| P75 | ${stats.floorReached.p75.toFixed(1)} |`);
  lines.push(`| P90 | ${stats.floorReached.p90.toFixed(1)} |`);
  lines.push(`| Std Dev | ${stats.floorReached.stdDev.toFixed(2)} |`);
  lines.push('');

  // Death Distribution
  lines.push('### Death Distribution');
  lines.push('');
  const deathFloors = Object.entries(stats.deathsByFloor)
    .map(([floor, count]) => ({ floor: parseInt(floor), count }))
    .sort((a, b) => a.floor - b.floor);

  if (deathFloors.length > 0) {
    lines.push('| Floor | Deaths | Percentage |');
    lines.push('|-------|--------|------------|');
    for (const { floor, count } of deathFloors.slice(0, 20)) {
      const percent = (count / stats.runCount * 100).toFixed(1);
      lines.push(`| ${floor} | ${count} | ${percent}% |`);
    }
    if (deathFloors.length > 20) {
      lines.push(`| ... | ... | ... |`);
    }
    lines.push('');
  }

  // Gold Economy
  lines.push('## Gold Economy');
  lines.push('');
  lines.push('### Per Run');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Mean | ${stats.goldPerRun.mean.toFixed(0)} |`);
  lines.push(`| Median | ${stats.goldPerRun.median.toFixed(0)} |`);
  lines.push(`| Min | ${stats.goldPerRun.min} |`);
  lines.push(`| Max | ${stats.goldPerRun.max} |`);
  lines.push(`| Std Dev | ${stats.goldPerRun.stdDev.toFixed(0)} |`);
  lines.push('');

  // Gold per floor
  const goldFloors = Object.entries(stats.goldPerFloor)
    .map(([floor, data]) => ({ floor: parseInt(floor), ...data }))
    .sort((a, b) => a.floor - b.floor);

  if (goldFloors.length > 0) {
    lines.push('### Gold by Floor');
    lines.push('');
    lines.push('| Floor | Avg Gold | Samples |');
    lines.push('|-------|----------|---------|');
    for (const { floor, mean, samples } of goldFloors.slice(0, 15)) {
      lines.push(`| ${floor} | ${mean.toFixed(0)} | ${samples} |`);
    }
    lines.push('');
  }

  // Item Statistics
  lines.push('## Item Statistics');
  lines.push('');
  lines.push('### Purchase Rates');
  lines.push('');
  lines.push('| Item | Rate (per run) |');
  lines.push('|------|----------------|');
  const itemRates = Object.entries(stats.itemPurchaseRate)
    .sort((a, b) => b[1] - a[1]);
  for (const [itemId, rate] of itemRates) {
    const flag = rate > 2 ? ' ⚠️' : rate < 0.1 ? ' ❓' : '';
    lines.push(`| ${itemId} | ${rate.toFixed(2)}${flag} |`);
  }
  lines.push('');

  // Survival Metrics
  lines.push('## Survival Metrics');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Avg Damage Blocked | ${stats.averageDamageBlocked.toFixed(2)} |`);
  lines.push(`| Avg Damage Taken | ${stats.averageDamageTaken.toFixed(2)} |`);
  lines.push('');

  // Survival rate by floor
  const survivalEntries = Object.entries(stats.survivalRateByFloor)
    .map(([floor, rate]) => ({ floor: parseInt(floor), rate }))
    .sort((a, b) => a.floor - b.floor);

  if (survivalEntries.length > 0) {
    lines.push('### Survival Rate by Floor');
    lines.push('');
    lines.push('| Floor | Survival Rate |');
    lines.push('|-------|---------------|');
    for (const { floor, rate } of survivalEntries.filter(e => e.floor <= 20 || e.floor % 5 === 0)) {
      const flag = rate < 0.1 ? ' 🔴' : rate < 0.3 ? ' 🟡' : '';
      lines.push(`| ${floor} | ${(rate * 100).toFixed(1)}%${flag} |`);
    }
    lines.push('');
  }

  // Session-specific stats
  if ('upgradeAdoptionRate' in stats) {
    const sessionStats = stats as SessionAggregatedStats;

    lines.push('## Meta-Progression (Session Mode)');
    lines.push('');

    // Upgrade adoption
    lines.push('### Upgrade Adoption');
    lines.push('');
    lines.push('| Upgrade | Purchases/Session |');
    lines.push('|---------|-------------------|');
    for (const [upgradeId, rate] of Object.entries(sessionStats.upgradeAdoptionRate)) {
      lines.push(`| ${upgradeId} | ${rate.toFixed(2)} |`);
    }
    lines.push('');

    // Estimated runs to max
    lines.push('### Estimated Runs to Max Upgrade');
    lines.push('');
    lines.push('| Upgrade | Est. Runs |');
    lines.push('|---------|-----------|');
    for (const [upgradeId, runs] of Object.entries(sessionStats.averageRunsToMaxUpgrade)) {
      lines.push(`| ${upgradeId} | ${runs.toFixed(0)} |`);
    }
    lines.push('');

    lines.push(`**Meta Gold Efficiency:** ${(sessionStats.metaGoldEfficiency * 100).toFixed(0)}%`);
    lines.push('');
  }

  // Warnings
  if (warnings.length > 0) {
    lines.push('## Balance Warnings');
    lines.push('');
    for (const warning of warnings) {
      const icon = warning.severity === 'critical' ? '🔴' :
                   warning.severity === 'warning' ? '🟡' : '🔵';
      lines.push(`- ${icon} **${warning.category}**: ${warning.message}`);
    }
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(`*Report generated by Balance Simulator*`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Write markdown report to file.
 */
export async function writeMarkdownReport(
  report: SimulationReport,
  filepath: string
): Promise<void> {
  const fs = await import('node:fs/promises');
  await fs.writeFile(filepath, generateMarkdownReport(report), 'utf-8');
}
