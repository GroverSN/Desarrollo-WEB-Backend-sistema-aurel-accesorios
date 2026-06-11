<template>
  <router-view />
</template>

<style>
/*Root de paleta de colores*/ 
:root {
  /*Paleta de Colores*/
  --primary-olive: #445a14;   /* Verde oscuro para textos/iconos importantes */
  --bg-cream: #fcf9da;        /* Fondo principal (el color crema de tu marca) */
  --soft-moss: #84813e;       /* Verde musgo para estados hover/activos */
  --earth-brown: #7e5a38;     /* Marrón tierra para acentos o bordes suaves */
  
  /*Colores de apoyo*/
  --white-pure: #ffffff;
  --text-main: #2d3436;
  --bg-sidebar: #f5f2d0;      /* Un tono ligeramente más oscuro que el crema para contraste */
}

:root {
  --primary: #6c5ce7;
  --bg: #f1f2f6;
  --text: #2d3436;
}

body.dark {
  --bg: #1e1e2f;
  --text: #ffffff;
  background: var(--bg-cream);
}

/*Estilos globales*/
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: var(--bg-cream);
}
</style>