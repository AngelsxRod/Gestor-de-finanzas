# Seguridad

## Controles transversales observados

- El repositorio ignora archivos `.env*`; no deben versionarse secretos.
- La web y la API escuchan en `127.0.0.1` de forma predeterminada.
- La API permite configurar `HOST` y `PORT`; ampliar su exposición fuera de loopback requiere revisar antes sus controles HTTP.
- No hay autenticación, autorización, persistencia ni gestión centralizada de secretos implementadas.
- La integración placeholder de Nest Observe fue retirada; actualmente no hay exportación de telemetría configurada.

La exposición HTTP y las capacidades ausentes de la API se documentan en [`apps/api/SECURITY.md`](apps/api/SECURITY.md).

No existe una guía de seguridad local para la web porque el código actual no aporta reglas específicas suficientes. Si se añaden entrada de usuario, sesión, consumo de API o manejo de datos financieros, habrá que definir y documentar los controles correspondientes.
