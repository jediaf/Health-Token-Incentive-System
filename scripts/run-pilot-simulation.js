/**
 * Enhanced Pilot Simulation Script - 14-Day Health Token Study
 * Simulates Control Group vs Incentive Group behavior
 * Generates realistic data with batch submission logic for academic report
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SIMULATION_CONFIG = {
    duration: 14, // days
    controlGroupSize: 10,
    incentiveGroupSize: 10,
    baseChurnRate: 0.05, // 5% daily churn for control group
    incentiveCompliance: 0.92, // 92% compliance for incentive group
    batchSubmissionProbability: 0.75, // 75% chance of batch submission
};

// Reward decay rules (as per business logic)
const REWARD_DECAY = [5, 3, 2]; // 1st, 2nd, 3rd+ logs
const COMPLETENESS_BONUS = 1.5;
const PARTIAL_MULTIPLIER = 0.5;

// User behavior profiles
const BEHAVIOR_PROFILES = {
    MORNING: { name: 'morning', primaryWindow: 0, weight: 0.7 },
    EVENING: { name: 'evening', primaryWindow: 2, weight: 0.7 },
    MIXED: { name: 'mixed', primaryWindow: null, weight: 0.33 },
};

// Realistic time windows for logging (hours)
const TIME_WINDOWS = [
    { start: 7, end: 10, weight: 0.4, name: 'morning' }, // Morning
    { start: 12, end: 14, weight: 0.2, name: 'lunch' }, // Lunch
    { start: 19, end: 23, weight: 0.4, name: 'evening' }, // Evening
];

/**
 * Assign behavior profile to user
 */
function assignBehaviorProfile() {
    const rand = Math.random();
    if (rand < 0.35) return BEHAVIOR_PROFILES.MORNING;
    if (rand < 0.70) return BEHAVIOR_PROFILES.EVENING;
    return BEHAVIOR_PROFILES.MIXED;
}

/**
 * Generate realistic timestamp within a day based on user profile
 */
function generateRealisticTimestamp(dayIndex, behaviorProfile, baseTimestamp = null) {
    const baseDate = new Date('2026-01-01');
    baseDate.setDate(baseDate.getDate() + dayIndex);

    let selectedWindow;

    if (behaviorProfile.primaryWindow !== null) {
        // User has a preferred time window
        if (Math.random() < behaviorProfile.weight) {
            selectedWindow = TIME_WINDOWS[behaviorProfile.primaryWindow];
        } else {
            // Occasionally log at other times
            const otherWindows = TIME_WINDOWS.filter((_, i) => i !== behaviorProfile.primaryWindow);
            selectedWindow = otherWindows[Math.floor(Math.random() * otherWindows.length)];
        }
    } else {
        // Mixed profile - pick randomly based on weights
        const rand = Math.random();
        let cumWeight = 0;
        selectedWindow = TIME_WINDOWS[0];

        for (const window of TIME_WINDOWS) {
            cumWeight += window.weight;
            if (rand <= cumWeight) {
                selectedWindow = window;
                break;
            }
        }
    }

    // If this is a batch submission, use base timestamp with slight offset
    if (baseTimestamp) {
        const base = new Date(baseTimestamp);
        // Add 1-10 minutes for batch entries
        base.setMinutes(base.getMinutes() + Math.floor(Math.random() * 10) + 1);
        return base.toISOString();
    }

    // Random hour and minute within window
    const hour = selectedWindow.start + Math.floor(Math.random() * (selectedWindow.end - selectedWindow.start));
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    baseDate.setHours(hour, minute, second);
    return baseDate.toISOString();
}

/**
 * Generate realistic health metrics with user baseline
 */
function generateHealthMetrics(userBaseline) {
    // Add variance around user's baseline
    const steps = Math.floor(userBaseline.steps + (Math.random() - 0.5) * 4000);
    const water = parseFloat((userBaseline.water + (Math.random() - 0.5) * 1.0).toFixed(1));
    const sleep = parseFloat((userBaseline.sleep + (Math.random() - 0.5) * 2.0).toFixed(1));

    return {
        steps: Math.max(3000, Math.min(15000, steps)),
        water: Math.max(1.2, Math.min(3.5, water)),
        sleep: Math.max(5.5, Math.min(9.0, sleep)),
    };
}

/**
 * Generate user baseline (natural tendencies)
 */
function generateUserBaseline() {
    return {
        steps: 7000 + Math.random() * 5000, // 7K-12K baseline
        water: 2.0 + Math.random() * 1.0, // 2.0-3.0L baseline
        sleep: 6.5 + Math.random() * 1.5, // 6.5-8.0h baseline
    };
}

/**
 * Calculate reward based on log count and completeness
 */
function calculateReward(logCountToday, isComplete = true) {
    let baseReward;
    if (logCountToday === 0) {
        baseReward = REWARD_DECAY[0]; // 5 HLT
    } else if (logCountToday === 1) {
        baseReward = REWARD_DECAY[1]; // 3 HLT
    } else {
        baseReward = REWARD_DECAY[2]; // 2 HLT
    }

    const multiplier = isComplete ? COMPLETENESS_BONUS : PARTIAL_MULTIPLIER;
    return baseReward * multiplier;
}

/**
 * Simulate a single user's behavior over 14 days
 */
function simulateUser(userId, isIncentiveGroup) {
    const logs = [];
    let totalTokens = 0;
    let activeDays = 0;
    let batchSubmissions = 0;
    let partialSubmissions = 0;

    // Assign user characteristics
    const behaviorProfile = assignBehaviorProfile();
    const userBaseline = generateUserBaseline();

    for (let day = 0; day < SIMULATION_CONFIG.duration; day++) {
        let willLog = false;

        if (isIncentiveGroup) {
            // Incentive group: high compliance with slight variance
            willLog = Math.random() < SIMULATION_CONFIG.incentiveCompliance;
        } else {
            // Control group: decreasing probability (churn)
            const churnFactor = Math.pow(1 - SIMULATION_CONFIG.baseChurnRate, day);
            const baseProb = 0.7; // Start with 70% engagement
            willLog = Math.random() < (baseProb * churnFactor);
        }

        if (willLog) {
            // Determine if this is a batch submission
            const isBatchSubmission = Math.random() < SIMULATION_CONFIG.batchSubmissionProbability;

            if (isBatchSubmission) {
                // Log all three metrics together (complete submission)
                const baseTimestamp = generateRealisticTimestamp(day, behaviorProfile);
                const metrics = generateHealthMetrics(userBaseline);

                const logsToday = logs.filter(log => {
                    const logDate = new Date(log.timestamp).toDateString();
                    const currentDate = new Date(baseTimestamp).toDateString();
                    return logDate === currentDate;
                }).length;

                let tokensEarned = 0;
                if (isIncentiveGroup) {
                    tokensEarned = calculateReward(logsToday, true); // Complete submission
                    totalTokens += tokensEarned;
                }

                logs.push({
                    day: day + 1,
                    timestamp: baseTimestamp,
                    ...metrics,
                    tokensEarned,
                    isComplete: true,
                    batchId: `batch_${day}_${logs.length}`,
                });

                batchSubmissions++;
                activeDays++;
            } else {
                // Partial submission (1-2 metrics)
                const numMetrics = Math.random() < 0.5 ? 1 : 2;
                const baseTimestamp = generateRealisticTimestamp(day, behaviorProfile);
                const metrics = generateHealthMetrics(userBaseline);

                // Randomly select which metrics to include
                const partialMetrics = {};
                const metricKeys = ['steps', 'water', 'sleep'];
                const selectedKeys = metricKeys.sort(() => Math.random() - 0.5).slice(0, numMetrics);

                selectedKeys.forEach(key => {
                    partialMetrics[key] = metrics[key];
                });

                const logsToday = logs.filter(log => {
                    const logDate = new Date(log.timestamp).toDateString();
                    const currentDate = new Date(baseTimestamp).toDateString();
                    return logDate === currentDate;
                }).length;

                let tokensEarned = 0;
                if (isIncentiveGroup) {
                    tokensEarned = calculateReward(logsToday, false); // Partial submission
                    totalTokens += tokensEarned;
                }

                logs.push({
                    day: day + 1,
                    timestamp: baseTimestamp,
                    steps: partialMetrics.steps || null,
                    water: partialMetrics.water || null,
                    sleep: partialMetrics.sleep || null,
                    tokensEarned,
                    isComplete: false,
                    batchId: null,
                });

                partialSubmissions++;
                activeDays++;
            }
        }
    }

    return {
        userId,
        group: isIncentiveGroup ? 'incentive' : 'control',
        behaviorProfile: behaviorProfile.name,
        logs,
        totalTokens,
        activeDays,
        complianceRate: (activeDays / SIMULATION_CONFIG.duration) * 100,
        batchSubmissions,
        partialSubmissions,
        batchRate: activeDays > 0 ? (batchSubmissions / activeDays) * 100 : 0,
    };
}

/**
 * Run full simulation
 */
function runSimulation() {
    console.log('🚀 Starting Enhanced 14-Day Pilot Simulation...\n');

    const results = {
        metadata: {
            simulationDate: new Date().toISOString(),
            duration: SIMULATION_CONFIG.duration,
            controlGroupSize: SIMULATION_CONFIG.controlGroupSize,
            incentiveGroupSize: SIMULATION_CONFIG.incentiveGroupSize,
            batchSubmissionEnabled: true,
        },
        controlGroup: [],
        incentiveGroup: [],
        summary: {},
    };

    // Simulate control group
    console.log('📊 Simulating Control Group (No Tokens)...');
    for (let i = 0; i < SIMULATION_CONFIG.controlGroupSize; i++) {
        const user = simulateUser(`C${String(i + 1).padStart(3, '0')}`, false);
        results.controlGroup.push(user);
        console.log(`  User ${user.userId}: ${user.activeDays}/${SIMULATION_CONFIG.duration} days active (${user.behaviorProfile})`);
    }

    // Simulate incentive group
    console.log('\n💰 Simulating Incentive Group (With Tokens)...');
    for (let i = 0; i < SIMULATION_CONFIG.incentiveGroupSize; i++) {
        const user = simulateUser(`I${String(i + 1).padStart(3, '0')}`, true);
        results.incentiveGroup.push(user);
        console.log(`  User ${user.userId}: ${user.activeDays}/${SIMULATION_CONFIG.duration} days, ${user.totalTokens.toFixed(1)} HLT, ${user.batchRate.toFixed(0)}% batch (${user.behaviorProfile})`);
    }

    // Calculate summary statistics
    const controlCompliance = results.controlGroup.reduce((sum, u) => sum + u.complianceRate, 0) / results.controlGroup.length;
    const incentiveCompliance = results.incentiveGroup.reduce((sum, u) => sum + u.complianceRate, 0) / results.incentiveGroup.length;
    const totalTokensDistributed = results.incentiveGroup.reduce((sum, u) => sum + u.totalTokens, 0);
    const avgBatchRate = results.incentiveGroup.reduce((sum, u) => sum + u.batchRate, 0) / results.incentiveGroup.length;

    results.summary = {
        controlGroupCompliance: parseFloat(controlCompliance.toFixed(2)),
        incentiveGroupCompliance: parseFloat(incentiveCompliance.toFixed(2)),
        complianceImprovement: parseFloat((incentiveCompliance - controlCompliance).toFixed(2)),
        totalTokensDistributed: parseFloat(totalTokensDistributed.toFixed(1)),
        averageTokensPerUser: parseFloat((totalTokensDistributed / results.incentiveGroup.length).toFixed(1)),
        averageBatchSubmissionRate: parseFloat(avgBatchRate.toFixed(2)),
    };

    // Generate daily aggregates for charts
    results.dailyMetrics = [];
    for (let day = 1; day <= SIMULATION_CONFIG.duration; day++) {
        const controlActive = results.controlGroup.filter(u =>
            u.logs.some(log => log.day === day)
        ).length;
        const incentiveActive = results.incentiveGroup.filter(u =>
            u.logs.some(log => log.day === day)
        ).length;

        const tokensToday = results.incentiveGroup.reduce((sum, user) => {
            const dayLogs = user.logs.filter(log => log.day === day);
            return sum + dayLogs.reduce((s, log) => s + log.tokensEarned, 0);
        }, 0);

        const batchLogsToday = results.incentiveGroup.reduce((sum, user) => {
            return sum + user.logs.filter(log => log.day === day && log.isComplete).length;
        }, 0);

        const totalLogsToday = results.incentiveGroup.reduce((sum, user) => {
            return sum + user.logs.filter(log => log.day === day).length;
        }, 0);

        results.dailyMetrics.push({
            day,
            controlCompliance: parseFloat(((controlActive / SIMULATION_CONFIG.controlGroupSize) * 100).toFixed(1)),
            incentiveCompliance: parseFloat(((incentiveActive / SIMULATION_CONFIG.incentiveGroupSize) * 100).toFixed(1)),
            tokensDistributed: parseFloat(tokensToday.toFixed(1)),
            batchSubmissionRate: totalLogsToday > 0 ? parseFloat(((batchLogsToday / totalLogsToday) * 100).toFixed(1)) : 0,
        });
    }

    // Save to public directory
    const outputPath = path.join(__dirname, '..', 'public', 'simulation_results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log('\n✅ Simulation Complete!');
    console.log('\n📈 Summary Statistics:');
    console.log(`  Control Group Compliance: ${results.summary.controlGroupCompliance}%`);
    console.log(`  Incentive Group Compliance: ${results.summary.incentiveGroupCompliance}%`);
    console.log(`  Improvement: +${results.summary.complianceImprovement}%`);
    console.log(`  Total Tokens Distributed: ${results.summary.totalTokensDistributed} HLT`);
    console.log(`  Average per User: ${results.summary.averageTokensPerUser} HLT`);
    console.log(`  Average Batch Submission Rate: ${results.summary.averageBatchSubmissionRate}%`);
    console.log(`\n💾 Results saved to: ${outputPath}`);
}

// Run simulation
runSimulation();
