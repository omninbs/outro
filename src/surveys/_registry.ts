import type { Survey } from '../lib/survey/types';

import { blankSurvey } from './blank';
import { logicRedstoneMusicSurvey } from './logic-redstone-music';
import { resumeSurvey } from './resume';

/**
 * 预设清单：首页按这个顺序铺卡片。
 *
 * 前两份都是没有问题的那类预设，也是「开始」的两种答法：
 * 「继续编辑」不清空已有内容，「空预设」清空、从一张白纸开始。
 * 一份预设一个文件，这里只负责把它们排成一列：
 * 加一份新预设 = 在 `src/surveys/` 新写一个文件 + 在这里加一行。
 * 题目怎么写（`kind` / `default` / `into` / `build`）见 `lib/survey/types.ts`。
 */
export const SURVEYS: Survey[] = [resumeSurvey, blankSurvey, logicRedstoneMusicSurvey];

/** 按 id 找预设；找不到返回 undefined——hash 是手写的，认不出就当没有这份 */
export const findSurvey = (id: string) => SURVEYS.find((survey) => survey.id === id);
