#!/usr/bin/env npx tsx
/**
 * Balance Simulator CLI Entry Point
 *
 * Monte Carlo simulation for game balance testing.
 *
 * Usage:
 *   pnpm sim                    # Run with defaults (10k runs)
 *   pnpm sim -r 50000           # 50k runs
 *   pnpm sim -m session         # Session mode with meta-progression
 *   pnpm sim --vitality 3       # Test with specific upgrades
 *
 * @module scripts/balance-sim
 */

import { parseCliArgs, mergeConfig } from './config.ts';
import { runSimulation } from './simulator.ts';
import { aggregateRunResults, aggregateSessionResults, analyzeBalance, analyzeSessionBalance } from './metrics.ts';
import {
  printConsoleReport,
  printProgress,
  clearProgress,
  writeJsonReport,
  writeMarkdownReport,
} from './reporters/index.ts';
import type { SimulationReport, RunResult, SessionResult, AggregatedStats } from './types.ts';

async function main(): Promise<void> {
  const startTime = Date.now();

  // Parse CLI arguments
  const args = process.argv.slice(2);
  const partialConfig = parseCliArgs(args);
  const config = mergeConfig(partialConfig);

  // Print header
  console.log('');
  console.log('  ⛏️  Balance Simulator');
  console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Mode: ${config.mode === 'single' ? 'Single Run' : 'Session'}`);
  if (config.mode === 'single') {
    console.log(`  Runs: ${config.runs.toLocaleString()}`);
  } else {
    console.log(`  Sessions: ${config.sessions} × ${config.runsPerSession} runs`);
  }
  console.log('');

  // Run simulation with progress reporting
  console.log('  Running simulation...');
  const results = runSimulation(config, (completed, total) => {
    printProgress(completed, total);
  });
  clearProgress();

  // Calculate duration
  const durationMs = Date.now() - startTime;
  console.log(`  ✓ Completed in ${(durationMs / 1000).toFixed(2)}s`);
  console.log('');

  // Aggregate stats and analyze balance
  let stats: AggregatedStats;
  let warnings;

  if (config.mode === 'single') {
    stats = aggregateRunResults(results as RunResult[]);
    warnings = analyzeBalance(stats);
  } else {
    stats = aggregateSessionResults(results as SessionResult[]);
    warnings = analyzeSessionBalance(stats);
  }

  // Build report
  const report: SimulationReport = {
    config,
    stats,
    warnings,
    timestamp: new Date().toISOString(),
    durationMs,
  };

  // Print console report
  printConsoleReport(report);

  // Generate output files
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const baseFilename = `balance-report-${timestamp}`;

  // Ensure reports directory exists
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const reportsDir = path.join(process.cwd(), 'reports');

  try {
    await fs.mkdir(reportsDir, { recursive: true });
  } catch {
    // Directory might already exist
  }

  // Write JSON and Markdown reports
  const jsonPath = path.join(reportsDir, `${baseFilename}.json`);
  const mdPath = path.join(reportsDir, `${baseFilename}.md`);

  await Promise.all([
    writeJsonReport(report, jsonPath),
    writeMarkdownReport(report, mdPath),
  ]);

  console.log('  📄 Reports generated:');
  console.log(`     ${jsonPath}`);
  console.log(`     ${mdPath}`);
  console.log('');

  // Exit with warning code if critical issues found
  const criticalWarnings = warnings.filter(w => w.severity === 'critical');
  if (criticalWarnings.length > 0) {
    console.log(`  ⚠️  ${criticalWarnings.length} critical balance issue(s) detected`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Simulation failed:', error);
  process.exit(1);
});
