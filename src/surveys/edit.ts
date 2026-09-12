import type { Survey } from '../lib/survey/types';
import { STEPS, step_route } from '../steps/_registry';

// 编辑表单：唯一没有问题的一份入口，它就是编辑向导本身，地址即向导第一步
export const edit_survey: Survey = {
	id: step_route(STEPS[0].id),
	title: '编辑表单',
	description: '不使用预设，直接编辑当前表单',
	questions: [],
};
