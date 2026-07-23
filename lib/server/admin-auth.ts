import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getRuntimeEnvironment, runtimeString } from "./cloudflare";

export async function getAdminUser() {
  const user = await getChatGPTUser();
  if (!user) return { user: null, authorized: false };
  const environment = await getRuntimeEnvironment();
  const configured = runtimeString(environment, "ADMIN_EMAILS");
  const allowed = new Set(
    (configured ?? "")
      .split(",")
      .map(email => email.trim().toLowerCase())
      .filter(Boolean),
  );
  return {
    user,
    authorized: allowed.has(user.email.toLowerCase()),
  };
}
