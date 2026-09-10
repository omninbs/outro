/**
 * 没有分栏的页面的标准宽度：首页、问卷页都用它。
 * 页脚也用同一个数，于是单栏页面从标题到页脚边线齐平。
 */
const STANDARD = 'max-w-[60rem]';

/** 页面容器的定宽：单栏页面用标准宽，只有分栏页面（表单的两栏加常驻清单）才要更宽 */
const PAGE_WIDTHS = { standard: STANDARD, wide: 'max-w-360' } as const;

export type PageWidth = keyof typeof PAGE_WIDTHS;

/** 页脚宽度固定，不跟着所在页面的容器走；就是标准宽 */
export const FOOTER_WIDTH = STANDARD;

/** 页脚最小高度：内容只有两栏几行，给个下限，免得夹在上下内边距里显得扁 */
export const FOOTER_MIN_HEIGHT = 'min-h-56';

/**
 * 页面容器：居中、按页面定宽，横向留白平时由它给。
 *
 * 窄屏（`max-narrow`）它把自己的横向留白让出去（`px-0`）——留白改成由里面的文字 / 控件
 * 各自带一次 `px-inset`（见 `style.css` 的 `--spacing-inset`），面则横向贴边。
 * 只有这样整页才会落到同一条竖线上；容器留一道、里面再留一道，就会越套越深。
 * 跨窄屏线时这道留白是直接跳掉的：几何量不插值（见 `ui/tokens.ts`）。
 */
const container = (width: string) => `mx-auto w-full ${width} px-6 max-narrow:px-0`;

/** 页面内容用的容器：居中、按页面定宽 */
export const pageContainer = (width: PageWidth) => container(PAGE_WIDTHS[width]);

/** 页脚用的容器：居中、宽度固定，每页都一样 */
export const footerContainer = () => container(FOOTER_WIDTH);
