import { Check, List, PenLine, Plus, Sparkles, X } from 'lucide-preact';

// 界面符号一律用图标组件：字形归系统字体管、会随字体飘，尺寸写死在这儿，装饰性的不给无障碍属性
const SIZE = 14;

// 叉：删除、退回选项
export function CloseIcon() {
	return <X size={SIZE} />;
}

// 加号：添加一行或一块
export function PlusIcon() {
	return <Plus size={SIZE} />;
}

// 勾：已完成的步骤
export function CheckIcon() {
	return <Check size={SIZE} />;
}

// 一列条目：第一步「摘要」
export function ListIcon() {
	return <List size={SIZE} />;
}

// 落笔：第二步「描述」
export function PenLineIcon() {
	return <PenLine size={SIZE} />;
}

// 亮起来的那一下：第三步「生成」
export function SparklesIcon() {
	return <Sparkles size={SIZE} />;
}
