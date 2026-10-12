create table library(
 tmdb_id bigint primary key, title text not null, year int, poster text, backdrop text,
 overview text, genres text[] default '{}', director text,
 status text not null check (status in ('seen','want')), added_at timestamptz default now());
create table reviews(
 id bigint generated always as identity primary key, tmdb_id bigint not null,
 author text not null, rating int not null check (rating between 1 and 5),
 comment text not null, created_at timestamptz default now());
create index on reviews(tmdb_id);
alter table library enable row level security; alter table reviews enable row level security;
