const utcDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function formatUtcDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return utcDate.format(date);
}

export function formatCount(value: number) {
  return new Intl.NumberFormat(undefined).format(value);
}

export function toDateInput(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export function formatGender(gender: string) {
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  if (gender === "other") return "Other";
  return gender;
}
