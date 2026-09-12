// 排版的公共片段：同一串类名抄到三处以上就是样式而不是排版细节

// 正文的次要文字：说明、描述、左栏标签
export const SUB_TEXT = 'text-base leading-relaxed text-ctp-subtext0';

// 标题的字样：同一层级的标题必须同款，页面标题与页脚那两栏的标题共用它
export const HEADING = 'text-lg font-semibold';

// 卡片里「一块内容的名字」的字样：面板标题与清单里的分组标题共用它，字号由调用点给
export const CARD_HEADING = 'font-semibold tracking-wide text-ctp-subtext1';

// 文本块的小标题：清单与结尾页共用它，同一块内容在两处只能长一个样
export const BLOCK_HEADING = 'font-bold tracking-widest text-ctp-mauve';

// 动效全应用只有这一份：只留能淡的属性、几何一概不插值，节奏快而轻、不回弹
const MOTION =
	'transition-[opacity,color,background-color,border-color,display] ' +
	'duration-150 ease-out motion-reduce:transition-none';

// 出现 / 消失：显隐本身是硬切，所以让它淡着来去
export const FADE = `${MOTION} transition-discrete`;

// 新挂上来的一行 / 一块：从透明淡进来，不要「啪」地出现
export const RISE = `${MOTION} starting:opacity-0`;

// 交互态的颜色渐变：反馈是元素自己变色，不位移、不换形状，贴框的图标按钮连淡底也不给
export const HOVER = MOTION;
