export const extractTimeFromDate = (date: Date) => {
    const timeFormatter = new Intl.DateTimeFormat("es-VE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    return timeFormatter.format(date);
};
