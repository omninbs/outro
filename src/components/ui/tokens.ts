/**
 * 排版的公共片段：同一串类名抄到三处以上，它就已经是样式而不是排版细节了。
 * 能写成组件的（标题块、面板）就别放这儿——常量只是没法组件化时的折中，救不了结构上的重复。
 */

/** 正文的次要文字：说明、描述、左栏标签 */
export const SUB_TEXT = 'text-base leading-relaxed text-ctp-subtext0';

/**
 * 标题的字样：**同一层级的标题必须同款**——页面标题与页脚那两栏的标题共用它，
 * 那两栏并排，谁也不该显得比谁高一档。抄成三份，所以它不再是排版细节。
 */
export const HEADING = 'text-lg font-semibold';

/**
 * 卡片里「一块内容的名字」的字样：面板标题与清单里的分组标题共用它。
 * 字号不进这个常量——嵌到哪一层就小一档，那是层级自己的事，由调用点给。
 */
export const CARD_HEADING = 'font-semibold tracking-wide text-ctp-subtext1';

/**
 * 文本块的小标题：清单与结尾页共用它——清单就是结尾页的预览，
 * 同一块内容在两处只能长一个样，所以不能只在一处带字距。
 */
export const BLOCK_HEADING = 'font-bold tracking-widest text-ctp-mauve';

/**
 * 动效全应用只有这一份定义，下面三个都长在它上面，各处一律从这儿取——
 * 散着写就会出现「这个快那个慢」，一动起来就露馅。
 *
 * 只留**能「淡」的属性**（透明度、文字色、底色、描边色、可硬切的显隐）；
 * **几何量一概不插值**（内边距、描边宽度、圆角、位移、缩放），形状要变就直接跳：
 * 插值出来的是「在动」，而页面里只要有东西在动，观者就得跟着重新找位置。
 *
 * 基调是快而轻、不回弹：目标是「别硬蹦」不是「炫」，开了「减少动态效果」就一律不画。
 */
const MOTION =
	'transition-[opacity,color,background-color,border-color,display] ' +
	'duration-150 ease-out motion-reduce:transition-none';

/** 出现 / 消失：按档位才有或才没有的东西；显隐本身是硬切，所以让它淡着来去 */
export const FADE = `${MOTION} transition-discrete`;

/** 新挂上来的一行 / 一块：从透明淡进来，不要「啪」地出现 */
export const RISE = `${MOTION} starting:opacity-0`;

/**
 * 交互态（悬停 / 聚焦 / 选中）的颜色渐变：可点件、聚焦时会变色的框都用它。
 * 反馈是这个元素**自己**变色，不位移、不换形状；贴在框里的图标按钮连淡底也不给——
 * 从透明浮出一块底色，看着像框里又长出一个按钮。
 */
export const HOVER = MOTION;
