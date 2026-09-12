import type { Survey } from '../lib/survey/types';

import { editSurvey } from './edit';
import { logicRedstoneMusicSurvey } from './logic-redstone-music';

/**
 * 入口清单：首页按这个顺序铺卡片。
 *
 * 一份入口一个文件，这里只管把它们排成一列——加一份入口 = 加一个文件 + 加一行。
 * 题目自身的写法见 `lib/survey/types.ts`。
 */
export const SURVEYS: Survey[] = [editSurvey, logicRedstoneMusicSurvey];

/**
 * 没有问题要问的那份入口就是表单本身，它的 id 同时也是路由里表单那一页的地址
 * （`formAtLastStep` 回到的就是这儿）。
 */
export const FORM_ID = SURVEYS.find((survey) => survey.questions.length === 0)!.id;

/** 按 id 找入口；地址是手写的，认不出就当没有这一份 */
export const findSurvey = (id: string) => SURVEYS.find((survey) => survey.id === id);
