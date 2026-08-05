const lowercaseStrings = (value: string): string => {
  if (typeof value === "string") {
    return value.toLowerCase();
  }
  return value;
};

export default lowercaseStrings;