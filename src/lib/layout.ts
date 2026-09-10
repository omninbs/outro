/** 页面容器宽度：首页内容少，窄一点；表单页两栏加常驻清单，要宽 */
export const PAGE_WIDTHS = { narrow: 'max-w-2xl', wide: 'max-w-360' } as const;

export type PageWidth = keyof typeof PAGE_WIDTHS;

/**
 * 内容与页脚共用的容器：居中、定宽、同一份左右内边距。
 *
 * 两边各写一套的话，页脚就会比内容宽或窄——所以只留这一个入口，
 * 由 PageShell 同时发给内容和页脚。
 */
export const pageContainer = (width: PageWidth) => `mx-auto w-full ${PAGE_WIDTHS[width]} px-6`;
