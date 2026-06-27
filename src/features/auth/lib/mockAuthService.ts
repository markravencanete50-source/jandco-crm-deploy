/**
 * Mock auth service. Every method has the exact async signature real
 * Firebase Auth calls will have, so swapping the implementation in
 * Phase 13 means changing this file only — no UI code should need to
 * change. Artificial latency simulates network round-trips so loading
 * states are real to develop against.
 */

export interface AuthResult {
  success: boolean;
  error?: string;
}

function delay(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockSignIn(email: string, _password: string): Promise<AuthResult> {
  await delay();
  if (email.toLowerCase() === "locked@example.com") {
    return { success: false, error: "This account has been suspended. Contact your admin." };
  }
  if (email.toLowerCase() === "wrong@example.com") {
    return { success: false, error: "Incorrect email or password." };
  }
  return { success: true };
}

export async function mockRegister(
  _fullName: string,
  email: string,
  _password: string
): Promise<AuthResult> {
  await delay();
  if (email.toLowerCase() === "taken@example.com") {
    return { success: false, error: "An account with this email already exists." };
  }
  return { success: true };
}

export async function mockSendPasswordReset(_email: string): Promise<AuthResult> {
  await delay();
  // Always succeeds from the UI's perspective — real implementations
  // should not reveal whether an email is registered.
  return { success: true };
}

export async function mockResetPassword(_token: string, _password: string): Promise<AuthResult> {
  await delay();
  return { success: true };
}
