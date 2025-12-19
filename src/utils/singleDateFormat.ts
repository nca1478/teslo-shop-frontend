export const singleDateFormat = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
        return "Fecha inválida";
    }

    const formattedDate = new Intl.DateTimeFormat("es-VE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(dateObj);

    return formattedDate;
};
