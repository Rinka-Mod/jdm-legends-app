/**
 * JDM LEGENDS — Kho tri thức trợ lý Chihara Mai
 * Tác giả gốc / Original author: Rinka-Mod
 * © 2026 Rinka-Mod. All rights reserved.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const CHAT_GREETING =
  "Chào bạn 👋 Mình là Chihara Mai.\n" +
  "Chọn một câu hỏi bên dưới, mình trả lời ngay cho bạn nhé.";

export const CHAT_NOTICE =
  "Ý tưởng ban đầu là mình sẽ thành một chatbot AI thật sự trong web này. " +
  "Nhưng Rinka vừa mới mua tay cầm nên đã hết kinh phí 😅 — khi nào có kinh phí mình sẽ được cải tiến sau. " +
  "Trong lúc chờ, bạn bấm một câu hỏi có sẵn ở trên để mình trả lời nhé!";

export const CHAT_FAQ: FaqItem[] = [
  {
    q: "JDM là gì?",
    a: "JDM là viết tắt của Japanese Domestic Market — xe và phụ tùng sản xuất, phân phối chính thức tại thị trường nội địa Nhật Bản, thường là tay lái nghịch (RHD). Ngày nay “JDM” còn là biểu tượng văn hoá chỉ dòng xe thể thao hiệu suất cao của Nhật thời hoàng kim 1980–2000, nổi tiếng nhờ khả năng độ chế và động cơ bền bỉ.",
  },
  {
    q: "Thoả thuận Quý ông 276 mã lực là gì?",
    a: "Năm 1989, hiệp hội các nhà sản xuất ô tô Nhật Bản (JAMA) thông qua một thoả thuận ngầm giới hạn công suất xe thương mại bán tại Nhật ở mức 276 mã lực (206 kW) nhằm giảm tai nạn giao thông. Nhiều xe thực tế mạnh hơn con số công bố. Thoả thuận chấm dứt năm 2004.",
  },
  {
    q: "Vì sao Supra MK4 nổi tiếng?",
    a: "Supra A80 (1993) dùng khối 2JZ-GTE I6 twin-turbo: 320 PS · 431 Nm · 0–100 km/h 4.9 giây. Khối sắt gang này bền tới mức có thể đẩy lên 700–1000 mã lực mà gần như không cần thay chi tiết bên trong — biến Supra thành huyền thoại của giới độ xe.",
  },
  {
    q: "Skyline GT-R R34 có gì đặc biệt?",
    a: "R34 (1999) là bản cuối dùng khối RB26DETT cùng hệ dẫn động 4 bánh ATTESA E-TS và lái 4 bánh HICAS, nên được gọi là “Godzilla”. Công suất công bố 280 PS theo thoả thuận nhưng thực tế mạnh hơn; bản V-Spec II Nür là chiếc đắt giá nhất trong giới sưu tầm.",
  },
  {
    q: "Động cơ quay của RX-7 là gì?",
    a: "RX-7 FD3S (1992) dùng động cơ Wankel 13B-REW: 2 rotor, twin-turbo, 280 PS · 314 Nm, chỉ nặng khoảng 1 270 kg. Vì không có piston lên xuống nên máy nhỏ, nhẹ và cân bằng gần 50:50 — nhưng tiếng máy cao vút như tua-bin mới là thứ không thể lẫn.",
  },
  {
    q: "NSX liên quan gì tới Ayrton Senna?",
    a: "Honda NSX (1990) là siêu xe động cơ giữa đầu tiên của Nhật, khung nhôm monocoque, nặng khoảng 1 370 kg. Khi đó Senna đang lái cho McLaren-Honda và đã góp ý trực tiếp về độ cứng thân xe trong lần thử tại Suzuka. Xe đạt 274 PS · 285 Nm · 0–100 km/h 5.2 giây.",
  },
  {
    q: "Lancer Evo VI và Impreza 22B khác nhau thế nào?",
    a: "Cả hai đều AWD, 280 PS và sinh ra từ đường đua WRC. Evo VI (1999) dùng 4G63T I4 turbo, 373 Nm, có vi sai chủ động AYC nên xoay xe vào cua rất nhanh. Impreza 22B STi (1998) dùng boxer EJ22 turbo, 363 Nm, chỉ sản xuất 400 chiếc nên giá trị sưu tầm cao hơn.",
  },
  {
    q: "Xe nào nhẹ nhất trong thư viện?",
    a: "Toyota Sprinter Trueno AE86 nhẹ nhất với khoảng 970 kg. Tiếp theo là Silvia S15 (~1 240 kg), rồi RX-7 FD và Impreza 22B (cùng khoảng 1 270 kg).",
  },
  {
    q: "Xe nào tăng tốc 0–100 nhanh nhất?",
    a: "Impreza 22B STi dẫn đầu với 4.7 giây, sát sau là Lancer Evolution VI 4.8 giây và Supra MK4 4.9 giây. Đây đều là xe AWD bám đường tốt hoặc có công suất lớn.",
  },
  {
    q: "Xe nào mạnh nhất thư viện?",
    a: "Supra MK4 dẫn đầu với 320 PS và 431 Nm. Tiếp theo là 350Z (287 PS), rồi tới nhóm 280 PS gồm GT-R R34, RX-7 FD, Evo VI, Impreza 22B và Chaser JZX100.",
  },
  {
    q: "AE86 có gì mà nổi tiếng vậy?",
    a: "AE86 (1983) chỉ có 130 PS từ khối 4A-GE 1.6L 16 van, nhưng nhẹ (~970 kg), cầu sau và hệ treo đơn giản nên cực cân bằng. Chính manga/anime Initial D của Shuichi Shigeno đã biến nó thành biểu tượng của văn hoá đua đèo.",
  },
  {
    q: "Silvia S15 có phải xe để drift không?",
    a: "Đúng. S15 (1999) dùng khối SR20DET nhẹ với 250 PS · 275 Nm, cầu sau, hộp số 6 cấp và vi sai hạn chế trượt. Cấu hình đó khiến nó thành lựa chọn mặc định ở các giải D1 Grand Prix, nên được gọi là chiếc coupé drift “quốc dân”.",
  },
  {
    q: "Chaser JZX100 và văn hoá Wangan?",
    a: "Chaser Tourer V (1996) là sedan 4 cửa dùng khối 1JZ-GTE twin-turbo, 280 PS · 378 Nm, dùng chung khung gầm với Supra. Vừa kín đáo vừa nhanh, nó trở thành lựa chọn tiêu chuẩn của dân chạy tốc độ trên đường cao tốc vịnh Tokyo (Wangan).",
  },
  {
    q: "Nguồn gốc dòng Z và truyền thuyết “Devil Z”?",
    a: "Datsun 240Z / Fairlady Z S30 (1969) dùng khối L24 I6 2.4L, 151 PS, thiết kế mũi dài – đuôi ngắn, giá chỉ bằng một nửa Jaguar E-Type thời đó. Ở Nhật nó gắn với truyền thuyết “Devil Z” trong Wangan Midnight.",
  },
  {
    q: "350Z có gì mới?",
    a: "350Z (2002) đánh dấu sự trở lại của dòng Z sau gần 6 năm, dùng khối VQ35DE V6 3.5L hút khí tự nhiên: 287 PS · 371 Nm · 0–100 km/h 5.4 giây. Đây là mẫu JDM hiện đại, nền tảng FM dùng chung với Infiniti G35.",
  },
  {
    q: "Civic Type R EK9 có gì đặc biệt?",
    a: "EK9 (1997) là chiếc Type R đầu tiên của Honda: khối B16B 1.6L hút khí tự nhiên đạt 185 PS, tương đương 115 PS/lít — cao nhất thời bấy giờ, đỏ máy tới 8 600 vòng tua. Thân xe hàn tay với các mối hàn gia cường thêm.",
  },
  {
    q: "Touge, Wangan và Kanjozoku là gì?",
    a: "Touge là chạy đèo đêm trên đường núi hẹp nhiều khúc cua, nơi kỹ năng quan trọng hơn mã lực. Wangan là đường cao tốc vịnh Tokyo, địa hạt của tốc độ trên 300 km/h. Kanjozoku là nhóm chạy vòng quanh Osaka, nổi tiếng với lối chạy đan nhau trên cao tốc.",
  },
  {
    q: "Thương hiệu độ xe JDM nổi tiếng nào?",
    a: "Những tên tuổi lớn gồm HKS, GReddy, Spoon Sports, Mugen, Mines và VeilSide. Họ là phần quan trọng của văn hoá tuning Nhật — từ turbo, ECU cho tới bodykit và aero.",
  },
  {
    q: "Xe JDM nào có giá sưu tầm cao nhất?",
    a: "Xe JDM nguyên bản thập niên 90 đang tăng giá rất mạnh. Đắt giá nhất thường là Nissan R34 GT-R (nhất là bản V-Spec II Nür) và Toyota Supra MK4 (đặc biệt bản số sàn Mỹ 1997) — có chiếc đã lên tới hàng trăm nghìn USD.",
  },
  {
    q: "Xu hướng JDM hiện nay thế nào?",
    a: "Ba hướng chính: sưu tầm xe nguyên bản với giá tăng phi mã, restomod (tân trang khung gầm cũ bằng công nghệ mới), và áp lực từ tiêu chuẩn khí thải ngày càng khắt khe với xe động cơ đốt trong hiệu suất cao.",
  },
];
