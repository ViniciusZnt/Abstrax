import { render, screen, fireEvent } from "@testing-library/react";
import ArtDetailPage from "../app/art/[id]/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

beforeAll(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
  });
  window.alert = jest.fn();
});

describe("ArtDetailPage", () => {
  it("renderiza título, descrição e autor", () => {
    render(<ArtDetailPage />);
    expect(
      screen.getByText(/a harmonia tranquila da água/i)
    ).toBeInTheDocument();
    const joaoSilvas = screen.getAllByText(/joão silva/i);
    expect(joaoSilvas[0]).toBeInTheDocument();
  });

  it("botão de compartilhar mostra alerta", () => {
    render(<ArtDetailPage />);
    const shareButton = screen.getByRole("button", { name: /compartilhar/i });
    fireEvent.click(shareButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      "Link copiado para a área de transferência!"
    );
  });
});
