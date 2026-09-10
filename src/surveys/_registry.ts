import type { Survey } from '../lib/survey/types';

import { editSurvey } from './edit';
import { logicRedstoneMusicSurvey } from './logic-redstone-music';

/**
 * 入口清单：首页按这个顺序铺卡片，第一张固定是「编辑表单」。
 *
 * 一份入口一个文件，这里只负责把它们排成一列：
 * 加一份新入口 = 在 `src/surveys/` 新写一个文件 + 在这里加一行。
 * 题目怎么写（`kind` / `default` / `into` / `build`）见 `lib/survey/types.ts`。
 */
export const SURVEYS: Survey[] = [editSurvey, logicRedstoneMusicSurvey];

/** 按 id 找入口；找不到返回 undefined——hash 是手写的，认不出就当没有这份 */
export const findSurvey = (id: string) => SURVEYS.find((survey) => survey.id === id);
