-- comment out if running for the first time
SELECT cron.unschedule('process_current_jobs_if_unlocked');
SELECT cron.unschedule('retry_failed_jobs');

SELECT cron.schedule(
    'process_current_jobs_if_unlocked',
    '*/30 * * * *',
    $$ SELECT process_current_jobs_if_unlocked(); $$
);

SELECT cron.schedule(
    'retry_failed_jobs',
    '* */6 * * *', 
    $$ SELECT retry_failed_jobs(); $$
);

SELECT * from cron.job;