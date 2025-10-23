# Supabase Setup for Field Service

This document contains the SQL commands needed to set up the vector database for the Akashic Field Service.

## Prerequisites

- Supabase project created
- Access to Supabase SQL Editor
- Service role key configured in Vercel environment variables

## SQL Setup Commands

Run these commands in your Supabase SQL Editor (in order):

### 1. Enable pgvector Extension

```sql
create extension if not exists vector;
```

### 2. Create field_vectors Table

```sql
create table if not exists field_vectors (
  id uuid primary key default gen_random_uuid(),
  node_id text not null,
  embedding vector(1536) not null,
  element text not null,
  archetype text not null,
  created_at timestamptz default now()
);

-- Add indexes for performance
create index if not exists field_vectors_node_id_idx on field_vectors(node_id);
create index if not exists field_vectors_element_idx on field_vectors(element);
create index if not exists field_vectors_archetype_idx on field_vectors(archetype);
create index if not exists field_vectors_created_at_idx on field_vectors(created_at);

-- Create vector similarity index (IVFFlat for better performance)
create index if not exists field_vectors_embedding_idx
  on field_vectors
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
```

### 3. Create match_field_vectors Function

```sql
create or replace function match_field_vectors(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 20
)
returns table (
  id uuid,
  node_id text,
  element text,
  archetype text,
  similarity float,
  created_at timestamptz
)
language plpgsql
as $$
begin
  return query
  select
    field_vectors.id,
    field_vectors.node_id,
    field_vectors.element,
    field_vectors.archetype,
    1 - (field_vectors.embedding <=> query_embedding) as similarity,
    field_vectors.created_at
  from field_vectors
  where 1 - (field_vectors.embedding <=> query_embedding) > match_threshold
  order by field_vectors.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### 4. Create node_trust Table

```sql
create table if not exists node_trust (
  node_id text primary key,
  trust_score float default 1.0,
  consistency_score float default 1.0,
  diversity_score float default 1.0,
  resonance_history float default 1.0,
  contribution_count int default 0,
  last_contribution timestamptz,
  updated_at timestamptz default now()
);
```

### 5. Create get_field_state Function

```sql
create or replace function get_field_state()
returns json
language plpgsql
as $$
declare
  result json;
begin
  select json_build_object(
    'elementFrequencies', (
      select json_object_agg(element, count)
      from (
        select element, count(*) as count
        from field_vectors
        group by element
      ) as element_counts
    ),
    'archetypeFrequencies', (
      select json_object_agg(archetype, count)
      from (
        select archetype, count(*) as count
        from field_vectors
        group by archetype
      ) as archetype_counts
    ),
    'nodeTrustScores', (
      select json_object_agg(node_id, trust_score)
      from node_trust
    ),
    'totalVectors', (
      select count(*) from field_vectors
    )
  ) into result;

  return result;
end;
$$;
```

### 6. Grant Permissions

```sql
grant execute on function match_field_vectors to service_role;
grant execute on function get_field_state to service_role;
grant all on field_vectors to service_role;
grant all on node_trust to service_role;
```

## Verification

After running all commands, verify the setup:

```sql
-- Check if tables exist
select tablename from pg_tables where schemaname = 'public';

-- Check if functions exist
select routine_name from information_schema.routines
where routine_schema = 'public';

-- Verify pgvector extension
select * from pg_extension where extname = 'vector';
```

## Testing

You can test the vector matching function with dummy data:

```sql
-- Insert test vector
insert into field_vectors (node_id, embedding, element, archetype)
values (
  'test-node-1',
  array_fill(0.1, ARRAY[1536])::vector,
  'Fire',
  'Shadow'
);

-- Test query
select * from match_field_vectors(
  array_fill(0.1, ARRAY[1536])::vector,
  0.5,
  10
);
```

## Environment Variables

Ensure these are set in your Vercel field-service deployment:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Next Steps

Once the database is set up:

1. Deploy the field-service to Vercel (already done)
2. Run the SQL commands above in Supabase
3. Test the `/api/field/query` endpoint
4. Start ingesting vectors from local MAIA instances

## Troubleshooting

**Error: "extension vector does not exist"**
- Solution: Run `create extension if not exists vector;` as superuser

**Error: "function match_field_vectors does not exist"**
- Solution: Re-run the function creation SQL

**Slow queries:**
- Solution: Ensure the IVFFlat index is created with appropriate `lists` parameter
- For datasets > 10k vectors, increase lists to 200-500

## Architecture

```
Local MAIA → Field Service (/api/field/query)
                    ↓
            match_field_vectors(embedding)
                    ↓
            Returns: Similar vectors with similarity scores
                    ↓
            FRI Calculation (resonance.ts)
                    ↓
            Symbolic Presentation (resonance-presenter.ts)
                    ↓
            Returns to User
```

The field is now ready to receive and aggregate wisdom.
