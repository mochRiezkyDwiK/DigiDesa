// declare module 'multer';
import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Tentukan lokasi penyimpanan berkas secara absolut/relatif
const uploadDir = path.join(__dirname, "../../public/uploads");

// Pastikan folder 'public/uploads' otomatis dibuat jika belum ada di komputer
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Konfigurasi Storage (Tempat penyimpanan & penamaan berkas)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Membuat nama file unik: BUKTI-WAKTU_UNIK.EKSTENSI (Contoh: BUKTI-1715600000000.jpg)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `BUKTI-${uniqueSuffix}${ext}`);
  },
});

// 3. Konfigurasi File Filter (Validasi format berkas semenjak di pintu gerbang)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Hanya menerima file bertipe gambar (jpeg, jpg, png)
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Format berkas tidak didukung! Mohon unggah gambar (.png, .jpg, .jpeg)"));
  }
};

// 4. Inisialisasi Multer dengan batasan ukuran 10MB
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MegaBytes
  },
});