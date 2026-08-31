# ADR-0006: Autenticación de un solo usuario con sesión por cookie firmada

- Estado: aceptado
- Fecha: 2026-08-31
- Responsables: mantenedores del proyecto

## Contexto

Es el último punto de "Producto mínimo incremental" en `ROADMAP.md`:
definir autenticación, autorización y sesiones antes de almacenar
información real o ampliar el acceso más allá de la computadora local. Hoy
la API no tiene ningún control de acceso — cualquiera con red hacia ella
puede leer y escribir todo. `SECURITY.md` ya lo marcaba como bloqueante.

El alcance del producto sigue siendo explícitamente de un solo usuario y una
sola instalación (`docs/architecture.md`); "uso multiusuario" está fuera de
alcance actual. Dos decisiones de producto no se podían inferir del código y
las resolvió el usuario directamente: el usuario se define por variables de
entorno (sin tabla `users` ni registro), y la sesión se guarda en una cookie
firmada sin estado (sin tabla `sessions`).

## Opciones consideradas

1. **Origen del usuario**: variables de entorno (`ADMIN_USERNAME` /
   `ADMIN_PASSWORD_HASH`) vs. una tabla `users` con un flujo de primer
   arranque. La tabla habilitaría cambiar la contraseña desde la propia
   app, pero agrega una tabla, migraciones y un flujo de setup nuevos para
   un caso que sigue siendo un solo usuario en la práctica. Se elige
   **variables de entorno**.
2. **Sesión**: cookie firmada sin estado (JWT) vs. una tabla `sessions`
   consultada en cada request. La tabla permitiría revocar una sesión
   específica sin rotar el secreto global, pero para un solo usuario no
   compensa la tabla, migración y consulta adicional en cada request. Se
   elige **cookie firmada sin estado**, con `jose` (HS256) en vez de una
   implementación propia de firma — es código de seguridad, no vale la pena
   reinventarlo.
3. **Quién valida la sesión**: solo la web (`proxy.ts`), solo la API, o
   ambas de forma independiente. `docs/architecture.md` ya asigna
   autorización a `apps/api` ("será propietaria de casos de uso,
   autorización..."), así que la API es quien valida credenciales y emite
   el token, y quien vuelve a validar la cookie en cada request (un guard
   global) — nunca confía en que la web ya filtró. La web verifica el mismo
   token de forma independiente y sin red en `proxy.ts` (el archivo que
   Next.js 16 renombró desde `middleware.ts`) para no renderizar ni un byte
   del dashboard a quien no tiene sesión válida; ambas capas comparten
   `SESSION_SECRET`.
4. **Contraseña**: `crypto.scrypt` de Node (sin dependencia nueva) con un
   formato propio `scrypt:N:r:p:<saltHex>:<hashHex>`, en vez de bcrypt o
   argon2. Evita una dependencia nueva para algo que la librería estándar
   de Node ya resuelve de forma segura.

## Decisión

`AuthModule` en `apps/api` valida `POST /api/v1/auth/login` contra
`ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`, siempre corriendo la comparación
`scrypt` (incluso con usuario incorrecto, contra un hash señuelo) para no
filtrar por tiempo de respuesta qué campo falló. En éxito firma un JWT
HS256 (`jose`, payload `{ sub: username, iat, exp }`, expira a las 12h fijas
sin renovación) y lo entrega en una cookie `gestor_finanzas_session`
(`httpOnly`, `sameSite=lax`, sin `secure` todavía — ver Consecuencias).
`POST /api/v1/auth/login` está limitado a 5 intentos por minuto
(`@nestjs/throttler`) contra fuerza bruta.

Un guard global (`APP_GUARD`) exige la cookie válida en cualquier endpoint
sin `@Public()`. Solo `GET /api/v1/health`, `POST /api/v1/auth/login` y
`POST /api/v1/auth/logout` son públicos; el resto —cuentas, categorías,
movimientos, saldos, presupuestos, `GET /api/v1/auth/session`— exige
sesión.

`apps/web` verifica la misma cookie en `proxy.ts` (comparte
`SESSION_SECRET` con la API vía variables de entorno) y redirige a
`/login` sin renderizar el dashboard. Para lograrlo sin filtrar el sidebar
a `/login`, `app/` se reorganizó con un route group `app/(dashboard)/`
(`AppShell` se aplica solo ahí; `/login` comparte únicamente el layout raíz)
— los route groups no cambian las URLs.

## Consecuencias

- Rotar `SESSION_SECRET` invalida todas las sesiones activas de golpe
  (no hay lista de sesiones que revocar individualmente).
- Perder `ADMIN_PASSWORD_HASH` o `SESSION_SECRET` fuera del repositorio es
  obligatorio, igual que `DATABASE_URL`; ambos deben tratarse como secretos
  de despliegue.
- No hay recuperación de contraseña ni multiusuario: cambiar la contraseña
  es regenerar el hash con `scripts/hash-password.mts` y reiniciar la API.
- La cookie no se marca `secure` porque el despliegue actual (self-hosted,
  sin HTTPS garantizado) la enviaría igual por HTTP y una cookie `secure`
  simplemente no se enviaría — quedaría roto, no más seguro. Debe
  revisarse cuando se agregue un reverse proxy con HTTPS delante de la web
  (ver `DEPLOYMENT.md`).
- Cualquier necesidad futura de multiusuario, recuperación de contraseña o
  revocación individual de sesiones requiere una nueva decisión y no debe
  añadirse ad hoc sobre este mecanismo.

## Referencias

- [`ADR-0005`](0005-backups-cifrados-con-cron-del-host.md)
- [`DEPLOYMENT.md`](../../DEPLOYMENT.md)
- [`SECURITY.md`](../../SECURITY.md)
