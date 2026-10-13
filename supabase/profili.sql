create table profiles(
 id bigint generated always as identity primary key,
 name text not null, emoji text not null, color text not null);
create unique index on profiles(lower(name));
alter table profiles enable row level security;
