// 作品数据类型定义
export interface WorkItem {
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  features: string[];
  desc?: string;
  download_url?: string;
  function?: {
    name: string;
    img1: string;
    img2?: string;
    img3?: string;
  }[];
}

// 作品数据
export const worksData: WorkItem[] = [
  {
    title: "Tianze-blog",
    description:
      "基于Hexo开发的个人博客网站",
    image: "/images/work1.jpg",
    tech: ["NodeJS"],
    link: "https://github.com/Tianze-ya/blog",
    features: ["个人介绍", "美观"],
  },
];
