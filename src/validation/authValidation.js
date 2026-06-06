function validateUser(data) {
  const { email, password } = data;

  if (!email) return "Email is required";
  if (!password) return "Password is required";

  if (!email.includes("@")) return "Invalid email format";

  if (password.length < 6) return "Password must be at least 6 characters";

  return null; // no error
}

module.exports = { validateUser };
