/**
 * JDM LEGENDS — Thư viện xe
 * Tác giả gốc / Original author: Rinka-Mod
 * © 2026 Rinka-Mod. All rights reserved.
 * Credit required when reused (xem LICENSE.md).
 */

export type BodyShape = "coupe" | "hatch" | "sedan";
export type Drivetrain = "FR" | "AWD" | "MR" | "FF";

export interface Car {
  id: string;
  brand: string;
  brandJp: string;
  name: string;
  code: string;
  year: number;
  kanji: string;
  shape: BodyShape;
  c1: string;
  c2: string;
  tagline: string;
  story: string;
  power: number;
  torque: number;
  accel: number;
  weight: number;
  drivetrain: Drivetrain;
  legacy: number;
  highlights: string[];
}

export const CARS: Car[] = [
  {
    id: "supra-a80",
    brand: "Toyota",
    brandJp: "トヨタ",
    name: "Supra MK4",
    code: "A80 · 2JZ-GTE",
    year: 1993,
    kanji: "牛魔王",
    shape: "coupe",
    c1: "#ff4d3d",
    c2: "#3a0b12",
    tagline: "Cỗ máy 2JZ huyền thoại — khối động cơ không thể phá huỷ.",
    story:
      "Supra A80 ra đời năm 1993 với khối 2JZ-GTE sắt gang và hai turbo song song. Động cơ này bền tới mức trở thành huyền thoại trong giới độ xe: có thể đẩy lên 700–1000 mã lực mà gần như không cần thay chi tiết bên trong. Thân xe cong mềm, đèn pha 'mắt ếch' và cánh gió lớn đã biến Supra thành gương mặt của cả một thế hệ phim ảnh và game đua xe.",
    power: 320,
    torque: 431,
    accel: 4.9,
    weight: 1510,
    drivetrain: "FR",
    legacy: 98,
    highlights: [
      "Khối 2JZ-GTE chịu tải cực cao, nền tảng của mọi bản độ dòng T6",
      "Getrag V160 hộp số 6 cấp sản xuất riêng cho Supra turbo",
      "Bản Mỹ 1997 chỉ có 3 bản số sàn, hiện là món sưu tầm đắt nhất dòng",
    ],
  },
  {
    id: "gtr-r34",
    brand: "Nissan",
    brandJp: "日産",
    name: "Skyline GT-R",
    code: "R34 · RB26DETT",
    year: 1999,
    kanji: "战神",
    shape: "sedan",
    c1: "#48c9ff",
    c2: "#062033",
    tagline: "Godzilla — cỗ máy AWD khiến cả siêu xe châu Âu phải dè chừng.",
    story:
      "R34 là bản cuối cùng của dòng RB26 với hệ dẫn động bốn bánh ATTESA E-TS và lái bốn bánh HICAS. Khối RB26DETT công bố 280 PS theo 'thoả thuận quý ông' nhưng thực tế mạnh hơn nhiều, chịu boost cao và cực bền dưới tay dân độ. Màn hình đa thông tin MFD hiển thị lực G và boost là chi tiết mang tính biểu tượng.",
    power: 280,
    torque: 392,
    accel: 5.0,
    weight: 1560,
    drivetrain: "AWD",
    legacy: 100,
    highlights: [
      "ATTESA E-TS chia lực kéo điện tử, gần như không thể hết bám",
      "Khối RB26DETT sắt gang + twin turbo, chịu 500+ PS khi lên đồ",
      "Bản V-Spec II Nür là chiếc R34 đắt giá nhất trong giới sưu tầm",
    ],
  },
  {
    id: "rx7-fd",
    brand: "Mazda",
    brandJp: "マツダ",
    name: "RX-7",
    code: "FD3S · 13B-REW",
    year: 1992,
    kanji: "回転",
    shape: "coupe",
    c1: "#ffb347",
    c2: "#3a2308",
    tagline: "Động cơ quay 13B — âm thanh cao vút như tua-bin.",
    story:
      "RX-7 FD dùng động cơ Wankel twin-turbo 13B-REW: nhỏ, nhẹ, đặt sau trục trước gần như hoàn hảo nên cân bằng gần 50:50. Thân xe mềm mại theo ngôn ngữ 'organic' của Mazda đầu thập niên 90. Chính sự nhẹ nhõm và tiếng máy VVVRRRR đặc trưng đã biến FD thành vũ khí tối thượng trên các cung đèo touge.",
    power: 280,
    torque: 314,
    accel: 5.3,
    weight: 1270,
    drivetrain: "FR",
    legacy: 94,
    highlights: [
      "Động cơ quay 13B-REW, 2 rotor, tuabin nối tiếp ở vòng tua cao",
      "Trọng lượng chỉ ~1 270 kg — nhẹ nhất trong nhóm huyền thoại",
      "Hệ treo sau độc lập đa liên kết, cân bằng gần hoàn hảo",
    ],
  },
  {
    id: "nsx-na1",
    brand: "Honda",
    brandJp: "ホンダ",
    name: "NSX",
    code: "NA1 · C30A VTEC",
    year: 1990,
    kanji: "東洋",
    shape: "coupe",
    c1: "#ff3d4e",
    c2: "#2a0710",
    tagline: "Chiếc siêu xe do Ayrton Senna đóng góp ý kiến khi phát triển.",
    story:
      "Honda NSX là siêu xe động cơ giữa đầu tiên của Nhật, khung nhôm toàn phần và chỉ nặng 1 370 kg. Senna, khi đó đang lái cho McLaren-Honda, đã phản hồi trực tiếp về độ cứng thân xe trong quá trình thử nghiệm tại Suzuka. Cabin bố trí rộng rãi, tầm nhìn tốt — NSX là chuẩn mực 'siêu xe dùng hằng ngày'.",
    power: 274,
    torque: 285,
    accel: 5.2,
    weight: 1370,
    drivetrain: "MR",
    legacy: 96,
    highlights: [
      "Khung monocoque nhôm: nhẹ hơn cả Porsche 911 cùng thời",
      "Động cơ V6 C30A với VTEC, đặt giữa sau ghế",
      "Là 'siêu xe hằng ngày' đầu tiên của ngành ô tô Nhật",
    ],
  },
  {
    id: "evo-6",
    brand: "Mitsubishi",
    brandJp: "三菱",
    name: "Lancer Evolution VI",
    code: "CP9A · 4G63T",
    year: 1999,
    kanji: "進化",
    shape: "sedan",
    c1: "#f5f5f7",
    c2: "#1c1f26",
    tagline: "Sedan tăng áp dẫn động 4 bánh, sinh ra cho đường đua rally.",
    story:
      "Evolution VI là đỉnh cao của dòng 4G63 trong thời kỳ WRC. Khối 4G63T xoay cam 180 độ, turbo Titan, bộ làm mát khí nạp lớn hơn và cản trước có các lỗ khí 'tomcat'. Với vi sai chủ động AYC và hệ AWD kèm khoá trung tâm, Evo VI ôm cua tựa như chạy trên ray.",
    power: 280,
    torque: 373,
    accel: 4.8,
    weight: 1360,
    drivetrain: "AWD",
    legacy: 91,
    highlights: [
      "Turbo Titan + hệ làm mát khí nạp lớn cho bản Tommi Mäkinen",
      "Vi sai chủ động AYC giúp xoay xe vào cua cực nhanh",
      "Bản RS chỉ có 8 chi tiết tiện nghi — cân nặng tối giản cho đua",
    ],
  },
  {
    id: "wrx-22b",
    brand: "Subaru",
    brandJp: "スバル",
    name: "Impreza 22B STi",
    code: "GC8 · EJ22",
    year: 1998,
    kanji: "星屑",
    shape: "coupe",
    c1: "#4d6bff",
    c2: "#0a1230",
    tagline: "Chỉ 400 chiếc — huyền thoại boxer tăng áp của Subaru.",
    story:
      "22B STi ra đời để kỷ niệm ba chức vô địch WRC liên tiếp. Chỉ 400 chiếc được sản xuất, tất cả đều màu xanh WR Blue, với thân xe rộng cơ bắp, boxer EJ22 dung tích 2.2L và hệ AWD điều khiển điện tử. Đây là chiếc Subaru được săn lùng nhiều nhất mọi thời đại.",
    power: 280,
    torque: 363,
    accel: 4.7,
    weight: 1270,
    drivetrain: "AWD",
    legacy: 95,
    highlights: [
      "Động cơ boxer EJ22 dung tích lớn hơn bản thương mại",
      "Chỉ 400 chiếc cho thị trường Nhật, số khung độc quyền",
      "Thân xe rộng hơn 80 mm so với WRX STi thường",
    ],
  },
  {
    id: "silvia-s15",
    brand: "Nissan",
    brandJp: "日産",
    name: "Silvia S15",
    code: "S15 · SR20DET",
    year: 1999,
    kanji: "七星",
    shape: "coupe",
    c1: "#8affc1",
    c2: "#05261a",
    tagline: "Chiếc coupé drift quốc dân của mọi sân gymkhana.",
    story:
      "S15 là bản cuối của dòng Silvia với khối SR20DET nhẹ, phân bổ lực tốt và cầu sau thuần chất. Hộp số 6 cấp với bộ vi sai hạn chế trượt giúp S15 quay đầu cực mượt, biến nó thành lựa chọn mặc định của dân drift chuyên nghiệp và mọi giải D1 Grand Prix.",
    power: 250,
    torque: 275,
    accel: 5.9,
    weight: 1240,
    drivetrain: "FR",
    legacy: 88,
    highlights: [
      "SR20DET nhẹ nên mũi xe rất thoát, vào cua lanh lẹ",
      "Bản Spec-R có thêm bộ tản nhiệt dầu và vi sai hạn chế trượt",
      "Nền tảng drift phổ biến nhất ở D1 Grand Prix",
    ],
  },
  {
    id: "ae86",
    brand: "Toyota",
    brandJp: "トヨタ",
    name: "Sprinter Trueno",
    code: "AE86 · 4A-GE",
    year: 1983,
    kanji: "熊猫",
    shape: "hatch",
    c1: "#f4f5f8",
    c2: "#26282f",
    tagline: "Hai tông màu trắng–đen, hậu duệ của huyền thoại touge.",
    story:
      "AE86 không mạnh — chỉ 130 PS từ khối 4A-GE 16 van — nhưng nhẹ 970 kg, cầu sau và hệ treo sau trục thanh giằng đơn giản. Chính sự cân bằng đó, cùng hình ảnh trong manga/anime Initial D, đã biến AE86 thành biểu tượng của văn hoá touge và trường phái drifting nguyên bản.",
    power: 130,
    torque: 149,
    accel: 8.0,
    weight: 970,
    drivetrain: "FR",
    legacy: 93,
    highlights: [
      "Khối 4A-GE 16 van đầu tiên dùng công nghệ đa van của Toyota",
      "Chỉ ~970 kg — tỷ lệ công suất/trọng lượng rất tốt cho thời đó",
      "Bất tử hoá qua manga Initial D của Shuichi Shigeno",
    ],
  },
  {
    id: "civic-ek9",
    brand: "Honda",
    brandJp: "ホンダ",
    name: "Civic Type R",
    code: "EK9 · B16B",
    year: 1997,
    kanji: "赤頭",
    shape: "hatch",
    c1: "#ff2d3f",
    c2: "#2b060c",
    tagline: "Chiếc Type R đầu tiên — VTEC hú ở 8 600 vòng tua.",
    story:
      "EK9 là Type R đầu tiên của Honda, dùng khối B16B dung tích 1.6L nhưng đạt 185 PS ở 8 200 vòng tua và đỏ máy tới 8 600. Thân xe hàn tay với các mối hàn bổ sung, khung nhẹ, phanh chỉnh tay nặng — mọi thứ nhằm phục vụ việc đua đường vòng.",
    power: 185,
    torque: 160,
    accel: 6.7,
    weight: 1070,
    drivetrain: "FF",
    legacy: 87,
    highlights: [
      "B16B đạt 115 PS/lít — cao nhất trong động cơ hút khí tự nhiên thời bấy giờ",
      "Thân xe hàn tay với các mối hàn gia cường thêm",
      "Đồng hồ vòng tua chia vạch đỏ tới 10 000 rpm",
    ],
  },
  {
    id: "chaser-jzx100",
    brand: "Toyota",
    brandJp: "トヨタ",
    name: "Chaser Tourer V",
    code: "JZX100 · 1JZ-GTE",
    year: 1996,
    kanji: "湾岸",
    shape: "sedan",
    c1: "#9ad9ff",
    c2: "#0a1b2b",
    tagline: "Sedan 1JZ — nữ hoàng của đường cao tốc Wangan.",
    story:
      "Chaser Tourer V là chiếc sedan bốn cửa với khối 1JZ-GTE twin turbo và cầu sau: vừa đủ kín cho hành khách, vừa đủ khét cho những đêm chạy 300 km/h trên đường Bayshore. Giá rẻ và cấu hình lý tưởng biến nó thành 'cỗ máy tốc độ giá rẻ' của dân Wangan.",
    power: 280,
    torque: 378,
    accel: 5.8,
    weight: 1520,
    drivetrain: "FR",
    legacy: 82,
    highlights: [
      "1JZ-GTE twin turbo: âm thanh đặc trưng, cực bền ở vòng tua cao",
      "Sedan 4 cửa nhưng khung gầm dùng chung với dòng Supra",
      "Lựa chọn tiêu chuẩn cho trường phái chạy Wangan ban đêm",
    ],
  },
  {
    id: "240z-s30",
    brand: "Nissan",
    brandJp: "日産",
    name: "Fairlady Z",
    code: "S30 · L24",
    year: 1969,
    kanji: "悪魔",
    shape: "coupe",
    c1: "#e0b25c",
    c2: "#2c1e05",
    tagline: "Nơi tất cả bắt đầu — 'Devil Z' của thập niên 70.",
    story:
      "Datsun 240Z là cú hích đưa xe thể thao Nhật ra thế giới: mũi dài, đuôi ngắn, động cơ 2.4L thẳng hàng và giá chưa bằng một nửa Jaguar E-Type. Ở Nhật, chiếc xe này gắn với truyền thuyết 'Devil Z' và những chuyến chạy xuyên đêm trên cao tốc.",
    power: 151,
    torque: 199,
    accel: 8.9,
    weight: 1050,
    drivetrain: "FR",
    legacy: 89,
    highlights: [
      "Thiết kế mũi dài – đuôi ngắn kinh điển, lấy cảm hứng từ xe Ý",
      "Bán chạy nhất lịch sử xe thể thao nhập khẩu vào Mỹ giai đoạn 1970s",
      "Nguồn cảm hứng cho truyền thuyết 'Devil Z' trong Wangan Midnight",
    ],
  },
  {
    id: "350z-z33",
    brand: "Nissan",
    brandJp: "日産",
    name: "350Z",
    code: "Z33 · VQ35DE",
    year: 2002,
    kanji: "再来",
    shape: "coupe",
    c1: "#b28bff",
    c2: "#1d0f33",
    tagline: "Hơi thở JDM hiện đại của dòng Fairlady Z.",
    story:
      "350Z đánh dấu sự trở lại của dòng Z sau gần sáu năm vắng bóng, với khối V6 VQ35DE hút khí tự nhiên đạt 287 PS và vẻ ngoài cơ bắp đậm chất thép Nhật. Đây cũng là mẫu xe mở ra làn sóng drift hiện đại và nền tảng platform dùng chung với Infiniti G35.",
    power: 287,
    torque: 371,
    accel: 5.4,
    weight: 1450,
    drivetrain: "FR",
    legacy: 80,
    highlights: [
      "V6 VQ35DE hút khí tự nhiên, dải tua rộng và mượt",
      "Thanh giằng chống xoắn khoang máy là chi tiết nhận diện đặc trưng",
      "Nền tảng FM dùng chung với Infiniti G35 Skyline",
    ],
  },
];
