CREATE TABLE job_queue (
    job_id serial PRIMARY KEY,
    http_verb TEXT NOT NULL CHECK (http_verb IN ('GET', 'POST', 'DELETE')),
    payload jsonb,
    status TEXT NOT NULL DEFAULT '',
    retry_count INTEGER DEFAULT 0,
    retry_limit INTEGER DEFAULT 10,
    url_path TEXT DEFAULT '', 
    content TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE current_jobs (
    request_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL
);

CREATE TABLE workers (
    id SERIAL PRIMARY KEY,
    locked BOOLEAN NOT NULL DEFAULT FALSE
);
-- Adding two workers:
INSERT INTO workers (locked)
VALUES (FALSE), (FALSE);
-- You can also add a worker with:
INSERT INTO workers 
DEFAULT VALUES;
-- Adding 10 workers:
do $$
begin
execute (
    select string_agg('INSERT INTO workers DEFAULT VALUES',';')
    from generate_series(1,5)
);
end; 
$$;
