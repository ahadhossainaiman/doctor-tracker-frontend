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

export function formatGender(gender: string) {
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  if (gender === "other") return "Other";
  return gender;
}
