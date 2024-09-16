import dayjs from "dayjs";
dayjs.locale('es');
export const formatDateTime = (date: Date) => {
  const fecha = dayjs(date).format('DD/MM/YYYY HH:mm:ss');
    return fecha
  };

  export const  formatDateTimeFormat2 = (date: Date) => {
    const fecha = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    return fecha
    
  }
  

  export const formatDate = (date: Date) => {
    const fecha = dayjs(date).add(6, 'hour').format('DD/MM/YYYY');
      return fecha
    };