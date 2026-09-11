import { Check, List, PenLine, Plus, Sparkles, X } from 'lucide-preact';

/**
 * 界面上的符号一律用图标组件，不写字体字符：字体字符的字形归**系统字体**管，同一颗勾换台机器
 * 就宽窄、粗细、基线都不同，而符号是控件的一部分，不该随字体飘（步骤圆里那三个数字同理，
 * 用户完全可能把系统字体换成拼音字体或艺术字）。图标跟着文字走：颜色由父层的文字色定，
 * 尺寸写死在这儿、不开成 prop，它自己不参与「长什么样」的决定；装饰性的那些不给无障碍属性，
 * 意思由旁边的文字或按钮标题说。库里挑的是一颗一个模块、细线条的那一路——装几颗只进几颗，
 * 不必为几颗图标背一整套图标运行时（许可声明在包自己里）；细节见 `AGENTS.md` 的「代码约定」。
 */
const SIZE = 14;

/** 叉：删除、退回选项 */
export function CloseIcon() {
	return <X size={SIZE} />;
}

/** 加号：添加一行或一块 */
export function PlusIcon() {
	return <Plus size={SIZE} />;
}

/** 勾：已完成的步骤 */
export function CheckIcon() {
	return <Check size={SIZE} />;
}

/** 一列条目：第一步「摘要」；步骤条那三颗见 `steps/_registry.tsx` */
export function ListIcon() {
	return <List size={SIZE} />;
}

/** 落笔：第二步「描述」 */
export function PenLineIcon() {
	return <PenLine size={SIZE} />;
}

/** 亮起来的那一下：第三步「生成」 */
export function SparklesIcon() {
	return <Sparkles size={SIZE} />;
}
