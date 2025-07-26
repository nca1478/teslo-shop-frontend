// [1,2,3,4,5,..., 7]
// [1,2,3,...,48, 49, 50]
export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  // Si el numero total de páginas es 7 o menos
  // vamos a mostrar todas las páginas sin puntos suspensivos
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1); // [1,2,3,4,5,6,7];
  }

  // Si la página actual está entre las primeras 3 páginas
  // mostrar las primeras 3, puntos suspensivos, y las ultimas 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages]; //[1,2,3, '...', 49,50];
  }

  // Si la página actual estra entre las últimas 3 páginas
  // mostrar las primeras 2, puntos suspensivos, las últimas 3 páginas
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // Si la página actual está en otro lugar medio
  // mostrar la primera página, puntos suspensivos, la pagina actual y vecinos
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

// otra alternativa para generar los números de la paginación
export const createPaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  const paginationArray: string[] = [];
  const maxDisplayedPages: number = 7;

  if (totalPages <= maxDisplayedPages + 1) {
    for (let i = 1; i <= totalPages; i++) {
      paginationArray.push(i.toString());
    }
  } else {
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxDisplayedPages / 2)
    );
    let endPage = startPage + maxDisplayedPages - 1;

    if (endPage >= totalPages) {
      startPage = totalPages - maxDisplayedPages + 1;
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationArray.push(i.toString());
    }

    if (startPage > 1) {
      paginationArray.unshift("1");
      if (startPage > 2) {
        paginationArray.splice(1, 0, "...");
      }
    }

    if (endPage < totalPages) {
      paginationArray.push(totalPages.toString());
      if (endPage < totalPages - 1) {
        paginationArray.splice(paginationArray.length - 1, 0, "...");
      }
    }
  }

  return paginationArray;
};
