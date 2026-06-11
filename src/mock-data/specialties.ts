export interface Specialty {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  iconUrl?: string;
  doctorCount: number;
  isActive: boolean;
  createdAt: string;
  services?: string[];
}

export const mockSpecialties: Specialty[] = [
  {
    id: "sp001",
    name: "Nội khoa",
    description: "Chẩn đoán và điều trị các bệnh lý nội khoa tổng quát.",
    longDescription: "Khoa Nội khoa Y Khoa Vạn Hạnh cung cấp dịch vụ chẩn đoán và điều trị toàn diện các bệnh lý nội khoa bao gồm bệnh tiêu hoá, hô hấp, nội tiết, cơ xương khớp và thần kinh. Đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại.",
    doctorCount: 8,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    services: ["Khám tổng quát", "Điều trị đái tháo đường", "Tăng huyết áp", "Ri nội soi tiêu hoá", "Bệnh phổi COPD", "Bệnh thần kinh"],
  },
  {
    id: "sp002",
    name: "Tim mạch",
    description: "Chuyên điều trị các bệnh lý tim mạch và huyết áp.",
    longDescription: "Khoa Tim mạch trang bị hệ thống máy móc hiện đại: siêu âm tim 4D, máy điện tâm đồ 24h Holter, máy đo huyết áp lưu động. Phẫu thuật can thiệp mạch vành, đặt stent và máy tạo nhịp.",
    doctorCount: 5,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    services: ["Siêu âm tim", "Chụp mạch vành", "Đặt stent", "Máy tạo nhịp", "Holter điện tâm đồ", "Đo ABPM"],
  },
  {
    id: "sp003",
    name: "Sản phụ khoa",
    description: "Thai sản, sinh đẻ và các bệnh phụ khoa.",
    longDescription: "Khoa Sản phụ khoa cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho phụ nữ từ tuổi dậy thì. Phòng sinh hiện đại, phẫu thuật nội soi, siêu âm thai kỳ 4D.",
    doctorCount: 6,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    services: ["Khám thai định kỳ", "Siêu âm 4D", "Phân tich NST", "Phụ khoa", "Phẫu thuật nội soi", "Tư vấn kế hoạch gia đình"],
  },
  {
    id: "sp004",
    name: "Nhi khoa",
    description: "Chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi.",
    longDescription: "Khoa Nhi Vạn Hạnh chuyên chăm sóc sức khỏe trẻ em với đội ngũ bác sĩ nhi khoa giàu kinh nghiệm. Phòng khám thiết kế thân thiện với trẻ em, trang thiết bị chuyên dụng cho nhi.",
    doctorCount: 4,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    services: ["Tiêm chủng", "Khám sơ sinh", "Bệnh hô hấp trẻ", "Suy dinh dưỡng", "Dị ứng", "Tư vấn phat triển"],
  },
  {
    id: "sp005",
    name: "Ngoại khoa",
    description: "Phẫu thuật và điều trị các bệnh lý ngoại khoa.",
    longDescription: "Khoa Ngoại khoa Y Khoa Vạn Hạnh với trang thiết bị phẫu thuật hiện đại, phòng mổ đạt tiêu chuẩn quốc tế. Chuyên phẫu thuật nội soi ít xâm lấn.",
    doctorCount: 7,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    services: ["Phẫu thuật nội soi", "Cắt ruột thừa", "Sởi mật", "Thoát vị", "Chấn thương", "Ung thư đại tràng"],
  },
  {
    id: "sp006",
    name: "Xương khớp",
    description: "Chẩn đoán và điều trị bệnh cơ xương khớp.",
    longDescription: "Khoa Xương khớp chuyên điều trị các bệnh viêm khớp, thoái hoá khớp, gout, loãng xương. Thực hiện phẫu thuật thay khớp, điều trị bệnh cột sống.",
    doctorCount: 3,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    services: ["Viêm khớp", "Gout", "Loãng xương", "Thay khớp", "Thoát vị đĩa đệm", "Vật lý trị liệu"],
  },
  {
    id: "sp007",
    name: "Da liễu",
    description: "Khám và điều trị các bệnh về da, tóc và móng.",
    longDescription: "Khoa Da liễu cung cấp dịch vụ chẩn đoán và điều trị các bệnh da liễu phổ biến. Trang thiết bị laser hiện đại. Dịch vụ da thẩm mỹ kết hợp chăm sóc da y khoa.",
    doctorCount: 3,
    isActive: true,
    createdAt: "2023-06-01T00:00:00Z",
    services: ["Trị mụn", "Trị nấm da", "Laser", "Nhởi đầy (filler)", "Tăng tiết mồ hôi", "Điều trị vẩy nến"],
  },
  {
    id: "sp008",
    name: "Mắt",
    description: "Chăm sóc và điều trị các bệnh về mắt.",
    longDescription: "Khoa Mắt trang bị máy móc chẩn đoán mắt hiện đại. Thực hiện phẫu thuật đục thủy tinh thể, lưởi trạm, điều trị glaucoma.",
    doctorCount: 2,
    isActive: true,
    createdAt: "2023-08-01T00:00:00Z",
    services: ["Khám mắt cơ bản", "Đục thủy tinh thể", "Glaucoma", "Lưới trạm", "Thiếu thị lực", "Lưởi trạm"],
  },
];
