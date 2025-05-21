import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/sections/hero-section";

describe("Componente HeroSection", () => {
  it("renderiza o título principal", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("heading", { name: /through the art/i })
    ).toBeInTheDocument();
  });

  it("renderiza o parágrafo de descrição", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/descubra uma jornada na arte abstrata/i)
    ).toBeInTheDocument();
  });

  it("renderiza o botão 'Comece a Criar'", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("button", { name: /comece a criar/i })
    ).toBeInTheDocument();
  });

  it("renderiza o botão 'Explorar Galeria'", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("button", { name: /explorar galeria/i })
    ).toBeInTheDocument();
  });
});
