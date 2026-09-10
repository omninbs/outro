/** 页面容器的定宽：中号给首页（和页脚同宽），宽号给表单页的两栏加常驻清单 */
const MEDIUM = 'max-w-[60rem]';

export const PAGE_WIDTHS = { medium: MEDIUM, wide: 'max-w-360' } as const;

export type PageWidth = keyof typeof PAGE_WIDTHS;

/** 页脚宽度固定，不跟着所在页面的容器走；中号就是首页那一档，两边的边线因此对得上 */
export const FOOTER_WIDTH = MEDIUM;

/** 页脚最小高度：内容只有两栏几行，给个下限，免得夹在上下内边距里显得扁 */
export const FOOTER_MIN_HEIGHT = 'min-h-56';

const container = (width: string) => `mx-auto w-full ${width} px-6`;

/** 页面内容用的容器：居中、按页面定宽 */
export const pageContainer = (width: PageWidth) => container(PAGE_WIDTHS[width]);

/** 页脚用的容器：居中、宽度固定，每页都一样 */
export const footerContainer = () => container(FOOTER_WIDTH);
