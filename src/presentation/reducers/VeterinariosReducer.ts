import type { DatosVeterinario, Veterinario } from "@/domain/models/Veterinario";

export type VeterinarioAction =
  | { type: "CARGAR_VETERINARIOS_INICIALES"; payload: Veterinario[] }
  | { type: "CREAR"; payload: Veterinario }
  | {
      type: "ACTUALIZAR";
      payload: {
        id: string;
        datos: DatosVeterinario;
      };
    }
  | { type: "ELIMINAR"; payload: string };

function ordenarVeterinarios(lista: Veterinario[]) {
  return [...lista].sort((a, b) =>
    `${a.firstName} ${a.lastName}`.localeCompare(
      `${b.firstName} ${b.lastName}`,
      "es",
    ),
  );
}

export function veterinariosReducer(
  state: Veterinario[],
  action: VeterinarioAction,
): Veterinario[] {
  switch (action.type) {
    case "CARGAR_VETERINARIOS_INICIALES":
      return ordenarVeterinarios(action.payload);

    case "CREAR":
      return ordenarVeterinarios([...state, action.payload]);

    case "ACTUALIZAR": {
      const { id, datos } = action.payload;
      return ordenarVeterinarios(
        state.map((veterinario) =>
          veterinario.id === id
            ? {
                ...veterinario,
                firstName: datos.firstName.trim(),
                lastName: datos.lastName.trim(),
                email: datos.email.trim(),
                phone: datos.phone.trim(),
                activo: datos.activo,
              }
            : veterinario,
        ),
      );
    }

    case "ELIMINAR":
      return state.filter((veterinario) => veterinario.id !== action.payload);

    default:
      return state;
  }
}
