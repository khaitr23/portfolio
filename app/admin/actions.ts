"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getContent, saveContent, type Content } from "@/lib/content";
import {
  createSessionToken,
  verifySessionToken,
  hashPassword,
} from "@/lib/auth";

const SESSION_COOKIE = "kt_admin_session";
const IS_PROD = process.env.NODE_ENV === "production";

function getSecrets() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!password || !secret) {
    throw new Error(
      "ADMIN_PASSWORD and SESSION_SECRET must be set in .env.local"
    );
  }
  return { password, secret };
}

export async function login(formData: FormData) {
  const { password: adminPassword, secret } = getSecrets();
  const input = formData.get("password") as string;

  // Compare hashes to avoid leaking timing info about password length
  const [inputHash, adminHash] = await Promise.all([
    hashPassword(input ?? ""),
    hashPassword(adminPassword),
  ]);

  if (inputHash === adminHash) {
    const token = await createSessionToken(secret);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: IS_PROD,       // HTTPS-only in production
      sameSite: "strict",    // No cross-site requests
      maxAge: 60 * 60 * 24, // 24 h
      path: "/admin",        // Scoped to /admin only
    });
    redirect("/admin");
  } else {
    redirect("/admin?error=1");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin");
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const { secret } = getSecrets();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return false;
    return await verifySessionToken(token, secret);
  } catch {
    return false;
  }
}

export async function updateContent(content: Content) {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
  saveContent(content);
}

export async function loadContent(): Promise<Content> {
  return getContent();
}
