/** 单栏页面的标准宽度：首页、问卷页都用它；页脚同款，所以单栏页面从标题到页脚边线齐平 */
const STANDARD = 'max-w-[60rem]';

/** 页面容器的定宽：单栏页面用标准宽，只有分栏页面（内容一栏加常驻清单）才要更宽 */
const PAGE_WIDTHS = { standard: STANDARD, wide: 'max-w-360' } as const;

export type PageWidth = keyof typeof PAGE_WIDTHS;

/** 页脚宽度固定：它不属于哪一页的容器，自己就是标准宽 */
export const FOOTER_WIDTH = STANDARD;

/** 页脚最小高度：内容只有几行，给个下限，免得夹在上下留白里显得扁 */
export const FOOTER_MIN_HEIGHT = 'min-h-56';

/**
 * 页面容器：居中、按页面定宽，横向留白平时由它给；窄档让出去，改由里面的文字与控件各带一次
 * ——容器留一道、里面再留一道只会越套越深，整页也就对不到同一条竖线上。跨档直接跳，不插值。
 */
const container = (width: string) => `mx-auto w-full ${width} px-6 narrow:px-0`;

/** 页面内容的容器 */
export const pageContainer = (width: PageWidth) => container(PAGE_WIDTHS[width]);

/** 页脚的容器：宽度固定，每页都一样 */
export const footerContainer = () => container(FOOTER_WIDTH);
