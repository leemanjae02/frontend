export function calcProgressPercent(
  taskAmount: number,
  completedTaskAmount: number,
) {
  if (!taskAmount || taskAmount <= 0) return 0;
  const raw = (completedTaskAmount / taskAmount) * 100;
  return Math.round(raw);
}
