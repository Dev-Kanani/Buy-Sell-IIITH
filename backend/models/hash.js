import bcrypt from "bcrypt";

async function HashPassword(password) {
  const saltRounds = 10;
  const input_password = password;

  const hash = await bcrypt.hash(input_password, saltRounds);

  console.log("Hashed password: ", hash);

  return hash;
}

async function UnhashPassword(password, hash) {
  const input_password = password;
  const input_hash = hash;

  const match = await bcrypt.compare(input_password, input_hash);

  console.log("Password match: ", match);

  return match;
}

export { HashPassword, UnhashPassword };
