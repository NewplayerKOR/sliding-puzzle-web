/**
 * 번역 템플릿의 `{key}` 자리표시자를 값으로 치환함.
 * 값이 없으면 원본 자리표시자를 유지해 누락을 쉽게 찾을 수 있게 함.
 */
export function formatMessage(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => {
    return values[key] !== undefined ? String(values[key]) : placeholder;
  });
}
