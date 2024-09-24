export enum HttpStatusCodeDescription {
  SUCCESS = 'Success',
  CREATED = 'Created',
  BAD_REQUEST = 'Bad request',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  NOT_FOUND = 'Not found',
  UNAUTHORIZED = 'Unauthorized',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  FORBIDDEN = 'Forbidden',
}
export const convertDate = (s) => {
  // Kiểm tra xem chuỗi có đúng định dạng dd/MM/yyyy hay không
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = s.match(dateRegex);

  if (!match) {
    return false; // Nếu không đúng định dạng, trả về false
  }

  const [_, day, month, year] = match;

  // Chuyển đổi sang định dạng yyyy-MM-dd
  const formattedDate = `${year}-${month}-${day}`;

  // Tạo object chứa startOfDay và endOfDay với .000000
  const result = {
    startOfDay: `${formattedDate} 00:00:00.000000`,
    endOfDay: `${formattedDate} 23:59:59.000000`
  };

  return result;
}
export const convertDate2 = (s) => {
  // Kiểm tra xem chuỗi có đúng định dạng dd/MM/yyyy hay không
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = s.match(dateRegex);

  if (!match) {
    return false; // Nếu không đúng định dạng, trả về false
  }

  const [_, day, month, year] = match;

  // Chuyển đổi sang định dạng yyyy-MM-dd
  const formattedDate = `${year}-${month}-${day}`;

  // Tạo object chứa startOfDay và endOfDay với .000000
  const result = {
    startOfDay: `${formattedDate} 00:00:00.000000`,
    endOfDay: `${formattedDate} 23:59:59.000000`
  };

  return result;
}
export const betweenQuery = (s: any) => {
  return `HistorySensor.created_at >= '${s.startOfDay}' AND HistorySensor.created_at <= '${s.endOfDay}'`;
}
export const betweenQuery2 = (s: any) => {
  return `HistoryAction.created_at >= '${s.startOfDay}' AND HistoryAction.created_at <= '${s.endOfDay}'`;
}

