import { config } from "dotenv"
import { eq } from "drizzle-orm"

config({ path: ".env.local" })

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@elhigueron.com"
  const password = process.env.ADMIN_PASSWORD ?? "Mbs2024"
  const name = process.env.ADMIN_NAME ?? "Administrador"

  const { db } = await import("../lib/db")
  const { user } = await import("../lib/db/schema")
  const { auth } = await import("../lib/auth")

  const existingRows = await db.select().from(user).where(eq(user.email, email)).limit(1)
  const existing = existingRows[0]

  if (existing) {
    await db
      .update(user)
      .set({
        role: "administrador",
        name,
        updatedAt: new Date(),
      })
      .where(eq(user.id, existing.id))

    console.log(`Admin already exists (${email}). Role ensured as administrador.`)
    console.log(
      existing.mustChangePassword
        ? "mustChangePassword is still true — password change required on next login."
        : "mustChangePassword is false — password already changed.",
    )
    return
  }

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  })

  if (!result?.user?.id) {
    throw new Error("Failed to create admin user via Better Auth signUpEmail.")
  }

  await db
    .update(user)
    .set({
      role: "administrador",
      mustChangePassword: true,
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(user.id, result.user.id))

  console.log(`Admin created: ${email}`)
  console.log("Default password set. mustChangePassword=true (change required after first login).")
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
