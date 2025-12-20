export class User {
  username!: string; // Not initialized here, but set later
  password!: string; // TypeScript non-null assertion
  roles!: string[];  // Value comes from backend
}