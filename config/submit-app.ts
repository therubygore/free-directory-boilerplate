import { SubmitListingConfig } from "@/types";

const enSubmitListingConfig: SubmitListingConfig = {
    title: "Submit Tattoo Shop",
    subtitle: "Add your tattoo shop to the PDX Tattoo Directory",
    form: {
        title: "Please enter your tattoo shop information",
        name: "Shop Name",
        namePlaceHolder: "Example: Rose City Tattoo",
        website: "Website",
        websitePlaceHolder: "https://yourshop.com",
        instagram: "Instagram",
        instagramPlaceHolder: "https://instagram.com/yourshop",
        bookingUrl: "Booking URL",
        bookingUrlPlaceHolder: "https://booking.yourshop.com",
        email: "Email",
        emailPlaceHolder: "contact@yourshop.com",
        description: "Description",
        descriptionPlaceHolder: "Tell us about your shop, specialties, artists, etc.",
        category: "Category",
        submit: "Submit Shop",
        submiting: "Submitting...",
        notice: "Your shop will be reviewed within 24 hours",
        success: "Your tattoo shop has been submitted for review!",
        error: "Something went wrong. Please try again.",
    }
}

const zhSubmitListingConfig: SubmitListingConfig = {
    title: "提交纹身店",
    subtitle: "将您的纹身店添加到PDX纹身目录",
    form: {
        title: "请输入您的纹身店信息",
        name: "店名",
        namePlaceHolder: "例如: Rose City Tattoo",
        website: "网站",
        websitePlaceHolder: "https://yourshop.com",
        instagram: "Instagram",
        instagramPlaceHolder: "https://instagram.com/yourshop",
        bookingUrl: "预约链接",
        bookingUrlPlaceHolder: "https://booking.yourshop.com",
        email: "邮箱",
        emailPlaceHolder: "contact@yourshop.com",
        description: "描述",
        descriptionPlaceHolder: "告诉我们您的店铺、专长、纹身师等信息",
        category: "类别",
        submit: "提交店铺",
        submiting: "提交中...",
        notice: "您的店铺将在24小时内审核",
        success: "您的纹身店已提交审核！",
        error: "出错了，请重试",
    }
}

export const getAllSubmitConfigs = (): { [key: string]: SubmitListingConfig } => ({
    en: enSubmitListingConfig,
    zh: zhSubmitListingConfig,
})

// For backward compatibility
export const AllSubmitAppConfigs = getAllSubmitConfigs()