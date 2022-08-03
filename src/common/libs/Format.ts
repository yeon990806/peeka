/**
 * 입력된 수를 특정 자릿수마다 구분자를 삽입하고, 소수를 잘라냅니다.
 * @param input 변환할 수입니다.
 * @param decimal 소수부를 최대 몇 자리까지 표시할지 결정합니다.
 * @param decimalSeparator 소수부를 구분할 때 사용할 구분자입니다.
 * @param decimalRound 소수부를 잘라낼 때 반올림을 할지 여부입니다. 반올림하지 않으면 버려집니다.
 * @param digit 몇번째 자리수마다 구분자가 삽입될지 결정합니다.
 * @param digitSeparator 자리수마다 삽입될 구분자입니다.
 * @returns 입력한 설정값대로 가공된 문자열입니다.
 */
 export function FormatNumber(
	input: number,
	decimal: number = 0,
	decimalSeparator: string = ".",
	decimalRound: boolean = true,
	digit: number = 3,
	digitSeparator: string = ",",
): string {
	if (isNaN(input)) return "NaN";
	if (!isFinite(input)) return input > 0 ? "Infinite" : "-Infinite";
	if (input === 0) return "0";

	if (decimalSeparator === ".") { // 소숫점이 기본 값인 경우, 간략화 가능
		const depth = Math.pow(10, decimal);
		let value = input * depth;
		if (decimalRound)
			value = Math.round(value);
		else
			value = Math.floor(value);
		value /= depth;

		const reg = /(^[+-]?\d+)(\d{3})/;
		let num = value.toString();
		while (reg.test(num)) num = num.replace(reg, `$1${digitSeparator}$2`);
		return num;
	}

	let num = input.toString();
	let dec = ""; // 소수부 결과
	if (num.includes(".")) { // 소수부가 있는 경우
		const offset = num.indexOf(".");
		const ds = num.substr(offset + 1); // 소숫점 이후 자르기
		num = num.substr(0, offset); // 소숫점 이전 자르기

		if (decimal > 0) {
			dec = decimalSeparator; // 구분자 삽입

			const depth = Math.pow(10, Math.max(0, ds.length - decimal));
			const dn = parseInt(ds, 10) / depth; // decimal 값만큼 소숫점 이동
			if (decimalRound)
				dec += Math.round(dn);
			else
				dec += Math.floor(dn);
		}
	}

	// 수를 특정 구분자로 나누기 위한 정규식
	const regex = new RegExp(`(^[+-]?\\d+)(\\d{${digit}})`);
	let ret: RegExpExecArray | null;
	const sb: string[] = [];
	while ((ret = regex.exec(num)) !== null) {
		sb.push(ret[2]); // 뒤쪽부터 거꾸로 쌓임
		num = num.replace(regex, "$1");
	}
	sb.push(num);
	return sb.reverse().join(digitSeparator) + dec;
}
