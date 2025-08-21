export interface ImageModalConfig {
  isOpen: boolean;
  title: string;
  images: string[];
  danmakuText: string;
  enableDanmaku: boolean;
  imageWidth: number;
  imageHeight: number;
}

export interface MusicModalConfig {
  isOpen: boolean;
  title: string;
  musicUrl: string;
  cover: string;
  author: string;
  danmakuText: string;
  enableDanmaku: boolean;
}

export interface VideoModalConfig {
  isOpen: boolean;
  videoUrl: string;
  danmakuText: string;
  enableDanmaku: boolean;
}

export interface TagConfig {
  type: "image" | "music" | "video" | "link";
  config:
    | ImageModalConfig
    | MusicModalConfig
    | VideoModalConfig
    | { url: string };
}

export const tagConfigs: Record<string, TagConfig> = {
  美食: {
    type: "image",
    config: {
      isOpen: true,
      title: "美食",
      images: [],
      danmakuText: "好吃",
      enableDanmaku: true,
      imageWidth: 500,
      imageHeight: 500,
    },
  },
  鲜花: {
    type: "music",
    config: {
      isOpen: true,
      title: "鲜花",
      musicUrl: "",
      cover: "/images/xh.jpg",
      author: "回春丹乐队",
      danmakuText: "好听",
      enableDanmaku: true,
    },
  },
  蜡笔小新: {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "",
      danmakuText: "蜡笔小新",
      enableDanmaku: true,
    },
  },
  音乐: {
    type: "link",
    config: {
      url: "https://music.163.com/",
    },
  },
};
