import { Check, List, PenLine, Plus, Sparkles, X } from 'lucide-preact';

/**
 * 图标：内联 SVG，来自 `lucide-preact`（ISC，版权声明在其包的 LICENSE 里）。
 *
 * 为什么不用字体字符：`×` `＋` `✓` 原来是字体字符，字形由**系统字体**决定——
 * 同一个勾，换台机器宽窄、粗细、基线都不一样，而它们是控件的一部分，不该随字体飘
 * （`＋` 最明显：全角字符，连占多宽都跟着字体走，还得靠一个空格去凑距离）。
 * 步骤条圆里那三个数字同理：用户完全可能把系统默认字体设成拼音字体或艺术字，
 * 数字跟着变样——所以那里也放图形（那三颗是**语义**图标，不是数字的形状）。
 *
 * 为什么是 lucide：24×24、2px 描边、线尾圆头，细线条那一路，跟 Catppuccin 的素色最搭；
 * 一颗图标一个模块、包又是 `sideEffects: false`，所以 import 几颗就只进几颗（按需是真的）。
 * FA 那套要核心 JS 加 React 绑定，光核心就 30 kB gzip（比现在整个应用还大），为几颗不值。
 *
 * 尺寸写死在这儿（14px 见方）不开成 prop：每颗在各自的地方都是这个大小，
 * 调用点没有要调它的场景（跟 `BareTextArea` 那三行一个规矩）。
 * 颜色不给：SVG 的 `stroke` 是 `currentColor`，跟文字一样由父元素的 `text-*` 定，
 * 悬停变色也归父元素——图标自己不参与「长什么样」的决定。
 * `aria-hidden` 也不给：库里没有无障碍属性时默认加上它，这些都是装饰，
 * 意思由旁边那行字或者按钮的 `title` 说（真给某颗安上 `title`，它会自动变成不隐藏）。
 */
const SIZE = 14;

/** 叉：删除、退回选项（`IconButton` 用它） */
export function CloseIcon() {
	return <X size={SIZE} />;
}

/** 加号：添加一行 / 一块（`AddButton` 用它） */
export function PlusIcon() {
	return <Plus size={SIZE} />;
}

/** 勾：已完成的步骤（`Stepper` 用它） */
export function CheckIcon() {
	return <Check size={SIZE} />;
}

/** 一列条目：第一步「摘要」（标题 + 一列元数据）。步骤条那三颗见 `steps/_registry.tsx` */
export function ListIcon() {
	return <List size={SIZE} />;
}

/** 落笔：第二步「描述」（写正文与页脚） */
export function PenLineIcon() {
	return <PenLine size={SIZE} />;
}

/** 亮起来的那一下：第三步「生成」（产出结尾页） */
export function SparklesIcon() {
	return <Sparkles size={SIZE} />;
}
