import {
	DEFAULT_FOOTER,
	DEFAULT_NOTICE,
	DEFAULT_NOTICE_LABEL,
	DEFAULT_TITLE,
} from '../lib/config';
import { flavors } from '../lib/palette';
import type { CardData } from '../lib/types';

const FONT =
	"'PingFang SC','Microsoft YaHei','Noto Sans SC',system-ui,-apple-system,'Segoe UI',sans-serif";

/**
 * 版权页本身就是一个页面：铺满容器、随容器尺寸排版，
 * 所有尺度都用容器查询单位表达，因此预览与全屏是同一套布局。
 */
export function CardPage({ data, exitLink }: { data: CardData; exitLink?: boolean }) {
	const c = flavors[data.flavor].colors;
	const accent = c[data.accent];
	const ts = (data.textScale || 100) / 100;

	/** 字号：随容器最小边缩放，并受文字大小设置影响 */
	const fs = (n: number) => `calc(${n}cqmin * var(--ts))`;
	/** 间距：只随容器缩放 */
	const sp = (n: number) => `${n}cqmin`;

	const title = data.title.trim() || DEFAULT_TITLE;
	const noticeLabel = data.noticeLabel.trim() || DEFAULT_NOTICE_LABEL;
	const notice = data.notice.trim() || DEFAULT_NOTICE;
	const footerText = data.footerText.trim() || DEFAULT_FOOTER;
	const fields = data.fields.filter((f) => f.value.trim() !== '');

	return (
		<div class="h-full w-full" style={{ containerType: 'size', ['--ts' as string]: ts }}>
			<div
				class="relative flex h-full w-full flex-col justify-center overflow-hidden"
				style={{
					padding: `${sp(10)} ${sp(14)}`,
					background: c.base,
					color: c.text,
					fontFamily: FONT,
				}}
			>
				<h1
					class="font-semibold"
					style={{ fontSize: fs(4.6), letterSpacing: '0.06em', lineHeight: 1.25 }}
				>
					{title}
				</h1>

				<div
					style={{
						width: sp(13),
						height: 'max(2px, 0.35cqmin)',
						background: accent,
						marginTop: sp(2.8),
					}}
				/>

				<div class="card-body" style={{ marginTop: sp(5.5), gap: sp(5.5) }}>
					{fields.length > 0 && (
						<div class="card-credits flex flex-col" style={{ gap: sp(1.8) }}>
							{fields.map((field) => (
								<div key={field.id} class="flex items-baseline" style={{ gap: sp(1.4) }}>
									{field.label.trim() && (
										<div
											class="w-[44%] shrink-0"
											style={{
												fontSize: fs(1.9),
												color: c.subtext0,
												letterSpacing: '0.06em',
												lineHeight: 1.6,
											}}
										>
											{field.label.trim()}
										</div>
									)}
									<div
										class="min-w-0 flex-1"
										style={{
											fontSize: fs(2.4),
											lineHeight: 1.6,
											wordBreak: 'break-word',
										}}
									>
										{field.value.trim()}
									</div>
								</div>
							))}
						</div>
					)}

					<div class="card-notice min-w-0">
						<div
							style={{
								fontSize: fs(1.9),
								color: accent,
								letterSpacing: '0.1em',
								marginBottom: sp(1.6),
							}}
						>
							{noticeLabel}
						</div>
						<div
							style={{
								fontSize: fs(2.2),
								color: c.subtext0,
								lineHeight: 1.85,
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-word',
							}}
						>
							{notice}
						</div>
					</div>
				</div>

				{(data.footerOn || exitLink) && (
					<div
						class="absolute flex justify-between"
						style={{
							left: sp(14),
							right: sp(14),
							bottom: sp(10),
							gap: sp(3),
							fontSize: fs(1.6),
							color: c.overlay0,
							letterSpacing: '0.08em',
						}}
					>
						<div>
							{exitLink && (
								<a
									data-exit="1"
									style={{ color: c.overlay0, textDecoration: 'none', cursor: 'pointer' }}
								>
									← 返回
								</a>
							)}
						</div>
						<div>{data.footerOn ? footerText : ''}</div>
					</div>
				)}
			</div>
		</div>
	);
}
