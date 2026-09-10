/**
 * 没有分栏的页面的标准宽度：首页、问卷页都用它。
 * 页脚也用同一个数，于是单栏页面从标题到页脚边线齐平。
 */
const STANDARD = 'max-w-[60rem]';

/** 页面容器的定宽：单栏页面用标准宽，只有分栏页面（表单的两栏加常驻清单）才要更宽 */
export const PAGE_WIDTHS = { standard: STANDARD, wide: 'max-w-360' } as const;

export type PageWidth = keyof typeof PAGE_WIDTHS;

/** 页脚宽度固定，不跟着所在页面的容器走；就是标准宽 */
export const FOOTER_WIDTH = STANDARD;

/** 页脚最小高度：内容只有两栏几行，给个下限，免得夹在上下内边距里显得扁 */
export const FOOTER_MIN_HEIGHT = 'min-h-56';

const container = (width: string) => `mx-auto w-full ${width} px-6`;

/** 页面内容用的容器：居中、按页面定宽 */
export const pageContainer = (width: PageWidth) => container(PAGE_WIDTHS[width]);

/** 页脚用的容器：居中、宽度固定，每页都一样 */
export const footerContainer = () => container(FOOTER_WIDTH);
