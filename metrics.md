1. Effectiveness Metrics (Goal Achievement)
Effectiveness measures the accuracy and completeness with which users achieve specified goals. In your backend, this involves parsing binary or categorical success states.
•	Task Completion Rate (TCR)
o	Data Type: Binary integer (0 for fail, 1 for success) or Boolean.
o	Formula:
$$\text{TCR} = \left( \frac{\text{Number of Successful Tasks}}{\text{Total Number of Task Attempts}} \right) \times 100$$
o	Engineering Consideration: Your system must aggregate rows grouped by task_id and compute the mean of the success column.
•	Partial Success Rate
o	Data Type: Categorical or Float (0 = Fail, 0.5 = Partial, 1 = Full Success).
o	Formula:
$$\text{Partial Success Rate} = \left( \frac{\text{Number of Partially Completed Tasks}}{\text{Total Number of Task Attempts}} \right) \times 100$$
o	Engineering Consideration: Useful for multi-step workflows (e.g., checkout forms). Your data schema needs to accept an intermediate state between success and failure.
•	Error Rate (Error Frequency)
o	Data Type: Numeric Integer (Count of errors per user per task).
o	Metrics to compute: * Average Errors per Task: Total errors across all users divided by the number of users.
	Error Opportunity Rate: If a task has 5 potential error points, calculate how many occurred relative to the total opportunities.
2. Efficiency Metrics (Effort Expended)
Efficiency relates the effectiveness of a task to the resources (usually time or mental effort) expended to achieve it.
•	Time on Task (Task Duration)
o	Data Type: Continuous Float (seconds or milliseconds).
o	Data Analysis Consideration: Usability time data is almost always positively skewed (log-normal distribution), meaning a few users taking a very long time will distort the arithmetic mean. Your backend should automatically calculate both the Mean and the Median, or use a geometric mean for a truer representation of the central tendency.
o	Formulas to include:
	Average Time on Task: For successful tasks only.
	Time till Failure: How long users struggle before quitting.
•	Overall Relative Efficiency
o	Data Type: Float.
o	Formula: Compares the time spent by successful users against the total time spent by all users.
$$\text{Efficiency} = \frac{\sum_{i=1}^{N} \sum_{j=1}^{R} n_{ij} t_{ij}}{\sum_{i=1}^{N} \sum_{j=1}^{R} t_{ij}} \times 100\%$$
(Where $n_{ij}$ is the success of user $j$ on task $i$, and $t_{ij}$ is the time taken).
•	The "Lostness" Metric
o	Data Type: Float (ranges from 0 to 1, where scores above 0.4 indicate the user is lost).
o	Formula: Great for a data analysis feature. It calculates how much a user wandered through a website structure compared to the optimal path.
$$\text{Lostness} = \sqrt{\left(\frac{N}{R} - 1\right)^2 + \left(\frac{L}{R} - 1\right)^2}$$
	$N$ = Number of unique pages visited during the task.
	$R$ = Total number of pages visited (including repeats).
	$L$ = Minimum/optimal number of pages required to complete the task.
o	Engineering Consideration: Your upload file must capture the sequence of URLs or page identifiers (an array of steps) so your backend can calculate unique vs. total counts.
3. Satisfaction & Perceived Ease Metrics (Subjective Experience)
These are quantitative scores collected via post-task or post-test questionnaires within the data file.
•	Single Ease Question (SEQ)
o	Data Type: Ordinal Integer (1 to 7 scale asked immediately after a task).
o	Analysis Logic: Simple average distribution and frequency breakdown (e.g., percentage of users who rated it 6 or 7).
•	System Usability Scale (SUS)
o	Data Type: Array of 10 integers (each scaled 1 to 5).
o	The Algorithm Logic (Must be coded in your backend):
	For odd-numbered questions ($1, 3, 5, 7, 9$), subtract 1 from the user score $(X - 1)$.
	For even-numbered questions ($2, 4, 6, 8, 10$), subtract the user score from 5 $(5 - X)$.
	Sum the converted scores and multiply by 2.5 to get a normalized score out of 100.
o	Data Analysis Output: Calculate the mean SUS score across all participants. A score of 68 is the global benchmark average.

