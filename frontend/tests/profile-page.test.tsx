import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePage from "../app/profile/page";

describe("ProfilePage", () => {
  it("renderiza o perfil com nome do usuário", () => {
    render(<ProfilePage />);
    // Verifica se o nome do usuário está na tela
    expect(screen.getByText("João Silva")).toBeInTheDocument();
  });

  it("alternar para modo edição e mostrar botão salvar", () => {
    render(<ProfilePage />);
    const editButton = screen.getByRole("button", { name: /editar perfil/i });
    fireEvent.click(editButton);

    // Agora deve aparecer o botão de salvar
    expect(
      screen.getByRole("button", { name: /salvar alterações/i })
    ).toBeInTheDocument();

    // O input do nome deve estar visível e com o valor atual
    const nameInput = screen.getByLabelText("Nome") as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe("João Silva");
  });
});
