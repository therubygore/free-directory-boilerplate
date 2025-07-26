import { AccountSettingsConfig } from "@/types";

const enSettingsConfig: AccountSettingsConfig = {
    title: "Settings",
    subtitle: "Manage account and website settings",
    form: {
        title: "Update Account Info",
        subtitle: "Please enter your name and link when your application is shown",
        name: "Name",
        namePlaceHolder: "enter a display name you are comfortable with, 32 characters maximum",
        link: "Link",
        linkPlaceHolder: "enter a link that can be shared with others, like github or twitter account page",
        submit: "Save",
        submiting: "Saving...",
        success: "Your account info has been updated.",
        error: "Something went wrong. Please try again.",
    }
}

const zhSettingsConfig: AccountSettingsConfig = {
    title: "设置",
    subtitle: "管理账号和网站设置",
    form: {
        title: "更新账号信息",
        subtitle: "请输入你的名称和链接, 当你的应用被展示时会显示",
        name: "名称",
        namePlaceHolder: "最多32个字符, 例如: IndieHacker",
        link: "链接",
        linkPlaceHolder: "个人网站或者Github链接, 例如: https://indiehackers.site",
        submit: "提交",
        submiting: "提交中...",
        success: "账号信息已更新",
        error: "出错了, 请重试",
    }
}

export const AllSettingsConfigs:{[key: string]: AccountSettingsConfig} = {
    en: enSettingsConfig,
    zh: zhSettingsConfig,
}

export function getAllSettingsConfigs() {
    return AllSettingsConfigs;
}