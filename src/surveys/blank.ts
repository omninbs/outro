import type { Survey } from '../lib/survey/types';

/**
 * 空预设：没有问题的一份问卷。
 *
 * 它是一条正经的路，不是占位：没有引导就是它的引导——
 * 点进去直接进表单，标题、元数据、文本块都由自己写。
 * 它不碰已有内容（清空只发生在第三步的「重置」里），
 * 所以从表单退回首页、再点这张卡回来，填过的东西还在，可以接着改。
 */
export const blankSurvey: Survey = {
	id: 'blank',
	title: '空预设',
	description: '没有引导，直接进表单：标题、元数据、文本块都由你自己写。',
	questions: [],
};
