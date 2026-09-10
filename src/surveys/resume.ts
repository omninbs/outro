import { hasContent } from '../lib/card';
import type { Survey } from '../lib/survey/types';

/**
 * 继续编辑：也没有问题的一份预设。
 *
 * 它跟空预设只差一个回答：空预设答「清空、从白纸开始」，它答「不用，接着写」，
 * 所以它不写 `resetOnStart`。两张卡都没有题可答，点进去都是直接进表单。
 * 内容是空的时候它不该出现（`when`）：没写过东西就没有「继续」可言，
 * 铺出来只是一张通往空表单的卡。
 */
export const resumeSurvey: Survey = {
	id: 'resume',
	title: '继续编辑',
	description: '打开表单接着改：标题、元数据、文本块都还在。',
	questions: [],
	when: hasContent,
};
