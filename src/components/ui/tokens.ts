/**
 * 排版的公共片段：同一串类名被抄到三处以上时，它就已经是样式而不再是排版细节了。
 *
 * 能写成组件的（标题块、面板）就别放这儿——类名常量只是没法组件化时的折中，
 * 它救不了结构上的重复。
 */

/** 正文的次要文字：说明、描述、左栏标签 */
export const SUB_TEXT = 'text-base leading-relaxed text-ctp-subtext0';

/**
 * 动效全应用只有这一份定义，下面四个都长在它上面，各处的类名一律从这儿取——
 * 散着写 `transition-*` 就会出现「这个 200ms 那个 300ms、这个带回弹那个不带」，一动起来就露馅。
 *
 * 一个元素只能有一份 `transition-property`，所以属性清单只能写一次、写全：
 * 内边距 / 描边宽度 / 圆角（面跨断点的形变）、透明度与颜色（出现消失、悬停），
 * 加上 `display`（好让硬切也能淡出来，配合 `transition-discrete`）。
 * 清单里都有的属性在元素上不存在时不会有什么代价，但没有的属性就一定动不了。
 *
 * **只做渐变，不做位移与缩放**：`transform` 故意不在清单里，谁也不许「按下去缩一下」。
 * 元素一旦在空间里动起来就没有好下场——缩放不动邻居，看着像在抖（2026-09 那批选项按钮
 * 就是这么被否掉的）；真动了，观者就得跟着重新找位置。要表达「我点到了」，换颜色。
 * 唯一允许的「动」是连贯的形变：面跨断点时长成贴边的带（`MORPH`），那本来就是同一件东西在变。
 *
 * 基调：150ms、ease-out、不回弹。目标是「别硬蹦」而不是「炫」，
 * 看上去应该几乎察觉不到有动画，只觉得不突兀。
 * 系统开了「减少动态效果」时一律不画（`motion-reduce:transition-none`），不用另写 CSS。
 *
 * 只给**能插值**的东西配过渡：`flex-direction`、列数变化这类插不了值，
 * 只能靠淡入淡出「遮」，遮不住的就让它利落地跳，别硬做。
 */
const MOTION =
	'transition-[padding,border-width,border-radius,opacity,color,background-color,border-color,display] ' +
	'duration-150 ease-out motion-reduce:transition-none';

/** 面（卡片 / 框 / 页面留白）跨响应式断点时的形变：卡片长成贴边的带，就是这几条一起走 */
export const MORPH = MOTION;

/** 出现 / 消失：右侧清单、步骤条名称这类。带上 display，硬切也能淡出来 */
export const FADE = `${MOTION} transition-discrete`;

/** 新挂上来的一行 / 一块：从透明淡进来，避免「啪」地出现 */
export const RISE = `${MOTION} starting:opacity-0`;

/**
 * 可点件（按钮、选项、可点卡片、链接）：悬停与选中的颜色变化走渐变。
 * 跟 `MORPH` 是同一份清单——可点件往往也是个会跨断点变形的面，清单写全了才够用；
 * 单独起个名字是为了让调用处看得出「这里在说可点」，不是为了加效果。
 */
export const HOVER = MOTION;
