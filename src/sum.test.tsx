import { render, screen } from "@testing-library/react";

function Button({ children }: { children: React.ReactNode }) {
  return <button>{children}</button>;
}

test("ボタンが表示される", () => {
  render(<Button>Click</Button>);
  expect(screen.getByText("Click")).toBeInTheDocument();
});