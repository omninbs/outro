import type { Hint } from '../lib/evaluate';

const ICONS: Record<Hint['level'], { char: string; cls: string }> = {
	ok: { char: '✓', cls: 'bg-ctp-green/15 text-ctp-green' },
	warn: { char: '!', cls: 'bg-ctp-yellow/15 text-ctp-yellow' },
	info: { char: 'i', cls: 'bg-ctp-blue/15 text-ctp-blue' },
};

export function Checklist({
	hints,
	score,
	grade,
	onAdd,
}: {
	hints: Hint[];
	score: number;
	grade: string;
	onAdd: (label: string) => void;
}) {
	return (
		<section class="rounded-lg border border-ctp-surface0 bg-ctp-mantle p-4">
			<div class="mb-3 flex items-center gap-3">
				<h2 class="text-sm font-semibold text-ctp-subtext1">补全提示</h2>
				<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-ctp-surface0">
					<div class="h-full rounded-full bg-ctp-mauve transition-all" style={{ width: `${score}%` }} />
				</div>
				<span class="w-14 text-right text-xs tabular-nums text-ctp-subtext0">
					{score}% · {grade}
				</span>
			</div>

			<ul class="space-y-1.5">
				{hints.map((hint, index) => {
					const icon = ICONS[hint.level];
					return (
						<li
							key={`${hint.text}-${index}`}
							class="flex items-start gap-2 rounded-md bg-ctp-crust px-2.5 py-2 text-xs leading-relaxed"
						>
							<span
								class={`mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold ${icon.cls}`}
							>
								{icon.char}
							</span>
							<span class="flex-1 text-ctp-subtext0">{hint.text}</span>
							{hint.addMeta && (
								<button
									type="button"
									onClick={() => onAdd(hint.addMeta!)}
									class="shrink-0 rounded bg-ctp-surface0 px-2 py-0.5 text-ctp-mauve transition hover:bg-ctp-surface1"
								>
									补上
								</button>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
}
