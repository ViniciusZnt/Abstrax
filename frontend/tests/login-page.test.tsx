// __tests__/login.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page"; // ajuste o caminho se necessário
import * as nextNavigation from "next/navigation";

// Mock do useRouter do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Página de Login", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza inputs de e-mail e senha", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const button = screen.getByRole("button", { name: /entrar/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
  it("permite digitar e submeter o formulário", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const button = screen.getByRole("button", { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: "teste@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveTextContent(/entrando/i);
    });
  });
});
