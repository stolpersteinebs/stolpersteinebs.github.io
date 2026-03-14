# Supabase-Setup fuer das Koscherspiel

1. In Supabase unter `Auth > Providers > Email` die E-Mail-Bestaetigung deaktivieren.
2. Das SQL aus [supabase-setup.sql](/home/merlin-kreuzer/stolpersteinebs.github.io/koscherspiel/supabase-setup.sql) im SQL-Editor ausfuehren.
3. Sicherstellen, dass die Meta-Tags in [index.html](/home/merlin-kreuzer/stolpersteinebs.github.io/koscherspiel/index.html) zu deinem Projekt passen:
   `koscher-supabase-url`, `koscher-supabase-key`, `koscher-supabase-table`, `koscher-supabase-profile-table`, `koscher-supabase-email-domain`

Das neue Setup macht Folgendes serverseitig:

- Angemeldete Nutzer sehen nur ihre aktuelle 20er-Liga.
- Alle 3 Tage steigen Platz 1 bis 5 auf, Platz 16 bis 20 ab.
- Es gibt eine separate Gast-Liga.
- Gast-Eintraege werden alle 3 Tage automatisch bereinigt.
- Ligadaten werden nicht mehr im Browser lokal gespeichert.
