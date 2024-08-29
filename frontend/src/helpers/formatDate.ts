import dayjs from "dayjs";
dayjs.locale('es');
export const formatDateTime = (date: Date) => {
  const fecha = dayjs(date).format('DD/MM/YYYY HH:mm');
    return fecha
  };

  export const formatDate = (date: Date) => {
    const fecha = dayjs(date).format('DD/MM/YYYY');
      return fecha
    };