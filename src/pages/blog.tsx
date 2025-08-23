import { useState, useEffect, useCallback, JSX, useRef } from "react";
import Head from "next/head";
import SvgIcon from "@/components/SvgIcon";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface DirectoryTreeItem {
  id: string;
  name: string;
  isFolder: boolean;
  level: number;
  children: DirectoryTreeItem[];
}

interface BlogStats {
  totalArticles: number;
  totalDirectories: number;
  totalFiles: number;
  lastUpdated: string;
  categoryStats: { [key: string]: number };
  directoryTree: DirectoryTreeItem[];
}

const DirectoryItem = React.memo(
  ({
    item,
    level = 0,
    collapsedFolders,
    toggleFolder,
  }: {
    item: DirectoryTreeItem;
    level?: number;
    collapsedFolders: Set<string>;
    toggleFolder: (folderId: string) => void;
  }) => {
    const isCollapsed = collapsedFolders.has(item.id);

    // 创建缩进线
    const createIndentation = () => {
      if (level === 0) return null;
      
      return (
        <div className="absolute left-4 top-4 bottom-0 flex items-start" style={{ marginLeft: `${(level - 1) * 16}px` }}>
          <div className="h-full w-px bg-gray-800" />
        </div>
      );
    };

    if (item.isFolder) {
      return (
        <div className="relative my-0.5">
          {level > 0 && createIndentation()}
          <div
            className={`flex items-center cursor-pointer rounded-md px-2 py-1 transition-all duration-200 ${isCollapsed ? 'hover:bg-[rgba(255,255,255,.05)]' : 'hover:bg-[rgba(255,255,255,.08)]'}`}
            style={{ marginLeft: `${level === 0 ? 0 : 16}px` }}
            onClick={() => toggleFolder(item.id)}
          >
            <div className="flex-shrink-0 mr-1.5 transition-transform duration-200" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
              <SvgIcon
                name="right"
                width={12}
                height={12}
                color="#9CA3AF"
              />
            </div>
            <span className="text-yellow-400 mr-1.5">📁</span>
            <span className="text-gray-300 font-medium select-none">{item.name}</span>
            <span className="ml-auto text-xs text-gray-500 bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded-full">
              {item.children.length}
            </span>
          </div>
          
          {!isCollapsed && (
            <div className="ml-6 border-l border-gray-800 pl-2 py-0.5 rounded-md bg-[rgba(0,0,0,0.2)]">
              {item.children.map((child, index) => (
                <DirectoryItem
                  key={child.id || `${child.name}-${index}`}
                  item={child}
                  level={level + 1}
                  collapsedFolders={collapsedFolders}
                  toggleFolder={toggleFolder}
                />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="relative my-0.5 group" style={{ marginLeft: `${level * 16}px` }}>
          <div
            className="flex items-center rounded-md px-2 py-1 hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200 group-hover:bg-[rgba(61,133,169,0.1)] group-hover:border-[rgba(61,133,169,0.3)] border border-transparent"
          >
            <span className="text-blue-400 mr-1.5">📄</span>
            <span className="text-gray-300 text-sm truncate max-w-[200px]">{item.name}</span>
          </div>
        </div>
      );
    }
  }
);

DirectoryItem.displayName = "DirectoryItem";

// 将打字机动画提取为独立组件


export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(
    null
  );
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [loading, setLoading] = useState(true);
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const blogContentRef = useRef<HTMLDivElement>(null);
  // 加载文章列表
  useEffect(() => {
    loadArticles();
    loadBlogStats();
  }, []);

  useEffect(() => {
    if (!selectedArticle) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollContainer = document.querySelector(
            ".custom-scrollbar"
          ) as HTMLElement;
          if (!scrollContainer) return;

          const scrollTop = scrollContainer.scrollTop;
          const containerHeight = scrollContainer.clientHeight;

          const headings = tableOfContents
            .map((item) => {
              const element = document.getElementById(item.id);
              if (element) {
                const rect = element.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                // 计算相对于滚动容器的位置
                const relativeTop = rect.top - containerRect.top;
                return {
                  id: item.id,
                  top: relativeTop,
                  absoluteTop: scrollTop + relativeTop,
                  element,
                };
              }
              return null;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null); // 类型守卫

          if (headings.length === 0) return;

          // 改进的检测逻辑
          const threshold = 80; // 减小阈值
          let bestHeading = headings[0]; // 默认第一个标题

          // 找到最合适的标题
          for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];

            // 如果标题在视口顶部附近或之上
            if (heading.top <= threshold) {
              bestHeading = heading;
            } else {
              // 如果当前标题在阈值之下，停止查找
              break;
            }
          }

          // 特殊处理：如果没有标题在阈值内，选择最接近顶部的可见标题
          if (bestHeading.top > threshold) {
            const visibleHeadings = headings.filter(
              (h) => h.top >= 0 && h.top <= containerHeight
            );
            if (visibleHeadings.length > 0) {
              bestHeading = visibleHeadings[0];
            }
          }

          // 只有当找到的标题与当前不同时才更新
          if (bestHeading && bestHeading.id !== activeHeading) {
            setActiveHeading(bestHeading.id);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // 获取滚动容器
    const scrollContainer = document.querySelector(".custom-scrollbar");
    if (scrollContainer) {
      // 添加防抖延迟
      let timeoutId: NodeJS.Timeout;
      const debouncedHandleScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleScroll, 30); // 减少防抖时间
      };

      scrollContainer.addEventListener("scroll", debouncedHandleScroll);
      // 初始检查
      setTimeout(handleScroll, 100); // 延迟初始检查

      return () => {
        clearTimeout(timeoutId);
        scrollContainer.removeEventListener("scroll", debouncedHandleScroll);
      };
    }
  }, [selectedArticle, tableOfContents, activeHeading]);

  // 监听滚动显示/隐藏回到顶部按钮
  useEffect(() => {
    if (selectedArticle) {
      setShowBackToTop(false);
      return;
    }

    // 等待数据加载完成和DOM渲染
    if (loading || articles.length === 0) {
      setShowBackToTop(false);
      return;
    }

    const handleScroll = () => {
      if (blogContentRef.current) {
        const scrollTop = blogContentRef.current.scrollTop;
        const shouldShow = scrollTop > 100;
        console.log("滚动位置:", scrollTop, "是否显示按钮:", shouldShow); // 调试日志
        setShowBackToTop(shouldShow);
      }
    };

    // 延迟设置监听器，确保DOM完全渲染
    const timer = setTimeout(() => {
      const scrollContainer = blogContentRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
        console.log("回到顶部监听器已添加");

        // 立即检查一次滚动位置
        handleScroll();
      } else {
        console.log("blogContentRef.current 为空");
      }
    }, 300); // 增加延迟时间

    return () => {
      clearTimeout(timer);
      // 在清理函数中使用变量存储ref值，避免依赖变化问题
      const currentScrollContainer = blogContentRef.current;
      if (currentScrollContainer) {
        currentScrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectedArticle, loading, articles.length]);

  // 回到顶部函数
  const scrollToTop = () => {
    if (blogContentRef.current) {
      blogContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // 添加折叠状态管理
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(
    new Set()
  );

  // 切换文件夹折叠状态
  const toggleFolder = useCallback((folderId: string) => {
    setCollapsedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("加载文章失败");
      }
      const data = await response.json();
      setArticles(data.articles || []);
      setCategories(data.categories || ["全部"]);
      setLoading(false);
    } catch (error) {
      console.error("加载文章失败:", error);
      setArticles([]);
      setCategories(["全部"]);
      setLoading(false);
    }
  };

  const loadBlogStats = async () => {
    try {
      const response = await fetch("/api/blog-stats");
      if (response.ok) {
        const stats = await response.json();
        setBlogStats(stats);

        // 默认收缩所有文件夹
        const getAllFolderIds = (items: DirectoryTreeItem[]): string[] => {
          const folderIds: string[] = [];
          items.forEach((item) => {
            if (item.isFolder) {
              folderIds.push(item.id);
              if (item.children && item.children.length > 0) {
                folderIds.push(...getAllFolderIds(item.children));
              }
            }
          });
          return folderIds;
        };

        const allFolderIds = getAllFolderIds(stats.directoryTree || []);
        setCollapsedFolders(new Set(allFolderIds));
      }
    } catch (error) {
      console.error("加载统计信息失败:", error);
    }
  };
  // 过滤文章
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "全部" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 生成目录
  const generateTableOfContents = (content: string) => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    return headings.map((heading, index) => {
      // 提取标题级别
      const levelMatch = heading.match(/^#+/);
      const level = levelMatch ? levelMatch[0].length : 1;
      
      // 提取标题文本，处理可能的内联格式
      const title = heading.replace(/^#+\s+/, "")
        .replace(/\*\*(.*?)\*\*/g, '$1')  // 移除粗体标记
        .replace(/\*(.*?)\*/g, '$1')      // 移除斜体标记
        .replace(/`(.*?)`/g, '$1')        // 移除行内代码标记
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接标记
        .trim();

      // 生成唯一ID，考虑标题内容和位置
      const id = `heading-${index}-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
      
      return {
        id,
        title,
        level,
      };
    });
  };

  // 打开文章
  const openArticle = (article: BlogArticle) => {
    setIsTransitioning(true);
    // 使用 requestAnimationFrame 优化动画流畅度
    requestAnimationFrame(() => {
      setSelectedArticle(article);
      setTableOfContents(generateTableOfContents(article.content));
      // 使用 requestAnimationFrame 确保状态更新完成后再结束动画
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    });
  };

  // 返回文章列表
  const backToList = () => {
    setIsTransitioning(true);
    // 使用 requestAnimationFrame 优化动画流畅度
    requestAnimationFrame(() => {
      setSelectedArticle(null);
      setTableOfContents([]);
      // 使用 requestAnimationFrame 确保状态更新完成后再结束动画
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    });
  };

  // 跳转到指定标题
  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [showToast, setShowToast] = React.useState(false);

  // 处理简介中的内联格式
  const processDescription = (description: string): string => {
    // 先处理HTML标签，将其转换为行内代码格式
    let processed = description
      .replace(/<([^>]+)>/g, '`<$1>`'); // 将HTML标签转换为行内代码
    
    // 移除其他Markdown内联格式，包括原始的行内代码格式
    processed = processed
      .replace(/\*\*(.*?)\*\*/g, '$1')  // 移除粗体标记
      .replace(/\*(.*?)\*/g, '$1')      // 移除斜体标记
      .replace(/_(.*?)_/g, '$1')        // 移除下划线标记
      .replace(/`([^`]+)`/g, '$1')      // 移除原始行内代码标记
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接标记
      .replace(/~~(.*?)~~/g, '$1')      // 移除删除线标记
      .replace(/==(.*?)==/g, '$1')      // 移除高亮标记
      .replace(/-(.*?)-/g, '$1')        // 移除带连字符的格式
      .trim();
    
    return processed;
  };

  // 创建一个处理内联格式的独立函数
  const processInlineFormats = (line: string): string => {
    // 处理代码块和内联代码 - 优先处理
    if (line.includes('`')) {
      line = line.replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    }

    // 处理变量 ${variable}
    line = line.replace(/\$\{([^}]+)\}/g, '<code class="bg-gray-700 text-gray-200 px-1 py-0.5 rounded text-sm font-mono">${$1}</code>');

    // 处理HTML标签
    // 处理带样式的span标签 <span style="...">text</span>
    line = line.replace(/<span style="([^"]+)">([^<]+)<\/span>/g, (match, style, text) => {
      // 安全处理样式，只允许特定样式
      const allowedStyles = [
        'color', 'background-color', 'font-size', 'font-weight', 
        'text-decoration', 'display', 'margin', 'padding', 
        'border', 'border-radius', 'float', 'clear', 'width', 
        'height', 'text-align', 'line-height'
      ];
      
      const styleObj: Record<string, string> = {};
      const stylePairs = style.split(';');
      
      stylePairs.forEach((pair: string) => {
        const [property, value] = pair.split(':').map(s => s.trim());
        if (property && value && allowedStyles.includes(property)) {
          // 颜色值验证
          if (property === 'color' || property === 'background-color') {
            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || 
                /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value) ||
                /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)$/.test(value) ||
                value.match(/^[a-zA-Z]+$/)) {
              styleObj[property] = value;
            }
          } else {
            styleObj[property] = value;
          }
        }
      });
      
      const safeStyle = Object.entries(styleObj)
        .map(([prop, val]) => `${prop}: ${val}`)
        .join('; ');
      
      return `<span style="${safeStyle}">${text}</span>`;
    });
    
    // 处理kbd标签 <kbd>text</kbd>
    line = line.replace(/<kbd>([^<]+)<\/kbd>/g, '<kbd class="bg-gray-700 text-gray-200 px-1 py-0.5 rounded text-xs font-mono border border-gray-600">$1</kbd>');
    
    // 处理small标签 <small>text</small>
    line = line.replace(/<small>([^<]+)<\/small>/g, '<small class="text-sm text-gray-400">$1</small>');
    
    // 处理mark标签 <mark>text</mark>
    line = line.replace(/<mark>([^<]+)<\/mark>/g, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');

    // 处理粗体 **text** 和 __text__
    line = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
    line = line.replace(/__([^_]+)__/g, '<strong class="font-bold">$1</strong>');

    // 处理斜体 *text* 和 _text_
    line = line.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    line = line.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');

    // 处理删除线 ~~text~~
    line = line.replace(/~~([^~]+)~~/g, '<del class="line-through text-gray-500">$1</del>');

    // 处理高亮 ==text==
    line = line.replace(/==([^=]+)==/g, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');

    // 处理链接 [text](url)
    line = line.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" class="text-[#3d85a9] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // 处理图片 ![alt](src)
    line = line.replace(
      /!\[([^\]]+)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg border border-gray-700 my-2" loading="lazy" />'
    );

    // 处理脚注 [^note]
    line = line.replace(
      /\[\^([^\]]+)\]/g,
      '<sup class="text-[#3d85a9] hover:underline cursor-pointer" title="脚注">[$1]</sup>'
    );

    // 处理上标 ^{text}
    line = line.replace(
      /\^\{([^}]+)\}/g,
      '<sup class="text-[85%] align-super">$1</sup>'
    );

    // 处理下标 _{text}
    line = line.replace(
      /_\{([^}]+)\}/g,
      '<sub class="text-[85%] align-sub">$1</sub>'
    );

    // 处理任务列表 - [x] 和 [ ]
    line = line.replace(
      /^- \[x\]\s+(.+)$/gm,
      '<div class="flex items-center my-1"><span class="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center">✓</span><span>$1</span></div>'
    );
    line = line.replace(
      /^- \[ \]\s+(.+)$/gm,
      '<div class="flex items-center my-1"><span class="w-5 h-5 border border-gray-500 rounded mr-2"></span><span>$1</span></div>'
    );

    return line;
  };

// 渲染 Markdown 内容（增强版）
const renderMarkdown = (content: string) => {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let inTable = false;
  let tableRows: string[][] = [];
  let codeBlockContent = "";
  let codeLanguage = "";
  let headingIndex = 0;
  let inMathBlock = false;
  let mathContent = "";
  let inList = false;
  let listType: "ul" | "ol" = "ul";
  let listItems: JSX.Element[] = [];

  // 复制代码功能
  const copyToClipboard = (text: string) => {
    const cleanText = text.replace(/\n$/, "");
    navigator.clipboard
      .writeText(cleanText)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch(console.error);
  };

  // 处理表格行
  const processTableRow = (line: string) => {
    const cells = line
      .split("|")
      .map(cell => cell.trim())
      .filter(cell => cell);
    return cells;
  };

  // 渲染表格
  const renderTable = () => {
    if (tableRows.length < 2) return null;

    const headers = tableRows[0];
    const aligns = tableRows[1].map(cell => {
      if (cell.startsWith(":") && cell.endsWith(":")) return "center";
      if (cell.startsWith(":")) return "left";
      if (cell.endsWith(":")) return "right";
      return "left";
    });

    return (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              {headers.map((header, i) => (
                <th 
                  key={i}
                  className={`px-4 py-2 text-left border border-gray-700 ${
                    aligns[i] === "center" ? "text-center" : 
                    aligns[i] === "right" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(2).map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={rowIndex % 2 ? "bg-gray-900" : "bg-gray-800"}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className={`px-4 py-2 border border-gray-700 ${
                      aligns[cellIndex] === "center" ? "text-center" : 
                      aligns[cellIndex] === "right" ? "text-right" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: processInlineFormats(cell) }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 渲染数学公式
  const renderMath = (math: string, displayMode: boolean) => {
    return (
      <div className={`my-4 ${displayMode ? "" : "inline-block"}`}>
        <div className="bg-gray-800 rounded p-4 overflow-x-auto">
          <pre className="text-gray-300 font-mono text-sm">
            {math}
          </pre>
        </div>
      </div>
    );
  };

  // 渲染列表的函数
  const renderList = () => {
    if (listItems.length === 0) return null;
    
    const listElement = React.createElement(
      listType,
      {
        key: elements.length,
        className: `mb-4 pl-6 ${listType === "ul" ? "list-disc" : "list-decimal"}`,
      },
      listItems
    );
    
    listItems = [];
    inList = false;
    
    return listElement;
  };

  lines.forEach((line, index) => {
    // 数学公式块处理
    if (line.startsWith("$$")) {
      if (!inMathBlock) {
        inMathBlock = true;
        mathContent = "";
      } else {
        inMathBlock = false;
        elements.push(renderMath(mathContent, true));
      }
      return;
    }

    if (inMathBlock) {
      mathContent += line + "\n";
      return;
    }

    // 表格处理
    if (line.trim().startsWith("|") && line.includes("|")) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(processTableRow(line));
      return;
    } else if (inTable) {
      inTable = false;
      const tableElement = renderTable();
      if (tableElement) elements.push(tableElement);
    }

    // 代码块处理
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockContent = "";
        codeLanguage = line.replace("```", "").trim() || "plaintext";
      } else {
        inCodeBlock = false;
        const currentCodeContent = codeBlockContent;
        const currentLanguage = codeLanguage;

        // 处理代码块中的``格式，保留原样
        const processedCodeContent = currentCodeContent
          .replace(/`/g, '`')
          .replace(/\$/g, '$');

        elements.push(
          <div key={`code-${index}`} className="bg-gray-900 rounded-lg my-4 overflow-hidden relative group">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-xs text-gray-400 uppercase font-mono">
                {currentLanguage}
              </span>
              <button
                onClick={() => copyToClipboard(currentCodeContent)}
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                title="复制代码"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                复制
              </button>
            </div>
            <SyntaxHighlighter
              language={currentLanguage === "plaintext" ? "text" : currentLanguage}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "16px",
                background: "transparent",
                fontSize: "14px",
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {processedCodeContent}
            </SyntaxHighlighter>
          </div>
        );
      }
      return;
    }

    if (inCodeBlock) {
      // 在代码块中，直接保留``和$符号原样
      codeBlockContent += (codeBlockContent ? "\n" : "") + line;
      return;
    }

    // 列表处理 - 改进版
    if ((line.startsWith("- ") || line.match(/^\d+\. /)) && !inCodeBlock && !inTable && !line.startsWith("> ")) {
      const isOrdered = line.match(/^\d+\. /);
      const currentListType = isOrdered ? "ol" : "ul";
      
      // 处理列表项中的内联格式
      const listItemContent = line.replace(/^[-|\d+\.]\s+/, "");
      const processedContent = processInlineFormats(listItemContent);
      
      const listItem = (
        <li 
          key={listItems.length} 
          className="mb-1"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      );

      if (inList && listType === currentListType) {
        // 继续当前列表
        listItems.push(listItem);
      } else {
        // 结束上一个列表并开始新列表
        if (inList) {
          const listElement = renderList();
          if (listElement) elements.push(listElement);
        }
        inList = true;
        listType = currentListType;
        listItems.push(listItem);
      }
      return;
    }

    // 如果不是列表项但之前在处理列表，则结束列表
    if (inList && line.trim() && !line.startsWith("  ") && !line.startsWith("\t")) {
      const listElement = renderList();
      if (listElement) elements.push(listElement);
    }

    // 图片处理
    if (line.match(/!\[(.*?)\]\((.*?)\)/)) {
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        const altText = match[1];
        const imgSrc = match[2];
        elements.push(
          <div key={index} className="my-4 flex justify-center">
            <img 
              src={imgSrc} 
              alt={altText} 
              className="max-w-full h-auto rounded-lg border border-gray-700"
              loading="lazy"
            />
          </div>
        );
      }
      return;
    }

    // 内联格式处理 (粗体、斜体、链接、行内代码、脚注、上标、下标等)
    if (line.match(/\*\*|\*|__|_|~~|==|\[.*\]\(.*\)|!\[.*\]\(.*\)|\^|_\{|\$\{|`/)) {
      const processedLine = processInlineFormats(line);
      elements.push(
        <p 
          key={index} 
          className="mb-4 text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
      return;
    }

    // 标题处理
    if (line.startsWith("# ")) {
      const id = `heading-${headingIndex++}`;
      const titleContent = processInlineFormats(line.replace("# ", ""));
      elements.push(
        <h1 key={index} id={id} className="text-3xl font-bold mb-4 text-white mt-8 first:mt-0" dangerouslySetInnerHTML={{ __html: titleContent }} />
      );
    } else if (line.startsWith("## ")) {
      const id = `heading-${headingIndex++}`;
      const titleContent = processInlineFormats(line.replace("## ", ""));
      elements.push(
        <h2 key={index} id={id} className="text-2xl font-bold mb-3 text-white mt-6" dangerouslySetInnerHTML={{ __html: titleContent }} />
      );
    } else if (line.startsWith("### ")) {
      const id = `heading-${headingIndex++}`;
      const titleContent = processInlineFormats(line.replace("### ", ""));
      elements.push(
        <h3 key={index} id={id} className="text-xl font-bold mb-2 text-white mt-4" dangerouslySetInnerHTML={{ __html: titleContent }} />
      );
    } else if (line.startsWith("#### ")) {
      const id = `heading-${headingIndex++}`;
      const titleContent = processInlineFormats(line.replace("#### ", ""));
      elements.push(
        <h4 key={index} id={id} className="text-lg font-bold mb-2 text-white mt-3" dangerouslySetInnerHTML={{ __html: titleContent }} />
      );
    }

    // 分割线
    else if (line.match(/^[-*_]{3,}$/)) {
      elements.push(<hr key={index} className="my-6 border-gray-700" />);
    }

    // 引用
    else if (line.startsWith("> ")) {
      const quote = line.replace("> ", "");
      const processedQuote = processInlineFormats(quote);
      elements.push(
        <blockquote key={index} className="border-l-4 border-[#3d85a9] pl-4 my-4 text-gray-400 italic" dangerouslySetInnerHTML={{ __html: processedQuote }} />
      );
      return;
    }

    // 普通段落
    else if (line.trim() && !inList) {
      const processedLine = processInlineFormats(line);
      elements.push(
        <p key={index} className="mb-4 text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />
      );
    } else if (!line.trim() && elements.length > 0) {
      elements.push(<br key={index} />);
    }
  });

  // 处理最后可能未关闭的列表
  if (inList) {
    const listElement = renderList();
    if (listElement) elements.push(listElement);
  }

  // 处理最后可能未关闭的表格
  if (inTable) {
    const tableElement = renderTable();
    if (tableElement) elements.push(tableElement);
  }

  return elements;
};

  if (loading) {
    return (
      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] font-[family-name:var(--font-geist-sans)] flex items-center justify-center relative z-20`}
      >
        <div className="loader">
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>docs - wuxian&apos;s web</title>
        <meta name="description" content="分享开发经验和技术文章" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Toast 提示 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          代码已复制到剪贴板
        </div>
      )}

      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-[family-name:var(--font-geist-sans)] custom-scrollbar overflow-x-hidden`}
        style={{
          overflowY: "scroll",
          height: "100vh",
        }}
      >
        {/* 导航按钮 */}
        <div className="fixed top-4 left-4 z-10 flex gap-2">
          <Link
            href="/works"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon name="left" width={16} height={16} color="#fff" />
            <span className="text-sm">作品集</span>
          </Link>
          <Link
            href="/"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon name="home" width={16} height={16} color="#fff" />
            <span className="text-sm">首页</span>
          </Link>
        </div>

        <div className="container mx-auto px-4 pt-20 pb-8 max-w-full overflow-x-hidden">
          {/* 文章列表视图 */}
          <div
            className={`transition-all duration-300 ${
              selectedArticle
                ? "opacity-0 pointer-events-none absolute"
                : "opacity-100"
            } ${isTransitioning ? "scale-95" : "scale-100"}`}
          >
            {/* 主要内容区域 - 左右布局 */}
            <div className="max-w-7xl mx-auto flex gap-4 h-[80vh]">
              {/* 左侧分类面板 */}
              <div className="w-64 sticky top-45 h-fit hidden sm:block">
                <div className="bg-[rgba(0,0,0,.3)] rounded-lg p-4 border border-[rgba(255,255,255,.1)]">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <SvgIcon name="tag" width={20} height={20} color="#fff" />
                    文章分类
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                          selectedCategory === category
                            ? "bg-[#3d85a9] text-white shadow-lg"
                            : "bg-[rgba(0,0,0,.2)] text-gray-300 hover:bg-[rgba(0,0,0,.4)] border border-[rgba(255,255,255,.05)]"
                        }`}
                      >
                        <span>{category}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedCategory === category
                              ? "bg-[rgba(255,255,255,.2)] text-white"
                              : "bg-[rgba(255,255,255,.1)] text-gray-400"
                          }`}
                        >
                          {category === "全部"
                            ? articles.length
                            : articles.filter(
                                (article) => article.category === category
                              ).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 中间文章列表 */}
              <div className="flex-1 w-full">
                {/* 搜索栏 */}
                <div className="mb-4">
                  <div className="max-w-2xl mx-auto">
                    <h1 className="text-[40px] font-bold text-[#fff] text-shadow-sm flex items-end justify-center mb-[10px]">
                      {selectedArticle ? selectedArticle.filename : "知识库"}
                    </h1>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="搜索文章标题、内容或标签..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-12 bg-[rgba(0,0,0,.3)] border border-[rgba(255,255,255,.1)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#3d85a9] transition-colors"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <SvgIcon
                          name="search"
                          width={20}
                          height={20}
                          color="#fff"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 移动端分类tabs */}
                <div className="mt-4 sm:hidden">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 -mx-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-[#3d85a9] text-white shadow-lg"
                            : "bg-[rgba(0,0,0,.3)] text-gray-300 hover:bg-[rgba(0,0,0,.5)] border border-[rgba(255,255,255,.1)]"
                        }`}
                      >
                        {category}
                        <span
                          className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            selectedCategory === category
                              ? "bg-[rgba(255,255,255,.2)] text-white"
                              : "bg-[rgba(255,255,255,.1)] text-gray-400"
                          }`}
                        >
                          {category === "全部"
                            ? articles.length
                            : articles.filter(
                                (article) => article.category === category
                              ).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  ref={blogContentRef}
                  className="grid gap-3 max-h-[70vh] overflow-auto custom-scrollbar blog-content relative pb-20"
                >
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => openArticle(article)}
                      className="bg-[rgba(0,0,0,.3)] rounded-lg p-4 cursor-pointer hover:bg-[rgba(0,0,0,.4)] transition-all duration-200 border border-[rgba(255,255,255,.1)] hover:border-[#3d85a9] group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-bold text-white group-hover:text-[#3d85a9] transition-colors">
                          {article.title}
                        </h2>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm text-gray-400">
                            {article.date}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2 leading-relaxed">
                        {processDescription(article.description)}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-[rgba(61,133,169,.2)] text-[#fff] rounded text-sm">
                            {article.category}
                          </span>
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* 回到顶部按钮 */}
                  {showBackToTop && (
                    <div className="sticky bottom-4 flex justify-end pr-4 pointer-events-none ">
                      <button
                        onClick={scrollToTop}
                        className="bg-[rgba(61,133,169,0.9)] hover:bg-[rgba(61,133,169,1)] text-white p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] pointer-events-auto cursor-pointer"
                        aria-label="回到顶部"
                      >
                        <SvgIcon
                          name="top"
                          width={20}
                          height={20}
                          color="#fff"
                        />
                      </button>
                    </div>
                  )}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                      {selectedCategory === "全部"
                        ? "没有找到相关文章"
                        : `在 "${selectedCategory}" 分类中没有找到相关文章`}
                    </p>
                  </div>
                )}
              </div>

              {/* 右侧统计面板 */}
              <div className="w-80 sticky top-49 h-fit hidden lg:block">
                <div className="bg-[rgba(0,0,0,.3)] rounded-lg p-3 border border-[rgba(255,255,255,.1)]">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <SvgIcon name="count" width={20} height={20} color="#fff" />
                    博客统计
                  </h3>

                  {blogStats ? (
                    <div className="space-y-3">
                      {/* 总体统计 */}
                      <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#fff] mb-3 flex gap-[5px] items-center">
                          <SvgIcon
                            name="count1"
                            width={15}
                            height={15}
                            color="#fff"
                          />
                          总体统计
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-300">总文章数</span>
                            <span className="text-white font-medium">
                              {blogStats.totalArticles} 篇
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">总目录数</span>
                            <span className="text-white font-medium">
                              {blogStats.totalDirectories} 个
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">总文件数</span>
                            <span className="text-white font-medium">
                              {blogStats.totalFiles} 个
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 分类统计 */}
                      <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#fff] mb-3 flex gap-[5px] items-center">
                          <SvgIcon
                            name="count2"
                            width={15}
                            height={15}
                            color="#fff"
                          />
                          分类统计
                        </h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries(blogStats.categoryStats).map(
                            ([category, count]) => (
                              <div
                                key={category}
                                className="flex justify-between items-center"
                              >
                                <span className="text-gray-300">
                                  {category}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-[rgba(255,255,255,.1)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-[#3d85a9] to-[#1b2c55] rounded-full transition-all duration-300"
                                      style={{
                                        width: `${
                                          (count / blogStats.totalArticles) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-white font-medium w-8 text-right">
                                    {count}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* 目录结构 */}
                      <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4 overflow-y-auto custom-scrollbar h-[150px]">
                        <h4 className="text-sm font-medium text-[#fff] mb-3">
                          📁 目录结构
                        </h4>
                        <div className="text-xs text-gray-300 font-mono leading-relaxed max-h-60">
                          {blogStats?.directoryTree &&
                          blogStats.directoryTree.length > 0 ? (
        <div className="space-y-2">
          {blogStats.directoryTree.map(
            (item: DirectoryTreeItem, index: number) => (
              <DirectoryItem
                key={item.id || `${item.name}-${index}`}
                item={item}
                collapsedFolders={collapsedFolders}
                toggleFolder={toggleFolder}
              />
            )
          )}
        </div>
                          ) : (
                            <div className="text-gray-500">暂无目录结构</div>
                          )}
                        </div>
                      </div>

                      {/* 更新时间 */}
                      <div className="text-xs text-gray-400 text-center pt-2 border-t border-[rgba(255,255,255,.1)]">
                        最后更新: {blogStats.lastUpdated}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-[#3d85a9] border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-400 text-sm">加载统计信息中...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 返回按钮 - 永远置顶 */}
          {selectedArticle && (
            <button
              onClick={backToList}
              className="fixed top-16 left-4 z-50 bg-[rgba(0,0,0,.3)] hover:bg-[rgba(0,0,0,.4)] rounded-lg px-3 py-2 lg:px-4 lg:py-2 text-white flex items-center gap-2 text-sm lg:text-base shadow-lg backdrop-blur-sm will-change-transform"
            >
              <SvgIcon name="left" width={16} height={16} color="#fff" />
              返回文章列表
            </button>
          )}

          {/* 文章详情视图 - 响应式优化 */}
          {selectedArticle && (
            <div
              className={`transition-all bg-[rgba(0,0,0,.1)] duration-300 ease-out p-10 rounded-lg ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8">
                {/* 文章内容 */}
                <div className="flex-1 order-2 lg:order-1">

                  {/* 文章头部 */}
                  <div className="mb-6 lg:mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4 leading-tight">
                      {selectedArticle.filename}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-gray-300 mb-3 lg:mb-4 text-sm lg:text-base">
                      <span>{selectedArticle.date}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{selectedArticle.category}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="hidden md:inline">
                        {selectedArticle.filename}
                      </span>
                    </div>
                  </div>

                  {/* 文章内容 */}
                  <div className="prose prose-invert max-w-none prose-sm lg:prose-base">
                    {renderMarkdown(selectedArticle.content)}
                  </div>
                </div>

                {/* 目录 - 响应式处理 */}
                {tableOfContents.length > 0 && (
                  <div className="w-full max-w-[300px] order-1 lg:order-2 lg:sticky lg:top-20 lg:h-fit">
                    <div className="bg-[rgba(0,0,0,.3)] rounded-lg p-3 lg:p-4 border border-[rgba(255,255,255,.1)]">
                      <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4">
                        目录
                      </h3>
                      <nav className="lg:block">
                        {/* 移动端折叠目录 */}
                        <div className="lg:hidden">
                          <details className="group">
                            <summary className="cursor-pointer text-sm text-gray-300 hover:text-white transition-colors list-none flex items-center justify-between">
                              <span>展开目录</span>
                              <SvgIcon
                                name="down"
                                width={16}
                                height={16}
                                color="#9CA3AF"
                                className="group-open:rotate-180 transition-transform"
                              />
                            </summary>
                            <div className="mt-2 max-h-60 overflow-y-auto custom-scrollbar overflow-x-hidden">
                              {tableOfContents.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => scrollToHeading(item.id)}
                                  className={`block w-full text-left py-2 px-2 text-sm hover:bg-[rgba(255,255,255,.1)] rounded transition-colors relative ${
                                    activeHeading === item.id
                                      ? "text-[#214362] font-semibold"
                                      : item.level === 1
                                      ? "text-white font-medium"
                                      : item.level === 2
                                      ? "text-gray-300 ml-4"
                                      : "text-gray-400 ml-8"
                                  }`}
                                >
                                  {activeHeading === item.id && (
                                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-[#214362] rounded-r"></span>
                                  )}
                                  <span
                                    className={
                                      activeHeading === item.id ? "ml-3" : ""
                                    }
                                  >
                                    {item.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </details>
                        </div>

                        {/* 桌面端展开目录 */}
                        <div className="hidden lg:block">
                          {tableOfContents.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => scrollToHeading(item.id)}
                              className={`block w-full text-left py-2 px-2 text-sm hover:bg-[rgba(255,255,255,.1)] rounded transition-colors relative ${
                                activeHeading === item.id
                                  ? "text-[#1E2939] font-semibold pl-4"
                                  : item.level === 1
                                  ? "text-white font-medium"
                                  : item.level === 2
                                  ? "text-gray-300 ml-4"
                                  : "text-gray-400 ml-8"
                              }`}
                            >
                              {activeHeading === item.id && (
                                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-[#1E2939] rounded-r"></span>
                              )}
                              <span
                                className={activeHeading === item.id ? "" : ""}
                              >
                                {item.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-8 right-8 z-10">
          <Link
            href="/chat"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <span className="text-sm">聊天室</span>
            <SvgIcon name="right" width={20} height={20} color="#fff" />
          </Link>
        </div>
      </div>
    </>
  );
}