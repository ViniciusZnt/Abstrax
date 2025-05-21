// __tests__/MyGalleryPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import MyGalleryPage from "../app/my-gallery/page";

describe("MyGalleryPage", () => {
  beforeEach(() => {
    render(<MyGalleryPage />);
  });

  test("renderiza título e descrição corretamente", () => {
    expect(screen.getByText("Minha Galeria")).toBeInTheDocument();
    expect(screen.getByText("Explore suas artes criadas")).toBeInTheDocument();
  });

  test("filtra artes por termo de pesquisa", () => {
    const searchInput = screen.getByPlaceholderText(
      "Pesquisar por título, descrição ou criador..."
    );
    fireEvent.change(searchInput, { target: { value: "Harmonia" } });

    expect(screen.getByText("Harmonia Tranquila")).toBeInTheDocument();
    expect(
      screen.queryByText("Celebração do Infinito")
    ).not.toBeInTheDocument();
  });

  test("mostra mensagem quando nenhuma arte é encontrada", () => {
    const searchInput = screen.getByPlaceholderText(
      "Pesquisar por título, descrição ou criador..."
    );
    fireEvent.change(searchInput, { target: { value: "TermoInexistente" } });

    expect(screen.getByText("Nenhuma arte encontrada")).toBeInTheDocument();
  });
});
