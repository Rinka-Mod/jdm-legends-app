/**
 * ==========================================================================
 * JDM LEGENDS — Chính sách mật khẩu.
 *
 * Vì sao cần: mật khẩu yếu là lỗ hổng duy nhất không thể vá bằng cấu hình máy
 * chủ. Bcrypt chỉ bảo vệ được tới mức mật khẩu đủ khó đoán — người tấn công chỉ
 * cần một danh sách vài nghìn mật khẩu phổ biến là đủ quét sạch tài khoản yếu.
 *
 * Ba lớp kiểm tra:
 *   1. độ dài tối thiểu;
 *   2. nằm trong danh sách mật khẩu bị dò nhiều nhất;
 *   3. liên quan tới chính người dùng (tên, phần đầu của email) hoặc quá dễ đoán
 *      (một ký tự lặp lại, chuỗi leo thang kiểu 12345678 / abcdefgh / qwertyui).
 *
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 * ==========================================================================
 */

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 100;

/**
 * Danh sách ngắn những mật khẩu xuất hiện đầu tiên trong hầu hết các cuộc tấn
 * công (lấy từ các bảng xếp hạng rò rỉ dữ liệu phổ biến), thêm vài mật khẩu
 * tiếng Việt và vài từ khoá riêng của dự án.
 */
const COMMON_PASSWORDS = new Set([
  "123456",
  "1234567",
  "12345678",
  "123456789",
  "1234567890",
  "12341234",
  "111111",
  "11111111",
  "000000",
  "00000000",
  "22222222",
  "66666666",
  "88888888",
  "87654321",
  "password",
  "password1",
  "password123",
  "passw0rd",
  "p@ssw0rd",
  "qwerty",
  "qwerty123",
  "qwertyui",
  "qwertyuiop",
  "abc123",
  "abc12345",
  "abcd1234",
  "a1234567",
  "asdfghjk",
  "zxcvbnm",
  "qazwsx",
  "1q2w3e4r",
  "1qaz2wsx",
  "iloveyou",
  "letmein",
  "welcome",
  "welcome1",
  "admin",
  "admin123",
  "administrator",
  "root",
  "root1234",
  "superman",
  "batman",
  "monkey",
  "dragon",
  "master",
  "shadow",
  "sunshine",
  "princess",
  "football",
  "baseball",
  "trustno1",
  "dung1234",
  "matkhau",
  "matkhau1",
  "matkhau123",
  "matkhau1234",
  "matkhau12345",
  "matkhau123456",
  "mk123456",
  "khongcopass",
  "jdmlegends",
  "jdmlegend",
  "jdmlegend123",
  "chihara",
  "rinkamod",
  "nissan",
  "toyota",
  "honda",
  "mazda",
  "supra",
  "skyline",
  "gtr34",
  "s13s14s15",
]);

/** Chuỗi leo thang — mật khẩu chỉ toàn một đoạn nằm trong các chuỗi này là quá dễ đoán. */
const SEQUENCES = [
  "0123456789",
  "1234567890",
  "abcdefghijklmnopqrstuvwxyz",
  "zyxwvutsrqponmlkjihgfedcba",
  "qwertyuiopasdfghjklzxcvbnm",
];

export interface PasswordContext {
  /** Email đăng ký — để chặn mật khẩu chứa phần tên trong email. */
  email?: string;
  /** Tên hiển thị. */
  name?: string;
}

/**
 * Kiểm tra mật khẩu.
 * @returns Thông báo lỗi bằng tiếng Việt, hoặc `null` nếu hợp lệ.
 */
export function passwordProblem(password: string, context: PasswordContext = {}): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Mật khẩu cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Mật khẩu tối đa ${MAX_PASSWORD_LENGTH} ký tự.`;
  }

  const lower = password.toLowerCase();

  if (COMMON_PASSWORDS.has(lower)) {
    return "Mật khẩu này nằm trong danh sách bị dò nhiều nhất. Bạn chọn mật khẩu khác nhé.";
  }

  // Một ký tự lặp lại: aaaaaaaa, 11111111…
  if (/^(.)\1+$/.test(password)) {
    return "Mật khẩu không nên chỉ gồm một ký tự lặp lại.";
  }

  // Toàn bộ phần chữ/số là một đoạn leo thang: 12345678, abcdefgh, qwertyui…
  const plain = lower.replace(/[^a-z0-9]/g, "");
  if (plain.length >= 6 && SEQUENCES.some((sequence) => sequence.includes(plain))) {
    return "Mật khẩu đang là một chuỗi quá dễ đoán (kiểu 12345678). Bạn thêm chữ và ký tự khác nhé.";
  }

  const localPart = context.email?.split("@")[0]?.trim().toLowerCase() ?? "";
  if (localPart.length >= 3 && lower.includes(localPart)) {
    return "Mật khẩu không nên chứa phần tên trong email của bạn.";
  }

  /* So cả tên viết liền: người dùng hay gõ "Nguoi Test" thành "nguoitest123". */
  const displayName = context.name?.trim().toLowerCase() ?? "";
  for (const token of new Set([displayName, displayName.replace(/\s+/g, "")])) {
    if (token.length >= 3 && lower.includes(token)) {
      return "Mật khẩu không nên chứa tên hiển thị của bạn.";
    }
  }

  return null;
}
