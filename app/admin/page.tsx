/* eslint-disable @next/next/no-img-element -- the existing logo crop is intentionally preserved. */

import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { getAdminUser } from "@/lib/server/admin-auth";
import Link from "next/link";
import AdminLeadDashboard from "./AdminLeadDashboard";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const admin = await getAdminUser();

  if (!admin.authorized) {
    return (
      <main className={styles.locked}>
        <section>
          <img src="/sparclean-logo-220.webp" width="220" height="42" alt="SparClean"/>
          <span>Private client ledger</span>
          <h1>This account does not have access.</h1>
          <p>Ask the site owner to add <strong>{user.email}</strong> to the administrative allowlist.</p>
          <Link href="/">Return to the website</Link>
        </section>
      </main>
    );
  }

  return (
    <AdminLeadDashboard
      userName={user.displayName}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
