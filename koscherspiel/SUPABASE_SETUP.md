# Supabase-Setup fuer das Koscherspiel

1. In Supabase unter `Auth > Providers > Email` die E-Mail-Bestaetigung deaktivieren.
   Das Frontend meldet Nutzer mit `Benutzername + Passwort` an und erzeugt intern eine synthetische E-Mail-Adresse.

2. Das SQL aus [supabase-setup.sql](/home/merlin-kreuzer/stolpersteinebs.github.io/koscherspiel/supabase-setup.sql) im Supabase-SQL-Editor ausfuehren.

3. Sicherstellen, dass die Meta-Tags in [index.html](/home/merlin-kreuzer/stolpersteinebs.github.io/koscherspiel/index.html) zu deinem Projekt passen:
   `koscher-supabase-url`, `koscher-supabase-key`, `koscher-supabase-table`, `koscher-supabase-profile-table`, `koscher-supabase-email-domain`

4. Danach koennen Nutzer Konten anlegen, sich mit Benutzername und Passwort anmelden und werden mit ihrem besten Score automatisch in die passende Duolingo-Liga einsortiert.
