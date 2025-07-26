import { User } from "@prisma/client";

import { Icons } from "@/components/shared/icons";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
};

export type MainNavItem = {
  title: string;
  href: string;
  path?: string;
  disabled?: boolean;
  external?: boolean;
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
    | {
      href: string;
      items?: never;
    }
    | {
      href?: string;
      items: NavItem[];
    }
  );

export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
    coffee: string;
  };
  creator: string;
  subtitle: string;
};

export type AuthConfig = {
  signin: string;
  signinWithGitub: string;
  signinWithGoogle: string;
  signinDesc: string;
  logout: string;
};

export type ProductConfig = {
  title: string;
  subtitle: string;
  submitButton: string;
  details: string;
  introduction: string;
  github: string;
  source: string;
  price: string;
  website: string;
  submitter: string;
  free: string;
  opensource: string;
  date: string;
}

export type ApplicationConfig = {
  title: string;
  subtitle: string;
  submitButton: string;
  gotoApp: string;
  website: string,
  date: string,
  introduction: string;
  details: string;
  submitter: string;
}

export type GuideConfig = {
  title: string;
  subtitle: string;
  seeAllGuides: string;
}

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type NavConfig = {
  mainNav: MainNavItem[];
};

export type DashboardConfig = {
  // mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type AccountSettingsConfig = {
  title: string;
  subtitle: string;
  form: {
    title: string;
    subtitle: string;
    name: string;
    namePlaceHolder: string;
    link: string;
    linkPlaceHolder: string;
    submit: string;
    submiting: string;
    success: string;
    error: string;
  }
}

export type ShareResourceConfig = {
  title: string;
  subtitle: string;
  form: {
    title: string;
    name: string;
    namePlaceHolder: string;
    link: string;
    linkPlaceHolder: string;
    submit: string;
    submiting: string;
    success: string;
    error: string;
  }
}

export type SubmitAppConfig = {
  title: string;
  subtitle: string;
  form: {
    title: string;
    name: string;
    namePlaceHolder: string;
    link: string;
    linkPlaceHolder: string;
    submit: string;
    submiting: string;
    desc: string;
    descPlaceHolder: string;
    types: string;
    image: string;
    coverImage: string;
    update: string;
    updating: string;
    delete: string;
    deleting: string;
    imageUploading: string;
    notice: string;
    success: string;
    error: string;
  }
}

export type SubmitListingConfig = {
  title: string;
  subtitle: string;
  form: {
    title: string;
    name: string;
    namePlaceHolder: string;
    website: string;
    websitePlaceHolder: string;
    instagram: string;
    instagramPlaceHolder: string;
    bookingUrl: string;
    bookingUrlPlaceHolder: string;
    email: string;
    emailPlaceHolder: string;
    description: string;
    descriptionPlaceHolder: string;
    category: string;
    submit: string;
    submiting: string;
    notice: string;
    success: string;
    error: string;
  }
}

export type AppListConfig = {
  title: string;
  subtitle: string;
  submitAppButton: string;
  emptyAppList: string;
  form: {
    title: string;
    name: string;
    namePlaceHolder: string;
    link: string;
    linkPlaceHolder: string;
    desc: string;
    descPlaceHolder: string;
    types: string;
    image: string;
    coverImage: string;
    update: string;
    updating: string;
    delete: string;
    deleting: string;
    imageUploading: string;
    success: string;
    error: string;
    deleteSuccess: string;
    deleteError: string;
  }
}

export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type InfoLdg = {
  title: string;
  image: string;
  description: string;
  list: InfoList[];
}