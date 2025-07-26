import { ShareResourceConfig } from "@/types";

const enShareResourceConfig: ShareResourceConfig = {
    title: "Share Product",
    subtitle: "Share your favorite products for indie hackers",
    form: {
        title: "Please enter the name and link of the product",
        name: "Name",
        namePlaceHolder: "32 characters maximum, example: ChatGPT",
        link: "Link",
        linkPlaceHolder: "product website or github repository, example: https://chatgpt.openai.com or https://github.com/openai/chatgpt",
        submit: "Submit",
        submiting: "Submiting...",
        success: "Thank you for your sharing.",
        error: "Something went wrong. Please try again.",
    }
}

const zhShareResourceConfig: ShareResourceConfig = {
    title: "推荐产品",
    subtitle: "分享你喜欢的适合独立开发者的产品",
    form: {
        title: "请输入产品的名称和链接",
        name: "名称",
        namePlaceHolder: "最多32个字符, 例如: ChatGPT",
        link: "链接",
        linkPlaceHolder: "产品网站或者Github链接, 例如: https://chatgpt.openai.com or https://github.com/openai/chatgpt",
        submit: "提交",
        submiting: "提交中...",
        success: "感谢您的分享",
        error: "出错了, 请重试",
    }
}

export const AllShareResourceConfigs:{[key: string]: ShareResourceConfig} = {
    en: enShareResourceConfig,
    zh: zhShareResourceConfig,
}

export function getAllShareResourceConfigs() {
    return AllShareResourceConfigs;
}