// __tests__/GalleryPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import GalleryPage from "../app/gallery/page";

describe("GalleryPage", () => {
  beforeEach(() => {
    render(<GalleryPage />);
  });

  test("renderiza título e descrição corretamente", () => {
    expect(screen.getByText("Galeria de Arte")).toBeInTheDocument();
    expect(
      screen.getByText(/Explore obras de arte criadas pela comunidade/)
    ).toBeInTheDocument();
  });

  test("mostra apenas artes públicas", () => {
    const publicArts = [
      "Harmonia Tranquila",
      "Celebração do Infinito",
      "Fluidez Cósmica",
    ];
    const privateArts = [
      "Paisagem Onírica",
      "Abstração Geométrica",
      "Sinfonia de Cores",
    ];

    publicArts.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    privateArts.forEach((title) => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    });
  });

  test("filtra artes por termo de pesquisa", () => {
    const searchInput = screen.getByPlaceholderText(
      "Pesquisar por título, descrição ou criador..."
    );
    fireEvent.change(searchInput, { target: { value: "Fluidez" } });

    expect(screen.getByText("Fluidez Cósmica")).toBeInTheDocument();
    expect(screen.queryByText("Harmonia Tranquila")).not.toBeInTheDocument();
  });
});
