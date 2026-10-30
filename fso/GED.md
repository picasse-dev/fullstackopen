# Guia Estructuras de datos y operaciones comunes al desarrollar aplicaciones con React

Gran parte del trabajo con React consiste en transformar datos: combinar
arreglos, modificar objetos, filtrar información y mantener el estado de
la interfaz sincronizado con esos datos.

Esta guía reúne las operaciones de JavaScript que conviene dominar para
trabajar con arrays, objetos y estructuras anidadas en aplicaciones
React.

------------------------------------------------------------------------

## 1. Las estructuras de datos que más vas a utilizar

### Arrays (arreglos)

Se utilizan para guardar y manipular colecciones: usuarios, productos,
tareas, ejercicios y publicaciones.

Operaciones frecuentes: `map`, `filter`, `find`, `reduce`, `some`,
`every` y `sort`.

### Objects (objetos)

Representan entidades con propiedades: un usuario, una rutina o un
producto.

Operaciones frecuentes: acceder, agregar, actualizar, eliminar y
desestructurar propiedades.

### Arrays de objetos y objetos anidados

Son muy comunes en aplicaciones reales: listas de usuarios con datos,
rutinas con ejercicios o pedidos con productos.

Operaciones frecuentes: actualizar elementos por ID, modificar
propiedades anidadas y combinar datos.

### Map y Set

Son estructuras especializadas para asociar claves con valores y evitar
duplicados.

Operaciones frecuentes:

-   `Map`: `get`, `set`, `has`, `delete`.
-   `Set`: `add`, `has`, `delete`.

En React, conviene priorizar primero arrays, objetos y estructuras
anidadas.

> **Regla importante de React:** cuando actualizas el estado,
> normalmente debes crear un array u objeto nuevo en lugar de modificar
> directamente el existente.

------------------------------------------------------------------------

## 2. Operaciones con arrays

Imagina que estás desarrollando una aplicación de fitness y tienes estos
ejercicios:

``` js
const exercises = [
  { id: 1, name: "Push-ups", reps: 15, completed: false },
  { id: 2, name: "Squats", reps: 20, completed: true },
  { id: 3, name: "Plank", reps: 1, completed: false }
];
```

### A. Agregar elementos

Operaciones: spread (`...`) y `concat()`.

``` js
const newExercise = {
  id: 4,
  name: "Pull-ups",
  reps: 10,
  completed: false
};

// Con spread
const updated = [...exercises, newExercise];

// Con concat
const updated2 = exercises.concat(newExercise);
```

Ambas crean un array nuevo.

También puedes agregar elementos al principio:

``` js
const updated = [newExercise, ...exercises];
```

### B. Eliminar elementos

Operación: `filter()`.

``` js
const updated = exercises.filter(
  exercise => exercise.id !== 2
);
```

Elimina el ejercicio cuyo ID es `2`, conservando los demás.

Este patrón sirve para eliminar tareas, productos del carrito, usuarios
o ejercicios.

### C. Modificar un elemento dentro de un array

Operaciones: `map()` y spread.

Por ejemplo, marcar un ejercicio como completado:

``` js
const updated = exercises.map(exercise =>
  exercise.id === 1
    ? { ...exercise, completed: true }
    : exercise
);
```

¿Qué sucede?

1.  `map()` recorre todos los ejercicios.
2.  Si encuentra el ID `1`, crea un objeto nuevo con `completed: true`.
3.  Si no coincide, conserva el objeto original.
4.  Devuelve un array nuevo.

Esta es una de las operaciones más importantes de React.

### D. Buscar un elemento

Operación: `find()`.

``` js
const exercise = exercises.find(
  exercise => exercise.id === 2
);

console.log(exercise.name); // "Squats"
```

`find()` devuelve el primer elemento que coincide o `undefined` si no
encuentra ninguno.

### E. Filtrar elementos según una condición

Operación: `filter()`.

``` js
const completed = exercises.filter(
  exercise => exercise.completed
);
```

Ahora tienes únicamente los ejercicios completados.

También puedes filtrar por nombre:

``` js
const results = exercises.filter(exercise =>
  exercise.name.toLowerCase().includes("push")
);
```

Esto sirve para implementar buscadores en interfaces.

### F. Transformar todos los elementos

Operación: `map()`.

``` js
const exerciseNames = exercises.map(
  exercise => exercise.name
);

// ["Push-ups", "Squats", "Plank"]
```

También puedes generar elementos para una interfaz React:

``` jsx
{exercises.map(exercise => (
  <ExerciseCard
    key={exercise.id}
    exercise={exercise}
  />
))}
```

Aquí conectas la manipulación de datos con la representación de
componentes React.

### G. Combinar arrays

Operaciones: spread y `concat()`.

``` js
const monday = ["Push-ups", "Squats"];
const tuesday = ["Plank", "Pull-ups"];

const week = [...monday, ...tuesday];
```

Resultado:

``` js
["Push-ups", "Squats", "Plank", "Pull-ups"]
```

También puedes unir resultados procedentes de diferentes fuentes:

``` js
const allUsers = [...usersFromAPI, ...newUsers];
```

### H. Contar, sumar y comprobar condiciones

Operaciones: `reduce()`, `some()` y `every()`.

``` js
// Sumar las repeticiones
const totalReps = exercises.reduce(
  (total, exercise) => total + exercise.reps,
  0
);

// ¿Hay algún ejercicio completado?
const hasCompleted = exercises.some(
  exercise => exercise.completed
);

// ¿Están todos completados?
const allCompleted = exercises.every(
  exercise => exercise.completed
);
```

Estas operaciones son útiles para estadísticas, indicadores de progreso
y validaciones.

### I. Ordenar elementos

Operación: `sort()`.

``` js
const ordered = [...exercises].sort(
  (a, b) => a.reps - b.reps
);
```

Ordena por número de repeticiones, de menor a mayor.

> **Cuidado:** `sort()` modifica el array sobre el que se ejecuta. Por
> eso usamos `[...exercises]` para no alterar el array original.

------------------------------------------------------------------------

## 3. Operaciones con objetos

Supón que tienes un usuario:

``` js
const user = {
  id: 1,
  name: "Sebastian",
  age: 25,
  level: "beginner"
};
```

### A. Leer propiedades

``` js
user.name;          // "Sebastian"
user["level"];      // "beginner"

const property = "age";
user[property];     // 25
```

La notación con corchetes es especialmente útil cuando el nombre de la
propiedad está guardado en una variable.

### B. Agregar o actualizar propiedades

``` js
const updatedUser = {
  ...user,
  age: 26,
  city: "Zipaquirá"
};
```

Esto actualiza `age`, agrega `city` y conserva las demás propiedades.

En un objeto, si escribes dos veces la misma propiedad, prevalece la
última:

``` js
const updatedUser = {
  ...user,
  level: "intermediate"
};
```

### C. Eliminar propiedades

``` js
const { age, ...userWithoutAge } = user;
```

Ahora `userWithoutAge` contiene todas las propiedades excepto `age`. El
objeto original sigue intacto.

### D. Extraer propiedades (desestructuración)

``` js
const { name, level } = user;

console.log(name);  // "Sebastian"
console.log(level); // "beginner"
```

También puedes asignar valores predeterminados:

``` js
const { country = "Colombia" } = user;
```

Esto es común cuando recibes datos de una API o trabajas con las props
de un componente.

### E. Combinar objetos

``` js
const personal = { name: "Ana", age: 30 };
const preferences = { theme: "dark", language: "es" };

const profile = {
  ...personal,
  ...preferences
};
```

Resultado:

``` js
{
  name: "Ana",
  age: 30,
  theme: "dark",
  language: "es"
}
```

Si ambos objetos tienen una propiedad con el mismo nombre, el que
aparece después sobrescribe el valor anterior.

------------------------------------------------------------------------

## 4. Combinar arrays y objetos

En una aplicación real casi nunca trabajas exclusivamente con arrays
sencillos u objetos sencillos. Trabajas con estructuras combinadas.

Por ejemplo, una rutina:

``` js
const routine = {
  id: 1,
  name: "Full body",
  exercises: [
    { id: 1, name: "Push-ups", reps: 15 },
    { id: 2, name: "Squats", reps: 20 }
  ]
};
```

### Agregar un ejercicio a la rutina

``` js
const updatedRoutine = {
  ...routine,
  exercises: [
    ...routine.exercises,
    { id: 3, name: "Plank", reps: 1 }
  ]
};
```

### Modificar las repeticiones de un ejercicio

Por ejemplo, cambiar las repeticiones del ejercicio con ID `2`:

``` js
const updatedRoutine = {
  ...routine,
  exercises: routine.exercises.map(exercise =>
    exercise.id === 2
      ? { ...exercise, reps: 30 }
      : exercise
  )
};
```

### Eliminar un ejercicio

``` js
const updatedRoutine = {
  ...routine,
  exercises: routine.exercises.filter(
    exercise => exercise.id !== 2
  )
};
```

La idea es copiar el objeto exterior, crear un array nuevo para la
propiedad `exercises` y, cuando corresponda, crear también un objeto
nuevo para el elemento modificado.

Este patrón aparece constantemente en aplicaciones React.

------------------------------------------------------------------------

## 5. Aplicar estas operaciones al estado de React

Aquí está la conexión con Full Stack Open.

Imagina que guardas tus ejercicios en `useState`:

``` jsx
import { useState } from "react";

function ExerciseList() {
  const [exercises, setExercises] = useState([
    { id: 1, name: "Push-ups", completed: false }
  ]);

  function addExercise() {
    const newExercise = {
      id: Date.now(),
      name: "Squats",
      completed: false
    };

    setExercises(previous => [
      ...previous,
      newExercise
    ]);
  }

  function removeExercise(id) {
    setExercises(previous =>
      previous.filter(exercise => exercise.id !== id)
    );
  }

  function completeExercise(id) {
    setExercises(previous =>
      previous.map(exercise =>
        exercise.id === id
          ? { ...exercise, completed: true }
          : exercise
      )
    );
  }

  return (
    <div>
      <button onClick={addExercise}>Add exercise</button>

      {exercises.map(exercise => (
        <div key={exercise.id}>
          {exercise.name} — {exercise.completed ? "Done" : "Pending"}

          <button onClick={() => completeExercise(exercise.id)}>
            Complete
          </button>

          <button onClick={() => removeExercise(exercise.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

Este componente reúne varias operaciones habituales en el trabajo
diario:

-   Añadir registros.
-   Eliminar registros por identificador.
-   Actualizar registros concretos.
-   Recorrer arrays para renderizar componentes.
-   Mantener el estado de manera inmutable.

**Nota sobre los identificadores:** `Date.now()` es suficiente para este
ejemplo local, pero para una aplicación real con persistencia debes usar
identificadores que garanticen la unicidad.

------------------------------------------------------------------------

## 6. Chuleta de JavaScript para React

  Lo que quieres hacer                       Método o patrón
  ------------------------------------------ ---------------------------------
  Transformar cada elemento                  `map()`
  Filtrar elementos                          `filter()`
  Encontrar un elemento                      `find()`
  Comprobar si existe alguno                 `some()`
  Comprobar si todos cumplen                 `every()`
  Sumar o acumular valores                   `reduce()`
  Combinar arrays                            `[...a, ...b]`
  Añadir al final                            `[...array, item]`
  Añadir al principio                        `[item, ...array]`
  Copiar un array                            `[...array]`
  Copiar y actualizar un objeto              `{ ...obj, prop: value }`
  Eliminar una propiedad                     Desestructuración con `...rest`
  Ordenar sin mutar el original              `[...array].sort(...)`
  Eliminar duplicados sencillos              `[...new Set(array)]`
  Extraer propiedades                        `const { prop } = obj`
  Combinar objetos                           `{ ...obj1, ...obj2 }`
  Convertir un objeto en pares clave-valor   `Object.entries(obj)`
  Obtener las claves de un objeto            `Object.keys(obj)`
  Obtener sus valores                        `Object.values(obj)`

### Dos matices que conviene aprender pronto

-   `slice()` crea una porción de un array sin modificarlo; `splice()`
    inserta o elimina elementos modificando el array original.
-   Spread (`...`) hace una copia superficial (*shallow copy*), no
    profunda (*deep copy*). Si tienes objetos anidados, copiar el objeto
    exterior no copia automáticamente todos sus objetos internos.

------------------------------------------------------------------------

## 7. Prácticas tipo trabajo real para Full Stack Open

No te limites a memorizar los métodos. Practícalos mediante pequeños
encargos similares a los que recibirías en un equipo de desarrollo.

### 1. CRUD de tareas

**Objetivo:** agregar, editar, completar y eliminar tareas de una lista.

Métodos y conceptos:

-   `map()`
-   `filter()`
-   Spread (`...`)
-   `useState`

### 2. Carrito de compras

**Objetivo:** añadir productos, acumular cantidades y calcular el total.

Métodos y conceptos:

-   `find()`
-   `map()`
-   `reduce()`
-   Objetos anidados

### 3. Buscador y filtros

**Objetivo:** buscar usuarios por nombre y filtrar por rol o estado.

Métodos y conceptos:

-   `filter()`
-   `includes()`
-   `some()`

### 4. Editor de rutinas

**Objetivo:** añadir ejercicios, cambiar repeticiones y eliminar
ejercicios dentro de una rutina.

Métodos y conceptos:

-   Arrays de objetos
-   Actualización de estructuras anidadas
-   Spread (`...`)
-   `map()` y `filter()`

### 5. Panel de estadísticas

**Objetivo:** calcular ejercicios completados, porcentajes y mejores
marcas.

Métodos y conceptos:

-   `reduce()`
-   `filter()`
-   `sort()`
-   `every()`

------------------------------------------------------------------------

## 8. Orden recomendado de aprendizaje

1.  Domina arrays y objetos básicos.
2.  Practica `map()`, `filter()` y `find()`.
3.  Aprende spread y desestructuración.
4.  Combina arrays de objetos.
5.  Modifica propiedades dentro de objetos anidados.
6.  Aplica todo con `useState` en React.
7.  Construye pequeños CRUD.
8.  Añade búsqueda, filtros y persistencia en el navegador.

## Conclusión

El objetivo no es memorizar veinte métodos. Es que, cuando te pidan una
funcionalidad, puedas identificar:

1.  Qué estructura de datos tienes.
2.  Qué transformación necesitas realizar.
3.  Cómo actualizar el estado sin introducir errores.
4.  Cómo representar el resultado en la interfaz.

Esa habilidad te permitirá leer repositorios de GitHub, modificar
componentes ajenos y trabajar con código que no has escrito tú.
