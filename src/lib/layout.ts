/** 页面容器宽度：首页内容少，窄一点；表单页两栏加常驻清单，要宽 */
export const PAGE_WIDTHS = { narrow: 'max-w-2xl', wide: 'max-w-360' } as const;

export type PageWidth = keyof typeof PAGE_WIDTHS;

/** 页脚宽度固定，不跟着所在页面的容器走；60rem 是参考站页脚容器的宽度 */
export const FOOTER_WIDTH = 'max-w-[60rem]';

const container = (width: string) => `mx-auto w-full ${width} px-6`;

/** 页面内容用的容器：居中、按页面定宽 */
export const pageContainer = (width: PageWidth) => container(PAGE_WIDTHS[width]);

/** 页脚用的容器：居中、宽度固定，每页都一样 */
export const footerContainer = () => container(FOOTER_WIDTH);
