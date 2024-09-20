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
export const validateDate = (s: string) => {
  // Kiểm tra định dạng "YYYY-MM-DD HH:MM:SS.SSSSSS"
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}$/;
  // Kiểm tra định dạng "YYYY-MM-DD"
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateTimeRegex.test(s)) {
    return true;  // Chuỗi đã đúng định dạng đầy đủ
  }

  if (dateRegex.test(s)) {
    return true;  // Thêm giờ mặc định vào định dạng ngày
  }

  return false;  // Không thuộc định dạng hợp lệ
}
export const betweenQuery = (s: string) => {
  // Ngày bắt đầu và kết thúc của ngày 2024-12-11
  const startOfDay = (`${s} 00:00:00.000000`);
  const endOfDay = (`${s} 23:59:59.000000`);

  return `HistorySensor.created_at >= '${startOfDay}' AND HistorySensor.created_at <= '${endOfDay}'`;
}

