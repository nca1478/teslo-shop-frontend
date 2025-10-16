export const getInitials = (fullName: string) => {
    return fullName
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase())
        .join("");
};
