import { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { CompanyData } from '../types';

export async function generateReport(company: string, data: CompanyData): Promise<void> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: `${company} - Company Analysis Report`,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: `Generated on ${new Date().toLocaleDateString()}`,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Industry Analysis',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({ text: data.industry }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Financial Overview',
          heading: HeadingLevel.HEADING_1,
        }),
        createFinancialsTable(data),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'AI/ML Use Cases',
          heading: HeadingLevel.HEADING_1,
        }),
        ...data.useCases.map(useCase => [
          new Paragraph({
            text: useCase.title,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: useCase.description }),
          new Paragraph({
            text: `Business Impact: ${useCase.impact}`,
            bullet: { level: 0 },
          }),
          new Paragraph({ text: '' }),
        ]).flat(),
        new Paragraph({
          text: 'Additional Resources',
          heading: HeadingLevel.HEADING_1,
        }),
        ...data.resources.map(resource =>
          new Paragraph({
            text: `${resource.title}`,
            bullet: { level: 0 },
          })
        ),
      ],
    }],
  });

  // Use Packer to generate the document blob
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${company}-Analysis-Report.docx`);
}

function createFinancialsTable(data: CompanyData) {
  if (!data.financials) return new Paragraph({ text: 'Financial data not available' });

  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Year' })] }),
          new TableCell({ children: [new Paragraph({ text: 'Revenue (M$)' })] }),
          new TableCell({ children: [new Paragraph({ text: 'Profit (M$)' })] }),
        ],
      }),
      ...data.financials.years.map((year, index) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: year })] }),
            new TableCell({ children: [new Paragraph({ text: data.financials!.revenue[index].toString() })] }),
            new TableCell({ children: [new Paragraph({ text: data.financials!.profit[index].toString() })] }),
          ],
        })
      ),
    ],
  });
}