export class TextJustificationService {
	private justifyParagraph(paragraph: string): string {
		const words = paragraph.trim().split(/\s+/);
		const lines: string[] = [];
		let line: string[] = [];
		let lineLength = 0;
		const maxWidth = 80;
		let index = 0;

		while (index < words.length) {
			const word = words[index];
			if (lineLength + word.length + line.length <= maxWidth) {
				line.push(word);
				lineLength += word.length;
				index += 1;
			} else {
				const totalSpaces = maxWidth - lineLength;
				const gaps = line.length - 1;
				let justifiedLine = "";

				if (gaps > 0) {
					const spaces: string[] = [];
					for (let i = 0; i < gaps; i++) {
						let spaceSize = Math.floor(totalSpaces / gaps);
						if (i >= gaps - (totalSpaces % gaps)) {
							spaceSize += 1;
						}
						spaces.push(" ".repeat(spaceSize));
					}
					for (let i = 0; i < line.length - 1; i++) {
						justifiedLine += line[i] + spaces[i];
					}
					justifiedLine += line[line.length - 1];
				} else {
					justifiedLine = line[0] + " ".repeat(maxWidth - line[0].length);
				}

				lines.push(justifiedLine);
				line = [];
				lineLength = 0;
			}
		}
		if (line.length > 0) {
			let justifiedLine = line.join(" ");
			justifiedLine += " ".repeat(maxWidth - justifiedLine.length);
			lines.push(justifiedLine);
		}
		return lines.join("\n");
	}

	public justifyText(text: string): string {
		const paragraphs = text.trim().split(/\r?\n\r?\n|\r\r/);
		const justifiedParagraphs = paragraphs.map((paragraph) =>
			this.justifyParagraph(paragraph),
		);
		return justifiedParagraphs.join("\n");
	}
}

export default new TextJustificationService();
