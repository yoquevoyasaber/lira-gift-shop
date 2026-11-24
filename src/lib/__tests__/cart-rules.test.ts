import { describe, it, expect } from "vitest";
import { validateDemoCard, requireAdminTest } from "../cart-rules";
describe("pago simulado", () => {
  it("acepta la tarjeta de prueba 4242", () => expect(validateDemoCard("4242 4242 4242 4242", "12/30", "123")).toBe(true));
  it("rechaza otras tarjetas", () => expect(validateDemoCard("4000 0000 0000 0002", "12/30", "123")).toBe(false));
  it("solo administradoras pueden simular", () => expect(() => requireAdminTest(false)).toThrow());
});
