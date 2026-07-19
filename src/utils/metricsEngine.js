import Papa from 'papaparse';

// Helper to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Helper to generate a random float between min and max
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

// Generate sample data as a CSV string
export function generateSampleCSV(numUsers = 50, tasks = ['Task_A', 'Task_B', 'Task_C']) {
  const data = [];
  
  for (let i = 1; i <= numUsers; i++) {
    const userId = `user_${String(i).padStart(3, '0')}`;
    
    tasks.forEach(taskId => {
      // Success state: 0 (Fail), 0.5 (Partial), 1 (Success)
      const successRand = Math.random();
      const success_state = successRand > 0.8 ? 0 : successRand > 0.6 ? 0.5 : 1;
      
      const error_count = success_state === 1 ? getRandomInt(0, 2) : getRandomInt(2, 6);
      const time_on_task_seconds = success_state === 1 ? getRandomFloat(30, 120) : getRandomFloat(90, 300);
      
      const optimal_path_length = taskId === 'Task_A' ? 4 : taskId === 'Task_B' ? 6 : 3;
      const pages_visited_unique = optimal_path_length + getRandomInt(0, 3);
      const pages_visited_total = pages_visited_unique + getRandomInt(0, 5);
      
      const seq_score = success_state === 1 ? getRandomInt(5, 7) : getRandomInt(1, 4);
      
      // SUS is 10 questions, each 1-5
      const sus_scores = Array.from({ length: 10 }, () => getRandomInt(1, 5)).join('|');

      data.push({
        user_id: userId,
        task_id: taskId,
        success_state,
        error_count,
        time_on_task_seconds: time_on_task_seconds.toFixed(2),
        pages_visited_total,
        pages_visited_unique,
        optimal_path_length,
        seq_score,
        sus_scores
      });
    });
  }
  
  return Papa.unparse(data);
}

// Process an array of UX records into aggregated metrics
export function processUXRecords(data) {
  const tasks = {};
  let totalSUSSum = 0;
  let totalSUSUsers = 0;
  // To compute global mean SUS, we need 1 per user, but let's just average all SUS scores in the dataset
  // A better way is per user_id, but assuming SUS is post-test, usually it's one per user.
  // Our schema generates one per task, let's just treat each row as a session and average all SUS.
  
  data.forEach(row => {
    const t = row.task_id;
    if (!tasks[t]) {
      tasks[t] = {
        attempts: 0,
        successes: 0,
        partials: 0,
        errors: 0,
        successTimeSum: 0,
        totalTimeSum: 0,
        efficiencyNumerator: 0,
        lostnessSum: 0,
        seqSum: 0
      };
    }
    
    tasks[t].attempts += 1;
    if (row.success_state === 1) tasks[t].successes += 1;
    if (row.success_state === 0.5) tasks[t].partials += 1;
    
    tasks[t].errors += row.error_count;
    
    const time = parseFloat(row.time_on_task_seconds);
    tasks[t].totalTimeSum += time;
    if (row.success_state === 1) {
      tasks[t].successTimeSum += time;
    }
    
    // Efficiency numerator: sum(n_ij * t_ij)
    tasks[t].efficiencyNumerator += row.success_state * time;
    
    // Lostness formula: sqrt((N/R - 1)^2 + (L/R - 1)^2)
    const N = row.pages_visited_unique;
    const R = row.pages_visited_total;
    const L = row.optimal_path_length;
    const lostness = Math.sqrt(Math.pow((N/R - 1), 2) + Math.pow((L/R - 1), 2));
    tasks[t].lostnessSum += lostness;
    
    tasks[t].seqSum += row.seq_score;
    
    // SUS Processing
    if (row.sus_scores) {
      const susArray = String(row.sus_scores).split('|').map(Number);
      if (susArray.length === 10) {
        let susScore = 0;
        susArray.forEach((x, index) => {
          const qNum = index + 1;
          if (qNum % 2 !== 0) {
            // Odd: X - 1
            susScore += (x - 1);
          } else {
            // Even: 5 - X
            susScore += (5 - x);
          }
        });
        susScore *= 2.5;
        totalSUSSum += susScore;
        totalSUSUsers += 1;
      }
    }
  });

  const processedTasks = [];
  let globalTCRSum = 0;
  let globalEffNum = 0;
  let globalEffDen = 0;
  let globalLostnessSum = 0;
  let globalSeqSum = 0;
  let totalRows = 0;
  
  for (const [taskId, stats] of Object.entries(tasks)) {
    const TCR = (stats.successes / stats.attempts) * 100;
    const partialRate = (stats.partials / stats.attempts) * 100;
    const failRate = 100 - TCR - partialRate;
    const avgErrors = stats.errors / stats.attempts;
    
    const avgSuccessTime = stats.successes > 0 ? stats.successTimeSum / stats.successes : 0;
    const relativeEfficiency = stats.totalTimeSum > 0 ? (stats.efficiencyNumerator / stats.totalTimeSum) * 100 : 0;
    
    const avgLostness = stats.lostnessSum / stats.attempts;
    const avgSeq = stats.seqSum / stats.attempts;
    
    processedTasks.push({
      taskId,
      TCR,
      partialRate,
      failRate,
      avgErrors,
      avgSuccessTime,
      relativeEfficiency,
      avgLostness,
      avgSeq
    });
    
    globalTCRSum += TCR;
    globalEffNum += stats.efficiencyNumerator;
    globalEffDen += stats.totalTimeSum;
    globalLostnessSum += stats.lostnessSum;
    globalSeqSum += stats.seqSum;
    totalRows += stats.attempts;
  }
  
  const numTasks = processedTasks.length;
  
  const globalKPIs = {
    avgTCR: numTasks > 0 ? globalTCRSum / numTasks : 0,
    overallEfficiency: globalEffDen > 0 ? (globalEffNum / globalEffDen) * 100 : 0,
    avgLostness: totalRows > 0 ? globalLostnessSum / totalRows : 0,
    avgSeq: totalRows > 0 ? globalSeqSum / totalRows : 0,
    avgSUS: totalSUSUsers > 0 ? totalSUSSum / totalSUSUsers : null
  };

  return { tasks: processedTasks, globalKPIs };
}
