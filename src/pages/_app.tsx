import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import LoadingAnimation from "@/components/LoadingAnimation";
import ThemeToggle from "@/components/ThemeToggle";
import CommentModal from "@/components/CommentModal";
import { useState, useEffect } from "react";
import SvgIcon from "@/components/SvgIcon";
import {
  commentAPI,
  reactionAPI,
  ReactionType,
} from "../../service/api/comment";
import { useRouter } from "next/router";

// 布局组件，包含公共的主题切换和背景
function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const [commentCount, setCommentCount] = useState(0);

  // 加载评论数量和点赞数量
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [commentsData] = await Promise.all([
          commentAPI.getComments(),
          reactionAPI.getReactions(),
        ]);
        setCommentCount(commentsData.length);
      } catch (error) {
        console.error("加载数据失败:", error);
      }
    };

    loadCounts();
  }, []);

  const handleCommentClick = () => {
    setIsCommentOpen(true);
  };

  // 格式化评论数量显示
  const formatCount = (count: number) => {
    return count > 99 ? "99+" : count.toString();
  };

  const isChatPage = router.pathname === "/chat";

  return (
    <div className="relative min-h-screen">
      {/* 主题切换按钮 */}
      <ThemeToggle />

      {/* 浅色主题背景图片 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-sm transition-opacity duration-1000 ease-in-out z-[-1]"
        style={{
          backgroundImage: `url('/images/img3.jpg')`,
          opacity: theme === "light" ? 1 : 0,
        }}
      />

      {/* 深色主题背景图片 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-sm transition-opacity duration-1000 ease-in-out z-[-1]"
        style={{
          backgroundImage: `url('/images/img2.jpg')`,
          opacity: theme === "dark" ? 1 : 0,
        }}
      />

      {/* 点赞按钮 */}

     

      {/* 评论按钮 */}
      {!isChatPage && (
        <button
          onClick={handleCommentClick}
          className={`
          fixed bottom-52 right-10 z-10
          bg-[#5D676B] hover:bg-[#2C363F] text-white
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          flex items-center justify-center cursor-pointer w-12 h-12 rounded-full 
        `}
        >
          <SvgIcon name="comment" width={20} height={20} color="#fff" />
          <span className="text-[11px] flex items-center justify-center font-medium absolute right-[-15px] top-0 bg-[#2C363F] w-[25px] h-[25px] rounded-full">
            {formatCount(commentCount)}
          </span>
        </button>
      )}
      {/* 评论弹窗 */}
      <CommentModal
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      />

      {/* 页面内容 */}
      {children}
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载时间，3秒后隐藏加载动画
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {/* 全局加载动画 */}
      <LoadingAnimation isVisible={isLoading} />

      {/* 布局组件包装页面内容 */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
