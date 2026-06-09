import axios from "axios";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import * as cheerio from "cheerio";
import { Request, Response } from "express";

const BASE_URL = "https://bandungbaratkab.go.id";
const NEWS_URL = `${BASE_URL}/news-article`;

const getAbsoluteUrl = (href: string) => {
  if (href.startsWith("http")) return href;
  return `${BASE_URL}${href.startsWith("/") ? href : `/${href}`}`;
};

const cleanText = (value: string) => value.replace(/\s+/g, " ").trim();

const requestOptions = {
  timeout: 15000,
  headers: {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
};

const getDetailImage = async (link: string) => {
  try {
    const response = await axios.get(link, requestOptions);
    const $ = cheerio.load(response.data);
    const imageSrc =
      $('meta[property="og:image"]').attr("content") ||
      $("img.img-fluid").first().attr("src") ||
      $('img[src*="/storage/uploads/"]').first().attr("src") ||
      $('img[src*="/storage/article-thumbnail/"]').first().attr("src") ||
      "";

    return imageSrc ? getAbsoluteUrl(imageSrc) : "";
  } catch {
    return "";
  }
};

const getExcerpt = (text: string, title: string, kategori: string, tanggal: string) => {
  const cleaned = cleanText(
    text
      .replace(title, "")
      .replace(kategori, "")
      .replace(tanggal, "")
      .replace(/Admin/g, ""),
  );

  return cleaned.length > 180 ? `${cleaned.slice(0, 180)}...` : cleaned;
};

export const getPengumuman = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 20);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const category = typeof req.query.category === "string" ? req.query.category : "";

    const response = await axios.get(NEWS_URL, {
      params: {
        ...(page > 1 ? { page } : {}),
        ...(category ? { category } : {}),
      },
      ...requestOptions,
    });

    const $ = cheerio.load(response.data);
    const data: any[] = [];
    const usedLinks = new Set<string>();

    $('a.text-two-lines[href*="/news-article/read/"], a.fw-semibold[href*="/news-article/read/"]').each((index, element) => {
      if (data.length >= limit) return false;

      const linkElement = $(element);
      const judul = cleanText(linkElement.text());
      const href = linkElement.attr("href");

      if (!judul || !href) return;

      const link = getAbsoluteUrl(href);
      if (usedLinks.has(link)) return;
      usedLinks.add(link);

      const container = linkElement.closest("article, .card, .row, .col, div");
      const containerText = cleanText(container.text());
      const kategori =
        cleanText(container.find('a[href*="/news-article?category="]').first().text()) || "Berita";
      const tanggal = containerText.match(/\d{1,2}\s+[A-Za-zÀ-ÿ]+\s+\d{4}/)?.[0] ||
        "Tanggal tidak tersedia";
      const imageSrc = container.find("img").first().attr("src") || "";

      data.push({
        id: index + 1,
        judul,
        kategori,
        tanggal,
        penulis: "Pemkab Bandung Barat",
        status: "aktif",
        deskripsi: getExcerpt(containerText, judul, kategori, tanggal) ||
          "Informasi resmi dari Pemerintah Kabupaten Bandung Barat.",
        lampiran: false,
        prioritas: "sedang",
        link,
        gambar: imageSrc ? getAbsoluteUrl(imageSrc) : "",
      });
    });

    const detailImages = await Promise.all(data.map((item) => getDetailImage(item.link)));
    const pengumuman = data.map((item, index) => ({
      ...item,
      gambar: detailImages[index],
    }));

    const kategoriLinks = $('a[href*="/news-article?category="]')
      .map((_, element) => {
        const label = cleanText($(element).text());
        const href = $(element).attr("href") || "";
        const slug = new URL(getAbsoluteUrl(href)).searchParams.get("category") || "";

        return label && slug ? { label, slug, link: getAbsoluteUrl(href) } : null;
      })
      .get()
      .filter(Boolean);

    res.status(200).json({
      success: true,
      source: "bandungbaratkab",
      categories: kategoriLinks,
      data: pengumuman,
    });
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Gagal mengambil data Bandung Barat:", errorMessage);

    res.status(502).json({
      success: false,
      message: "Gagal mengambil data pengumuman dari website Bandung Barat",
      error: status ? `Website Bandung Barat merespons status ${status}` : errorMessage,
    });
  }
};
