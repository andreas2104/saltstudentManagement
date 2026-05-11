import { signToken } from "../lib/auth";

async function main() {
  const token = await signToken({
    userId: 4,
    email: "adminevent@gmail.com",
    role: "ADMIN",
  });
  console.log(token);
}

main().catch(console.error);
