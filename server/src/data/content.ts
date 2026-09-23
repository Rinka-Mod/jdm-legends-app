/**
 * JDM LEGENDS — Dòng thời gian & văn hoá
 * Tác giả gốc / Original author: Rinka-Mod
 * © 2026 Rinka-Mod. All rights reserved.
 */

export interface Era {
  year: string;
  k: string;
  title: string;
  desc: string;
  cars: string[];
}

export interface CultureTopic {
  en: string;
  jp: string;
  desc: string;
}

export const ERAS: Era[] = [
  {
    year: "1965",
    k: "黎明",
    title: "Bình minh",
    desc: "Ngành ô tô Nhật chuyển mình từ xe mini dân dụng sang xe thể thao thực thụ. Những chiếc coupé hai cửa đầu tiên với động cơ thẳng hàng ra đời, mở đường cho hình ảnh nước Nhật trên bản đồ xe thế giới.",
    cars: ["Honda S800", "Toyota 2000GT"],
  },
  {
    year: "1970",
    k: "公害",
    title: "Khủng hoảng khí thải",
    desc: "Luật khí thải khắt khe của Mỹ và Nhật buộc các hãng tái cấu trúc động cơ. Mazda chọn con đường động cơ quay Wankel — cược lớn nhưng tạo dấu ấn không thể trộn lẫn.",
    cars: ["Datsun 240Z", "Mazda RX-3"],
  },
  {
    year: "1980",
    k: "黄金",
    title: "Bong bóng",
    desc: "Thời kỳ bubble kinh tế: tiền đổ vào R&D không giới hạn. Xe cầu sau nhẹ, máy 16 van và văn hoá độ xe đường phố bùng nổ thành các nhóm hasiriya có tổ chức.",
    cars: ["AE86", "R31 Skyline"],
  },
  {
    year: "1990",
    k: "頂点",
    title: "Đỉnh cao",
    desc: "Thập niên hoàng kim: mỗi hãng đều có một huyền thoại. Quy ước ngầm giới hạn 280 PS xuất hiện, nhưng chính nó lại thúc đẩy cuộc đua khí động học và khung gầm.",
    cars: ["NSX", "Supra A80", "R32 GT-R", "RX-7 FD"],
  },
  {
    year: "2000",
    k: "伝説",
    title: "Huyền thoại hoá",
    desc: "R34, Evo VI, Impreza 22B đóng lại kỷ nguyên analog. Drift trở thành môn thể thao chính thức và đường Bayshore viết tiếp truyện Wangan bằng dân chạy tốc độ cực đại.",
    cars: ["R34 GT-R", "Evo VI", "S15", "22B STi"],
  },
  {
    year: "NAY",
    k: "継承",
    title: "Kế thừa",
    desc: "Xe JDM sạch trở thành tài sản sưu tầm toàn cầu. Các xưởng restomod đưa khung gầm cũ lên hệ điện tử mới, còn cộng đồng trẻ tiếp tục giữ ngôn ngữ độ xe nguyên bản.",
    cars: ["Restomod", "Legacy Parts", "Đấu giá quốc tế"],
  },
];

export const CULTURE: CultureTopic[] = [
  {
    en: "Touge",
    jp: "峠",
    desc: "Chạy đèo đêm: những cung đường núi hẹp với hàng trăm khúc cua, nơi kỹ năng quan trọng hơn mã lực.",
  },
  {
    en: "Wangan",
    jp: "湾岸",
    desc: "Đường cao tốc vịnh Tokyo — địa hạt của tốc độ trên 300 km/h và những đội đua tốc độ cực đại.",
  },
  {
    en: "Kanjozoku",
    jp: "環状族",
    desc: "Nhóm chạy vòng lặp quanh Osaka, nổi tiếng với lối chạy đan nhau trên cao tốc giữa dòng xe đông.",
  },
  {
    en: "Bōsōzoku",
    jp: "暴走族",
    desc: "Phong trào nổi loạn thập niên 80 với ống xả vểnh cao, tem vẽ rực rỡ và âm thanh vang khắp phố.",
  },
  {
    en: "Hashiriya",
    jp: "走り屋",
    desc: "Dân chạy đường: cộng đồng dùng xe cũ, tự độ máy trong garage nhỏ và chia sẻ dữ liệu track bằng sổ tay.",
  },
  {
    en: "Itasha",
    jp: "痛車",
    desc: "Xe dán decal anime — đẹp hay 'đau đớn' tuỳ người xem, nhưng chắc chắn là phần rực rỡ nhất của văn hoá xe Nhật.",
  },
  {
    en: "Kansei",
    jp: "感性",
    desc: "Cảm nhận kỹ thuật đến từ trực giác: thứ khiến người độ xe Nhật tin vào 'tay lái' hơn cả thông số.",
  },
  {
    en: "Junk Yard",
    jp: "廃車",
    desc: "Bãi xe phế liệu là kho linh kiện quốc dân — nguồn phụ tùng và nơi khai sinh nhiều bản độ kỳ dị nhất.",
  },
];
