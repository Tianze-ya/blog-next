import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextApiRequest, NextApiResponse } from "next";

interface BlogArticle {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  filename: string;
  category: string;
}

interface BlogResponse {
  articles: BlogArticle[];
  categories: string[];
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readBlogsRecursively(dir: string, baseDir: string): BlogArticle[] {
  const articles: BlogArticle[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      articles.push(...readBlogsRecursively(fullPath, baseDir));
    } else if (item.endsWith(".md") && item !== "count.md") {
      const relativePath = path.relative(baseDir, dir);
      // 只取第一级目录作为分类名称
      const category = relativePath.split(path.sep)[0] || "全部";

      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      articles.push({
        id: `${category}-${item}`,
        title: data.title || item.replace(".md", ""),
        description: data.description || extractDescription(content, data.title || item.replace(".md", "")),
        date: formatDate(data.date || new Date()),
        tags: data.tags || ["未分类"],
        content,
        filename: item,
        category: category === "root" ? "根目录" : category,
      });
    }
  });

  return articles;
}

function extractDescription(content: string, title: string): string {
  // 1. 优先提取简介部分
  const introMatch = content.match(/##\s*简介\s*\n([\s\S]*?)(?=\n##|\n#|$)/);
  if (introMatch && introMatch[1].trim()) {
    return introMatch[1].trim().replace(/\n/g, " ").substring(0, 150) + (introMatch[1].length > 150 ? "..." : "");
  }

  // 2. 提取第一段非标题、非代码块的文本
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line.trim() || line.startsWith('#') || line.startsWith('```')) continue;
    return line.trim().substring(0, 150) + (line.length > 150 ? "..." : "");
  }

  // 3. 默认返回标题
  return title;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse | { error: string }>
) {
  try {
    const blogsDirectory = path.join(process.cwd(), "src", "blogs");

    if (!fs.existsSync(blogsDirectory)) {
      return res.status(404).json({ error: "blogs目录不存在" });
    }

    const articles = readBlogsRecursively(blogsDirectory, blogsDirectory);
    const categories = [
      "全部",
      ...Array.from(new Set(articles.map((article) => article.category))),
    ];

    res.status(200).json({ articles, categories });
  } catch (error) {
    console.error("读取文章失败:", error);
    res.status(500).json({ error: "读取文章失败" });
  }
}