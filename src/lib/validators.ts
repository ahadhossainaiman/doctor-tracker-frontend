import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^[0-9+()\-\s]{7,20}$/,
    "Use 7–20 characters: digits, spaces, and + ( ) -.",
  );
