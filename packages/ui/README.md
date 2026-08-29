# @gestor-finanzas/ui

Primitivas visuales compartidas y tokens semánticos organizados con Atomic Design.

- `atoms`: `Heading`, `Text`, `Eyebrow`, `Button`, `Input`, `Select` y `Label`. Son elementos indivisibles sin conocimiento del dominio.
- `molecules`: `Field`, `ContentHeader` y la familia con exports nombrados `Panel`, `PanelHeader` y `PanelContent`. Resuelven composiciones pequeñas y reutilizables.

`Heading` exige un `level` semántico y acepta un `variant` visual independiente. Elegir un tamaño nunca debe alterar la jerarquía del documento.

La aplicación consumidora debe importar una vez `@gestor-finanzas/ui/styles.css`. Ese archivo define colores, tipografía, espaciado, radios y sombras mediante tokens `--ui-*`, con temas claro, oscuro y preferencia del sistema.

Los organisms con comportamiento de negocio permanecen dentro de las features, los templates pertenecen a la aplicación y las pages al router. El package no administra datos, formularios, routing ni vocabulario de negocio.
