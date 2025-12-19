export const extractTimeFromDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
        return "Hora inválida";
    }

    const timeFormatter = new Intl.DateTimeFormat("es-VE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    return timeFormatter.format(dateObj);
};
