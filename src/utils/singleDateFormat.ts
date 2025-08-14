export const singleDateFormat = (date: Date) => {
    const formattedDate = new Intl.DateTimeFormat("es-VE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);

    return formattedDate;
};
