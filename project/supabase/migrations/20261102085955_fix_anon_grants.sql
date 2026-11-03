/*
# Fix grants to remove anon access

The app requires sign-in, so all policies target `authenticated` only.
The initial migration accidentally granted CRUD to `anon` on all tables.
This removes those `anon` grants so only `authenticated` can reach the data.
The `handle_new_user` trigger function is SECURITY DEFINER and runs as the
owner, so it doesn't need anon grants to insert into profiles.

1. Changes
- REVOKE all privileges from `anon` on `profiles`, `detections`, `alerts`.
- Keep `authenticated` CRUD on `detections` and `alerts`.
- Keep `authenticated` SELECT, UPDATE on `profiles`.
*/

REVOKE ALL ON profiles FROM anon;
REVOKE ALL ON detections FROM anon;
REVOKE ALL ON alerts FROM anon;
